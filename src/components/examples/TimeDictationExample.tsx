import React, { useState } from 'react';
import { ExerciseSettings } from '../../types/game.types';
import { TimeSettingsPanel } from '../TimeDictation/TimeSettingsPanel';
import { TimeDictationPanel } from '../TimeDictationPanel';

export const TimeDictationExample: React.FC = () => {
  const [currentView, setCurrentView] = useState<'settings' | 'practice'>('settings');
  const [exerciseSettings, setExerciseSettings] = useState<ExerciseSettings | null>(null);

  const handleStartExercise = (settings: ExerciseSettings) => {
    setExerciseSettings(settings);
    setCurrentView('practice');
  };

  const handleReset = () => {
    setCurrentView('settings');
    setExerciseSettings(null);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Time Dictation Panel Example</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setCurrentView('settings')}
          style={{ 
            marginRight: '1rem',
            backgroundColor: currentView === 'settings' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Settings
        </button>
        <button 
          onClick={() => setCurrentView('practice')}
          disabled={!exerciseSettings}
          style={{ 
            backgroundColor: currentView === 'practice' && exerciseSettings ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: exerciseSettings ? 'pointer' : 'not-allowed'
          }}
        >
          Practice
        </button>
      </div>

      {currentView === 'settings' && (
        <div>
          <h3>Time Dictation Settings</h3>
          <TimeSettingsPanel onStart={handleStartExercise} />
        </div>
      )}

      {currentView === 'practice' && exerciseSettings && (
        <div>
          <h3>Time Dictation Practice</h3>
          <TimeDictationPanel 
            settings={exerciseSettings} 
            onReset={handleReset}
          />
        </div>
      )}

      {exerciseSettings && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <h4>Current Settings:</h4>
          <pre>{JSON.stringify(exerciseSettings, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};