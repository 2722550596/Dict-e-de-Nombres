/**
 * 用户相关类型定义
 * 统一管理所有用户数据、统计信息和偏好设置相关的类型
 */

// ==================== 基础用户数据 ====================
export interface UserData {
  // 等级系统
  level: number;
  experience: number;
  
  // 会话统计
  totalSessions: number;
  todaySessions: number;
  lastActiveDate: string;
  
  // 答题统计
  totalQuestions: number;
  totalCorrect: number;
  maxStreak: number;
  
  // 扩展统计信息
  stats?: UserStats;
  
  // 用户偏好设置
  preferences?: UserPreferences;
  
  // 系统字段
  levelSystemVersion?: number;
  migrationDate?: string;
  bonusExperience?: number;
}

// ==================== 用户统计信息 ====================
export interface UserStats {
  // 准确率统计
  averageAccuracy: number;
  bestAccuracy: number;
  
  // 时间统计
  totalPlayTime: number; // 总游戏时间（秒）
  
  // 连续天数
  consecutiveDays: number;
  
  // 最后游戏日期
  lastPlayDate?: string;
}

// ==================== 用户偏好设置 ====================
export interface UserPreferences {
  // 音效设置
  soundEnabled: boolean;
  celebrationEnabled: boolean;
  volume: number;
  
  // 界面设置
  showHints: boolean;
  language: string;
  
  // 游戏设置
  autoPlay?: boolean;
  defaultSpeed?: 'slow' | 'normal' | 'fast';
  defaultInterval?: number;
}

// ==================== 扩展的玩家数据（向后兼容） ====================
export interface PlayerData extends UserData {
  version: string;
  playerId: string;
  playerName?: string;
  experienceToNext: number;
  
  // 当前游戏状态
  currentStreak: number;
  longestStreak: number;
  currentScore: number;
  
  // 难度相关
  difficultyStats: DifficultyStats;
  
  // 成就系统
  achievements: Achievement[];
  unlockedAchievements: string[];
  
  // 游戏历史
  recentSessions: GameSession[];
  
  // 重写偏好设置为必需字段
  preferences: UserPreferences;
  stats: UserStats;
}

// ==================== 难度统计 ====================
export interface DifficultyStats {
  [key: string]: {
    highScore: number;
    bestAccuracy: number;
    timesPlayed: number;
    averageScore: number;
    unlocked: boolean;
  };
}

// ==================== 成就系统 ====================
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

// ==================== 游戏会话 ====================
export interface GameSession {
  mode: 'number' | 'math';
  difficulty: string;
  score: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  duration: number; // 秒
  maxStreak: number;
  date: string;
  operator?: string; // 数学模式的运算符
}

// ==================== 数字统计 ====================
export interface NumberStats {
  [number: string]: {
    correct: number;
    total: number;
    accuracy?: number;
    lastSeen?: string;
  };
}

// ==================== 奖励信息 ====================
export interface RewardInfo {
  experience: number;
  streak: number;
  streakBonus: number;
  accuracy: number;
  perfectScore: boolean;
  levelUp?: {
    oldLevel: number;
    newLevel: number;
  };
  sessionScore?: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

// ==================== 推荐结果 ====================
export interface RecommendationResult {
  text: string;
  recommendedRange: string;
  difficulty?: string;
  reason?: string;
}

// ==================== 用户进度信息 ====================
export interface UserProgress {
  currentLevel: number;
  currentExp: number;
  nextLevelExp: number;
  progress: number; // 0-1 之间的进度百分比
  expToNext: number;
}

// ==================== 迁移相关类型 ====================
export interface MigrationResult {
  success: boolean;
  oldLevel: number;
  newLevel: number;
  oldExperience: number;
  adjustedExperience: number;
  bonusExperience?: number;
  migrationDate: string;
  error?: string;
}

export interface BackupData {
  userData: UserData;
  timestamp: string;
  version: string;
  checksum: string;
}

export interface MigrationLog {
  timestamp: string;
  action: 'backup' | 'migrate' | 'rollback' | 'verify';
  success: boolean;
  details: string;
  error?: string;
}

// ==================== 类型守卫 ====================
export const isUserData = (obj: any): obj is UserData => {
  return obj && 
    typeof obj.level === 'number' &&
    typeof obj.experience === 'number' &&
    typeof obj.totalSessions === 'number' &&
    typeof obj.totalQuestions === 'number' &&
    typeof obj.totalCorrect === 'number' &&
    typeof obj.maxStreak === 'number' &&
    typeof obj.lastActiveDate === 'string';
};

export const isPlayerData = (obj: any): obj is PlayerData => {
  return isUserData(obj) &&
    typeof obj.version === 'string' &&
    typeof obj.playerId === 'string' &&
    typeof obj.experienceToNext === 'number' &&
    obj.preferences && 
    obj.stats &&
    Array.isArray(obj.achievements);
};

export const isRewardInfo = (obj: any): obj is RewardInfo => {
  return obj &&
    typeof obj.experience === 'number' &&
    typeof obj.streak === 'number' &&
    typeof obj.streakBonus === 'number' &&
    typeof obj.accuracy === 'number' &&
    typeof obj.perfectScore === 'boolean';
};

// ==================== 工具类型 ====================
export type PartialUserData = Partial<UserData>;
export type RequiredUserData = Required<UserData>;
export type UserDataUpdate = Partial<Pick<UserData, 'experience' | 'level' | 'totalSessions' | 'todaySessions' | 'totalQuestions' | 'totalCorrect' | 'maxStreak'>>;

// ==================== 默认值 ====================
export const createDefaultUserData = (): UserData => ({
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
    volume: 0.7,
    showHints: true,
    language: 'fr',
  },
});

export const createDefaultUserStats = (): UserStats => ({
  averageAccuracy: 0,
  bestAccuracy: 0,
  totalPlayTime: 0,
  consecutiveDays: 0,
});

export const createDefaultUserPreferences = (): UserPreferences => ({
  soundEnabled: true,
  celebrationEnabled: true,
  volume: 0.7,
  showHints: true,
  language: 'fr',
});
