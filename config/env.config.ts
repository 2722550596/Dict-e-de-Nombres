/**
 * 环境配置管理
 * 统一管理环境变量和运行时配置
 */

// ==================== 环境类型定义 ====================
export type Environment = 'development' | 'production' | 'test';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ==================== 环境配置接口 ====================
export interface EnvironmentConfig {
  NODE_ENV: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  logLevel: LogLevel;
  enableDebugTools: boolean;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  apiBaseUrl?: string;
  geminiApiKey?: string;
}

// ==================== 获取环境变量 ====================
function getEnvVar(key: string, defaultValue?: string): string | undefined {
  // 在浏览器环境中，环境变量通过 import.meta.env 或 process.env 访问
  if (typeof window !== 'undefined') {
    // 浏览器环境
    return (import.meta.env?.[key] as string) || (window as any).process?.env?.[key] || defaultValue;
  } else {
    // Node.js 环境
    return process.env[key] || defaultValue;
  }
}

// ==================== 环境配置创建 ====================
function createEnvironmentConfig(): EnvironmentConfig {
  const nodeEnv = (getEnvVar('NODE_ENV') || 'development') as Environment;
  
  const config: EnvironmentConfig = {
    NODE_ENV: nodeEnv,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
    logLevel: (getEnvVar('LOG_LEVEL') || (nodeEnv === 'production' ? 'warn' : 'debug')) as LogLevel,
    enableDebugTools: nodeEnv !== 'production',
    enableAnalytics: nodeEnv === 'production',
    enableErrorReporting: nodeEnv === 'production',
    apiBaseUrl: getEnvVar('API_BASE_URL'),
    geminiApiKey: getEnvVar('GEMINI_API_KEY'),
  };

  return config;
}

// ==================== 导出配置实例 ====================
export const ENV_CONFIG = createEnvironmentConfig();

// ==================== 调试配置 ====================
export const DEBUG_CONFIG = {
  // 是否启用调试工具
  ENABLE_DEBUG_TOOLS: ENV_CONFIG.enableDebugTools,
  
  // 是否显示性能指标
  SHOW_PERFORMANCE_METRICS: ENV_CONFIG.isDevelopment,
  
  // 是否启用详细日志
  VERBOSE_LOGGING: ENV_CONFIG.isDevelopment,
  
  // 是否启用React DevTools
  ENABLE_REACT_DEVTOOLS: ENV_CONFIG.isDevelopment,
  
  // 是否显示调试信息
  SHOW_DEBUG_INFO: ENV_CONFIG.isDevelopment,
} as const;

// ==================== 功能开关配置 ====================
export const FEATURE_FLAGS = {
  // 是否启用新的等级系统
  ENABLE_NEW_LEVEL_SYSTEM: true,
  
  // 是否启用成就系统
  ENABLE_ACHIEVEMENTS: ENV_CONFIG.isDevelopment, // 开发中功能
  
  // 是否启用AI功能
  ENABLE_AI_FEATURES: !!ENV_CONFIG.geminiApiKey,
  
  // 是否启用音效
  ENABLE_AUDIO_EFFECTS: true,
  
  // 是否启用动画
  ENABLE_ANIMATIONS: true,
  
  // 是否启用分析
  ENABLE_ANALYTICS: ENV_CONFIG.enableAnalytics,
  
  // 是否启用错误报告
  ENABLE_ERROR_REPORTING: ENV_CONFIG.enableErrorReporting,
  
  // 是否启用实验性功能
  ENABLE_EXPERIMENTAL_FEATURES: ENV_CONFIG.isDevelopment,
} as const;

// ==================== API 配置 ====================
export const API_CONFIG = {
  // 基础URL
  BASE_URL: ENV_CONFIG.apiBaseUrl || '',
  
  // 超时时间 (毫秒)
  TIMEOUT: 10000,
  
  // 重试次数
  RETRY_ATTEMPTS: 3,
  
  // 重试延迟 (毫秒)
  RETRY_DELAY: 1000,
  
  // Gemini API配置
  GEMINI: {
    API_KEY: ENV_CONFIG.geminiApiKey,
    MODEL: 'gemini-pro',
    MAX_TOKENS: 1000,
  },
} as const;

// ==================== 性能配置 ====================
export const PERFORMANCE_CONFIG = {
  // 是否启用性能监控
  ENABLE_MONITORING: ENV_CONFIG.isProduction,
  
  // 性能预算 (毫秒)
  PERFORMANCE_BUDGET: {
    FCP: 1500, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
  },
  
  // 资源加载超时
  RESOURCE_TIMEOUT: 5000,
  
  // 是否启用懒加载
  ENABLE_LAZY_LOADING: true,
  
  // 是否启用代码分割
  ENABLE_CODE_SPLITTING: ENV_CONFIG.isProduction,
} as const;

// ==================== 安全配置 ====================
export const SECURITY_CONFIG = {
  // 是否启用CSP
  ENABLE_CSP: ENV_CONFIG.isProduction,
  
  // 是否启用HTTPS重定向
  FORCE_HTTPS: ENV_CONFIG.isProduction,
  
  // 会话超时 (毫秒)
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30分钟
  
  // 是否启用数据加密
  ENABLE_ENCRYPTION: ENV_CONFIG.isProduction,
} as const;

// ==================== 工具函数 ====================
export const envUtils = {
  /**
   * 检查是否为开发环境
   */
  isDev: () => ENV_CONFIG.isDevelopment,
  
  /**
   * 检查是否为生产环境
   */
  isProd: () => ENV_CONFIG.isProduction,
  
  /**
   * 检查是否为测试环境
   */
  isTest: () => ENV_CONFIG.isTest,
  
  /**
   * 获取当前环境名称
   */
  getEnv: () => ENV_CONFIG.NODE_ENV,
  
  /**
   * 检查功能是否启用
   */
  isFeatureEnabled: (feature: keyof typeof FEATURE_FLAGS) => FEATURE_FLAGS[feature],
  
  /**
   * 获取API配置
   */
  getApiConfig: () => API_CONFIG,
  
  /**
   * 检查是否应该显示调试信息
   */
  shouldShowDebug: () => DEBUG_CONFIG.SHOW_DEBUG_INFO,
  
  /**
   * 获取日志级别
   */
  getLogLevel: () => ENV_CONFIG.logLevel,
} as const;

// ==================== 类型导出 ====================
export type FeatureFlag = keyof typeof FEATURE_FLAGS;
export type DebugOption = keyof typeof DEBUG_CONFIG;
