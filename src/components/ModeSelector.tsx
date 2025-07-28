import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { ExerciseMode } from '../types/exercise';

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
        <button
          className={`mode-tab ${selectedMode === 'direction' ? 'active' : ''}`}
          onClick={() => onModeChange('direction')}
        >
          {translations.modes.directionDictation || 'Direction Dictation'}
        </button>
        <button
          className={`mode-tab ${selectedMode === 'time' ? 'active' : ''}`}
          onClick={() => onModeChange('time')}
        >
          {translations.modes.timeDictation || 'Time Dictation'}
        </button>
        <button
          className={`mode-tab ${selectedMode === 'length' ? 'active' : ''}`}
          onClick={() => onModeChange('length')}
        >
          {translations.modes.lengthDictation || 'Length Dictation'}
        </button>
      </div>
    </div>
  );
};
