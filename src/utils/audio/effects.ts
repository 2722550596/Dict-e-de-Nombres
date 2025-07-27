/**
 * 音效管理工具
 * 重构自原audioEffects.ts，提供更清晰的音效管理接口
 */

import { CONFIG } from '../../../config';
import { TRANSLATIONS } from '../../i18n/languages';
import type { SoundEffect } from '../../types';
import { createAudioError, safeExecute } from '../core/errors';

// 音效配置接口
interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

/**
 * 音效管理器类
 */
export class AudioEffectsManager {
  private static instance: AudioEffectsManager;
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = CONFIG.AUDIO.DEFAULT_VOLUME;
  private loadedSounds: Map<SoundEffect, AudioBuffer> = new Map();
  private soundConfigs: Record<SoundEffect, SoundConfig>;

  constructor() {
    this.soundConfigs = CONFIG.AUDIO.SOUND_EFFECTS;
    this.initializeAudioContext();
  }

  static getInstance(): AudioEffectsManager {
    if (!AudioEffectsManager.instance) {
      AudioEffectsManager.instance = new AudioEffectsManager();
    }
    return AudioEffectsManager.instance;
  }

  /**
   * 初始化音频上下文
   */
  private initializeAudioContext(): void {
    safeExecute(() => {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();

        // 处理浏览器的自动播放策略
        if (this.audioContext.state === 'suspended') {
          const resumeAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
              this.audioContext.resume();
            }
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('touchstart', resumeAudio);
          };

          document.addEventListener('click', resumeAudio);
          document.addEventListener('touchstart', resumeAudio);
        }
      }
    });
  }

  /**
   * 获取当前语言的翻译
   */
  private getCurrentTranslations() {
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'fr';
    return TRANSLATIONS[currentLanguage] || TRANSLATIONS.fr;
  }

  /**
   * 设置音效启用状态
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 获取音效启用状态
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * 获取音量
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 播放音效缓冲区
   */
  private playAudioBuffer(buffer: AudioBuffer): void {
    safeExecute(() => {
      if (!this.audioContext || !this.enabled) return;

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(this.audioContext.currentTime);
    });
  }

  /**
   * 生成音调
   */
  private generateTone(config: SoundConfig): void {
    safeExecute(() => {
      if (!this.audioContext || !this.enabled) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        config.volume * this.volume,
        this.audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + config.duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + config.duration);
    });
  }

  /**
   * 播放预定义音效
   */
  playSound(effect: SoundEffect): void {
    if (!this.enabled) return;

    safeExecute(() => {
      // 首先尝试播放加载的音频文件
      const audioBuffer = this.loadedSounds.get(effect);
      if (audioBuffer) {
        this.playAudioBuffer(audioBuffer);
        return;
      }

      // 回退到生成的音效
      const config = this.soundConfigs[effect];
      if (config) {
        this.generateTone(config);
      } else {
        throw createAudioError(`Unknown sound effect: ${effect}`, { effect });
      }
    });
  }

  /**
   * 播放庆祝音效序列
   */
  playCelebration(): void {
    if (!this.enabled) return;

    safeExecute(() => {
      const celebrationSequence = [
        { effect: 'success' as SoundEffect, delay: 0 },
        { effect: 'celebration' as SoundEffect, delay: 200 },
        { effect: 'success' as SoundEffect, delay: 400 },
      ];

      celebrationSequence.forEach(({ effect, delay }) => {
        setTimeout(() => this.playSound(effect), delay);
      });
    });
  }

  /**
   * 加载音效文件
   */
  async loadSoundFile(effect: SoundEffect, url: string): Promise<boolean> {
    return safeExecute(async () => {
      if (!this.audioContext) {
        throw createAudioError('AudioContext not available');
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw createAudioError(`Failed to fetch sound file: ${url}`, { status: response.status });
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.loadedSounds.set(effect, audioBuffer);
      return true;
    }, false);
  }

  /**
   * 预加载所有音效文件
   */
  async preloadSounds(): Promise<void> {
    const soundUrls: Partial<Record<SoundEffect, string>> = {
      success: '/sounds/success.mp3',
      error: '/sounds/error.mp3',
      click: '/sounds/click.mp3',
      celebration: '/sounds/celebration.mp3',
    };

    const loadPromises = Object.entries(soundUrls).map(([effect, url]) =>
      this.loadSoundFile(effect as SoundEffect, url).catch(() => {
        // 静默处理加载失败，回退到生成的音效
        console.warn(`Failed to load sound file for ${effect}, using generated sound`);
      })
    );

    await Promise.allSettled(loadPromises);
  }

  /**
   * 创建自定义音效
   */
  createCustomSound(
    name: string,
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ): void {
    const customConfig: SoundConfig = {
      frequency,
      duration,
      type,
      volume,
    };

    safeExecute(() => {
      this.generateTone(customConfig);
    });
  }

  /**
   * 播放音效序列
   */
  playSequence(effects: Array<{ effect: SoundEffect; delay: number }>): void {
    if (!this.enabled) return;

    effects.forEach(({ effect, delay }) => {
      setTimeout(() => this.playSound(effect), delay);
    });
  }

  /**
   * 获取音效信息
   */
  getSoundInfo(): {
    enabled: boolean;
    volume: number;
    loadedSounds: string[];
    availableEffects: SoundEffect[];
    audioContextState: string;
  } {
    return {
      enabled: this.enabled,
      volume: this.volume,
      loadedSounds: Array.from(this.loadedSounds.keys()),
      availableEffects: Object.keys(this.soundConfigs) as SoundEffect[],
      audioContextState: this.audioContext?.state || 'unavailable',
    };
  }

  /**
   * 清理资源
   */
  dispose(): void {
    safeExecute(() => {
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
      }
      this.loadedSounds.clear();
      this.audioContext = null;
    });
  }
}

// 创建单例实例
const audioEffects = AudioEffectsManager.getInstance();

/**
 * 便捷的音效播放函数
 */
export const playSound = (effect: SoundEffect): void => {
  audioEffects.playSound(effect);
};

/**
 * 播放庆祝音效
 */
export const playCelebration = (): void => {
  audioEffects.playCelebration();
};

/**
 * 设置音效启用状态
 */
export const setAudioEnabled = (enabled: boolean): void => {
  audioEffects.setEnabled(enabled);
};

/**
 * 设置音量
 */
export const setAudioVolume = (volume: number): void => {
  audioEffects.setVolume(volume);
};

/**
 * 预加载音效
 */
export const preloadAudioEffects = (): Promise<void> => {
  return audioEffects.preloadSounds();
};

/**
 * 创建自定义音效
 */
export const createCustomAudioEffect = (
  name: string,
  frequency: number,
  duration: number,
  type?: OscillatorType,
  volume?: number
): void => {
  audioEffects.createCustomSound(name, frequency, duration, type, volume);
};

/**
 * 获取音效管理器实例（用于高级操作）
 */
export const getAudioEffectsManager = (): AudioEffectsManager => {
  return audioEffects;
};

/**
 * 向后兼容的导出
 */
export { audioEffects };
export default audioEffects;
