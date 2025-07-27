import { AlertTriangle } from 'lucide-react';
import React from 'react';
import { AudioState } from '../hooks/useAudioPlayer';
import { useLanguage } from '../hooks/useLanguage';

interface AudioControlsProps {
  audioState: AudioState;
  playbackSpeed: number;
  playbackInterval: number;
  currentPlayingIndex: number;
  totalItems: number;
  voiceWarning: string | null;
  isSubmitted: boolean;
  onPlayPause: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: number) => void;
  onIntervalChange: (interval: number) => void;

}

export const AudioControls: React.FC<AudioControlsProps> = ({
  audioState,
  playbackSpeed,
  playbackInterval,
  currentPlayingIndex,
  totalItems,
  voiceWarning,
  isSubmitted,
  onPlayPause,
  onReplay,
  onSpeedChange,
  onIntervalChange
}) => {
  const { translations } = useLanguage();

  const progressPercentage = totalItems > 0 ? (currentPlayingIndex / totalItems) * 100 : 0;

  return (
    <>
      {voiceWarning && (
        <div className="voice-warning" style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '8px 12px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#856404',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={16} />
          {voiceWarning}
        </div>
      )}
      
      <div className="audio-controls">
        <button 
          className="button" 
          onClick={onPlayPause} 
          disabled={isSubmitted}
        >
          {audioState === 'playing' ? translations.pause : translations.play}
        </button>
        
        <button
          className="button"
          onClick={onReplay}
          disabled={isSubmitted}
        >
          {translations.replay}
        </button>


        
        <div className="speed-interval-container">
          <div className="speed-control">
            <label htmlFor="speed">{translations.speed}</label>
            <select
              id="speed"
              className="select"
              style={{width: 'auto'}}
              value={playbackSpeed}
              onChange={e => onSpeedChange(Number(e.target.value))}
              disabled={isSubmitted}
            >
              <option value="0.7">{translations.speeds.slow}</option>
              <option value="1">{translations.speeds.normal}</option>
              <option value="1.3">{translations.speeds.fast}</option>
            </select>
          </div>

          <div className="interval-control">
            <label htmlFor="interval">{translations.interval}</label>
            <input
              id="interval"
              type="number"
              className="input"
              style={{width: '80px'}}
              value={playbackInterval}
              onChange={e => onIntervalChange(Number(e.target.value))}
              min="0.1"
              max="10"
              step="0.1"
              disabled={isSubmitted}
            />
            <span>s</span>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <span>{translations.progress}</span>
            <span>{currentPlayingIndex} / {totalItems}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};
