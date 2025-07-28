/**
 * TTS优化工具
 * 优化浏览器TTS的表现，添加语言特定的TTS配置
 */

import { getLanguageConfig } from './language-configs';

// TTS配置接口
export interface TTSConfig {
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

// TTS优化选项
export interface TTSOptimizationOptions {
  addPauses: boolean;
  numberSpacing: boolean;
  emphasizeNumbers: boolean;
  slowDownComplexWords: boolean;
}

/**
 * TTS优化器类
 */
export class TTSOptimizer {
  private voiceCache: Map<string, SpeechSynthesisVoice | null> = new Map();

  /**
   * 优化数字的TTS表达
   */
  optimizeNumberForTTS(num: number, language: string): string {
    const config = getLanguageConfig(language);
    let text = num.toString();

    // 添加适当的空格和停顿
    if (config.ttsConfig.numberSpacing) {
      text = this.addNumberSpacing(text);
    }

    // 处理特殊数字（如年份、电话号码格式）
    if (this.isYear(num)) {
      text = this.formatYearForTTS(num, language);
    } else if (this.isLargeNumber(num)) {
      text = this.formatLargeNumberForTTS(num, language);
    }

    // 添加停顿标记
    if (config.ttsConfig.pauseAfterNumbers) {
      text = this.addPauseAfterNumber(text);
    }

    return text;
  }

  /**
   * 优化时间表达的TTS
   */
  optimizeTimeForTTS(timeText: string, language: string): string {
    const config = getLanguageConfig(language);
    let optimizedText = timeText;

    // 添加适当的停顿标记
    optimizedText = this.addTimeRelatedPauses(optimizedText, config);

    // 处理日期分隔符
    optimizedText = this.optimizeDateSeparators(optimizedText, config);

    // 处理序数词
    optimizedText = this.optimizeOrdinals(optimizedText, language);

    return optimizedText;
  }

  /**
   * 优化方位词汇的TTS
   */
  optimizeDirectionForTTS(directionText: string, language: string): string {
    const config = getLanguageConfig(language);
    let optimizedText = directionText;

    // 方位词汇通常不需要特殊处理，但可以添加轻微停顿
    if (config.ttsConfig.pauseAfterNumbers) {
      optimizedText = this.addMinorPause(optimizedText);
    }

    return optimizedText;
  }

  /**
   * 优化长度表达的TTS
   */
  optimizeLengthForTTS(lengthText: string, language: string): string {
    let optimizedText = lengthText;

    // 在数字和单位之间添加停顿
    optimizedText = this.addPauseBetweenNumberAndUnit(optimizedText);

    // 处理小数点
    optimizedText = this.optimizeDecimalPoints(optimizedText, language);

    return optimizedText;
  }

  /**
   * 获取语言特定的TTS配置
   */
  getTTSConfig(language: string): TTSConfig {
    const config = getLanguageConfig(language);
    const voice = this.getBestVoiceForLanguage(language);

    return {
      lang: config.speechLang,
      rate: config.ttsConfig.rate,
      pitch: config.ttsConfig.pitch,
      volume: config.ttsConfig.volume,
      voice: voice || undefined
    };
  }

  /**
   * 获取指定语言的最佳语音
   */
  getBestVoiceForLanguage(language: string): SpeechSynthesisVoice | null {
    // 检查缓存
    if (this.voiceCache.has(language)) {
      return this.voiceCache.get(language) || null;
    }

    if (!window.speechSynthesis) {
      this.voiceCache.set(language, null);
      return null;
    }

    const voices = window.speechSynthesis.getVoices();
    const config = getLanguageConfig(language);
    const targetLang = config.speechLang;

    // 首先尝试精确匹配
    let bestVoice = voices.find(voice =>
      voice.lang.toLowerCase() === targetLang.toLowerCase()
    );

    // 如果没有精确匹配，尝试语言代码匹配
    if (!bestVoice) {
      const langCode = targetLang.split('-')[0].toLowerCase();
      bestVoice = voices.find(voice =>
        voice.lang.toLowerCase().startsWith(langCode)
      );
    }

    // 优先选择本地语音
    if (bestVoice && !bestVoice.localService) {
      const localVoice = voices.find(voice =>
        voice.lang.toLowerCase().startsWith(targetLang.split('-')[0].toLowerCase()) &&
        voice.localService
      );
      if (localVoice) {
        bestVoice = localVoice;
      }
    }

    // 缓存结果
    this.voiceCache.set(language, bestVoice || null);
    return bestVoice || null;
  }

