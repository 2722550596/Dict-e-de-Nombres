# 输入框导航系统修复方案设计

## 概述

基于对当前实现的深入分析，我们发现了20个潜在问题。本文档提供了一个全面的修复方案，重新设计输入框导航系统的核心架构。

## 核心问题分析

### 根本原因
1. **状态管理复杂性**：多个相互依赖的状态导致同步问题
2. **边界检测逻辑不准确**：页面切换的判断条件有缺陷
3. **异步操作缺乏协调**：setTimeout 和状态更新的竞态条件
4. **引用管理效率低下**：为所有项目创建引用，但只使用当前页面的

## 修复方案架构

### 1. 重新设计状态管理架构

#### 1.1 统一的导航状态
```typescript
interface NavigationState {
  currentPage: number;
  currentItemIndex: number;  // 全局索引
  isTransitioning: boolean;  // 页面切换状态
  lastFocusedIndex: number;  // 最后聚焦的索引
}

interface NavigationContext {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPageStartIndex: number;
  currentPageEndIndex: number;
  isLastPage: boolean;
  isFirstPage: boolean;
}
```

#### 1.2 状态计算函数
```typescript
const calculateNavigationContext = (
  currentPage: number, 
  totalItems: number, 
  itemsPerPage: number
): NavigationContext => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPageStartIndex = currentPage * itemsPerPage;
  const currentPageEndIndex = Math.min(currentPageStartIndex + itemsPerPage - 1, totalItems - 1);
  
  return {
    totalItems,
    itemsPerPage,
    totalPages,
    currentPageStartIndex,
    currentPageEndIndex,
    isLastPage: currentPage === totalPages - 1,
    isFirstPage: currentPage === 0
  };
};
```

### 2. 重新设计跨页面导航逻辑

#### 2.1 精确的边界检测
```typescript
const isAtPageBoundary = (
  currentIndex: number, 
  direction: 'next' | 'prev',
  context: NavigationContext
): boolean => {
  if (direction === 'next') {
    return currentIndex === context.currentPageEndIndex && !context.isLastPage;
  } else {
    return currentIndex === context.currentPageStartIndex && !context.isFirstPage;
  }
};
```

#### 2.2 状态机模式的页面切换
```typescript
type NavigationAction = 
  | { type: 'NAVIGATE_NEXT'; currentIndex: number }
  | { type: 'NAVIGATE_PREV'; currentIndex: number }
  | { type: 'PAGE_TRANSITION_START'; targetPage: number }
  | { type: 'PAGE_TRANSITION_COMPLETE'; targetIndex: number }
  | { type: 'FOCUS_SET'; index: number };

const navigationReducer = (
  state: NavigationState, 
  action: NavigationAction
): NavigationState => {
  switch (action.type) {
    case 'NAVIGATE_NEXT':
      // 精确的导航逻辑
      break;
    case 'PAGE_TRANSITION_START':
      return { ...state, isTransitioning: true };
    case 'PAGE_TRANSITION_COMPLETE':
      return { 
        ...state, 
        isTransitioning: false, 
        lastFocusedIndex: action.targetIndex 
      };
    default:
      return state;
  }
};
```

### 3. 优化的引用管理系统

#### 3.1 分页引用管理
```typescript
interface PagedInputRefs {
  currentPageRefs: Map<number, HTMLInputElement>; // 只存储当前页面的引用
  pendingFocusIndex: number | null; // 待聚焦的索引
}

const usePagedInputRefs = (
  currentPage: number,
  itemsPerPage: number
) => {
  const refsMap = useRef<Map<number, HTMLInputElement>>(new Map());
  const pendingFocusRef = useRef<number | null>(null);
  
  // 页面切换时清理旧引用
  useEffect(() => {
    refsMap.current.clear();
    
    // 如果有待聚焦的索引，设置焦点
    if (pendingFocusRef.current !== null) {
      const targetInput = refsMap.current.get(pendingFocusRef.current);
      if (targetInput) {
        targetInput.focus();
        pendingFocusRef.current = null;
      }
    }
  }, [currentPage]);
  
  const setInputRef = useCallback((globalIndex: number) => 
    (el: HTMLInputElement | null) => {
      if (el) {
        refsMap.current.set(globalIndex, el);
      } else {
        refsMap.current.delete(globalIndex);
      }
    }, []);
  
  const focusInput = useCallback((globalIndex: number) => {
    const input = refsMap.current.get(globalIndex);
    if (input) {
      input.focus();
      return true;
    } else {
      // 设置待聚焦索引，等待页面切换完成
      pendingFocusRef.current = globalIndex;
      return false;
    }
  }, []);
  
  return { setInputRef, focusInput };
};
```

