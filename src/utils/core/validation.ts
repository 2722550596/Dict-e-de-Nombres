/**
 * 数据验证工具
 * 提供统一的数据验证、类型检查和数据清理功能
 */

import type { GameSession, MathProblem, UserData } from '../../types';
import { createValidationError, handleError } from './errors';

// 验证结果接口
export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors: string[];
  warnings: string[];
}

// 验证规则接口
export interface ValidationRule<T> {
  name: string;
  validate: (value: T) => boolean;
  message: string;
  severity?: 'error' | 'warning';
}

/**
 * 基础验证器类
 */
export class Validator<T> {
  private rules: ValidationRule<T>[] = [];

  /**
   * 添加验证规则
   */
  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  /**
   * 执行验证
   */
  validate(value: T): ValidationResult<T> {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const rule of this.rules) {
      try {
        if (!rule.validate(value)) {
          const message = `${rule.name}: ${rule.message}`;

          if (rule.severity === 'warning') {
            warnings.push(message);
          } else {
            errors.push(message);
          }
        }
      } catch (error) {
        handleError(createValidationError(`Validation rule "${rule.name}" failed`, { error, value }));
        errors.push(`${rule.name}: Validation rule execution failed`);
      }
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? value : undefined,
      errors,
      warnings,
    };
  }
}

/**
 * 通用验证函数
 */
export const validators = {
  /**
   * 检查是否为数字
   */
  isNumber: (value: any): boolean => typeof value === 'number' && !isNaN(value),

  /**
   * 检查是否为正数
   */
  isPositive: (value: number): boolean => value > 0,

  /**
   * 检查是否为非负数
   */
  isNonNegative: (value: number): boolean => value >= 0,

  /**
   * 检查是否为整数
   */
  isInteger: (value: number): boolean => Number.isInteger(value),

  /**
   * 检查是否在范围内
   */
  inRange: (min: number, max: number) => (value: number): boolean => value >= min && value <= max,

  /**
   * 检查字符串是否非空
   */
  isNonEmptyString: (value: any): boolean => typeof value === 'string' && value.trim().length > 0,

  /**
   * 检查是否为有效日期字符串
   */
  isValidDateString: (value: any): boolean => {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  },

  /**
   * 检查数组是否非空
   */
  isNonEmptyArray: (value: any): boolean => Array.isArray(value) && value.length > 0,

  /**
   * 检查对象是否有指定属性
   */
  hasProperty: (property: string) => (value: any): boolean =>
    value && typeof value === 'object' && property in value,

  /**
   * 检查是否为有效的数学运算符
   */
  isValidMathOperator: (value: any): boolean => ['+', '-', '×', '÷'].includes(value),

  /**
   * 检查是否为有效的游戏模式
   */
  isValidGameMode: (value: any): boolean => ['number', 'math', 'time', 'direction', 'length'].includes(value),

  /**
   * 检查是否为有效的时间类型
   */
  isValidTimeType: (value: any): boolean => ['year', 'month', 'day', 'weekday', 'fullDate'].includes(value),

  /**
   * 检查是否为有效的方位类型
   */
  isValidDirectionType: (value: any): boolean => ['cardinal', 'relative', 'spatial'].includes(value),

  /**
   * 检查是否为有效的长度单位
   */
  isValidLengthUnit: (value: any): boolean => typeof value === 'string' && value.trim().length > 0,
};

/**
 * 新模式统计验证函数（8.1新增）
 */
const isValidModeStats = (stats: any): boolean => {
  if (!stats || typeof stats !== 'object') return false;

  return validators.isNumber(stats.totalSessions) && validators.isNonNegative(stats.totalSessions) &&
    validators.isNumber(stats.totalCorrect) && validators.isNonNegative(stats.totalCorrect) &&
    validators.isNumber(stats.totalQuestions) && validators.isNonNegative(stats.totalQuestions) &&
    validators.isNumber(stats.bestAccuracy) && validators.inRange(0, 1)(stats.bestAccuracy) &&
    validators.isNumber(stats.averageAccuracy) && validators.inRange(0, 1)(stats.averageAccuracy) &&
    typeof stats.favoriteTimeType === 'string' || typeof stats.favoriteDirectionType === 'string' || typeof stats.favoriteUnit === 'string';
};

