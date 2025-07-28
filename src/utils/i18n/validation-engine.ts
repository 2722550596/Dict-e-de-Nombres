/**
 * 通用验证引擎
 * 实现基于配置的答案验证系统
 */

import { getLanguageConfig, getSynonymMapping } from './language-configs';

// 验证结果接口
export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-1之间，表示匹配的置信度
  matchType: 'exact' | 'synonym' | 'format' | 'fuzzy';
  normalizedInput: string;
  normalizedCorrect: string;
}

// 验证选项
export interface ValidationOptions {
  caseSensitive?: boolean;
  allowSynonyms?: boolean;
  allowFormatVariants?: boolean;
  fuzzyThreshold?: number; // 模糊匹配的阈值
  strictMode?: boolean;
}

/**
 * 通用验证引擎类
 */
export class ValidationEngine {
  /**
   * 通用答案验证
   */
  validateAnswer(
    userInput: string,
    correctAnswer: string | string[],
    language: string,
    options: ValidationOptions = {}
  ): ValidationResult {
    const defaultOptions: ValidationOptions = {
      caseSensitive: false,
      allowSynonyms: true,
      allowFormatVariants: true,
      fuzzyThreshold: 0.8,
      strictMode: false,
      ...options
    };

    const normalizedInput = this.normalizeInput(userInput, language, defaultOptions);

    // 如果正确答案是数组，逐一检查
    const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

    for (const correct of correctAnswers) {
      const normalizedCorrect = this.normalizeInput(correct, language, defaultOptions);

      // 精确匹配
      if (normalizedInput === normalizedCorrect) {
        return {
          isValid: true,
          confidence: 1.0,
          matchType: 'exact',
          normalizedInput,
          normalizedCorrect
        };
      }

      // 同义词匹配
      if (defaultOptions.allowSynonyms) {
        const synonymResult = this.checkSynonyms(normalizedInput, normalizedCorrect, language);
        if (synonymResult.isValid) {
          return {
            ...synonymResult,
            normalizedInput,
            normalizedCorrect
          };
        }
      }

      // 格式变体匹配
      if (defaultOptions.allowFormatVariants) {
        const formatResult = this.checkFormatVariants(normalizedInput, correct, language);
        if (formatResult.isValid) {
          return {
            ...formatResult,
            normalizedInput,
            normalizedCorrect
          };
        }
      }

      // 模糊匹配（最后尝试）
      if (!defaultOptions.strictMode) {
        const fuzzyResult = this.checkFuzzyMatch(normalizedInput, normalizedCorrect, defaultOptions.fuzzyThreshold!);
        if (fuzzyResult.isValid) {
          return {
            ...fuzzyResult,
            normalizedInput,
            normalizedCorrect
          };
        }
      }
    }

    // 没有匹配
    return {
      isValid: false,
      confidence: 0,
      matchType: 'exact',
      normalizedInput,
      normalizedCorrect: Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer
    };
  }

  /**
   * 数字验证（支持多种格式）
   */
  validateNumber(userInput: string, correctNumber: number, language: string): ValidationResult {
    const config = getLanguageConfig(language);

    // 尝试解析用户输入为数字
    const parsedInput = this.parseNumber(userInput, config);

    if (parsedInput === correctNumber) {
      return {
        isValid: true,
        confidence: 1.0,
        matchType: 'exact',
        normalizedInput: userInput,
        normalizedCorrect: correctNumber.toString()
      };
    }

    // 检查文字形式的数字
    const synonyms = getSynonymMapping(language);
    const textForm = Object.keys(synonyms).find(key =>
      synonyms[key].includes(correctNumber.toString())
    );

    if (textForm && this.normalizeInput(userInput, language) === textForm) {
      return {
        isValid: true,
        confidence: 0.9,
        matchType: 'synonym',
        normalizedInput: userInput,
        normalizedCorrect: correctNumber.toString()
      };
    }

    return {
      isValid: false,
      confidence: 0,
      matchType: 'exact',
      normalizedInput: userInput,
      normalizedCorrect: correctNumber.toString()
    };
  }

