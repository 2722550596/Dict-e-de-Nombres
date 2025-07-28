import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DictationLanguageProvider } from './src/components/DictationLanguageProvider';
import { DirectionSettingsPanel } from './src/components/DirectionDictation/DirectionSettingsPanel';
import { DynamicSubtitle, DynamicTitle } from './src/components/DynamicTitle';
import { GameHUD } from './src/components/GameHUD';
import { LanguageProvider } from './src/components/LanguageProvider';
import { LanguageSelector } from './src/components/LanguageSelector';
import { LengthSettingsPanel } from './src/components/LengthDictation/LengthSettingsPanel';
import { MathSettingsPanel } from './src/components/MathDictation/MathSettingsPanel';
import { ModeSelector } from './src/components/ModeSelector';
import { NumberSettingsPanel } from './src/components/NumberDictation/NumberSettingsPanel';
import { PracticePanel } from './src/components/PracticePanel';
import { TimeSettingsPanel } from './src/components/TimeDictation/TimeSettingsPanel';
import { VolumeControl } from './src/components/VolumeControl';
import { useGlobalAudioEffects } from './src/hooks/useGlobalAudioEffects';
import './src/styles/DynamicTitle.css';
import { ExerciseMode, ExerciseSettings } from './src/types/exercise';
import { GameDataManager } from './src/utils/gameData';

// SVG调试图标组件
const DebugIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const AppContent = () => {
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

  const handleModeChange = (mode: ExerciseMode) => {
    // 清理之前模式的状态和数据
    setSettings(null);
    setView('settings');
    setSelectedMode(mode);
    playInteractionSound('click');
  };

  const renderSettingsPanel = () => {
    return (
      <div className="settings-panel-container">
        <div className={`settings-panel-wrapper ${selectedMode === 'number' ? 'active' : 'hidden'}`}>
          <NumberSettingsPanel onStart={handleStartPractice} />
        </div>
        <div className={`settings-panel-wrapper ${selectedMode === 'math' ? 'active' : 'hidden'}`}>
          <MathSettingsPanel onStart={handleStartPractice} />
        </div>
        <div className={`settings-panel-wrapper ${selectedMode === 'direction' ? 'active' : 'hidden'}`}>
          <DirectionSettingsPanel onStart={handleStartPractice} />
        </div>
        <div className={`settings-panel-wrapper ${selectedMode === 'time' ? 'active' : 'hidden'}`}>
          <TimeSettingsPanel onStart={handleStartPractice} />
        </div>
        <div className={`settings-panel-wrapper ${selectedMode === 'length' ? 'active' : 'hidden'}`}>
          <LengthSettingsPanel onStart={handleStartPractice} />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="app-container">
        <div className="app-header">
          <div className="left-controls">
          </div>
          <div className="right-controls">
            <VolumeControl />
            <button
              className="debug-button"
              onClick={() => window.open('./debug/voice-test.html', '_blank')}
              title="Debug Voice Test"
            >
              <DebugIcon />
            </button>
            <LanguageSelector />
          </div>
        </div>

      {view === 'settings' ? (
        <>
          <DynamicTitle />
          <DynamicSubtitle />
          <ModeSelector
            selectedMode={selectedMode}
            onModeChange={handleModeChange}
          />
          {renderSettingsPanel()}
        </>
      ) : settings ? (
        <PracticePanel settings={settings} onReset={handleReset} />
      ) : null}
      </div>
    </>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <DictationLanguageProvider>
        <GameHUD />
        <AppContent />
      </DictationLanguageProvider>
    </LanguageProvider>
  );
};

// 将GameDataManager暴露到全局，方便调试
(window as any).GameDataManager = GameDataManager;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);