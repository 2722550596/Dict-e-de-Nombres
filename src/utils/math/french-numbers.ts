/**
 * 法语数字转换工具
 * 提供数字到法语文本的转换功能
 */

import { createValidationError, handleError, safeExecute } from '../core/errors';

// 基础数字到法语的映射
const BASE_NUMBERS: Record<number, string> = {
  0: 'zéro', 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq',
  6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf', 10: 'dix',
  11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze',
  16: 'seize', 17: 'dix-sept', 18: 'dix-huit', 19: 'dix-neuf', 20: 'vingt',
  30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante',
  70: 'soixante-dix', 80: 'quatre-vingts', 90: 'quatre-vingt-dix'
};

// 大数字单位
const LARGE_UNITS: Record<number, string> = {
  1000: 'mille',
  1000000: 'million',
  1000000000: 'milliard'
};

/**
 * 法语数字转换器类
 */
export class FrenchNumberConverter {
  private static instance: FrenchNumberConverter;

  static getInstance(): FrenchNumberConverter {
    if (!FrenchNumberConverter.instance) {
      FrenchNumberConverter.instance = new FrenchNumberConverter();
    }
    return FrenchNumberConverter.instance;
  }

  /**
   * 将数字转换为法语文本
   */
  convert(num: number): string {
    return safeExecute(() => {
      // 输入验证
      if (!Number.isInteger(num)) {
        throw createValidationError('Number must be an integer', { num });
      }

      if (num < 0) {
        return `moins ${this.convert(Math.abs(num))}`;
      }

      if (num === 0) {
        return BASE_NUMBERS[0];
      }

      return this.convertPositiveNumber(num);
    }, num.toString());
  }

  /**
   * 转换正数
   */
  private convertPositiveNumber(num: number): string {
    // 直接映射的数字
    if (BASE_NUMBERS[num]) {
      return BASE_NUMBERS[num];
    }

    // 处理大数字
    if (num >= 1000000000) {
      return this.convertLargeNumber(num, 1000000000, 'milliard');
    }
    if (num >= 1000000) {
      return this.convertLargeNumber(num, 1000000, 'million');
    }
    if (num >= 1000) {
      return this.convertThousands(num);
    }

    // 处理100以内的数字
    if (num >= 100) {
      return this.convertHundreds(num);
    }

    // 处理21-99的数字
    return this.convertTens(num);
  }

  /**
   * 转换大数字（百万、十亿等）
   */
  private convertLargeNumber(num: number, unit: number, unitName: string): string {
    const quotient = Math.floor(num / unit);
    const remainder = num % unit;

    let result = '';

    // 处理商
    if (quotient === 1 && unitName === 'million') {
      result = 'un million';
    } else if (quotient === 1 && unitName === 'milliard') {
      result = 'un milliard';
    } else {
      result = `${this.convertPositiveNumber(quotient)} ${unitName}`;
      if (quotient > 1 && unitName === 'million') {
        result += 's';
      }
    }

    // 处理余数
    if (remainder > 0) {
      result += ` ${this.convertPositiveNumber(remainder)}`;
    }

    return result;
  }

  /**
   * 转换千位数
   */
  private convertThousands(num: number): string {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;

    let result = '';

    if (thousands === 1) {
      result = 'mille';
    } else {
      result = `${this.convertPositiveNumber(thousands)} mille`;
    }

    if (remainder > 0) {
      result += ` ${this.convertPositiveNumber(remainder)}`;
    }

    return result;
  }

  /**
   * 转换百位数
   */
  private convertHundreds(num: number): string {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;

    let result = '';

    if (hundreds === 1) {
      result = 'cent';
    } else {
      result = `${BASE_NUMBERS[hundreds]} cent`;
    }

    // 复数形式
    if (hundreds > 1 && remainder === 0) {
      result += 's';
    }

    if (remainder > 0) {
      result += ` ${this.convertPositiveNumber(remainder)}`;
    }

    return result;
  }

  /**
   * 转换十位数（21-99）
   */
  private convertTens(num: number): string {
    if (num <= 20) {
      return BASE_NUMBERS[num] || num.toString();
    }

    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;

    if (ones === 0) {
      return BASE_NUMBERS[tens] || num.toString();
    }

    // 特殊规则：70-79 和 90-99
    if (tens === 70) {
      return `soixante-${BASE_NUMBERS[10 + ones]}`;
    }

    if (tens === 90) {
      return `quatre-vingt-${BASE_NUMBERS[10 + ones]}`;
    }

    // 特殊规则：21, 31, 41, 51, 61, 71
    if (ones === 1 && tens !== 80) {
      return `${BASE_NUMBERS[tens]}-et-un`;
    }

    return `${BASE_NUMBERS[tens]}-${BASE_NUMBERS[ones]}`;
  }

  /**
   * 批量转换数字
   */
  convertBatch(numbers: number[]): Record<number, string> {
    const result: Record<number, string> = {};
    
    for (const num of numbers) {
      result[num] = this.convert(num);
    }
    
    return result;
  }

  /**
   * 验证转换结果
   */
  validate(num: number, expected: string): boolean {
    const actual = this.convert(num);
    return actual === expected;
  }

  /**
   * 获取数字的音节数（用于语音合成优化）
   */
  getSyllableCount(num: number): number {
    const text = this.convert(num);
    // 简化的音节计算
    const syllables = text.split('-').length + text.split(' ').length - 1;
    return Math.max(1, syllables);
  }
}

/**
 * 运算符转法语文本
 */
export const OPERATOR_TO_FRENCH: Record<string, string> = {
  '+': 'plus',
  '-': 'moins',
  '×': 'fois',
  '÷': 'divisé par'
};

/**
 * 便捷函数
 */
const converter = FrenchNumberConverter.getInstance();

/**
 * 将数字转换为法语文本
 */
export const numberToFrench = (num: number): string => {
  return converter.convert(num);
};

/**
 * 批量转换数字
 */
export const numbersToFrench = (numbers: number[]): Record<number, string> => {
  return converter.convertBatch(numbers);
};

/**
 * 将运算符转换为法语文本
 */
export const operatorToFrench = (operator: string): string => {
  return OPERATOR_TO_FRENCH[operator] || operator;
};

/**
 * 创建数学表达式的法语文本
 */
export const createMathExpressionText = (
  operand1: number,
  operator: string,
  operand2: number
): string => {
  return safeExecute(() => {
    const num1Text = numberToFrench(operand1);
    const operatorText = operatorToFrench(operator);
    const num2Text = numberToFrench(operand2);
    
    return `${num1Text} ${operatorText} ${num2Text}`;
  }, `${operand1} ${operator} ${operand2}`);
};

/**
 * 获取常用数字的法语映射（用于缓存）
 */
export const getCommonNumbersMapping = (max: number = 100): Record<number, string> => {
  const mapping: Record<number, string> = {};
  
  for (let i = 0; i <= max; i++) {
    mapping[i] = numberToFrench(i);
  }
  
  return mapping;
};

/**
 * 验证法语数字文本
 */
export const validateFrenchNumber = (num: number, text: string): boolean => {
  return converter.validate(num, text);
};

/**
 * 获取数字的发音复杂度（用于难度评估）
 */
export const getNumberComplexity = (num: number): 'simple' | 'medium' | 'complex' => {
  const syllableCount = converter.getSyllableCount(num);
  
  if (syllableCount <= 2) return 'simple';
  if (syllableCount <= 4) return 'medium';
  return 'complex';
};

export default converter;
