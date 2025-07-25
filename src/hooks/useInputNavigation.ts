import { useState, useRef, useCallback } from 'react';

interface UseInputNavigationProps {
  totalItems: number;
  getMaxLength: (index: number) => number;
}

export function useInputNavigation({ totalItems, getMaxLength }: UseInputNavigationProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(totalItems).fill(''));
  const [placeholderStates, setPlaceholderStates] = useState<boolean[]>(Array(totalItems).fill(false));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const maxLength = getMaxLength(index);
    const truncatedValue = value.slice(0, maxLength);

    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = truncatedValue;
      return newAnswers;
    });

    // 清除占位符状态
    setPlaceholderStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });

    // 自动跳转到下一个输入框
    if (truncatedValue.length === maxLength && index < totalItems - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }, [totalItems, getMaxLength]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === ' ') {
      e.preventDefault();
      // 设置占位符状态
      setPlaceholderStates(prev => {
        const newStates = [...prev];
        newStates[index] = true;
        return newStates;
      });

      // 自动跳转到下一个输入框
      if (index < totalItems - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (index < totalItems - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (index < totalItems - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRowIndex = index + 10; // 假设每行10个
      if (nextRowIndex < totalItems) {
        const nextRowInput = inputRefs.current[nextRowIndex];
        if (nextRowInput) {
          nextRowInput.focus();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRowIndex = index - 10; // 假设每行10个
      if (prevRowIndex >= 0) {
        const prevRowInput = inputRefs.current[prevRowIndex];
        if (prevRowInput) {
          prevRowInput.focus();
        }
      }
    } else if (e.key === 'Backspace') {
      const currentInput = e.target as HTMLInputElement;
      if (currentInput.value === '' && index > 0) {
        e.preventDefault();
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          // 将光标移到末尾
          setTimeout(() => {
            prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
          }, 0);
        }
      }
    }
  }, [totalItems]);

  const resetAnswers = useCallback(() => {
    setUserAnswers(Array(totalItems).fill(''));
    setPlaceholderStates(Array(totalItems).fill(false));
  }, [totalItems]);

  const setInputRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  }, []);

  return {
    userAnswers,
    placeholderStates,
    handleInputChange,
    handleKeyDown,
    resetAnswers,
    setInputRef,
    setUserAnswers,
    setPlaceholderStates
  };
}
