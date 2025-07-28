import { useCallback, useEffect, useRef, useState } from 'react';
import { useDictationLanguage } from './useDictationLanguage';

interface UseDirectionAudioProps {
  currentText: string | null;
  onPlaybackComplete?: () => void;
}

interface DirectionAudioState {
  isPlaying: boolean;
  canPlay: boolean;
  voiceWarning: string | null;
}

export const useDirectionAudio = ({ currentText, onPlaybackComplete }: UseDirectionAudioProps) => {
  const { dictationLanguage } = useDictationLanguage();
  const [audioState, setAudioState] = useState<DirectionAudioState>({
    isPlaying: false,
    canPlay: true,
    voiceWarning: null
  });
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);

  // Check if speech synthesis is available
  const checkSpeechSupport = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      setAudioState(prev => ({
        ...prev,
        canPlay: false,
        voiceWarning: '您的浏览器不支持语音合成功能'
      }));
      return false;
    }
    return true;
  }, []);

  // Get appropriate voice for the dictation language
  const getVoice = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    
    // Language mapping for voice selection
    const languageMap: Record<string, string[]> = {
      'fr-FR': ['fr-FR', 'fr'],
      'en-US': ['en-US', 'en'],
      'de-DE': ['de-DE', 'de'],
      'es-ES': ['es-ES', 'es'],
      'it-IT': ['it-IT', 'it'],
      'pt-PT': ['pt-PT', 'pt'],
      'zh-CN': ['zh-CN', 'zh'],
      'ja-JP': ['ja-JP', 'ja'],
      'ko-KR': ['ko-KR', 'ko'],
      'ar-SA': ['ar-SA', 'ar'],
      'ru-RU': ['ru-RU', 'ru'],
      'nl-NL': ['nl-NL', 'nl'],
      'sv-SE': ['sv-SE', 'sv'],
      'nb-NO': ['nb-NO', 'no']
    };

    const targetLanguages = languageMap[dictationLanguage] || ['fr-FR', 'fr'];
    
    // Find the best matching voice
    for (const lang of targetLanguages) {
      const voice = voices.find(v => v.lang.startsWith(lang));
      if (voice) return voice;
    }
    
    // Fallback to first available voice
    return voices[0] || null;
  }, [dictationLanguage]);

  // Play current text
  const playCurrentText = useCallback(() => {
    if (!currentText || !checkSpeechSupport() || isPlayingRef.current) {
      return;
    }

    // Stop any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentText);
    const voice = getVoice();
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = dictationLanguage;
    }

    utterance.rate = 0.8; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      isPlayingRef.current = true;
      setAudioState(prev => ({
        ...prev,
        isPlaying: true,
        voiceWarning: null
      }));
    };

    utterance.onend = () => {
      isPlayingRef.current = false;
      setAudioState(prev => ({
        ...prev,
        isPlaying: false
      }));
      onPlaybackComplete?.();
    };

    utterance.onerror = (event) => {
      isPlayingRef.current = false;
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        voiceWarning: `语音播放错误: ${event.error}`
      }));
      console.error('语音合成错误：', event.error);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [currentText, checkSpeechSupport, getVoice, dictationLanguage, onPlaybackComplete]);

  // Stop current playback
  const stopPlayback = useCallback(() => {
    speechSynthesis.cancel();
    isPlayingRef.current = false;
    setAudioState(prev => ({
      ...prev,
      isPlaying: false
    }));
  }, []);

  // Replay current text
  const replayCurrentText = useCallback(() => {
    stopPlayback();
    setTimeout(() => {
      playCurrentText();
    }, 100);
  }, [stopPlayback, playCurrentText]);

  // Auto-play when currentText changes
  useEffect(() => {
    if (currentText) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        playCurrentText();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentText, playCurrentText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      isPlayingRef.current = false;
    };
  }, []);

  return {
    audioState,
    playCurrentText,
    replayCurrentText,
    stopPlayback
  };
};
