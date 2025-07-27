# 输入框导航优化设计文档

## 概述

本设计文档详细描述了输入框导航系统的优化方案，重点解决空格键处理和跨页面自动切换的问题。设计遵循简化原则，移除不必要的复杂性，同时增强用户体验。

## 架构

### 核心组件关系

```
EnhancedPracticePanel (状态协调)
    ↓
useInputNavigation (导航逻辑) ← 新增页面切换参数
    ↓
PracticeGrid (渲染层) ← 简化占位符逻辑
```

### 状态管理优化

**移除的状态：**
- `placeholderStates: boolean[]` - 完全移除占位符状态管理

**保留的状态：**
- `userAnswers: string[]` - 用户输入答案
- `inputRefs: RefObject<HTMLInputElement[]>` - 输入框DOM引用

**新增的参数：**
- `currentPage: number` - 当前页码
- `setCurrentPage: (page: number) => void` - 页面切换函数
- `itemsPerPage: number` - 每页项目数
- `totalPages: number` - 总页数

## 组件设计

### 1. useInputNavigation Hook 重构

#### 接口定义
```typescript
interface UseInputNavigationProps {
  totalItems: number;
  getMaxLength: (index: number) => number;
  // 新增：页面相关参数
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  totalPages: number;
}

interface UseInputNavigationReturn {
  userAnswers: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  setInputRef: (index: number) => (el: HTMLInputElement | null) => void;
  setUserAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  // 移除：placeholderStates 相关返回值
}
```

#### 核心逻辑设计

**1. 简化的空格键处理：**
```typescript
if (e.key === ' ') {
  e.preventDefault();
  // 直接跳转，无任何副作用
  navigateToNext(index);
}
```

**2. 增强的自动切换逻辑：**
```typescript
const navigateToNext = (currentIndex: number) => {
  if (currentIndex < totalItems - 1) {
    const nextIndex = currentIndex + 1;
    const nextInput = inputRefs.current[nextIndex];
    
    if (nextInput) {
      // 同页面内跳转
      nextInput.focus();
    } else {
      // 跨页面跳转
      handleCrossPageNavigation(currentIndex, nextIndex);
    }
  }
};

const handleCrossPageNavigation = (currentIndex: number, nextIndex: number) => {
  const currentPageLastIndex = (currentPage + 1) * itemsPerPage - 1;
  
  if (currentIndex === currentPageLastIndex && currentPage < totalPages - 1) {
    setCurrentPage(currentPage + 1);
    
    // 延迟聚焦，确保DOM更新
    setTimeout(() => {
      const nextPageFirstInput = inputRefs.current[nextIndex];
      if (nextPageFirstInput) {
        nextPageFirstInput.focus();
      }
    }, 150); // 适当延迟确保页面切换完成
  }
};
```

**3. 输入变化处理优化：**
```typescript
const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
  const value = e.target.value.replace(/[^0-9]/g, '');
  const maxLength = getMaxLength(index);
  const truncatedValue = value.slice(0, maxLength);

  setUserAnswers(prev => {
    const newAnswers = [...prev];
    newAnswers[index] = truncatedValue;
    return newAnswers;
  });

  // 自动跳转逻辑（包含跨页面）
  if (truncatedValue.length === maxLength) {
    navigateToNext(index);
  }
}, [totalItems, getMaxLength, currentPage, setCurrentPage, itemsPerPage, totalPages]);
```

### 2. PracticeGrid 组件简化

#### 移除占位符相关代码
```typescript
// 移除的props
interface PracticeGridProps {
  // placeholderStates: boolean[]; // 删除
  // playedItems: boolean[]; // 简化或删除
  // ... 其他保持不变
}

// 简化的渲染逻辑
<div className="input-container">
  <input
    ref={setInputRef(globalIndex)}
    type="text"
    className="input"
    value={userAnswers[globalIndex] || ''}
    onChange={(e) => onInputChange(e, globalIndex)}
    onKeyDown={(e) => onKeyDown(e, globalIndex)}
    maxLength={getMaxLength(globalIndex)}
    aria-label={`${translations.answerFor} ${globalIndex + 1}`}
  />
  {/* 移除占位符显示逻辑 */}
</div>
```

