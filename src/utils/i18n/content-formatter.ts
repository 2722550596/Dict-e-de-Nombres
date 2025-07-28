/**
 * 通用内容格式化器
 * 提供统一的格式化接口，支持数字、时间、方位、长度的格式化
 */

import { getLanguageConfig, getSynonymMapping } from './language-configs';

// 格式化内容接口
export interface FormattedContent {
  displayText: string;
  ttsText: string;
  acceptedFormats: string[];
}

// 时间内容接口（从现有代码导入）
export interface TimeContent {
  type: 'year' | 'month' | 'day' | 'weekday' | 'fullDate';
  value: string;
  displayText: string;
  acceptedAnswers?: string[];
}

// 方位内容接口（从现有代码导入）
export interface DirectionContent {
  type: 'cardinal' | 'relative' | 'spatial';
  value: string;
  displayText: string;
  acceptedAnswers?: string[];
}

// 长度内容接口（从现有代码导入）
export interface LengthContent {
  value: number;
  unit: string;
  displayText: string;
  acceptedFormats?: string[];
}

/**
 * 通用内容格式化器类
 */
export class ContentFormatter {
  /**
   * 数字格式化 - 主要依赖浏览器TTS
   */
  formatNumber(num: number, language: string): FormattedContent {
    const config = getLanguageConfig(language);

    // 基础显示文本
    const displayText = this.formatNumberDisplay(num, config);

    // TTS优化文本
    const ttsText = this.formatNumberForTTS(num, config);

    // 接受的格式
    const acceptedFormats = this.generateNumberFormats(num, language);

    return {
      displayText,
      ttsText,
      acceptedFormats
    };
  }

  /**
   * 时间格式化 - 基于配置的通用逻辑
   */
  formatTime(content: TimeContent, language: string): FormattedContent {
    const config = getLanguageConfig(language);

    const displayText = this.buildTimeDisplay(content, config);
    const ttsText = this.buildTimeTTSText(content, config);
    const acceptedFormats = this.generateTimeFormats(content, config, language);

    return {
      displayText,
      ttsText,
      acceptedFormats
    };
  }

  /**
   * 方位格式化 - 简单映射
   */
  formatDirection(content: DirectionContent, language: string): FormattedContent {
    const displayText = content.displayText;
    const ttsText = content.displayText; // 方位词汇通常不需要特殊TTS处理
    const acceptedFormats = this.generateDirectionFormats(content, language);

    return {
      displayText,
      ttsText,
      acceptedFormats
    };
  }

  /**
   * 长度格式化 - 基于单位偏好
   */
  formatLength(content: LengthContent, language: string): FormattedContent {
    const config = getLanguageConfig(language);

    const displayText = content.displayText;
    const ttsText = this.formatLengthForTTS(content, config);
    const acceptedFormats = this.generateLengthFormats(content, config, language);

    return {
      displayText,
      ttsText,
      acceptedFormats
    };
  }

  // ========== 私有辅助方法 ==========

  /**
   * 格式化数字显示
   */
  private formatNumberDisplay(num: number, config: any): string {
    if (config.numberFormat.useNativeFormatting) {
      // 使用浏览器原生格式化
      try {
        return new Intl.NumberFormat(config.code, {
          useGrouping: true
        }).format(num);
      } catch {
        return num.toString();
      }
    }

    return num.toString();
  }

  /**
   * 为TTS优化数字格式
   */
  private formatNumberForTTS(num: number, config: any): string {
    let text = num.toString();

    // 添加数字间距（适用于某些语言）
    if (config.ttsConfig.numberSpacing && text.length > 3) {
      text = text.split('').join(' ');
    }

    // 处理年份格式
    if (this.isYear(num)) {
      return this.formatYearForTTS(num, config);
    }

    return text;
  }

  /**
   * 生成数字的接受格式
   */
  private generateNumberFormats(num: number, language: string): string[] {
    const formats = [num.toString()];
    const synonyms = getSynonymMapping(language);

    // 添加文字形式（如果有同义词映射）
    const textForm = synonyms[num.toString()];
    if (textForm) {
      formats.push(...textForm);
    }

    // 添加格式化的数字（带千位分隔符等）
    const config = getLanguageConfig(language);
    if (config.numberFormat.useNativeFormatting) {
      try {
        const formatted = new Intl.NumberFormat(config.code).format(num);
        if (formatted !== num.toString()) {
          formats.push(formatted);
        }
      } catch {
        // 忽略格式化错误
      }
    }

    return Array.from(new Set(formats));
  }

  /**
   * 构建时间显示文本
   */
  private buildTimeDisplay(content: TimeContent, config: any): string {
    // 根据配置调整时间显示格式
    switch (content.type) {
      case 'year':
        return content.value;
      case 'month':
        return content.displayText;
      case 'day':
        if (config.timeFormat.useOrdinals) {
          return this.addOrdinalSuffix(content.value, config.code);
        }
        return content.value;
      case 'weekday':
        return content.displayText;
      case 'fullDate':
        return this.formatFullDate(content.value, config);
      default:
        return content.displayText;
    }
  }

