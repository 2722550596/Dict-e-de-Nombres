import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { DirectionContent } from '../types/game.types';
import './DirectionButtonGrid.css';

export interface DirectionButtonGridProps {
  availableDirections: DirectionContent[];
  currentQuestion: DirectionContent | null;
  onDirectionSelect: (direction: string) => void;
  feedbackState: 'none' | 'correct' | 'incorrect';
  selectedDirection?: string;
  correctDirection?: string;
}

export const DirectionButtonGrid: React.FC<DirectionButtonGridProps> = ({
  availableDirections,
  currentQuestion,
  onDirectionSelect,
  feedbackState,
  selectedDirection,
  correctDirection
}) => {
  const { translations } = useLanguage();
  // Calculate button positions based on direction type and value
  const getButtonPosition = (direction: DirectionContent): { x: number; y: number } => {
    // If position is already defined in the direction content, use it
    if (direction.buttonPosition) {
      return direction.buttonPosition;
    }

    // Calculate position based on direction type and value
    const { type, value } = direction;
    
    switch (type) {
      case 'cardinal': // 基本方位：东南西北
        switch (value.toLowerCase()) {
          case '北': case 'north': case 'nord': return { x: 1, y: 0 };
          case '东北': case 'northeast': case 'nord-est': return { x: 2, y: 0 };
          case '东': case 'east': case 'est': return { x: 2, y: 1 };
          case '东南': case 'southeast': case 'sud-est': return { x: 2, y: 2 };
          case '南': case 'south': case 'sud': return { x: 1, y: 2 };
          case '西南': case 'southwest': case 'sud-ouest': return { x: 0, y: 2 };
          case '西': case 'west': case 'ouest': return { x: 0, y: 1 };
          case '西北': case 'northwest': case 'nord-ouest': return { x: 0, y: 0 };
          default: return { x: 1, y: 1 }; // center
        }
      
      case 'relative': // 相对方位：左右前后
        switch (value.toLowerCase()) {
          case '前': case 'front': case 'devant': return { x: 1, y: 0 };
          case '右': case 'right': case 'droite': return { x: 2, y: 1 };
          case '后': case 'back': case 'derrière': return { x: 1, y: 2 };
          case '左': case 'left': case 'gauche': return { x: 0, y: 1 };
          case '左前': case 'front-left': case 'devant-gauche': return { x: 0, y: 0 };
          case '右前': case 'front-right': case 'devant-droite': return { x: 2, y: 0 };
          case '左后': case 'back-left': case 'derrière-gauche': return { x: 0, y: 2 };
          case '右后': case 'back-right': case 'derrière-droite': return { x: 2, y: 2 };
          default: return { x: 1, y: 1 }; // center
        }
      
      case 'spatial': // 空间方位：上下里外
        switch (value.toLowerCase()) {
          case '上': case 'up': case 'haut': return { x: 1, y: 0 };
          case '下': case 'down': case 'bas': return { x: 1, y: 2 };
          case '里': case 'inside': case 'dedans': return { x: 1, y: 1 };
          case '外': case 'outside': case 'dehors': return { x: 0, y: 1 };
          case '左上': case 'upper-left': case 'haut-gauche': return { x: 0, y: 0 };
          case '右上': case 'upper-right': case 'haut-droite': return { x: 2, y: 0 };
          case '左下': case 'lower-left': case 'bas-gauche': return { x: 0, y: 2 };
          case '右下': case 'lower-right': case 'bas-droite': return { x: 2, y: 2 };
          default: return { x: 1, y: 1 }; // center
        }
      
      default:
        return { x: 1, y: 1 }; // center fallback
    }
  };

  // Create a 3x3 grid layout
  const gridSize = 3;
  const buttonGrid: (DirectionContent | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

  // Place buttons in their calculated positions
  availableDirections.forEach(direction => {
    const position = getButtonPosition(direction);
    const x = Math.max(0, Math.min(gridSize - 1, position.x));
    const y = Math.max(0, Math.min(gridSize - 1, position.y));
    buttonGrid[y][x] = direction;
  });

  const handleButtonClick = (direction: DirectionContent) => {
    if (feedbackState === 'none') {
      onDirectionSelect(direction.value);
    }
  };

  const getButtonState = (direction: DirectionContent): string => {
    if (feedbackState === 'none') {
      return 'default';
    }
    
    if (feedbackState === 'correct' && direction.value === selectedDirection) {
      return 'correct';
    }
    
    if (feedbackState === 'incorrect') {
      if (direction.value === selectedDirection) {
        return 'incorrect';
      }
      if (direction.value === correctDirection) {
        return 'correct-answer';
      }
    }
    
    return 'disabled';
  };

  return (
    <div className="direction-button-grid">
      <div className="direction-grid-container">
        {buttonGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="direction-grid-row">
            {row.map((direction, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="direction-grid-cell">
                {direction ? (
                  <button
                    className={`direction-button ${getButtonState(direction)}`}
                    onClick={() => handleButtonClick(direction)}
                    disabled={feedbackState !== 'none'}
                    aria-label={`${translations.newModeTexts?.selectDirection || 'Select direction'}: ${direction.displayText}`}
                  >
                    <span className="direction-text">{direction.displayText}</span>
                    {getButtonState(direction) === 'correct' && (
                      <span className="feedback-icon correct-icon">✓</span>
                    )}
                    {getButtonState(direction) === 'incorrect' && (
                      <span className="feedback-icon incorrect-icon">✗</span>
                    )}
                    {getButtonState(direction) === 'correct-answer' && (
                      <span className="feedback-icon correct-answer-icon">✓</span>
                    )}
                  </button>
                ) : (
                  <div className="direction-button-placeholder" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {currentQuestion && (
        <div className="current-question-info">
          <div className="question-type-badge">
            {currentQuestion.type === 'cardinal' && (translations.directionTypes?.cardinal || 'Cardinal Directions')}
            {currentQuestion.type === 'relative' && (translations.directionTypes?.relative || 'Relative Directions')}
            {currentQuestion.type === 'spatial' && (translations.directionTypes?.spatial || 'Spatial Directions')}
          </div>
        </div>
      )}
    </div>
  );
};