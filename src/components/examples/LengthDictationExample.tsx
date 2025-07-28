import React, { useState } from 'react';
import { ExerciseSettings } from '../../types/game.types';
import { LengthDictationPanel } from '../LengthDictationPanel';

export const LengthDictationExample: React.FC = () => {
  const [currentView, setCurrentView] = useState<'settings' | 'practice'>('settings');
  const [exerciseSettings, setExerciseSettings] = useState<ExerciseSettings | null>(null);

  const handleStartExercise = () => {
    const settings: ExerciseSettings = {
      mode: 'length',
      difficulty: 'basic-units',
      range: [1, 100],
      quantity: 10,
      speed: 'normal',
      interval: 2000,
      lengthUnits: ['米', '厘米', '毫米', '公里'],
      lengthRange: [1, 100]
    };
    setExerciseSettings(settings);
    setCurrentView('practice');
  };

  const handleReset = () => {
    setCurrentView('settings');
    setExerciseSettings(null);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Length Dictation Panel Example</h2>
      
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
          <h3>Length Dictation Settings</h3>
          <div style={{ 
            padding: '1rem', 
            border: '1px solid #ddd', 
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            <h4>Configuration:</h4>
            <ul>
              <li>Mode: Length Dictation</li>
              <li>Units: 米, 厘米, 毫米, 公里</li>
              <li>Range: 1-100</li>
              <li>Quantity: 10 questions</li>
              <li>Speed: Normal</li>
            </ul>
            <button 
              onClick={handleStartExercise}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Start Length Dictation Practice
            </button>
          </div>
        </div>
      )}

      {currentView === 'practice' && exerciseSettings && (
        <div>
          <h3>Length Dictation Practice</h3>
          <LengthDictationPanel 
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