  /**
   * 构建时间TTS文本
   */
  private buildTimeTTSText(content: TimeContent, config: any): string {
    // 大多数情况下，时间的TTS文本与显示文本相同
    // 但可以根据需要添加停顿标记等
    let text = this.buildTimeDisplay(content, config);

    if (config.ttsConfig.pauseAfterNumbers) {
      // 在数字后添加短暂停顿
      text = text.replace(/(\d+)/g, '$1,');
    }

    return text;
  }

  /**
   * 生成时间接受格式
   */
  private generateTimeFormats(content: TimeContent, config: any, language: string): string[] {
    const formats = content.acceptedAnswers || [content.value, content.displayText];

    // 根据语言添加额外格式
    switch (content.type) {
      case 'day':
        if (config.timeFormat.useOrdinals) {
          const ordinal = this.addOrdinalSuffix(content.value, config.code);
          formats.push(ordinal);
        }
        break;
      case 'month':
        // 添加数字格式
        const monthNum = this.getMonthNumber(content.value, language);
        if (monthNum) {
          formats.push(monthNum.toString());
          formats.push(monthNum < 10 ? `0${monthNum}` : monthNum.toString());
        }
        break;
    }

    return Array.from(new Set(formats));
  }

  /**
   * 生成方位接受格式
   */
  private generateDirectionFormats(content: DirectionContent, language: string): string[] {
    const formats = content.acceptedAnswers || [content.value, content.displayText];
    const synonyms = getSynonymMapping(language);

    // 添加同义词
    const mainWord = content.value.toLowerCase();
    if (synonyms[mainWord]) {
      formats.push(...synonyms[mainWord]);
    }

    // 添加大小写变体
    formats.push(content.value.toLowerCase());
    formats.push(content.value.toUpperCase());

    return Array.from(new Set(formats));
  }

  /**
   * 为TTS格式化长度
   */
  private formatLengthForTTS(content: LengthContent, config: any): string {
    let text = `${content.value} ${content.unit}`;

    if (config.ttsConfig.pauseAfterNumbers) {
      text = `${content.value}, ${content.unit}`;
    }

    return text;
  }

  /**
   * 生成长度接受格式
   */
  private generateLengthFormats(content: LengthContent, config: any, _language: string): string[] {
    const formats = content.acceptedFormats || [];

    // 添加基本格式
    formats.push(`${content.value} ${content.unit}`);
    formats.push(`${content.value}${content.unit}`);

    // 根据单位偏好添加其他格式
    if (config.unitPreferences.system === 'imperial' && this.isMetricUnit(content.unit)) {
      // 添加英制等价格式（如果需要）
      const imperialEquivalent = this.convertToImperial(content.value, content.unit);
      if (imperialEquivalent) {
        formats.push(imperialEquivalent);
      }
    }

    return Array.from(new Set(formats));
  }

  // ========== 工具方法 ==========

  private isYear(num: number): boolean {
    return num >= 1000 && num <= 9999;
  }

  private formatYearForTTS(num: number, _config: any): string {
    // 年份通常按千位读取，如 "2023" 读作 "twenty twenty-three"
    // 这里让浏览器TTS处理，只做基础格式化
    return num.toString();
  }

  private addOrdinalSuffix(value: string, languageCode: string): string {
    const num = parseInt(value);
    if (isNaN(num)) return value;

    // 简化的序数词处理
    switch (languageCode) {
      case 'en-US':
        if (num === 1 || num === 21 || num === 31) return `${num}st`;
        if (num === 2 || num === 22) return `${num}nd`;
        if (num === 3 || num === 23) return `${num}rd`;
        return `${num}th`;
      case 'fr-FR':
        return num === 1 ? '1er' : `${num}e`;
      default:
        return value;
    }
  }

  private formatFullDate(value: string, _config: any): string {
    // 根据配置格式化完整日期
    // 这里简化处理，实际可以更复杂
    return value;
  }

  private getMonthNumber(monthName: string, language: string): number | null {
    // 简化的月份名称到数字的映射
    // 实际实现可以更完整
    const monthMappings: Record<string, Record<string, number>> = {
      'fr-FR': {
        'janvier': 1, 'février': 2, 'mars': 3, 'avril': 4,
        'mai': 5, 'juin': 6, 'juillet': 7, 'août': 8,
        'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12
      },
      'en-US': {
        'january': 1, 'february': 2, 'march': 3, 'april': 4,
        'may': 5, 'june': 6, 'july': 7, 'august': 8,
        'september': 9, 'october': 10, 'november': 11, 'december': 12
      }
    };

    const mapping = monthMappings[language];
    return mapping ? mapping[monthName.toLowerCase()] || null : null;
  }

  private isMetricUnit(unit: string): boolean {
    return ['mm', 'cm', 'm', 'km'].includes(unit);
  }

  private convertToImperial(_value: number, _unit: string): string | null {
    // 简化的公制到英制转换
    // 实际实现可以更完整
    return null;
  }
}

// 导出单例实例
export const contentFormatter = new ContentFormatter();
