/**
 * 数据验证工具
 * 提供统一的数据验证、类型检查和数据清理功能
 */

import type { UserData, GameSession, MathProblem } from '../../types';
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
      validate: (data) => validators.isNonEmptyString(data.mode),
      message: 'Mode must be a non-empty string',
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