### 3. EnhancedPracticePanel 集成

#### 状态传递
```typescript
const {
  userAnswers,
  handleInputChange,
  handleKeyDown,
  setInputRef,
  setUserAnswers
} = useInputNavigation({
  totalItems: correctAnswers.length,
  getMaxLength,
  // 新增参数
  currentPage,
  setCurrentPage,
  itemsPerPage: ITEMS_PER_PAGE,
  totalPages: Math.ceil(correctAnswers.length / ITEMS_PER_PAGE)
});
```

## 数据模型

### 输入框状态模型
```typescript
// 简化后的状态结构
interface InputNavigationState {
  userAnswers: string[];           // 用户输入的答案
  inputRefs: RefObject<HTMLInputElement[]>; // DOM引用
  // 移除：placeholderStates
}

// 页面导航模型
interface PageNavigationContext {
  currentPage: number;             // 当前页码（0开始）
  totalPages: number;              // 总页数
  itemsPerPage: number;            // 每页项目数
  currentPageStartIndex: number;   // 当前页起始索引
  currentPageEndIndex: number;     // 当前页结束索引
}
```

## 错误处理

### 跨页面导航错误处理
```typescript
const handleCrossPageNavigation = (currentIndex: number, nextIndex: number) => {
  try {
    const currentPageLastIndex = (currentPage + 1) * itemsPerPage - 1;
    
    if (currentIndex === currentPageLastIndex && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      
      setTimeout(() => {
        const nextPageFirstInput = inputRefs.current[nextIndex];
        if (nextPageFirstInput) {
          nextPageFirstInput.focus();
        } else {
          console.warn(`无法找到索引为 ${nextIndex} 的输入框`);
        }
      }, 150);
    }
  } catch (error) {
    console.error('跨页面导航失败:', error);
    // 降级处理：保持在当前页面
  }
};
```

### 输入框引用错误处理
```typescript
const navigateToNext = (currentIndex: number) => {
  if (currentIndex < totalItems - 1) {
    const nextIndex = currentIndex + 1;
    const nextInput = inputRefs.current[nextIndex];
    
    if (nextInput && typeof nextInput.focus === 'function') {
      nextInput.focus();
    } else {
      // 尝试跨页面导航
      handleCrossPageNavigation(currentIndex, nextIndex);
    }
  }
};
```

## 测试策略

### 单元测试覆盖
1. **空格键行为测试**
   - 验证空格键直接跳转
   - 验证不产生占位符状态
   - 验证在最后输入框的边界行为

2. **跨页面导航测试**
   - 验证页面边界的自动切换
   - 验证焦点正确设置
   - 验证延迟机制工作正常

3. **状态管理测试**
   - 验证占位符状态完全移除
   - 验证用户答案状态正确更新
   - 验证页面切换时状态一致性

### 集成测试场景
1. **完整输入流程测试**
   - 从第一页输入到最后一页
   - 混合使用各种导航方式
   - 验证跨页面连续性

2. **边界条件测试**
   - 单页面场景
   - 最后一页最后一个输入框
   - 空输入框的各种操作

## 性能优化

### 内存优化
- 移除 `placeholderStates` 数组，减少内存占用
- 优化 `inputRefs` 管理，避免内存泄漏

### 渲染优化
- 减少不必要的状态更新
- 优化跨页面切换的重渲染

### 用户体验优化
- 150ms 的延迟确保页面切换流畅
- 保持焦点状态的连续性
- 减少用户的认知负担（移除混乱的占位符）

## 向后兼容性

### 保持的功能
- 所有现有的键盘导航（方向键、回车、退格）
- 数字过滤和长度限制
- 自动长度检测和跳转
- 网格导航功能

### 移除的功能
- 占位符状态管理和显示
- 空格键的占位符设置行为

这些移除的功能被认为是改进，因为它们简化了用户界面和交互逻辑。