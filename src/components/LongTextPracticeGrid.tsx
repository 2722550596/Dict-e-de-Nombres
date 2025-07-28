import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { LengthContent, TimeContent } from '../types/game.types';

interface FeedbackCellProps {
  userAnswer: string;
  correctAnswers: string[];
  displayText: string;
}

const FeedbackCell: React.FC<FeedbackCellProps> = ({ userAnswer, correctAnswers, displayText }) => {
  const isCorrect = correctAnswers.some(answer => 
    userAnswer.trim().toLowerCase() === answer.toLowerCase()
  );
  
  return (
    <div className={`long-text-feedback-cell ${isCorrect ? 'correct' : 'incorrect'}`}>
      {isCorrect ? (
        <span className="correct-answer">{displayText}</span>
      ) : (
        <div className="feedback-content">
          {userAnswer && <span className="user-answer-wrong">{userAnswer}</span>}
          <span className="correct-answer">{displayText}</span>
        </div>
      )}
    </div>
  );
};

interface LongTextPracticeGridProps {
  items: (TimeContent | LengthContent)[];
  userAnswers: string[];
  isSubmitted: boolean;
  currentPlayingIndex: number;
  audioState: 'idle' | 'playing' | 'paused';
  currentPage: number;
  itemsPerPage: number;
  onInputChange: (index: number, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  setInputRef: (index: number) => (el: HTMLInputElement | null) => void;
}

export const LongTextPracticeGrid: React.FC<LongTextPracticeGridProps> = ({
  items,
  userAnswers,
  isSubmitted,
  currentPlayingIndex,
  audioState,
  currentPage,
  itemsPerPage,
  onInputChange,
  onKeyDown,
  setInputRef
}) => {
  const { translations } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible items for current page
  const visibleItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex).map((item, i) => ({
      item,
      globalIndex: startIndex + i
    }));
  }, [items, currentPage, itemsPerPage]);

  // Calculate adaptive input width based on content
  const getInputWidth = useCallback((item: TimeContent | LengthContent): string => {
    const baseWidth = 120; // Minimum width in pixels
    const charWidth = 12; // Approximate character width in pixels
    
    // Get the longest possible answer to determine width
    let maxLength = item.displayText.length;
    
    if ('acceptedAnswers' in item) {
      // TimeContent
      maxLength = Math.max(maxLength, ...item.acceptedAnswers.map(answer => answer.length));
    } else if ('acceptedFormats' in item) {
      // LengthContent
      maxLength = Math.max(maxLength, ...item.acceptedFormats.map(format => format.length));
    }
    
    // Add some padding for comfortable typing
    const calculatedWidth = Math.max(baseWidth, (maxLength + 4) * charWidth);
    return `${Math.min(calculatedWidth, 300)}px`; // Cap at 300px
  }, []);

  // Handle input change with validation
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, globalIndex: number) => {
    const value = e.target.value;
    onInputChange(globalIndex, value);
  }, [onInputChange]);

  // Enhanced keyboard navigation for long text inputs
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, globalIndex: number) => {
    // Allow normal text editing keys to pass through
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Home' || e.key === 'End') {
      const input = e.target as HTMLInputElement;
      const cursorPosition = input.selectionStart || 0;
      const textLength = input.value.length;
      
      // Only handle navigation if at text boundaries
      if (e.key === 'Backspace' && cursorPosition === 0 && textLength === 0) {
        // At beginning of empty input, navigate to previous
        onKeyDown(e, globalIndex);
      } else if (e.key === 'Delete' && cursorPosition === textLength) {
        // At end of input with Delete, could navigate to next
        // But typically Delete doesn't navigate, so we let it pass
        return;
      } else {
        // Normal text editing, don't interfere
        return;
      }
    } else {
      // Pass through to existing navigation logic
      onKeyDown(e, globalIndex);
    }
  }, [onKeyDown]);

  // Scroll current playing item into view
  useEffect(() => {
    if (audioState === 'playing' && containerRef.current) {
      const currentPlayingElement = containerRef.current.querySelector(
        `[data-index="${currentPlayingIndex}"]`
      ) as HTMLElement;
      
      if (currentPlayingElement) {
        currentPlayingElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentPlayingIndex, audioState]);

  return (
    <div className="long-text-grid-container" ref={containerRef}>
      {visibleItems.map(({ item, globalIndex }) => {
        const isCurrentPlaying = globalIndex === currentPlayingIndex && audioState === 'playing';
        const inputWidth = getInputWidth(item);
        
        return (
          <div 
            key={globalIndex} 
            className={`long-text-grid-cell ${isCurrentPlaying ? 'current-playing' : ''}`}
            data-index={globalIndex}
          >
            <div className="long-text-cell-header">
              <span className="cell-number">{globalIndex + 1}</span>
              {isCurrentPlaying && (
                <span className="playing-indicator">♪</span>
              )}
            </div>
            
            {isSubmitted ? (
              <FeedbackCell 
                userAnswer={userAnswers[globalIndex] || ''} 
                correctAnswers={
                  'acceptedAnswers' in item
                    ? item.acceptedAnswers
                    : 'acceptedFormats' in item
                    ? item.acceptedFormats
                    : []
                }
                displayText={item.displayText}
              />
            ) : (
              <div className="long-text-input-container">
                <input
                  ref={setInputRef(globalIndex)}
                  type="text"
                  className="long-text-input"
                  style={{ width: inputWidth }}
                  value={userAnswers[globalIndex] || ''}
                  onChange={(e) => handleInputChange(e, globalIndex)}
                  onKeyDown={(e) => handleKeyDown(e, globalIndex)}
                  placeholder={translations.typeHere || '请输入...'}
                  aria-label={`${translations.answerFor || '答案'} ${globalIndex + 1}: ${item.displayText}`}
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="input-hint">
                  {item.displayText}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};