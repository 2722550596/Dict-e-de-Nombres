import { useCallback, useRef, useState } from 'react';
import { LengthContent, TimeContent } from '../types/game.types';
import { validateLengthAnswer } from '../utils/lengthGeneration';

interface UseLongTextNavigationProps {
    items: (TimeContent | LengthContent)[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    totalPages: number;
}

export function useLongTextNavigation({
    items,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages
}: UseLongTextNavigationProps) {
    const [userAnswers, setUserAnswers] = useState<string[]>(Array(items.length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Cross-page navigation handler (forward)
    const handleCrossPageNavigation = useCallback((currentIndex: number, nextIndex: number) => {
        try {
            setCurrentPage(currentPage + 1);

            // Delay focus to ensure DOM update
            setTimeout(() => {
                const nextPageFirstInput = inputRefs.current[nextIndex];
                if (nextPageFirstInput && typeof nextPageFirstInput.focus === 'function') {
                    nextPageFirstInput.focus();
                    // Position cursor at the beginning for long text inputs
                    nextPageFirstInput.setSelectionRange(0, 0);
                } else {
                    // Retry if first attempt fails
                    setTimeout(() => {
                        const retryInput = inputRefs.current[nextIndex];
                        if (retryInput) {
                            retryInput.focus();
                            retryInput.setSelectionRange(0, 0);
                        }
                    }, 100);
                }
            }, 150);
        } catch (error) {
            console.error('Cross-page navigation failed:', error);
        }
    }, [currentPage, setCurrentPage]);

    // Reverse cross-page navigation handler (backward)
    const handleReverseCrossPageNavigation = useCallback((currentIndex: number, prevIndex: number) => {
        try {
            setCurrentPage(currentPage - 1);

            // Delay focus to ensure DOM update
            setTimeout(() => {
                const prevPageLastInput = inputRefs.current[prevIndex];
                if (prevPageLastInput && typeof prevPageLastInput.focus === 'function') {
                    prevPageLastInput.focus();
                    // Position cursor at the end for backward navigation
                    setTimeout(() => {
                        if (prevPageLastInput.setSelectionRange) {
                            const length = prevPageLastInput.value.length;
                            prevPageLastInput.setSelectionRange(length, length);
                        }
                    }, 0);
                } else {
                    // Retry if first attempt fails
                    setTimeout(() => {
                        const retryInput = inputRefs.current[prevIndex];
                        if (retryInput) {
                            retryInput.focus();
                            setTimeout(() => {
                                if (retryInput.setSelectionRange) {
                                    const length = retryInput.value.length;
                                    retryInput.setSelectionRange(length, length);
                                }
                            }, 0);
                        }
                    }, 100);
                }
            }, 150);
        } catch (error) {
            console.error('Reverse cross-page navigation failed:', error);
        }
    }, [currentPage, setCurrentPage]);

    // Navigate to next input
    const navigateToNext = useCallback((currentIndex: number) => {
        if (currentIndex < items.length - 1) {
            const nextIndex = currentIndex + 1;
            const currentPageEndIndex = Math.min((currentPage + 1) * itemsPerPage - 1, items.length - 1);

            if (currentIndex === currentPageEndIndex && currentPage < totalPages - 1) {
                // Cross-page navigation needed
                handleCrossPageNavigation(currentIndex, nextIndex);
            } else {
                // Same page navigation
                const nextInput = inputRefs.current[nextIndex];
                if (nextInput) {
                    nextInput.focus();
                    nextInput.setSelectionRange(0, 0);
                }
            }
        }
    }, [items.length, currentPage, itemsPerPage, totalPages, handleCrossPageNavigation]);

    // Navigate to previous input
    const navigateToPrev = useCallback((currentIndex: number) => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const currentPageStartIndex = currentPage * itemsPerPage;

            if (currentIndex === currentPageStartIndex && currentPage > 0) {
                // Reverse cross-page navigation needed
                handleReverseCrossPageNavigation(currentIndex, prevIndex);
            } else {
                // Same page navigation
                const prevInput = inputRefs.current[prevIndex];
                if (prevInput) {
                    prevInput.focus();
                    // Position cursor at end for backward navigation
                    setTimeout(() => {
                        if (prevInput.setSelectionRange) {
                            const length = prevInput.value.length;
                            prevInput.setSelectionRange(length, length);
                        }
                    }, 0);
                }
            }
        }
    }, [currentPage, itemsPerPage, handleReverseCrossPageNavigation]);

    // Handle input change - no automatic navigation for long text
    const handleInputChange = useCallback((index: number, value: string) => {
        setUserAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[index] = value;
            return newAnswers;
        });
    }, []);

    // Enhanced keyboard navigation for long text inputs
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const input = e.target as HTMLInputElement;
        const cursorPosition = input.selectionStart || 0;
        const textLength = input.value.length;

        if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
                navigateToPrev(index);
            } else {
                navigateToNext(index);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            navigateToNext(index);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateToNext(index);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateToPrev(index);
        } else if (e.key === 'ArrowLeft' && cursorPosition === 0) {
            // Only navigate if cursor is at the beginning
            e.preventDefault();
            navigateToPrev(index);
        } else if (e.key === 'ArrowRight' && cursorPosition === textLength) {
            // Only navigate if cursor is at the end
            e.preventDefault();
            navigateToNext(index);
        } else if (e.key === 'Backspace' && cursorPosition === 0 && textLength === 0) {
            // Only navigate if input is empty and cursor is at beginning
            e.preventDefault();
            navigateToPrev(index);
        }
        // For other keys, allow normal text editing behavior
    }, [navigateToNext, navigateToPrev]);

    // Validation helper for time and length content
    const validateAnswer = useCallback((index: number, answer: string): boolean => {
        const item = items[index];
        if (!item || !answer.trim()) return false;

        if ('acceptedAnswers' in item) {
            // TimeContent validation
            const normalizedAnswer = answer.trim().toLowerCase();
            return item.acceptedAnswers.some(accepted =>
                accepted.toLowerCase() === normalizedAnswer
            );
        } else if ('acceptedFormats' in item) {
            // LengthContent validation - use the specialized validation function
            return validateLengthAnswer(item, answer);
        }

        // Fallback to display text comparison
        const normalizedAnswer = answer.trim().toLowerCase();
        return (item as any).displayText?.toLowerCase() === normalizedAnswer;
    }, [items]);

    // Get validation results for all answers
    const getValidationResults = useCallback(() => {
        return userAnswers.map((answer, index) => ({
            index,
            answer,
            isValid: validateAnswer(index, answer),
            item: items[index]
        }));
    }, [userAnswers, validateAnswer, items]);

    // Reset all answers
    const resetAnswers = useCallback(() => {
        setUserAnswers(Array(items.length).fill(''));
    }, [items.length]);

    // Set input ref
    const setInputRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
    }, []);

    // Focus specific input
    const focusInput = useCallback((index: number) => {
        const input = inputRefs.current[index];
        if (input) {
            input.focus();
            input.setSelectionRange(0, 0);
        }
    }, []);

    return {
        userAnswers,
        handleInputChange,
        handleKeyDown,
        resetAnswers,
        setInputRef,
        setUserAnswers,
        validateAnswer,
        getValidationResults,
        focusInput
    };
}