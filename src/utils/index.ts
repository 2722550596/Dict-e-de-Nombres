/**
 * 统一工具函数入口
 * 提供所有工具函数的统一导出接口
 */

// ==================== 核心工具 ====================
export * from './core/errors';
export * from './core/formatting';
export * from './core/storage';
export * from './core/validation';

// ==================== 游戏工具 ====================
export * from './game/data-manager';

// ==================== 数学工具 ====================
export * from './math/french-numbers';

// ==================== 音频工具 ====================
export * from './audio/effects';

// ==================== 内容生成工具 ====================
export * from './directionGeneration';
export * from './lengthGeneration';
export * from './timeGeneration';

// ==================== 向后兼容导出 ====================
// 为了保持向后兼容性，重新导出一些常用的函数和类

// 错误处理
export {
  createAudioError,
  createGameLogicError, createStorageError, createValidationError, handleError, retryExecute, safeExecute
} from './core/errors';

// 数据验证
export {
  sanitizers, validateGameSession,
  validateMathProblem, validateUserData
} from './core/validation';

// 存储管理
export {
  numberStatsStorage,
  storageUtils, userDataStorage
} from './core/storage';

// 格式化工具
export {
  format, gameFormatter, numberFormatter, textFormatter, timeFormatter
} from './core/formatting';

// 游戏数据管理
export {
  GameDataManagerCompat as GameDataManager, gameDataManager
} from './game/data-manager';

// 法语数字转换
export {
  createMathExpressionText,
  getCommonNumbersMapping, getNumberComplexity, numberToFrench,
  numbersToFrench,
  operatorToFrench, validateFrenchNumber
} from './math/french-numbers';

// 音效管理
export {
  createCustomAudioEffect,
  getAudioEffectsManager, playCelebration, playSound, preloadAudioEffects, setAudioEnabled,
  setAudioVolume
} from './audio/effects';

// ==================== 工具函数集合 ====================
/**
 * 核心工具函数集合
 */
export const coreUtils = {
  // 错误处理
  errors: {
    handle: handleError,
    createValidation: createValidationError,
    createStorage: createStorageError,
    createAudio: createAudioError,
    createGameLogic: createGameLogicError,
    safeExecute,
    retryExecute,
  },

  // 数据验证
  validation: {
    validateUserData,
    validateGameSession,
    validateMathProblem,
    sanitizers,
  },

  // 存储管理
  storage: {
    userData: userDataStorage,
    numberStats: numberStatsStorage,
    utils: storageUtils,
  },

  // 格式化
  formatting: {
    format,
    number: numberFormatter,
    time: timeFormatter,
    text: textFormatter,
    game: gameFormatter,
  },
};

/**
 * 游戏工具函数集合
 */
export const gameUtils = {
  // 数据管理
  dataManager: gameDataManager,

  // 向后兼容
  GameDataManager: GameDataManagerCompat,
};

/**
 * 数学工具函数集合
 */
export const mathUtils = {
  // 法语数字转换
  french: {
    numberToText: numberToFrench,
    numbersToText: numbersToFrench,
    operatorToText: operatorToFrench,
    createExpression: createMathExpressionText,
    getCommonMapping: getCommonNumbersMapping,
    validate: validateFrenchNumber,
    getComplexity: getNumberComplexity,
  },
};

/**
 * 音频工具函数集合
 */
export const audioUtils = {
  // 音效管理
  effects: {
    play: playSound,
    playCelebration,
    setEnabled: setAudioEnabled,
    setVolume: setAudioVolume,
    preload: preloadAudioEffects,
    createCustom: createCustomAudioEffect,
    getManager: getAudioEffectsManager,
  },
};

/**
 * 所有工具函数的统一接口
 */
export const utils = {
  core: coreUtils,
  game: gameUtils,
  math: mathUtils,
  audio: audioUtils,
};

/**
 * 便捷的工具函数访问
 */
export const {
  errors,
  validation,
  storage,
  formatting,
} = coreUtils;

export const {
  dataManager,
} = gameUtils;

export const {
  french,
} = mathUtils;

export const {
  effects,
} = audioUtils;

// ==================== 类型导出 ====================
export type {
  AppError, ErrorHandlingOptions, ErrorSeverity, ErrorType
} from './core/errors';

export type {
  ValidationResult,
  ValidationRule
} from './core/validation';

export type {
  StorageOptions, StorageResult
} from './core/storage';

export type {
  FormatOptions
} from './core/formatting';

// ==================== 默认导出 ====================
export default utils;