const isValidTimeDictationStats = (stats: any): boolean => {
  if (!isValidModeStats(stats)) return false;
  return validators.isValidTimeType(stats.favoriteTimeType) &&
    (!stats.timeTypeStats || typeof stats.timeTypeStats === 'object');
};

const isValidDirectionDictationStats = (stats: any): boolean => {
  if (!isValidModeStats(stats)) return false;
  return validators.isValidDirectionType(stats.favoriteDirectionType) &&
    (!stats.directionTypeStats || typeof stats.directionTypeStats === 'object');
};

const isValidLengthDictationStats = (stats: any): boolean => {
  if (!isValidModeStats(stats)) return false;
  return validators.isValidLengthUnit(stats.favoriteUnit) &&
    (!stats.unitStats || typeof stats.unitStats === 'object');
};

/**
 * 用户数据验证器
 */
export const createUserDataValidator = (): Validator<UserData> => {
  return new Validator<UserData>()
    .addRule({
      name: 'level',
      validate: (data) => validators.isNumber(data.level) && validators.isPositive(data.level) && validators.isInteger(data.level),
      message: 'Level must be a positive integer',
    })
    .addRule({
      name: 'experience',
      validate: (data) => validators.isNumber(data.experience) && validators.isNonNegative(data.experience) && validators.isInteger(data.experience),
      message: 'Experience must be a non-negative integer',
    })
    .addRule({
      name: 'totalSessions',
      validate: (data) => validators.isNumber(data.totalSessions) && validators.isNonNegative(data.totalSessions) && validators.isInteger(data.totalSessions),
      message: 'Total sessions must be a non-negative integer',
    })
    .addRule({
      name: 'todaySessions',
      validate: (data) => validators.isNumber(data.todaySessions) && validators.isNonNegative(data.todaySessions) && validators.isInteger(data.todaySessions),
      message: 'Today sessions must be a non-negative integer',
    })
    .addRule({
      name: 'lastActiveDate',
      validate: (data) => validators.isValidDateString(data.lastActiveDate),
      message: 'Last active date must be a valid date string',
    })
    // 新模式统计验证（8.1新增）
    .addRule({
      name: 'timeDictationStats',
      validate: (data) => !data.timeDictationStats || isValidModeStats(data.timeDictationStats),
      message: 'Time dictation stats must be valid if present',
    })
    .addRule({
      name: 'directionDictationStats',
      validate: (data) => !data.directionDictationStats || isValidModeStats(data.directionDictationStats),
      message: 'Direction dictation stats must be valid if present',
    })
    .addRule({
      name: 'lengthDictationStats',
      validate: (data) => !data.lengthDictationStats || isValidModeStats(data.lengthDictationStats),
      message: 'Length dictation stats must be valid if present',
    })
    .addRule({
      name: 'newModesDataVersion',
      validate: (data) => !data.newModesDataVersion || (validators.isNumber(data.newModesDataVersion) && validators.isPositive(data.newModesDataVersion) && validators.isInteger(data.newModesDataVersion)),
      message: 'New modes data version must be a positive integer if present',
    })
    .addRule({
      name: 'totalQuestions',
      validate: (data) => validators.isNumber(data.totalQuestions) && validators.isNonNegative(data.totalQuestions) && validators.isInteger(data.totalQuestions),
      message: 'Total questions must be a non-negative integer',
    })
    .addRule({
      name: 'totalCorrect',
      validate: (data) => validators.isNumber(data.totalCorrect) && validators.isNonNegative(data.totalCorrect) && validators.isInteger(data.totalCorrect),
      message: 'Total correct must be a non-negative integer',
    })
    .addRule({
      name: 'maxStreak',
      validate: (data) => validators.isNumber(data.maxStreak) && validators.isNonNegative(data.maxStreak) && validators.isInteger(data.maxStreak),
      message: 'Max streak must be a non-negative integer',
    })
    .addRule({
      name: 'consistency',
      validate: (data) => data.totalCorrect <= data.totalQuestions,
      message: 'Total correct cannot exceed total questions',
    });
};

