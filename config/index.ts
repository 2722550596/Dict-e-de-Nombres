/**
 * 配置管理统一入口
 * 导出所有配置模块，提供统一的配置访问接口
 */

// ==================== 配置模块导入 ====================
export * from './build.config';
export * from './constants';
export * from './env.config';
export * from './game.config';

// ==================== 重新导出常用配置 ====================
import { DEPLOYMENT_CONFIGS } from './build.config';
import { AUDIO_CONFIG, GAME_CONFIG, STORAGE_KEYS, STYLE_CONFIG, TIMING, UI_CONFIG, VALIDATION } from './constants';
import { DEBUG_CONFIG, ENV_CONFIG, FEATURE_FLAGS } from './env.config';
import { ACHIEVEMENTS, DIFFICULTY_CONFIGS, LEVEL_SYSTEM_CONFIG } from './game.config';

// ==================== 配置聚合对象 ====================
export const CONFIG = {
  // 存储相关
  STORAGE: STORAGE_KEYS,

  // 时间相关
  TIMING,

  // 游戏相关
  GAME: GAME_CONFIG,

  // UI相关
  UI: UI_CONFIG,

  // 音频相关
  AUDIO: AUDIO_CONFIG,

  // 验证相关
  VALIDATION,

  // 样式相关
  STYLE: STYLE_CONFIG,

  // 难度配置
  DIFFICULTY: DIFFICULTY_CONFIGS,

  // 等级系统
  LEVEL_SYSTEM: LEVEL_SYSTEM_CONFIG,

  // 成就系统
  ACHIEVEMENTS,

  // 环境配置
  ENV: ENV_CONFIG,

  // 功能开关
  FEATURES: FEATURE_FLAGS,

  // 调试配置
  DEBUG: DEBUG_CONFIG,

  // 部署配置
  DEPLOYMENT: DEPLOYMENT_CONFIGS,
} as const;

// ==================== 配置工具函数 ====================
export const configUtils = {
  /**
   * 获取存储键
   */
  getStorageKey: (key: keyof typeof STORAGE_KEYS) => STORAGE_KEYS[key],

  /**
   * 获取动画时长
   */
  getAnimationDuration: (animation: keyof typeof TIMING.ANIMATION) => TIMING.ANIMATION[animation],

  /**
   * 获取延迟时间
   */
  getDelay: (delay: keyof typeof TIMING.DELAY) => TIMING.DELAY[delay],

  /**
   * 获取颜色值
   */
  getColor: (color: keyof typeof STYLE_CONFIG.COLORS) => STYLE_CONFIG.COLORS[color],

  /**
   * 获取字体权重
   */
  getFontWeight: (weight: keyof typeof STYLE_CONFIG.FONTS.WEIGHTS) => STYLE_CONFIG.FONTS.WEIGHTS[weight],

  /**
   * 检查是否为移动设备
   */
  isMobile: () => window.innerWidth <= UI_CONFIG.BREAKPOINTS.MOBILE,

  /**
   * 检查是否为平板设备
   */
  isTablet: () => window.innerWidth <= UI_CONFIG.BREAKPOINTS.TABLET && window.innerWidth > UI_CONFIG.BREAKPOINTS.MOBILE,

  /**
   * 检查是否为桌面设备
   */
  isDesktop: () => window.innerWidth > UI_CONFIG.BREAKPOINTS.TABLET,

  /**
   * 获取响应式值
   */
  getResponsiveValue: <T>(mobile: T, tablet: T, desktop: T): T => {
    if (configUtils.isMobile()) return mobile;
    if (configUtils.isTablet()) return tablet;
    return desktop;
  },

  /**
   * 获取难度配置
   */
  getDifficultyConfig: (difficulty: keyof typeof DIFFICULTY_CONFIGS) => DIFFICULTY_CONFIGS[difficulty],

  /**
   * 获取音效配置
   */
  getSoundConfig: (sound: keyof typeof AUDIO_CONFIG.SOUND_EFFECTS) => AUDIO_CONFIG.SOUND_EFFECTS[sound],

  /**
   * 检查功能是否启用
   */
  isFeatureEnabled: (feature: keyof typeof FEATURE_FLAGS) => FEATURE_FLAGS[feature],

  /**
   * 获取环境信息
   */
  getEnvironment: () => ENV_CONFIG.NODE_ENV,

  /**
   * 检查是否为开发环境
   */
  isDevelopment: () => ENV_CONFIG.isDevelopment,

  /**
   * 检查是否为生产环境
   */
  isProduction: () => ENV_CONFIG.isProduction,
} as const;

// ==================== 配置验证函数 ====================
export const configValidation = {
  /**
   * 验证配置完整性
   */
  validateConfig: () => {
    const errors: string[] = [];

    // 检查必要的配置项
    if (!STORAGE_KEYS.USER_DATA) {
      errors.push('Missing USER_DATA storage key');
    }

    if (!LEVEL_SYSTEM_CONFIG.maxLevel || LEVEL_SYSTEM_CONFIG.maxLevel <= 0) {
      errors.push('Invalid max level configuration');
    }

    if (!AUDIO_CONFIG.DEFAULT_VOLUME || AUDIO_CONFIG.DEFAULT_VOLUME < 0 || AUDIO_CONFIG.DEFAULT_VOLUME > 1) {
      errors.push('Invalid default volume configuration');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * 验证环境配置
   */
  validateEnvironment: () => {
    const warnings: string[] = [];

    if (ENV_CONFIG.isDevelopment && !DEBUG_CONFIG.ENABLE_DEBUG_TOOLS) {
      warnings.push('Debug tools disabled in development environment');
    }

    if (ENV_CONFIG.isProduction && DEBUG_CONFIG.SHOW_DEBUG_INFO) {
      warnings.push('Debug info enabled in production environment');
    }

    return {
      warnings
    };
  }
} as const;

// ==================== 默认导出 ====================
export default CONFIG;