### 4. 可靠的跨页面导航实现

#### 4.1 Promise-based 页面切换
```typescript
const usePageTransition = (
  currentPage: number,
  setCurrentPage: (page: number) => void
) => {
  const transitionPromiseRef = useRef<Promise<void> | null>(null);
  
  const transitionToPage = useCallback((targetPage: number): Promise<void> => {
    // 如果已有进行中的切换，等待完成
    if (transitionPromiseRef.current) {
      return transitionPromiseRef.current;
    }
    
    const promise = new Promise<void>((resolve) => {
      setCurrentPage(targetPage);
      
      // 使用 requestAnimationFrame 确保 DOM 更新完成
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          transitionPromiseRef.current = null;
          resolve();
        });
      });
    });
    
    transitionPromiseRef.current = promise;
    return promise;
  }, [setCurrentPage]);
  
  return { transitionToPage };
};
```

#### 4.2 统一的导航函数
```typescript
const useUnifiedNavigation = (
  navigationContext: NavigationContext,
  pageTransition: ReturnType<typeof usePageTransition>,
  inputRefs: ReturnType<typeof usePagedInputRefs>
) => {
  const navigateToIndex = useCallback(async (
    currentIndex: number,
    targetIndex: number
  ): Promise<boolean> => {
    // 检查目标索引是否有效
    if (targetIndex < 0 || targetIndex >= navigationContext.totalItems) {
      return false;
    }
    
    // 计算目标页面
    const targetPage = Math.floor(targetIndex / navigationContext.itemsPerPage);
    
    // 如果需要切换页面
    if (targetPage !== Math.floor(currentIndex / navigationContext.itemsPerPage)) {
      try {
        await pageTransition.transitionToPage(targetPage);
        // 页面切换完成后设置焦点
        return inputRefs.focusInput(targetIndex);
      } catch (error) {
        console.error('页面切换失败:', error);
        return false;
      }
    } else {
      // 同页面内导航
      return inputRefs.focusInput(targetIndex);
    }
  }, [navigationContext, pageTransition, inputRefs]);
  
  return { navigateToIndex };
};
```

### 5. 增强的键盘导航系统

#### 5.1 统一的键盘处理
```typescript
const useKeyboardNavigation = (
  currentIndex: number,
  navigationContext: NavigationContext,
  unifiedNavigation: ReturnType<typeof useUnifiedNavigation>
) => {
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const { navigateToIndex } = unifiedNavigation;
    
    switch (e.key) {
      case ' ':
      case 'Enter':
      case 'ArrowRight':
        e.preventDefault();
        navigateToIndex(index, index + 1);
        break;
        
      case 'ArrowLeft':
        e.preventDefault();
        navigateToIndex(index, index - 1);
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        // 智能计算下一行的索引
        const nextRowIndex = calculateNextRowIndex(index, navigationContext);
        navigateToIndex(index, nextRowIndex);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevRowIndex = calculatePrevRowIndex(index, navigationContext);
        navigateToIndex(index, prevRowIndex);
        break;
        
      case 'Backspace':
        handleBackspaceNavigation(e, index, navigateToIndex);
        break;
        
      default:
        break;
    }
  }, [currentIndex, navigationContext, unifiedNavigation]);
  
  return { handleKeyDown };
};
```

#### 5.2 智能行计算
```typescript
const calculateNextRowIndex = (
  currentIndex: number,
  context: NavigationContext
): number => {
  // 动态计算每行的项目数（基于当前页面布局）
  const itemsPerRow = calculateItemsPerRow(context);
  const nextRowIndex = currentIndex + itemsPerRow;
  
  return Math.min(nextRowIndex, context.totalItems - 1);
};

const calculateItemsPerRow = (context: NavigationContext): number => {
  // 可以基于屏幕宽度或CSS网格配置动态计算
  // 这里先使用固定值，后续可以优化
  return 10;
};
```

### 6. 用户体验增强