/**
 * 游戏会话验证器
 */
export const createGameSessionValidator = (): Validator<GameSession> => {
  return new Validator<GameSession>()
    .addRule({
      name: 'mode',
      validate: (data) => validators.isValidGameMode(data.mode),
      message: 'Mode must be a valid game mode (number, math, time, direction, length)',
    })
    .addRule({
      name: 'score',
      validate: (data) => validators.isNumber(data.score) && validators.isNonNegative(data.score),
      message: 'Score must be a non-negative number',
    })
    .addRule({
      name: 'accuracy',
      validate: (data) => validators.isNumber(data.accuracy) && validators.inRange(0, 1)(data.accuracy),
      message: 'Accuracy must be a number between 0 and 1',
    })
    .addRule({
      name: 'correctAnswers',
      validate: (data) => validators.isNumber(data.correctAnswers) && validators.isNonNegative(data.correctAnswers) && validators.isInteger(data.correctAnswers),
      message: 'Correct answers must be a non-negative integer',
    })
    .addRule({
      name: 'totalQuestions',
      validate: (data) => validators.isNumber(data.totalQuestions) && validators.isPositive(data.totalQuestions) && validators.isInteger(data.totalQuestions),
      message: 'Total questions must be a positive integer',
    })
    .addRule({
      name: 'duration',
      validate: (data) => validators.isNumber(data.duration) && validators.isPositive(data.duration),
      message: 'Duration must be a positive number',
    })
    .addRule({
      name: 'date',
      validate: (data) => validators.isValidDateString(data.date),
      message: 'Date must be a valid date string',
    })
    .addRule({
      name: 'consistency',
      validate: (data) => data.correctAnswers <= data.totalQuestions,
      message: 'Correct answers cannot exceed total questions',
    });
};

/**
 * 数学问题验证器
 */
export const createMathProblemValidator = (): Validator<MathProblem> => {
  return new Validator<MathProblem>()
    .addRule({
      name: 'operand1',
      validate: (data) => validators.isNumber(data.operand1) && validators.isInteger(data.operand1),
      message: 'Operand1 must be an integer',
    })
    .addRule({
      name: 'operator',
      validate: (data) => validators.isValidMathOperator(data.operator),
      message: 'Operator must be a valid math operator (+, -, ×, ÷)',
    })
    .addRule({
      name: 'operand2',
      validate: (data) => validators.isNumber(data.operand2) && validators.isInteger(data.operand2),
      message: 'Operand2 must be an integer',
    })
    .addRule({
      name: 'result',
      validate: (data) => validators.isNumber(data.result),
      message: 'Result must be a number',
    })
    .addRule({
      name: 'displayText',
      validate: (data) => validators.isNonEmptyString(data.displayText),
      message: 'Display text must be a non-empty string',
    })
    .addRule({
      name: 'divisionByZero',
      validate: (data) => data.operator !== '÷' || data.operand2 !== 0,
      message: 'Division by zero is not allowed',
    });
};

/**
 * 数据清理工具
 */
