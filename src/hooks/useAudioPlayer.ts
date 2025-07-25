import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from './useLanguage';

export type AudioState = 'idle' | 'playing' | 'paused';

interface UseAudioPlayerProps {
  items: string[]; // 要播放的文本数组
  onPlaybackComplete?: () => void;
}

export function useAudioPlayer({ items, onPlaybackComplete }: UseAudioPlayerProps) {
  const { translations } = useLanguage();
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playbackInterval, setPlaybackInterval] = useState(1.0);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentSpeechIndex = useRef(0);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const playbackSpeedRef = useRef(1);
  const speedChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePlaybackState = useCallback((newState: AudioState) => {
    setAudioState(newState);
    isPlayingRef.current = newState === 'playing';
  }, []);

  const getFrenchVoice = useCallback(() => {
    if (!window.speechSynthesis) return null;

    const voices = window.speechSynthesis.getVoices();
    const storageKey = 'selectedFrenchVoice';

    try {
      const savedVoiceData = localStorage.getItem(storageKey);
      if (savedVoiceData) {
        const voiceData = JSON.parse(savedVoiceData);
        const savedVoice = voices.find(voice =>
          voice.voiceURI === voiceData.voiceURI ||
          (voice.name === voiceData.name && voice.lang === voiceData.lang)
        );

        if (savedVoice) {
          return savedVoice;
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      localStorage.removeItem(storageKey);
    }

    const frenchVoicePatterns = [/fr.*fr/i, /french/i, /fr/i];
    
    for (const pattern of frenchVoicePatterns) {
      const voice = voices.find(v => pattern.test(v.lang) || pattern.test(v.name));
      if (voice) return voice;
    }

    return null;
  }, []);

  const checkVoiceSupport = useCallback(() => {
    if (!window.speechSynthesis) {
      setVoiceWarning(translations.warnings.noSpeechSupport);
      return;
    }

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        setTimeout(checkVoices, 100);
        return;
      }

      const frenchVoice = voices.find(v => 
        /fr.*fr/i.test(v.lang) || /french/i.test(v.name) || /fr/i.test(v.lang)
      );

      if (!frenchVoice) {
        setVoiceWarning(translations.warnings.noVoiceFound);
      } else {
        setVoiceWarning(null);
      }
    };

    checkVoices();
  }, [translations]);

  const playCurrentItem = useCallback((speed?: number) => {
    const index = currentSpeechIndex.current;
    if (index >= items.length || !window.speechSynthesis) {
      updatePlaybackState('idle');
      setCurrentPlayingIndex(0);
      if (onPlaybackComplete) {
        onPlaybackComplete();
      }
      return;
    }

    setCurrentPlayingIndex(index);

    const text = items[index];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';

    const frenchVoice = getFrenchVoice();
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.rate = speed !== undefined ? speed : playbackSpeedRef.current;

    utterance.onend = () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }

      if (isPlayingRef.current) {
        if (index + 1 < items.length) {
          currentSpeechIndex.current = index + 1;
          playbackTimeoutRef.current = setTimeout(() => {
            if (isPlayingRef.current) {
              playCurrentItem();
            }
          }, playbackInterval * 1000);
        } else {
          setCurrentPlayingIndex(items.length);
          updatePlaybackState('idle');
          if (onPlaybackComplete) {
            onPlaybackComplete();
          }
        }
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        if (event.error === 'language-unavailable' || event.error === 'voice-unavailable') {
          setVoiceWarning(translations.warnings.noVoiceFound);
        }
        updatePlaybackState('idle');
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [items, updatePlaybackState, playbackInterval, getFrenchVoice, translations, onPlaybackComplete]);

  const startPlayback = useCallback((fromIndex: number = 0) => {
    if (fromIndex >= items.length || !window.speechSynthesis) {
      updatePlaybackState('idle');
      setCurrentPlayingIndex(0);
      return;
    }

    currentSpeechIndex.current = fromIndex;
    setCurrentPlayingIndex(fromIndex);
    updatePlaybackState('playing');
    playCurrentItem();
  }, [items, updatePlaybackState, playCurrentItem]);

  const handlePlayPause = useCallback(() => {
    if (audioState === 'idle') {
      checkVoiceSupport();
    }

    if (audioState === 'playing') {
      updatePlaybackState('paused');
      window.speechSynthesis.cancel();
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
    } else {
      if (audioState === 'paused') {
        updatePlaybackState('playing');
        playCurrentItem();
      } else {
        startPlayback(0);
      }
    }
  }, [audioState, updatePlaybackState, playCurrentItem, startPlayback, checkVoiceSupport]);

  const handleReplay = useCallback(() => {
    window.speechSynthesis.cancel();
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    startPlayback(0);
  }, [startPlayback]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    playbackSpeedRef.current = newSpeed;

    const wasPlaying = audioState === 'playing';
    if (wasPlaying) {
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
        speedChangeTimeoutRef.current = null;
      }
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }

      window.speechSynthesis.cancel();

      speedChangeTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          playCurrentItem(newSpeed);
        }
        speedChangeTimeoutRef.current = null;
      }, 50);
    }
  }, [audioState, playCurrentItem]);

  const handleIntervalChange = useCallback((newInterval: number) => {
    const validInterval = Math.max(0.1, Math.min(10, newInterval || 1.0));
    setPlaybackInterval(validInterval);

    const wasPlaying = audioState === 'playing';
    if (wasPlaying) {
      if (intervalChangeTimeoutRef.current) {
        clearTimeout(intervalChangeTimeoutRef.current);
        intervalChangeTimeoutRef.current = null;
      }
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
        playbackTimeoutRef.current = null;
      }
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
        speedChangeTimeoutRef.current = null;
      }

      window.speechSynthesis.cancel();

      intervalChangeTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          playCurrentItem();
        }
        intervalChangeTimeoutRef.current = null;
      }, 50);
    }
  }, [audioState, playCurrentItem]);

  const stopPlayback = useCallback(() => {
    updatePlaybackState('idle');
    window.speechSynthesis.cancel();
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    setCurrentPlayingIndex(0);
    currentSpeechIndex.current = 0;
  }, [updatePlaybackState]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      window.speechSynthesis.cancel();
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
      }
      if (intervalChangeTimeoutRef.current) {
        clearTimeout(intervalChangeTimeoutRef.current);
      }
    };
  }, []);

  return {
    audioState,
    currentPlayingIndex,
    playbackSpeed,
    playbackInterval,
    voiceWarning,
    handlePlayPause,
    handleReplay,
    handleSpeedChange,
    handleIntervalChange,
    stopPlayback,
    startPlayback
  };
}