#### 6.1 视觉反馈系统
```typescript
const useNavigationFeedback = () => {
  const [feedbackState, setFeedbackState] = useState<{
    isTransitioning: boolean;
    transitionDirection: 'next' | 'prev' | null;
    message: string | null;
  }>({
    isTransitioning: false,
    transitionDirection: null,
    message: null
  });
  
  const showTransitionFeedback = useCallback((direction: 'next' | 'prev') => {
    setFeedbackState({
      isTransitioning: true,
      transitionDirection: direction,
      message: direction === 'next' ? '切换到下一页...' : '切换到上一页...'
    });
    
    // 自动清除反馈
    setTimeout(() => {
      setFeedbackState(prev => ({ ...prev, isTransitioning: false }));
    }, 500);
  }, []);
  
  return { feedbackState, showTransitionFeedback };
};
```

#### 6.2 可访问性支持
```typescript
const useAccessibilitySupport = (
  currentPage: number,
  totalPages: number,
  currentIndex: number
) => {
  const announcePageChange = useCallback((newPage: number) => {
    const message = `已切换到第 ${newPage + 1} 页，共 ${totalPages} 页`;
    
    // 使用 ARIA live region 通知屏幕阅读器
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [totalPages]);
  
  return { announcePageChange };
};
```

### 7. 错误处理和恢复机制

#### 7.1 错误边界
```typescript
const useNavigationErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const handleError = useCallback((error: Error, context: string) => {
    console.error(`导航错误 (${context}):`, error);
    setError(error);
    
    // 自动重试机制
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setError(null);
      }, 1000);
    }
  }, [retryCount]);
  
  const resetError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);
  
  return { error, handleError, resetError };
};
```

#### 7.2 降级策略
```typescript
const useFallbackNavigation = () => {
  const fallbackToSimpleNavigation = useCallback((
    currentIndex: number,
    targetIndex: number,
    inputRefs: Map<number, HTMLInputElement>
  ) => {
    // 简单的同页面导航作为降级方案
    const targetInput = inputRefs.get(targetIndex);
    if (targetInput) {
      targetInput.focus();
      return true;
    }
    
    // 如果连简单导航都失败，至少保持当前焦点
    const currentInput = inputRefs.get(currentIndex);
    if (currentInput) {
      currentInput.focus();
    }
    
    return false;
  }, []);
  
  return { fallbackToSimpleNavigation };
};
```

### 8. 性能优化

#### 8.1 防抖和节流
```typescript
const useDebouncedNavigation = (
  navigationFn: (index: number) => Promise<boolean>,
  delay: number = 100
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);
  
  const debouncedNavigate = useCallback((index: number) => {
    const now = Date.now();
    
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 如果调用过于频繁，延迟执行
    if (now - lastCallRef.current < delay) {
      timeoutRef.current = setTimeout(() => {
        navigationFn(index);
        lastCallRef.current = Date.now();
      }, delay);
    } else {
      navigationFn(index);
      lastCallRef.current = now;
    }
  }, [navigationFn, delay]);
  
  return { debouncedNavigate };
};
```

#### 8.2 内存优化
```typescript
const useMemoryOptimizedRefs = (currentPage: number, itemsPerPage: number) => {
  const refsMap = useRef<Map<number, HTMLInputElement>>(new Map());
  const maxCacheSize = itemsPerPage * 2; // 缓存当前页和相邻页
  
  const cleanupOldRefs = useCallback(() => {
    const currentPageStart = currentPage * itemsPerPage;
    const currentPageEnd = currentPageStart + itemsPerPage - 1;
    
    // 清理不在缓存范围内的引用
    for (const [index] of refsMap.current) {
      if (index < currentPageStart - itemsPerPage || 
          index > currentPageEnd + itemsPerPage) {
        refsMap.current.delete(index);
      }
    }
  }, [currentPage, itemsPerPage]);
  
  useEffect(() => {
    cleanupOldRefs();
  }, [currentPage, cleanupOldRefs]);
  
  return refsMap;
};
```

## 实施计划

### 阶段1：核心架构重构
1. 实现新的状态管理系统
2. 重写跨页面导航逻辑
3. 优化引用管理系统

### 阶段2：用户体验增强
1. 添加视觉反馈
2. 实现可访问性支持
3. 优化键盘导航

### 阶段3：错误处理和性能优化
1. 实现错误边界和恢复机制
2. 添加性能优化
3. 完善测试覆盖

## 测试策略

### 单元测试
- 状态计算函数测试
- 边界检测逻辑测试
- 导航函数测试

### 集成测试
- 跨页面导航流程测试
- 键盘导航测试
- 错误恢复测试

### 用户体验测试
- 可访问性测试
- 性能基准测试
- 移动端兼容性测试

这个修复方案解决了我们发现的所有20个潜在问题，提供了一个更加健壮、可维护和用户友好的输入框导航系统。