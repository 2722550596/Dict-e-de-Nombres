/**
 * 音频相关类型定义
 * 统一管理音效、语音合成等音频相关的类型
 */

// ==================== 音效类型 ====================
export type SoundEffect =
  | 'success'
  | 'error'
  | 'click'
  | 'hover'
  | 'celebration'
  | 'input'
  | 'submit'
  | 'select'
  | 'tab'
  | 'navigation'
  | 'toggle';

// ==================== 音效配置 ====================
export interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

// ==================== 音频状态 ====================
export interface AudioState {
  enabled: boolean;
  volume: number;
  currentlyPlaying: boolean;
  lastPlayedSound?: SoundEffect;
  lastPlayedTime?: number;
}

// ==================== 语音合成配置 ====================
export interface VoiceConfig {
  language: string;
  voice?: SpeechSynthesisVoice;
  rate: number;
  pitch: number;
  volume: number;
}

// ==================== 语音合成状态 ====================
export interface VoiceState {
  isSupported: boolean;
  isPlaying: boolean;
  availableVoices: SpeechSynthesisVoice[];
  currentVoice?: SpeechSynthesisVoice;
  queue: string[];
}

// ==================== 音频播放选项 ====================
export interface PlayOptions {
  volume?: number;
  delay?: number;
  interrupt?: boolean;
  callback?: () => void;
}

// ==================== 语音播放选项 ====================
export interface SpeechOptions {
  text: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}

// ==================== 音频管理器接口 ====================
export interface AudioManager {
  // 音效相关
  playSound(effect: SoundEffect, options?: PlayOptions): void;
  setEnabled(enabled: boolean): void;
  setVolume(volume: number): void;
  isEnabled(): boolean;
  getVolume(): number;
  
  // 语音合成相关
  speak(options: SpeechOptions): void;
  stopSpeaking(): void;
  pauseSpeaking(): void;
  resumeSpeaking(): void;
  isSpeaking(): boolean;
  getAvailableVoices(): SpeechSynthesisVoice[];
  setVoice(voice: SpeechSynthesisVoice): void;
}

// ==================== 音频事件 ====================
export interface AudioEvent {
  type: 'sound_played' | 'speech_started' | 'speech_ended' | 'speech_error' | 'volume_changed' | 'enabled_changed';
  timestamp: number;
  data?: any;
}

// ==================== 音频偏好设置 ====================
export interface AudioPreferences {
  soundEffectsEnabled: boolean;
  speechEnabled: boolean;
  masterVolume: number;
  soundEffectsVolume: number;
  speechVolume: number;
  speechRate: number;
  speechPitch: number;
  preferredVoice?: string;
  autoPlay: boolean;
}

// ==================== 音频分析数据 ====================
export interface AudioAnalytics {
  totalSoundsPlayed: number;
  totalSpeechTime: number;
  mostUsedSound: SoundEffect;
  averageSessionVolume: number;
  speechErrorCount: number;
  lastAudioActivity: string;
}

// ==================== 音频错误类型 ====================
export interface AudioError {
  type: 'synthesis_not_supported' | 'voice_not_found' | 'playback_failed' | 'permission_denied';
  message: string;
  details?: any;
  timestamp: number;
}

// ==================== 类型守卫 ====================
export const isSoundEffect = (value: string): value is SoundEffect => {
  const validSounds: SoundEffect[] = [
    'success', 'error', 'click', 'hover', 'celebration',
    'input', 'submit', 'select', 'tab', 'navigation', 'toggle'
  ];
  return validSounds.includes(value as SoundEffect);
};

export const isSoundConfig = (obj: any): obj is SoundConfig => {
  return obj &&
    typeof obj.frequency === 'number' &&
    typeof obj.duration === 'number' &&
    typeof obj.type === 'string' &&
    typeof obj.volume === 'number';
};

export const isVoiceConfig = (obj: any): obj is VoiceConfig => {
  return obj &&
    typeof obj.language === 'string' &&
    typeof obj.rate === 'number' &&
    typeof obj.pitch === 'number' &&
    typeof obj.volume === 'number';
};

// ==================== 工具类型 ====================
export type SoundEffectMap = Record<SoundEffect, SoundConfig>;
export type VoiceLanguageMap = Record<string, SpeechSynthesisVoice[]>;
export type AudioEventHandler = (event: AudioEvent) => void;

// ==================== 常量 ====================
export const DEFAULT_SOUND_VOLUME = 0.7;
export const DEFAULT_SPEECH_RATE = 1.0;
export const DEFAULT_SPEECH_PITCH = 1.0;
export const DEFAULT_SPEECH_VOLUME = 1.0;

export const SUPPORTED_LANGUAGES = ['fr-FR', 'en-US', 'zh-CN'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// ==================== 默认值创建函数 ====================
export const createDefaultAudioState = (): AudioState => ({
  enabled: true,
  volume: DEFAULT_SOUND_VOLUME,
  currentlyPlaying: false,
});

export const createDefaultVoiceConfig = (language: string = 'fr-FR'): VoiceConfig => ({
  language,
  rate: DEFAULT_SPEECH_RATE,
  pitch: DEFAULT_SPEECH_PITCH,
  volume: DEFAULT_SPEECH_VOLUME,
});

export const createDefaultAudioPreferences = (): AudioPreferences => ({
  soundEffectsEnabled: true,
  speechEnabled: true,
  masterVolume: DEFAULT_SOUND_VOLUME,
  soundEffectsVolume: DEFAULT_SOUND_VOLUME,
  speechVolume: DEFAULT_SPEECH_VOLUME,
  speechRate: DEFAULT_SPEECH_RATE,
  speechPitch: DEFAULT_SPEECH_PITCH,
  autoPlay: false,
});

export const createDefaultVoiceState = (): VoiceState => ({
  isSupported: 'speechSynthesis' in window,
  isPlaying: false,
  availableVoices: [],
  queue: [],
});