  /**
   * 创建优化的语音合成实例
   */
  createOptimizedUtterance(text: string, language: string): SpeechSynthesisUtterance {
    const config = this.getTTSConfig(language);
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = config.lang;
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;

    if (config.voice) {
      utterance.voice = config.voice;
    }

    return utterance;
  }

  /**
   * 测试语音合成是否可用
   */
  async testVoiceAvailability(language: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve(false);
        return;
      }

      const config = this.getTTSConfig(language);
      const testUtterance = new SpeechSynthesisUtterance('test');
      testUtterance.lang = config.lang;
      testUtterance.volume = 0; // 静音测试

      if (config.voice) {
        testUtterance.voice = config.voice;
      }

      let resolved = false;

      testUtterance.onend = () => {
        if (!resolved) {
          resolved = true;
          resolve(true);
        }
      };

      testUtterance.onerror = () => {
        if (!resolved) {
          resolved = true;
          resolve(false);
        }
      };

      // 设置超时
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          window.speechSynthesis.cancel();
          resolve(false);
        }
      }, 2000);

      window.speechSynthesis.speak(testUtterance);
    });
  }

  // ========== 私有辅助方法 ==========

  private addNumberSpacing(text: string): string {
    // 为长数字添加空格，提高可读性
    if (text.length > 4) {
      return text.split('').join(' ');
    }
    return text;
  }

  private isYear(num: number): boolean {
    return num >= 1000 && num <= 9999;
  }

  private isLargeNumber(num: number): boolean {
    return num >= 10000;
  }

  private formatYearForTTS(num: number, language: string): string {
    // 年份的特殊处理
    const config = getLanguageConfig(language);

    if (config.code === 'en-US') {
      // 英语年份通常按两位数读取
      const str = num.toString();
      if (str.length === 4) {
        const first = str.substring(0, 2);
        const second = str.substring(2, 4);
        return `${first} ${second}`;
      }
    }

    return num.toString();
  }

  private formatLargeNumberForTTS(num: number, _language: string): string {
    // 大数字的分组处理
    const str = num.toString();
    const groups = [];

    for (let i = str.length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3);
      groups.unshift(str.substring(start, i));
    }

    return groups.join(' ');
  }

  private addPauseAfterNumber(text: string): string {
    // 在数字后添加停顿标记
    return text + ',';
  }

  private addTimeRelatedPauses(text: string, _config: any): string {
    // 在时间相关的分隔符处添加停顿
    let result = text;

    // 在日期分隔符处添加停顿
    result = result.replace(/(\d+)[\/\-\.](\d+)/g, '$1, $2');

    return result;
  }

  private optimizeDateSeparators(text: string, config: any): string {
    // 优化日期分隔符的读音
    const separator = config.timeFormat.dateSeparator;

    if (separator === '/') {
      return text.replace(/\//g, ' ');
    } else if (separator === '-') {
      return text.replace(/-/g, ' ');
    } else if (separator === '.') {
      return text.replace(/\./g, ' ');
    }

    return text;
  }

  private optimizeOrdinals(text: string, language: string): string {
    // 优化序数词的读音
    if (language === 'en-US') {
      // 英语序数词优化
      text = text.replace(/(\d+)st/g, '$1st');
      text = text.replace(/(\d+)nd/g, '$1nd');
      text = text.replace(/(\d+)rd/g, '$1rd');
      text = text.replace(/(\d+)th/g, '$1th');
    } else if (language === 'fr-FR') {
      // 法语序数词优化
      text = text.replace(/1er/g, 'premier');
      text = text.replace(/(\d+)e/g, '$1ème');
    }

    return text;
  }

  private addMinorPause(text: string): string {
    // 添加轻微停顿
    return text + '.';
  }

  private addPauseBetweenNumberAndUnit(text: string): string {
    // 在数字和单位之间添加停顿
    return text.replace(/(\d+)\s*([a-zA-Z]+)/g, '$1, $2');
  }

  private optimizeDecimalPoints(text: string, language: string): string {
    // 优化小数点的读音
    const config = getLanguageConfig(language);
    const separator = config.numberFormat.decimalSeparator;

    if (separator === ',') {
      return text.replace(/,/g, ' virgule ');
    } else {
      return text.replace(/\./g, ' point ');
    }
  }

  /**
   * 清除语音缓存
   */
  clearVoiceCache(): void {
    this.voiceCache.clear();
  }
}

// 导出单例实例
export const ttsOptimizer = new TTSOptimizer();