  /**
   * 时间验证
   */
  validateTime(userInput: string, correctTime: any, language: string): ValidationResult {
    // 时间验证的特殊逻辑
    const normalizedInput = this.normalizeInput(userInput, language);

    // 检查多种时间格式
    const timeFormats = this.generateTimeFormats(correctTime, language);

    for (const format of timeFormats) {
      const normalizedFormat = this.normalizeInput(format, language);
      if (normalizedInput === normalizedFormat) {
        return {
          isValid: true,
          confidence: 1.0,
          matchType: 'format',
          normalizedInput,
          normalizedCorrect: format
        };
      }
    }

    return {
      isValid: false,
      confidence: 0,
      matchType: 'exact',
      normalizedInput,
      normalizedCorrect: correctTime.toString()
    };
  }

  /**
   * 方位验证
   */
  validateDirection(userInput: string, correctDirection: string, language: string): ValidationResult {
    return this.validateAnswer(userInput, correctDirection, language, {
      allowSynonyms: true,
      allowFormatVariants: true,
      fuzzyThreshold: 0.7 // 方位词汇允许更宽松的匹配
    });
  }

  /**
   * 长度验证
   */
  validateLength(userInput: string, correctLength: any, language: string): ValidationResult {
    const config = getLanguageConfig(language);

    // 解析用户输入的数值和单位
    const parsedInput = this.parseLengthInput(userInput, config);
    const parsedCorrect = this.parseLengthInput(correctLength.displayText, config);

    if (parsedInput && parsedCorrect) {
      // 检查数值是否相等（考虑单位换算）
      const isEqual = this.compareLengthValues(parsedInput, parsedCorrect, config);

      if (isEqual) {
        return {
          isValid: true,
          confidence: 1.0,
          matchType: 'exact',
          normalizedInput: userInput,
          normalizedCorrect: correctLength.displayText
        };
      }
    }

    // 回退到通用验证
    return this.validateAnswer(userInput, correctLength.acceptedFormats || [correctLength.displayText], language);
  }

  // ========== 私有辅助方法 ==========

  /**
   * 输入标准化
   */
  private normalizeInput(input: string, language: string, options: ValidationOptions = {}): string {
    let normalized = input;

    // 基础清理
    normalized = normalized.trim();

    if (!options.caseSensitive) {
      normalized = normalized.toLowerCase();
    }

    // 移除多余的空格
    normalized = normalized.replace(/\s+/g, ' ');

    // 移除标点符号（可选）
    if (!options.strictMode) {
      normalized = normalized.replace(/[^\w\s]/g, '');
    }

    // 语言特定的标准化
    normalized = this.applyLanguageSpecificNormalization(normalized, language);

    return normalized;
  }

  /**
   * 同义词检查
   */
  private checkSynonyms(input: string, correct: string, language: string): ValidationResult {
    const synonyms = getSynonymMapping(language);

    // 检查输入是否是正确答案的同义词
    const inputSynonyms = synonyms[input] || [];
    if (inputSynonyms.includes(correct)) {
      return {
        isValid: true,
        confidence: 0.9,
        matchType: 'synonym',
        normalizedInput: input,
        normalizedCorrect: correct
      };
    }

    // 检查正确答案是否是输入的同义词
    const correctSynonyms = synonyms[correct] || [];
    if (correctSynonyms.includes(input)) {
      return {
        isValid: true,
        confidence: 0.9,
        matchType: 'synonym',
        normalizedInput: input,
        normalizedCorrect: correct
      };
    }

    // 检查是否有共同的同义词
    const commonSynonyms = inputSynonyms.filter(syn => correctSynonyms.includes(syn));
    if (commonSynonyms.length > 0) {
      return {
        isValid: true,
        confidence: 0.8,
        matchType: 'synonym',
        normalizedInput: input,
        normalizedCorrect: correct
      };
    }

    return {
      isValid: false,
      confidence: 0,
      matchType: 'synonym',
      normalizedInput: input,
      normalizedCorrect: correct
    };
  }

