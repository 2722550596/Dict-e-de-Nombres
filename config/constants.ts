/**
 * 应用程序常量配置
 * 统一管理所有硬编码的常量值
 */

// ==================== 存储相关常量 ====================
export const STORAGE_KEYS = {
  // 用户数据
  USER_DATA: 'frenchNumbers_userData',
  NUMBER_STATS: 'frenchNumbers_numberStats',
  
  // 系统设置
  SELECTED_LANGUAGE: 'selectedLanguage',
  SOUND_EFFECTS_ENABLED: 'soundEffectsEnabled',
  VOLUME_LEVEL: 'volumeLevel',
  
  // 迁移和备份
  BACKUP: 'frenchNumbers_backup',
  MIGRATION_LOG: 'frenchNumbers_migrationLog',
} as const;

// ==================== 时间相关常量 ====================
export const TIMING = {
  // 动画持续时间 (毫秒)
  ANIMATION: {
    MODAL_FADE: 400,
    MODAL_SLIDE: 500,
    SLOT_MACHINE_FAST: 1000,
    SLOT_MACHINE_SLOW: 500,
    CELEBRATION: 3000,
    BUTTON_HOVER: 300,
    TRANSITION_SMOOTH: 200,
  },
  
  // 延迟时间 (毫秒)
  DELAY: {
    MODAL_SHOW: 600,
    SLOT_MACHINE_START: 600,
    STREAK_BONUS_SHOW: 100,
    STATS_SHOW: 0,
    FOOTER_SHOW: 200,
    CONFETTI_START: 100,
    AUDIO_START: 200,
    INPUT_NAVIGATION: 150,
  },
  
  // 音频相关时间
  AUDIO: {
    SLOT_MACHINE_INTERVAL: 100,
    SOUND_FADE_OUT: 100,
  },
} as const;

// ==================== 游戏配置常量 ====================
export const GAME_CONFIG = {
  // 分页设置
  ITEMS_PER_PAGE: 20,
  
  // 经验值计算
  EXPERIENCE: {
    BASE_EXP: 5,
    MATH_MULTIPLIERS: {
      '+': 2.5,
      '-': 3.5,
      '×': 4,
      '÷': 4,
    },
  },
  
  // 等级系统
  LEVEL_SYSTEM: {
    VERSION: 2,
    MAX_LEVEL: 100,
    BASE_EXPERIENCE: 100,
    EXPERIENCE_MULTIPLIER: 1.2,
  },
  
  // 默认用户数据
  DEFAULT_USER_DATA: {
    level: 1,
    experience: 0,
    totalSessions: 0,
    todaySessions: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    maxStreak: 0,
  },
} as const;

// ==================== UI 相关常量 ====================
export const UI_CONFIG = {
  // 模态框尺寸
  MODAL: {
    MIN_WIDTH: 360,
    MAX_WIDTH: 420,
    HEIGHT: 500,
    BORDER_RADIUS: 24,
    PADDING: 24,
  },
  
  // 响应式断点
  BREAKPOINTS: {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
  },
  
  // Z-index 层级
  Z_INDEX: {
    MODAL_OVERLAY: 1500,
    CELEBRATION_OVERLAY: 2000,
    TOOLTIP: 1000,
    DROPDOWN: 500,
  },
  
  // 网格布局
  GRID: {
    ITEMS_PER_ROW: 10,
    GAP: 12,
  },
} as const;

// ==================== 音频配置常量 ====================
export const AUDIO_CONFIG = {
  // 默认音量
  DEFAULT_VOLUME: 0.7,
  
  // 音效配置
  SOUND_EFFECTS: {
    success: { frequency: 800, duration: 0.2, type: 'sine', volume: 0.3 },
    error: { frequency: 300, duration: 0.3, type: 'sawtooth', volume: 0.2 },
    click: { frequency: 600, duration: 0.1, type: 'square', volume: 0.1 },
    hover: { frequency: 400, duration: 0.05, type: 'sine', volume: 0.05 },
    celebration: { frequency: 1000, duration: 0.5, type: 'sine', volume: 0.4 },
    input: { frequency: 500, duration: 0.08, type: 'triangle', volume: 0.08 },
    submit: { frequency: 700, duration: 0.15, type: 'sine', volume: 0.2 },
    select: { frequency: 550, duration: 0.12, type: 'sine', volume: 0.12 },
    tab: { frequency: 650, duration: 0.1, type: 'triangle', volume: 0.1 },
    navigation: { frequency: 500, duration: 0.08, type: 'sine', volume: 0.08 },
    toggle: { frequency: 450, duration: 0.1, type: 'triangle', volume: 0.1 },
  },
} as const;

// ==================== 验证规则常量 ====================
export const VALIDATION = {
  // 数字范围
  NUMBER_RANGES: {
    MIN: 0,
    MAX: 9999,
  },
  
  // 输入限制
  INPUT: {
    MAX_LENGTH: 4,
    MIN_QUESTIONS: 1,
    MAX_QUESTIONS: 200,
  },
  
  // 准确率阈值
  ACCURACY_THRESHOLDS: {
    PERFECT: 1.0,
    EXCELLENT: 0.9,
    GOOD: 0.8,
    FAIR: 0.7,
  },
} as const;

// ==================== 样式相关常量 ====================
export const STYLE_CONFIG = {
  // 颜色主题
  COLORS: {
    PRIMARY: '#3b82f6',
    PRIMARY_DARK: '#2563eb',
    SUCCESS: '#22c55e',
    ERROR: '#ef4444',
    WARNING: '#f59e0b',
    BACKGROUND: '#f8fafc',
    SURFACE: '#ffffff',
    TEXT: '#1e293b',
    TEXT_LIGHT: '#64748b',
    BORDER: '#cbd5e1',
    BORDER_FOCUS: '#60a5fa',
  },
  
  // 字体
  FONTS: {
    FAMILY: "'Poppins', sans-serif",
    WEIGHTS: {
      NORMAL: 400,
      MEDIUM: 500,
      SEMIBOLD: 600,
      BOLD: 700,
      EXTRABOLD: 800,
      BLACK: 900,
    },
  },
  
  // 阴影
  SHADOWS: {
    SMALL: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    MEDIUM: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    LARGE: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    EXTRA_LARGE: '0 25px 50px rgba(0, 0, 0, 0.15)',
  },
} as const;

// ==================== 类型导出 ====================
export type StorageKey = keyof typeof STORAGE_KEYS;
export type SoundEffect = keyof typeof AUDIO_CONFIG.SOUND_EFFECTS;
export type ColorName = keyof typeof STYLE_CONFIG.COLORS;
export type FontWeight = keyof typeof STYLE_CONFIG.FONTS.WEIGHTS;
