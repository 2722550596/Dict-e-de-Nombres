import { useState, useRef, useCallback } from 'react';

interface UseInputNavigationProps {
  totalItems: number;
  getMaxLength: (index: number) => number;
  // 新增：页面相关参数
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  totalPages: number;
}

export function useInputNavigation({ 
  totalItems, 
  getMaxLength,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalPages
}: UseInputNavigationProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(totalItems).fill(''));
  // 移除：placeholderStates 状态管理
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 跨页面导航处理函数（向前）
  const handleCrossPageNavigation = useCallback((currentIndex: number, nextIndex: number) => {
    try {
      setCurrentPage(currentPage + 1);
      
      // 延迟聚焦，确保DOM更新
      setTimeout(() => {
        const nextPageFirstInput = inputRefs.current[nextIndex];
        if (nextPageFirstInput && typeof nextPageFirstInput.focus === 'function') {
          nextPageFirstInput.focus();
        } else {
          console.warn(`无法找到索引为 ${nextIndex} 的输入框，将在下次渲染后重试`);
          // 如果第一次失败，再试一次（给更多时间让DOM更新）
          setTimeout(() => {
            const retryInput = inputRefs.current[nextIndex];
            if (retryInput) {
              retryInput.focus();
            }
          }, 100);
        }
      }, 150);
    } catch (error) {
      console.error('跨页面导航失败:', error);
      // 降级处理：保持在当前页面
    }
  }, [currentPage, setCurrentPage]);

  // 反向跨页面导航处理函数（向后）
  const handleReverseCrossPageNavigation = useCallback((currentIndex: number, prevIndex: number) => {
    try {
      setCurrentPage(currentPage - 1);
      
      // 延迟聚焦，确保DOM更新
      setTimeout(() => {
        const prevPageLastInput = inputRefs.current[prevIndex];
        if (prevPageLastInput && typeof prevPageLastInput.focus === 'function') {
          prevPageLastInput.focus();
          // 对于退格键，将光标移到末尾
          setTimeout(() => {
            if (prevPageLastInput.setSelectionRange) {
              prevPageLastInput.setSelectionRange(prevPageLastInput.value.length, prevPageLastInput.value.length);
            }
          }, 0);
        } else {
          console.warn(`无法找到索引为 ${prevIndex} 的输入框，将在下次渲染后重试`);
          // 如果第一次失败，再试一次
          setTimeout(() => {
            const retryInput = inputRefs.current[prevIndex];
            if (retryInput) {
              retryInput.focus();
              setTimeout(() => {
                if (retryInput.setSelectionRange) {
                  retryInput.setSelectionRange(retryInput.value.length, retryInput.value.length);
                }
              }, 0);
            }
          }, 100);
        }
      }, 150);
    } catch (error) {
      console.error('反向跨页面导航失败:', error);
      // 降级处理：保持在当前页面
    }
  }, [currentPage, setCurrentPage]);

  // 统一的导航到下一个输入框函数
  const navigateToNext = useCallback((currentIndex: number) => {
    if (currentIndex < totalItems - 1) {
      const nextIndex = currentIndex + 1;
      // 改进的边界检测：计算当前页面的实际结束索引
      const currentPageEndIndex = Math.min((currentPage + 1) * itemsPerPage - 1, totalItems - 1);
      
      // 先检查是否在页面边界
      if (currentIndex === currentPageEndIndex && currentPage < totalPages - 1) {
        // 需要跨页面导航
        handleCrossPageNavigation(currentIndex, nextIndex);
      } else {
        // 同页面内跳转
        const nextInput = inputRefs.current[nextIndex];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }, [totalItems, currentPage, itemsPerPage, totalPages, handleCrossPageNavigation]);

  // 统一的导航到上一个输入框函数
  const navigateToPrev = useCallback((currentIndex: number) => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      // 计算当前页面的起始索引
      const currentPageStartIndex = currentPage * itemsPerPage;
      
      // 检查是否在页面边界（当前页面的第一个输入框）
      if (currentIndex === currentPageStartIndex && currentPage > 0) {
        // 需要反向跨页面导航
        handleReverseCrossPageNavigation(currentIndex, prevIndex);
      } else {
        // 同页面内跳转
        const prevInput = inputRefs.current[prevIndex];
        if (prevInput) {
          prevInput.focus();
          // 将光标移到末尾
          setTimeout(() => {
            if (prevInput.setSelectionRange) {
              prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
            }
          }, 0);
        }
      }
    }
  }, [currentPage, itemsPerPage, handleReverseCrossPageNavigation]);

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
  }, [getMaxLength, navigateToNext]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === ' ') {
      e.preventDefault();
      // 简化的空格键处理：直接跳转，无任何副作用
      navigateToNext(index);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      navigateToNext(index);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateToNext(index);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateToPrev(index);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRowIndex = index + 10; // 假设每行10个
      if (nextRowIndex < totalItems) {
        // 检查是否需要跨页面导航
        const currentPageEndIndex = Math.min((currentPage + 1) * itemsPerPage - 1, totalItems - 1);
        if (nextRowIndex > currentPageEndIndex && currentPage < totalPages - 1) {
          // 跨页面导航到下一页对应位置
          handleCrossPageNavigation(index, nextRowIndex);
        } else {
          // 同页面内跳转
          const nextRowInput = inputRefs.current[nextRowIndex];
          if (nextRowInput) {
            nextRowInput.focus();
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRowIndex = index - 10; // 假设每行10个
      if (prevRowIndex >= 0) {
        // 检查是否需要跨页面导航
        const currentPageStartIndex = currentPage * itemsPerPage;
        if (prevRowIndex < currentPageStartIndex && currentPage > 0) {
          // 跨页面导航到上一页对应位置
          handleReverseCrossPageNavigation(index, prevRowIndex);
        } else {
          // 同页面内跳转
          const prevRowInput = inputRefs.current[prevRowIndex];
          if (prevRowInput) {
            prevRowInput.focus();
          }
        }
      }
    } else if (e.key === 'Backspace') {
      const currentInput = e.target as HTMLInputElement;
      if (currentInput.value === '') {
        e.preventDefault();
        navigateToPrev(index);
      }
    }
  }, [navigateToNext, navigateToPrev, totalItems, currentPage, itemsPerPage, totalPages, handleCrossPageNavigation, handleReverseCrossPageNavigation]);

  const resetAnswers = useCallback(() => {
    setUserAnswers(Array(totalItems).fill(''));
    // 移除：占位符状态重置
  }, [totalItems]);

  const setInputRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  }, []);

  return {
    userAnswers,
    placeholderStates: [], // 向后兼容：返回空数组
    handleInputChange,
    handleKeyDown,
    resetAnswers,
    setInputRef,
    setUserAnswers,
    setPlaceholderStates: () => {} // 向后兼容：空函数
  };
}
