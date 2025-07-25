import React from 'react';
import { ExerciseMode } from '../types/exercise';
import { useLanguage } from '../hooks/useLanguage';

interface ModeSelectorProps {
  selectedMode: ExerciseMode;
  onModeChange: (mode: ExerciseMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  const { translations } = useLanguage();

  return (
    <div className="mode-selector">
      <div className="mode-tabs">
        <button
          className={`mode-tab ${selectedMode === 'number' ? 'active' : ''}`}
          onClick={() => onModeChange('number')}
        >
          {translations.modes.numberDictation}
        </button>
        <button
          className={`mode-tab ${selectedMode === 'math' ? 'active' : ''}`}
          onClick={() => onModeChange('math')}
        >
          {translations.modes.mathDictation}
        </button>
      </div>
    </div>
  );
};
