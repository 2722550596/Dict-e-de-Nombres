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

  // 新模式统计（8.1新增）
  timeDictationStats?: TimeDictationStats;
  directionDictationStats?: DirectionDictationStats;
  lengthDictationStats?: LengthDictationStats;

  // 系统字段
  levelSystemVersion?: number;
  migrationDate?: string;
  bonusExperience?: number;
  newModesDataVersion?: number; // 新模式数据版本
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

// ==================== 新模式统计信息（8.1新增） ====================
export interface TimeDictationStats {
  // 基础统计
  totalSessions: number;
  totalCorrect: number;
  totalQuestions: number;
  bestAccuracy: number;
  averageAccuracy: number;

  // 时间类型偏好
  favoriteTimeType: string;
  timeTypeStats: {
    [timeType: string]: {
      sessions: number;
      correct: number;
      total: number;
      accuracy: number;
    };
  };

  // 最后练习日期
  lastPlayDate?: string;
}

export interface DirectionDictationStats {
  // 基础统计
  totalSessions: number;
  totalCorrect: number;
  totalQuestions: number;
  bestAccuracy: number;
  averageAccuracy: number;

  // 方位类型偏好
  favoriteDirectionType: string;
  directionTypeStats: {
    [directionType: string]: {
      sessions: number;
      correct: number;
      total: number;
      accuracy: number;
    };
  };

  // 最后练习日期
  lastPlayDate?: string;
}

export interface LengthDictationStats {
  // 基础统计
  totalSessions: number;
  totalCorrect: number;
  totalQuestions: number;
  bestAccuracy: number;
  averageAccuracy: number;

  // 单位偏好
  favoriteUnit: string;
  unitStats: {
    [unit: string]: {
      sessions: number;
      correct: number;
      total: number;
      accuracy: number;
    };
  };

  // 最后练习日期
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
  mode: 'number' | 'math' | 'time' | 'direction' | 'length';
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

// ==================== 扩展推荐系统类型 (8.2新增) ====================

// 模式表现分析
export interface ModePerformanceAnalysis {
  mode: 'number' | 'math' | 'time' | 'direction' | 'length';
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  accuracy: number;
  averageAccuracy: number;
  bestAccuracy: number;
  recentAccuracy: number; // 最近5次会话的平均准确率
  improvementTrend: 'improving' | 'stable' | 'declining';
  lastPlayDate?: string;
  experienceGained: number;
  averageSessionDuration?: number;
}

// 跨模式学习分析
export interface CrossModeAnalysis {
  strongestMode: 'number' | 'math' | 'time' | 'direction' | 'length';
  weakestMode: 'number' | 'math' | 'time' | 'direction' | 'length';
  modePerformances: ModePerformanceAnalysis[];
  overallProgress: 'excellent' | 'good' | 'average' | 'needs_improvement';
  balanceScore: number; // 0-100，表示各模式间的平衡程度
  recommendedFocusMode?: 'number' | 'math' | 'time' | 'direction' | 'length';
  diversityScore: number; // 0-100，表示练习的多样性
}

// 个性化难度推荐
export interface DifficultyRecommendation {
  mode: 'number' | 'math' | 'time' | 'direction' | 'length';
  currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  recommendedDifficulty: string;
  reason: string;
  confidenceScore: number; // 0-100，推荐的置信度
  nextMilestone?: string;
  estimatedTimeToMastery?: number; // 预计掌握时间（天）
}

// 练习频率和效果分析
export interface PracticeAnalysis {
  dailyAverageMinutes: number;
  weeklyFrequency: number;
  bestPerformanceTimeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  consistencyScore: number; // 0-100，练习一致性评分
  effectivenessScore: number; // 0-100，练习效果评分
  recommendedFrequency: string;
  recommendedDuration: string;
  optimalPracticeTime?: string;
}

// 综合推荐结果
export interface EnhancedRecommendationResult {
  // 基础推荐信息
  primaryRecommendation: RecommendationResult;

  // 跨模式分析
  crossModeAnalysis: CrossModeAnalysis;

  // 个性化难度推荐
  difficultyRecommendations: DifficultyRecommendation[];

  // 练习分析
  practiceAnalysis: PracticeAnalysis;

  // 具体建议
  suggestions: {
    immediate: string[]; // 立即可执行的建议
    shortTerm: string[]; // 短期建议（1-7天）
    longTerm: string[]; // 长期建议（1-4周）
  };

  // 元数据
  generatedAt: string;
  dataQuality: 'excellent' | 'good' | 'limited' | 'insufficient';
  recommendationVersion: string;
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
    typeof (obj as PlayerData).version === 'string' &&
    typeof (obj as PlayerData).playerId === 'string' &&
    typeof (obj as PlayerData).experienceToNext === 'number' &&
    (obj as PlayerData).preferences &&
    (obj as PlayerData).stats &&
    Array.isArray((obj as PlayerData).achievements);
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
  // 新模式统计默认值（8.1新增）
  timeDictationStats: createDefaultTimeDictationStats(),
  directionDictationStats: createDefaultDirectionDictationStats(),
  lengthDictationStats: createDefaultLengthDictationStats(),
  newModesDataVersion: 1, // 新模式数据版本
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

// ==================== 新模式统计默认值创建函数（8.1新增） ====================
export const createDefaultTimeDictationStats = (): TimeDictationStats => ({
  totalSessions: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  bestAccuracy: 0,
  averageAccuracy: 0,
  favoriteTimeType: 'year',
  timeTypeStats: {},
});

export const createDefaultDirectionDictationStats = (): DirectionDictationStats => ({
  totalSessions: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  bestAccuracy: 0,
  averageAccuracy: 0,
  favoriteDirectionType: 'cardinal',
  directionTypeStats: {},
});

export const createDefaultLengthDictationStats = (): LengthDictationStats => ({
  totalSessions: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  bestAccuracy: 0,
  averageAccuracy: 0,
  favoriteUnit: '米',
  unitStats: {},
});

// ==================== 新模式统计重置函数（8.1新增） ====================
export const resetTimeDictationStats = (): TimeDictationStats => createDefaultTimeDictationStats();
export const resetDirectionDictationStats = (): DirectionDictationStats => createDefaultDirectionDictationStats();
export const resetLengthDictationStats = (): LengthDictationStats => createDefaultLengthDictationStats();
