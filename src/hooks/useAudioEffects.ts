/**
 * 音效管理Hook
 * 统一管理音效播放、语音合成等音频相关功能
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { playSound, playCelebration } from '../utils/audioEffects';
import type { SoundEffect, AudioState } from '../types';
import { CONFIG } from '../../config';

// Hook选项接口
export interface UseAudioEffectsOptions {
  enableSounds?: boolean;
  enableCelebration?: boolean;
  defaultVolume?: number;
  enableErrorHandling?: boolean;
}

// Hook返回值接口
export interface UseAudioEffectsReturn {
  audioState: AudioState;
  playEffect: (effect: SoundEffect, options?: { volume?: number; delay?: number }) => void;
  playCelebrationEffect: (duration?: number) => void;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  error: string | null;
}

/**
 * 音效管理Hook
 */
export const useAudioEffects = (options: UseAudioEffectsOptions = {}): UseAudioEffectsReturn => {
  const {
    enableSounds = true,
    enableCelebration = true,
    defaultVolume = CONFIG.AUDIO.DEFAULT_VOLUME,
    enableErrorHandling = true,
  } = options;

  // 状态管理
  const [audioState, setAudioState] = useState<AudioState>({
    enabled: enableSounds,
    volume: defaultVolume,
    currentlyPlaying: false,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 引用管理
  const playingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const celebrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 清理定时器
   */
  const clearTimeouts = useCallback(() => {
    if (playingTimeoutRef.current) {
      clearTimeout(playingTimeoutRef.current);
      playingTimeoutRef.current = null;
    }
    if (celebrationTimeoutRef.current) {
      clearTimeout(celebrationTimeoutRef.current);
      celebrationTimeoutRef.current = null;
    }
  }, []);

  /**
   * 播放音效
   */
  const playEffect = useCallback((
    effect: SoundEffect, 
    playOptions: { volume?: number; delay?: number } = {}
  ) => {
    if (!audioState.enabled) return;

    const { volume = audioState.volume, delay = 0 } = playOptions;

    try {
      setError(null);
      setIsPlaying(true);
      setAudioState(prev => ({ ...prev, currentlyPlaying: true, lastPlayedSound: effect, lastPlayedTime: Date.now() }));

      const executePlay = () => {
        try {
          playSound(effect);
          
          // 设置播放状态持续时间
          const soundConfig = CONFIG.AUDIO.SOUND_EFFECTS[effect];
          const duration = soundConfig?.duration ? soundConfig.duration * 1000 : 200;
          
          playingTimeoutRef.current = setTimeout(() => {
            setIsPlaying(false);
            setAudioState(prev => ({ ...prev, currentlyPlaying: false }));
          }, duration);
          
        } catch (err) {
          if (enableErrorHandling) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to play sound effect';
            setError(errorMessage);
            console.warn(`useAudioEffects: Could not play ${effect} sound:`, err);
          }
          setIsPlaying(false);
          setAudioState(prev => ({ ...prev, currentlyPlaying: false }));
        }
      };

      if (delay > 0) {
        setTimeout(executePlay, delay);
      } else {
        executePlay();
      }

    } catch (err) {
      if (enableErrorHandling) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize sound playback';
        setError(errorMessage);
        console.warn('useAudioEffects: Error in playEffect:', err);
      }
      setIsPlaying(false);
      setAudioState(prev => ({ ...prev, currentlyPlaying: false }));
    }
  }, [audioState.enabled, audioState.volume, enableErrorHandling]);

  /**
   * 播放庆祝音效
   */
  const playCelebrationEffect = useCallback((duration: number = CONFIG.TIMING.ANIMATION.CELEBRATION) => {
    if (!audioState.enabled || !enableCelebration) return;

    try {
      setError(null);
      setIsPlaying(true);
      setAudioState(prev => ({ ...prev, currentlyPlaying: true }));

      playCelebration();

      celebrationTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
        setAudioState(prev => ({ ...prev, currentlyPlaying: false }));
      }, duration);

    } catch (err) {
      if (enableErrorHandling) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to play celebration effect';
        setError(errorMessage);
        console.warn('useAudioEffects: Could not play celebration effect:', err);
      }
      setIsPlaying(false);
      setAudioState(prev => ({ ...prev, currentlyPlaying: false }));
    }
  }, [audioState.enabled, enableCelebration, enableErrorHandling]);

  /**
   * 设置音效启用状态
   */
  const setEnabled = useCallback((enabled: boolean) => {
    setAudioState(prev => ({ ...prev, enabled }));
    if (!enabled) {
      clearTimeouts();
      setIsPlaying(false);
    }
  }, [clearTimeouts]);

  /**
   * 设置音量
   */
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setAudioState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  // 清理副作用
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return {
    audioState,
    playEffect,
    playCelebrationEffect,
    setEnabled,
    setVolume,
    isPlaying,
    error,
  };
};

/**
 * 简化版音效Hook（仅播放功能）
 */
export const useSimpleAudioEffects = () => {
  const { playEffect, playCelebrationEffect, isPlaying } = useAudioEffects({
    enableSounds: true,
    enableCelebration: true,
    enableErrorHandling: false,
  });

  return {
    playEffect,
    playCelebrationEffect,
    isPlaying,
  };
};

/**
 * 静音版音效Hook（用于测试或静音环境）
 */
export const useSilentAudioEffects = (): UseAudioEffectsReturn => {
  const mockAudioState: AudioState = {
    enabled: false,
    volume: 0,
    currentlyPlaying: false,
  };

  return {
    audioState: mockAudioState,
    playEffect: () => {},
    playCelebrationEffect: () => {},
    setEnabled: () => {},
    setVolume: () => {},
    isPlaying: false,
    error: null,
  };
};