export const sanitizers = {
  /**
   * 清理用户数据
   */
  sanitizeUserData: (data: Partial<UserData>): Partial<UserData> => {
    const sanitized: Partial<UserData> = {};

    if (data.level !== undefined) {
      sanitized.level = Math.max(1, Math.floor(Math.abs(data.level)));
    }
    if (data.experience !== undefined) {
      sanitized.experience = Math.max(0, Math.floor(Math.abs(data.experience)));
    }
    if (data.totalSessions !== undefined) {
      sanitized.totalSessions = Math.max(0, Math.floor(Math.abs(data.totalSessions)));
    }
    if (data.todaySessions !== undefined) {
      sanitized.todaySessions = Math.max(0, Math.floor(Math.abs(data.todaySessions)));
    }
    if (data.totalQuestions !== undefined) {
      sanitized.totalQuestions = Math.max(0, Math.floor(Math.abs(data.totalQuestions)));
    }
    if (data.totalCorrect !== undefined) {
      sanitized.totalCorrect = Math.max(0, Math.floor(Math.abs(data.totalCorrect)));
    }
    if (data.maxStreak !== undefined) {
      sanitized.maxStreak = Math.max(0, Math.floor(Math.abs(data.maxStreak)));
    }
    if (data.lastActiveDate !== undefined) {
      sanitized.lastActiveDate = typeof data.lastActiveDate === 'string' ? data.lastActiveDate : new Date().toDateString();
    }

    // 新模式统计清理（8.1新增）
    if (data.timeDictationStats !== undefined) {
      sanitized.timeDictationStats = sanitizers.sanitizeModeStats(data.timeDictationStats, 'time');
    }
    if (data.directionDictationStats !== undefined) {
      sanitized.directionDictationStats = sanitizers.sanitizeModeStats(data.directionDictationStats, 'direction');
    }
    if (data.lengthDictationStats !== undefined) {
      sanitized.lengthDictationStats = sanitizers.sanitizeModeStats(data.lengthDictationStats, 'length');
    }
    if (data.newModesDataVersion !== undefined) {
      sanitized.newModesDataVersion = Math.max(1, Math.floor(Math.abs(data.newModesDataVersion)));
    }

    return sanitized;
  },

  /**
   * 清理新模式统计数据（8.1新增）
   */
  sanitizeModeStats: (stats: any, mode: 'time' | 'direction' | 'length'): any => {
    if (!stats || typeof stats !== 'object') {
      // 返回默认值
      const defaultStats = {
        totalSessions: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        bestAccuracy: 0,
        averageAccuracy: 0,
      };

      switch (mode) {
        case 'time':
          return { ...defaultStats, favoriteTimeType: 'year', timeTypeStats: {} };
        case 'direction':
          return { ...defaultStats, favoriteDirectionType: 'cardinal', directionTypeStats: {} };
        case 'length':
          return { ...defaultStats, favoriteUnit: '米', unitStats: {} };
      }
    }

    const sanitized: any = {
      totalSessions: Math.max(0, Math.floor(Math.abs(stats.totalSessions || 0))),
      totalCorrect: Math.max(0, Math.floor(Math.abs(stats.totalCorrect || 0))),
      totalQuestions: Math.max(0, Math.floor(Math.abs(stats.totalQuestions || 0))),
      bestAccuracy: Math.max(0, Math.min(1, Math.abs(stats.bestAccuracy || 0))),
      averageAccuracy: Math.max(0, Math.min(1, Math.abs(stats.averageAccuracy || 0))),
    };

    // 模式特定字段
    switch (mode) {
      case 'time':
        sanitized.favoriteTimeType = validators.isValidTimeType(stats.favoriteTimeType) ? stats.favoriteTimeType : 'year';
        sanitized.timeTypeStats = stats.timeTypeStats && typeof stats.timeTypeStats === 'object' ? stats.timeTypeStats : {};
        break;
      case 'direction':
        sanitized.favoriteDirectionType = validators.isValidDirectionType(stats.favoriteDirectionType) ? stats.favoriteDirectionType : 'cardinal';
        sanitized.directionTypeStats = stats.directionTypeStats && typeof stats.directionTypeStats === 'object' ? stats.directionTypeStats : {};
        break;
      case 'length':
        sanitized.favoriteUnit = validators.isValidLengthUnit(stats.favoriteUnit) ? stats.favoriteUnit : '米';
        sanitized.unitStats = stats.unitStats && typeof stats.unitStats === 'object' ? stats.unitStats : {};
        break;
    }

    return sanitized;
  },

  /**
   * 清理数字范围
   */
  sanitizeRange: (range: [number, number]): [number, number] => {
    const [min, max] = range;
    const sanitizedMin = Math.max(0, Math.floor(Math.abs(min)));
    const sanitizedMax = Math.max(sanitizedMin, Math.floor(Math.abs(max)));
    return [sanitizedMin, sanitizedMax];
  },

  /**
   * 清理数量
   */
  sanitizeQuantity: (quantity: number, min: number = 1, max: number = 100): number => {
    return Math.max(min, Math.min(max, Math.floor(Math.abs(quantity))));
  },
};

