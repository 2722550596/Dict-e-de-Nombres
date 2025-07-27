/**
 * 统一错误处理工具
 * 提供标准化的错误处理、日志记录和用户友好的错误消息
 */

import { CONFIG } from '../../../config';

// 错误类型枚举
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  AUDIO = 'AUDIO',
  GAME_LOGIC = 'GAME_LOGIC',
  USER_INPUT = 'USER_INPUT',
  SYSTEM = 'SYSTEM',
}

// 错误严重程度
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// 标准化错误接口
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  stack?: string;
  context?: Record<string, any>;
}

// 错误处理选项
export interface ErrorHandlingOptions {
  logToConsole?: boolean;
  showToUser?: boolean;
  reportToService?: boolean;
  fallbackValue?: any;
  retryable?: boolean;
}

/**
 * 创建标准化错误对象
 */
export const createError = (
  type: ErrorType,
  severity: ErrorSeverity,
  code: string,
  message: string,
  details?: any,
  context?: Record<string, any>
): AppError => ({
  type,
  severity,
  code,
  message,
  details,
  timestamp: new Date().toISOString(),
  stack: new Error().stack,
  context,
});

/**
 * 错误处理器类
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * 处理错误
   */
  handle(error: AppError | Error, options: ErrorHandlingOptions = {}): void {
    const {
      logToConsole = true,
      showToUser = false,
      reportToService = false,
      retryable = false,
    } = options;

    // 标准化错误对象
    const standardError = this.standardizeError(error);

    // 记录到内存日志
    this.logError(standardError);

    // 控制台日志
    if (logToConsole) {
      this.logToConsole(standardError);
    }

    // 显示给用户
    if (showToUser) {
      this.showToUser(standardError);
    }

    // 报告到服务
    if (reportToService && CONFIG.ENV.IS_PRODUCTION) {
      this.reportToService(standardError);
    }
  }

  /**
   * 标准化错误对象
   */
  private standardizeError(error: AppError | Error): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    // 将普通Error转换为AppError
    return createError(
      ErrorType.SYSTEM,
      ErrorSeverity.MEDIUM,
      'UNKNOWN_ERROR',
      error.message || 'An unknown error occurred',
      { originalError: error },
      { stack: error.stack }
    );
  }

  /**
   * 检查是否为AppError
   */
  private isAppError(error: any): error is AppError {
    return error && typeof error === 'object' && 'type' in error && 'severity' in error;
  }

  /**
   * 记录错误到内存日志
   */
  private logError(error: AppError): void {
    this.errorLog.push(error);
    
    // 保持日志大小限制
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }
  }

  /**
   * 控制台日志
   */
  private logToConsole(error: AppError): void {
    const logMethod = this.getConsoleMethod(error.severity);
    const prefix = `[${error.type}:${error.severity}] ${error.code}`;
    
    logMethod(`${prefix}: ${error.message}`, {
      details: error.details,
      context: error.context,
      timestamp: error.timestamp,
    });
  }

  /**
   * 获取控制台方法
   */
  private getConsoleMethod(severity: ErrorSeverity): typeof console.log {
    switch (severity) {
      case ErrorSeverity.LOW:
        return console.info;
      case ErrorSeverity.MEDIUM:
        return console.warn;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * 显示给用户
   */
  private showToUser(error: AppError): void {
    // 这里可以集成通知系统
    const userMessage = this.getUserFriendlyMessage(error);
    
    // 简单的alert实现，实际项目中应该使用更好的UI组件
    if (error.severity === ErrorSeverity.CRITICAL) {
      alert(`Critical Error: ${userMessage}`);
    }
  }

  /**
   * 获取用户友好的错误消息
   */
  private getUserFriendlyMessage(error: AppError): string {
    // 根据错误类型返回用户友好的消息
    const messageMap: Record<string, string> = {
      STORAGE_FAILED: '数据保存失败，请稍后重试',
      NETWORK_ERROR: '网络连接异常，请检查网络设置',
      VALIDATION_ERROR: '输入数据格式不正确',
      AUDIO_ERROR: '音频播放失败',
      GAME_LOGIC_ERROR: '游戏逻辑错误',
    };

    return messageMap[error.code] || '发生了未知错误，请稍后重试';
  }

  /**
   * 报告到服务
   */
  private reportToService(error: AppError): void {
    // 这里可以集成错误报告服务（如Sentry）
    console.log('Reporting error to service:', error);
  }

  /**
   * 获取错误日志
   */
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * 清理错误日志
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * 获取错误统计
   */
  getErrorStats(): Record<ErrorType, number> {
    const stats = {} as Record<ErrorType, number>;
    
    Object.values(ErrorType).forEach(type => {
      stats[type] = 0;
    });

    this.errorLog.forEach(error => {
      stats[error.type]++;
    });

    return stats;
  }
}

/**
 * 便捷的错误处理函数
 */
export const handleError = (
  error: AppError | Error,
  options?: ErrorHandlingOptions
): void => {
  ErrorHandler.getInstance().handle(error, options);
};

/**
 * 创建特定类型的错误
 */
export const createValidationError = (message: string, details?: any) =>
  createError(ErrorType.VALIDATION, ErrorSeverity.MEDIUM, 'VALIDATION_ERROR', message, details);

export const createStorageError = (message: string, details?: any) =>
  createError(ErrorType.STORAGE, ErrorSeverity.HIGH, 'STORAGE_ERROR', message, details);

export const createNetworkError = (message: string, details?: any) =>
  createError(ErrorType.NETWORK, ErrorSeverity.MEDIUM, 'NETWORK_ERROR', message, details);

export const createAudioError = (message: string, details?: any) =>
  createError(ErrorType.AUDIO, ErrorSeverity.LOW, 'AUDIO_ERROR', message, details);

export const createGameLogicError = (message: string, details?: any) =>
  createError(ErrorType.GAME_LOGIC, ErrorSeverity.HIGH, 'GAME_LOGIC_ERROR', message, details);

/**
 * 安全执行函数，自动处理错误
 */
export const safeExecute = async <T>(
  fn: () => T | Promise<T>,
  fallbackValue?: T,
  errorOptions?: ErrorHandlingOptions
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    handleError(error as Error, errorOptions);
    return fallbackValue;
  }
};

/**
 * 重试执行函数
 */
export const retryExecute = async <T>(
  fn: () => T | Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries) {
        throw lastError;
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw lastError!;
};
