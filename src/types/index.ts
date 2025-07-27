/**
 * 统一类型定义入口
 * 导出所有类型定义，提供统一的类型访问接口
 */

// ==================== 核心类型导出 ====================
export * from './audio.types';
export * from './exercise';
export * from './game.types';
export * from './ui.types';
export * from './user.types';

// ==================== 重新导出常用类型 ====================
import type { SoundEffect } from './audio.types';
import type { GameSession, MathOperator } from './game.types';
import type { RewardInfo, UserData, UserPreferences } from './user.types';

// ==================== 类型聚合 ====================
export interface AppState {
  user: UserData;
  currentSession?: GameSession;
  preferences: UserPreferences;
}

// ==================== 工具类型 ====================
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ==================== 事件类型 ====================
export interface UserDataUpdateEvent {
  type: 'USER_DATA_UPDATE';
  payload: {
    oldData: UserData;
    newData: UserData;
    changes: Partial<UserData>;
  };
}

export interface SessionCompleteEvent {
  type: 'SESSION_COMPLETE';
  payload: {
    session: GameSession;
    reward: RewardInfo;
    levelUp?: boolean;
  };
}

export type AppEvent = UserDataUpdateEvent | SessionCompleteEvent;

// ==================== API 响应类型 ====================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== 错误类型 ====================
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ValidationError extends AppError {
  field: string;
  value: any;
  constraint: string;
}

// ==================== 配置类型 ====================
export interface TypedConfig {
  storage: Record<string, string>;
  timing: {
    animation: Record<string, number>;
    delay: Record<string, number>;
  };
  game: {
    experience: {
      baseExp: number;
      mathMultipliers: Record<MathOperator, number>;
    };
    levelSystem: {
      version: number;
      maxLevel: number;
    };
  };
  audio: {
    defaultVolume: number;
    soundEffects: Record<SoundEffect, any>;
  };
}

// ==================== 类型守卫 ====================
export const isUserData = (obj: any): obj is UserData => {
  return obj &&
    typeof obj.level === 'number' &&
    typeof obj.experience === 'number' &&
    typeof obj.totalSessions === 'number';
};

export const isGameSession = (obj: any): obj is GameSession => {
  return obj &&
    typeof obj.mode === 'string' &&
    typeof obj.score === 'number' &&
    typeof obj.accuracy === 'number';
};

export const isRewardInfo = (obj: any): obj is RewardInfo => {
  return obj &&
    typeof obj.experience === 'number' &&
    typeof obj.streak === 'number' &&
    typeof obj.accuracy === 'number';
};

// ==================== 默认导出 ====================
export default {
  // 常用类型的默认值
  defaultUserData: (): UserData => ({
    level: 1,
    experience: 0,
    totalSessions: 0,
    todaySessions: 0,
    lastActiveDate: new Date().toDateString(),
    totalQuestions: 0,
    totalCorrect: 0,
    maxStreak: 0,
    stats: {
      averageAccuracy: 0,
      bestAccuracy: 0,
      totalPlayTime: 0,
      consecutiveDays: 0,
    },
    preferences: {
      soundEnabled: true,
      celebrationEnabled: true,
      showHints: true,
      language: 'fr',
      volume: 0.7,
    },
  }),

  // 类型检查工具
  guards: {
    isUserData,
    isGameSession,
    isRewardInfo,
  },
};
