import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface FeedbackCellProps {
  userAnswer: string;
  correctAnswer: string | number;
}

const FeedbackCell: React.FC<FeedbackCellProps> = ({ userAnswer, correctAnswer }) => {
  const isCorrect = userAnswer === correctAnswer.toString();
  
  return (
    <div className={`feedback-cell ${isCorrect ? 'correct' : 'incorrect'}`}>
      {isCorrect ? (
        <span className="correct-answer">{correctAnswer}</span>
      ) : (
        <div className="feedback-content">
          {userAnswer && <span className="user-answer-wrong">{userAnswer}</span>}
          <span className="correct-answer">{correctAnswer}</span>
        </div>
      )}
    </div>
  );
};

interface PracticeGridProps {
  items: (number | string)[];
  userAnswers: string[];
  // 移除：placeholderStates: boolean[];
  playedItems: boolean[];
  isSubmitted: boolean;
  currentPlayingIndex: number;
  audioState: 'idle' | 'playing' | 'paused';
  currentPage: number;
  itemsPerPage: number;
  getMaxLength: (index: number) => number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  setInputRef: (index: number) => (el: HTMLInputElement | null) => void;
}

export const PracticeGrid: React.FC<PracticeGridProps> = ({
  items,
  userAnswers,
  // 移除：placeholderStates,
  playedItems,
  isSubmitted,
  currentPlayingIndex,
  audioState,
  currentPage,
  itemsPerPage,
  getMaxLength,
  onInputChange,
  onKeyDown,
  setInputRef
}) => {
  const { translations } = useLanguage();

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  const currentPlayingGlobalIndex = currentPlayingIndex;

  return (
    <div className="grid-container">
      {currentItems.map((item, i) => {
        const globalIndex = startIndex + i;
        const isCurrentPlaying = globalIndex === currentPlayingGlobalIndex && audioState === 'playing';
        
        return (
          <div key={globalIndex} className={`grid-cell ${isCurrentPlaying ? 'current-playing' : ''}`}>
            {isSubmitted ? (
              <FeedbackCell 
                userAnswer={userAnswers[globalIndex]} 
                correctAnswer={item} 
              />
            ) : (
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
            )}
          </div>
        );
      })}
    </div>
  );
};
