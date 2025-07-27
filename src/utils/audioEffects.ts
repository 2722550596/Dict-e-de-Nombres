// 音效类型定义
import { CONFIG } from '../../config';
import { TRANSLATIONS } from '../i18n/languages';

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

// 音效配置
interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

// 预定义音效配置
// 使用统一的音效配置
const SOUND_CONFIGS: Record<SoundEffect, SoundConfig> = CONFIG.AUDIO.SOUND_EFFECTS;

// 获取当前语言的翻译
const getCurrentTranslations = () => {
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'fr';
  return TRANSLATIONS[currentLanguage] || TRANSLATIONS.fr;
};

class AudioEffectsManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = CONFIG.AUDIO.DEFAULT_VOLUME;
  private loadedSounds: Map<SoundEffect, AudioBuffer> = new Map();

  constructor() {
    this.initAudioContext();
    this.loadSoundPreference();
    this.loadVolumePreference();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      const translations = getCurrentTranslations();
      console.warn(translations.console.webAudioNotSupported, error);
    }
  }

  private loadSoundPreference() {
    const saved = localStorage.getItem(CONFIG.STORAGE.SOUND_EFFECTS_ENABLED);
    this.enabled = saved !== 'false';
  }

  private loadVolumePreference() {
    const saved = localStorage.getItem(CONFIG.STORAGE.VOLUME_LEVEL);
    if (saved) {
      const volume = parseFloat(saved);
      if (!isNaN(volume) && volume >= 0 && volume <= 1) {
        this.volume = volume;
      }
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem(CONFIG.STORAGE.SOUND_EFFECTS_ENABLED, enabled.toString());
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem(CONFIG.STORAGE.VOLUME_LEVEL, this.volume.toString());
  }

  public getVolume(): number {
    return this.volume;
  }

  public isMuted(): boolean {
    return this.volume === 0 || !this.enabled;
  }

  public toggleMute(): boolean {
    if (this.volume === 0) {
      // 如果当前是静音，恢复到默认音量
      this.setVolume(0.7);
    } else {
      // 如果当前有音量，设为静音
      this.setVolume(0);
    }
    return this.isMuted();
  }

  // 使用Web Audio API生成音效
  private generateTone(config: SoundConfig): void {
    if (!this.audioContext || !this.enabled) return;

    try {
      // 确保AudioContext处于运行状态
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);
      oscillator.type = config.type;

      // 音量包络（应用全局音量）
      const finalVolume = config.volume * this.volume;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + config.duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + config.duration);
    } catch (error) {
      const translations = getCurrentTranslations();
      console.warn(translations.console.failedToGenerateAudioTone, error);
    }
  }

  // 播放预定义音效
  public playSound(effect: SoundEffect): void {
    if (!this.enabled) return;

    // 首先尝试播放加载的音频文件
    const audioBuffer = this.loadedSounds.get(effect);
    if (audioBuffer) {
      this.playAudioBuffer(audioBuffer);
      return;
    }

    // 回退到生成的音效
    const config = SOUND_CONFIGS[effect];
    if (config) {
      this.generateTone(config);
    }
  }

  // 播放音频缓冲区
  private playAudioBuffer(buffer: AudioBuffer): void {
    if (!this.audioContext) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // 应用全局音量
      gainNode.gain.setValueAtTime(0.3 * this.volume, this.audioContext.currentTime);
      source.start();
    } catch (error) {
      const translations = getCurrentTranslations();
      console.warn(translations.console.failedToPlayAudioBuffer, error);
    }
  }

  // 加载音效文件（供将来使用）
  public async loadSoundFile(effect: SoundEffect, url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.loadedSounds.set(effect, audioBuffer);
    } catch (error) {
      const translations = getCurrentTranslations();
      console.warn(`${translations.console.failedToLoadSoundFile} ${effect}:`, error);
    }
  }

  // 播放庆祝音效序列
  public playCelebration(): void {
    if (!this.enabled) return;

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        this.generateTone({
          frequency,
          duration: 0.3,
          type: 'sine',
          volume: 0.2 * this.volume
        });
      }, index * 150);
    });
  }

  // 清理资源
  public dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.loadedSounds.clear();
  }
}

// 单例实例
export const audioEffects = new AudioEffectsManager();

// 便捷函数
export const playSound = (effect: SoundEffect) => audioEffects.playSound(effect);
export const playCelebration = () => audioEffects.playCelebration();
export const setSoundEnabled = (enabled: boolean) => audioEffects.setEnabled(enabled);
export const isSoundEnabled = () => audioEffects.isEnabled();
export const setSoundVolume = (volume: number) => audioEffects.setVolume(volume);
export const getSoundVolume = () => audioEffects.getVolume();
export const isSoundMuted = () => audioEffects.isMuted();
export const toggleSoundMute = () => audioEffects.toggleMute();

// 在用户首次交互时初始化音频上下文
export const initAudioOnUserInteraction = () => {
  const initAudio = () => {
    if (audioEffects['audioContext']?.state === 'suspended') {
      audioEffects['audioContext'].resume();
    }
    document.removeEventListener('click', initAudio);
    document.removeEventListener('keydown', initAudio);
  };

  document.addEventListener('click', initAudio);
  document.addEventListener('keydown', initAudio);
};

// 音效文件URL配置（供将来使用）
export const SOUND_URLS = {
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  click: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
  celebration: '/sounds/celebration.mp3',
  input: '/sounds/input.mp3',
  submit: '/sounds/submit.mp3'
};

// 批量加载音效文件的函数（供将来使用）
export const loadAllSounds = async (): Promise<void> => {
  const loadPromises = Object.entries(SOUND_URLS).map(([effect, url]) =>
    audioEffects.loadSoundFile(effect as SoundEffect, url).catch(() => {
      // 静默处理加载失败，回退到生成的音效
    })
  );

  await Promise.allSettled(loadPromises);
};
