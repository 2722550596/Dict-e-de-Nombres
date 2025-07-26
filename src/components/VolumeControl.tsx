import React, { useState, useEffect, useRef } from 'react';
import { getSoundVolume, setSoundVolume, isSoundMuted, toggleSoundMute, playSound } from '../utils/audioEffects';

// SVG音量图标组件
const VolumeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const VolumeLowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const VolumeMediumIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const VolumeHighIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M23 2a12.93 12.93 0 0 1 0 20" />
  </svg>
);

export const VolumeControl: React.FC = () => {
  const [volume, setVolume] = useState(getSoundVolume());
  const [isMuted, setIsMuted] = useState(isSoundMuted());
  const [showSlider, setShowSlider] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // 更新音量状态
  useEffect(() => {
    const updateState = () => {
      setVolume(getSoundVolume());
      setIsMuted(isSoundMuted());
    };

    // 监听音量变化
    const interval = setInterval(updateState, 100);
    return () => clearInterval(interval);
  }, []);

  // 处理点击外部区域关闭滑块
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSlider(false);
      }
    };

    if (showSlider) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSlider]);

  const handleVolumeIconClick = () => {
    const newMutedState = toggleSoundMute();
    setIsMuted(newMutedState);
    playSound('toggle');
  };

  const handleVolumeChange = (newVolume: number) => {
    setSoundVolume(newVolume);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // 播放音效预览
    if (newVolume > 0) {
      playSound('click');
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowSlider(true);
    playSound('hover');
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowSlider(false);
    }, 300);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeOffIcon />; // 静音
    } else if (volume < 0.3) {
      return <VolumeLowIcon />; // 低音量
    } else if (volume < 0.7) {
      return <VolumeMediumIcon />; // 中音量
    } else {
      return <VolumeHighIcon />; // 高音量
    }
  };

  const volumePercentage = Math.round(volume * 100);

  return (
    <div 
      className="volume-control" 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="volume-button"
        onClick={handleVolumeIconClick}
        title={isMuted ? `取消静音 (${volumePercentage}%)` : `静音 (${volumePercentage}%)`}
      >
        {getVolumeIcon()}
      </button>
      
      {showSlider && (
        <div className="volume-slider-container">
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />
          <span className="volume-percentage">{volumePercentage}%</span>
        </div>
      )}
    </div>
  );
};
