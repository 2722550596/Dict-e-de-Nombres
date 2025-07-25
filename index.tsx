import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './src/components/LanguageProvider';
import { LanguageSelector } from './src/components/LanguageSelector';
import { VolumeControl } from './src/components/VolumeControl';
import { ModeSelector } from './src/components/ModeSelector';
import { NumberSettingsPanel } from './src/components/NumberDictation/NumberSettingsPanel';
import { MathSettingsPanel } from './src/components/MathDictation/MathSettingsPanel';
import { PracticePanel } from './src/components/PracticePanel';
import { useLanguage } from './src/hooks/useLanguage';
import { useGlobalAudioEffects } from './src/hooks/useGlobalAudioEffects';
import { ExerciseMode, ExerciseSettings } from './src/types/exercise';

const AppContent = () => {
  const { translations } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<ExerciseMode>('number');
  const [view, setView] = useState<'settings' | 'practice'>('settings');
  const [settings, setSettings] = useState<ExerciseSettings | null>(null);

  // 启用全局音效
  const { playInteractionSound } = useGlobalAudioEffects();

  const handleStartPractice = (newSettings: ExerciseSettings) => {
    setSettings(newSettings);
    setView('practice');
    playInteractionSound('navigation');
  };

  const handleReset = () => {
    setSettings(null);
    setView('settings');
    playInteractionSound('navigation');
  };

  const renderSettingsPanel = () => {
    if (selectedMode === 'number') {
      return <NumberSettingsPanel onStart={handleStartPractice} />;
    } else {
      return <MathSettingsPanel onStart={handleStartPractice} />;
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="left-controls">
          <VolumeControl />
        </div>
        <div className="right-controls">
          <button
            className="debug-button"
            onClick={() => window.open('./voice-test.html', '_blank')}
            title="Debug Voice Test"
          >
            🔧
          </button>
          <LanguageSelector />
        </div>
      </div>

      <h1>{translations.appTitle}</h1>
      <p className="app-subtitle">{translations.appSubtitle}</p>

      {view === 'settings' ? (
        <>
          <ModeSelector
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
          />
          {renderSettingsPanel()}
        </>
      ) : settings ? (
        <PracticePanel settings={settings} onReset={handleReset} />
      ) : null}
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);