/**
 * 时间内容验证器
 */
export const createTimeContentValidator = (): Validator<import('../../types').TimeContent> => {
  return new Validator<import('../../types').TimeContent>()
    .addRule({
      name: 'type',
      validate: (data) => validators.isValidTimeType(data.type),
      message: 'Type must be a valid time type (year, month, day, weekday, fullDate)',
    })
    .addRule({
      name: 'value',
      validate: (data) => validators.isNonEmptyString(data.value),
      message: 'Value must be a non-empty string',
    })
    .addRule({
      name: 'displayText',
      validate: (data) => validators.isNonEmptyString(data.displayText),
      message: 'Display text must be a non-empty string',
    })
    .addRule({
      name: 'acceptedAnswers',
      validate: (data) => validators.isNonEmptyArray(data.acceptedAnswers),
      message: 'Accepted answers must be a non-empty array',
    });
};

/**
 * 方位内容验证器
 */
export const createDirectionContentValidator = (): Validator<import('../../types').DirectionContent> => {
  return new Validator<import('../../types').DirectionContent>()
    .addRule({
      name: 'type',
      validate: (data) => validators.isValidDirectionType(data.type),
      message: 'Type must be a valid direction type (cardinal, relative, spatial)',
    })
    .addRule({
      name: 'value',
      validate: (data) => validators.isNonEmptyString(data.value),
      message: 'Value must be a non-empty string',
    })
    .addRule({
      name: 'displayText',
      validate: (data) => validators.isNonEmptyString(data.displayText),
      message: 'Display text must be a non-empty string',
    })
    .addRule({
      name: 'buttonPosition',
      validate: (data) => data.buttonPosition &&
        validators.isNumber(data.buttonPosition.x) &&
        validators.isNumber(data.buttonPosition.y),
      message: 'Button position must have valid x and y coordinates',
    });
};

/**
 * 长度内容验证器
 */
export const createLengthContentValidator = (): Validator<import('../../types').LengthContent> => {
  return new Validator<import('../../types').LengthContent>()
    .addRule({
      name: 'value',
      validate: (data) => validators.isNumber(data.value) && validators.isPositive(data.value),
      message: 'Value must be a positive number',
    })
    .addRule({
      name: 'unit',
      validate: (data) => validators.isValidLengthUnit(data.unit),
      message: 'Unit must be a valid length unit string',
    })
    .addRule({
      name: 'displayText',
      validate: (data) => validators.isNonEmptyString(data.displayText),
      message: 'Display text must be a non-empty string',
    })
    .addRule({
      name: 'acceptedFormats',
      validate: (data) => validators.isNonEmptyArray(data.acceptedFormats),
      message: 'Accepted formats must be a non-empty array',
    });
};

/**
 * 便捷的验证函数
 */
export const validateUserData = (data: UserData): ValidationResult<UserData> => {
  return createUserDataValidator().validate(data);
};

export const validateGameSession = (data: GameSession): ValidationResult<GameSession> => {
  return createGameSessionValidator().validate(data);
};

export const validateMathProblem = (data: MathProblem): ValidationResult<MathProblem> => {
  return createMathProblemValidator().validate(data);
};

export const validateTimeContent = (data: import('../../types').TimeContent): ValidationResult<import('../../types').TimeContent> => {
  return createTimeContentValidator().validate(data);
};

export const validateDirectionContent = (data: import('../../types').DirectionContent): ValidationResult<import('../../types').DirectionContent> => {
  return createDirectionContentValidator().validate(data);
};

export const validateLengthContent = (data: import('../../types').LengthContent): ValidationResult<import('../../types').LengthContent> => {
  return createLengthContentValidator().validate(data);
};