  /**
   * 格式变体检查
   */
  private checkFormatVariants(input: string, correct: string, language: string): ValidationResult {
    const config = getLanguageConfig(language);

    // 数字格式变体
    if (this.isNumeric(input) && this.isNumeric(correct)) {
      const inputNum = this.parseNumber(input, config);
      const correctNum = this.parseNumber(correct, config);

      if (inputNum === correctNum) {
        return {
          isValid: true,
          confidence: 0.95,
          matchType: 'format',
          normalizedInput: input,
          normalizedCorrect: correct
        };
      }
    }

    // 日期格式变体
    if (this.isDateFormat(input) && this.isDateFormat(correct)) {
      const normalizedInput = this.normalizeDateFormat(input, config);
      const normalizedCorrect = this.normalizeDateFormat(correct, config);

      if (normalizedInput === normalizedCorrect) {
        return {
          isValid: true,
          confidence: 0.95,
          matchType: 'format',
          normalizedInput: input,
          normalizedCorrect: correct
        };
      }
    }

    return {
      isValid: false,
      confidence: 0,
      matchType: 'format',
      normalizedInput: input,
      normalizedCorrect: correct
    };
  }

  /**
   * 模糊匹配检查
   */
  private checkFuzzyMatch(input: string, correct: string, threshold: number): ValidationResult {
    const similarity = this.calculateSimilarity(input, correct);

    if (similarity >= threshold) {
      return {
        isValid: true,
        confidence: similarity,
        matchType: 'fuzzy',
        normalizedInput: input,
        normalizedCorrect: correct
      };
    }

    return {
      isValid: false,
      confidence: similarity,
      matchType: 'fuzzy',
      normalizedInput: input,
      normalizedCorrect: correct
    };
  }

  /**
   * 计算字符串相似度（简化的Levenshtein距离）
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;

    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
  }

  /**
   * 解析数字
   */
  private parseNumber(input: string, config: any): number | null {
    // 移除千位分隔符
    let cleaned = input.replace(new RegExp(`\\${config.numberFormat.thousandsSeparator}`, 'g'), '');

    // 处理小数分隔符
    if (config.numberFormat.decimalSeparator !== '.') {
      cleaned = cleaned.replace(config.numberFormat.decimalSeparator, '.');
    }

    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  /**
   * 检查是否为数字格式
   */
  private isNumeric(str: string): boolean {
    return /^[\d\s,.\-+]+$/.test(str);
  }

  /**
   * 检查是否为日期格式
   */
  private isDateFormat(str: string): boolean {
    return /^\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4}$/.test(str);
  }

  /**
   * 标准化日期格式
   */
  private normalizeDateFormat(dateStr: string, config: any): string {
    // 简化的日期格式标准化
    return dateStr.replace(/[\/\-\.]/g, config.timeFormat.dateSeparator);
  }

  /**
   * 应用语言特定的标准化
   */
  private applyLanguageSpecificNormalization(input: string, language: string): string {
    // 根据语言应用特定的标准化规则
    switch (language) {
      case 'zh-CN':
        // 中文特定处理
        return input.replace(/[\u3000\s]/g, ''); // 移除中文空格
      case 'ar-SA':
        // 阿拉伯语特定处理
        return input.replace(/[\u200F\u200E]/g, ''); // 移除方向标记
      default:
        return input;
    }
  }

  /**
   * 生成时间格式变体
   */
  private generateTimeFormats(timeData: any, _language: string): string[] {
    // 简化实现，实际可以更复杂
    const formats = [timeData.toString()];

    if (timeData.acceptedAnswers) {
      formats.push(...timeData.acceptedAnswers);
    }

    return formats;
  }

  /**
   * 解析长度输入
   */
  private parseLengthInput(input: string, config: any): { value: number; unit: string } | null {
    const match = input.match(/^([\d.,]+)\s*([a-zA-Z]+)$/);
    if (!match) return null;

    const value = this.parseNumber(match[1], config);
    const unit = match[2].toLowerCase();

    return value !== null ? { value, unit } : null;
  }

  /**
   * 比较长度值（考虑单位换算）
   */
  private compareLengthValues(input: any, correct: any, _config: any): boolean {
    // 简化实现：只比较相同单位
    return input.value === correct.value && input.unit === correct.unit;
  }
}

// 导出单例实例
export const validationEngine = new ValidationEngine();
