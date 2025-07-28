/**
 * 游戏相关类型定义
 * 统一管理游戏逻辑、难度、等级系统等相关类型
 */

// ==================== 游戏模式 ====================
export type GameMode = 'number' | 'math' | 'time' | 'direction' | 'length';

// ==================== 难度等级 ====================
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type TraditionalDifficulty = 'Facile' | 'Moyen' | 'Difficile';

// ==================== 数学运算符 ====================
export type MathOperator = '+' | '-' | '×' | '÷';

// ==================== 游戏结果 ====================
export interface GameResult {
  number: number;
  userAnswer: string;
  correct: boolean;
  mode: GameMode;
  operator?: MathOperator;
  operand1?: number;
  operand2?: number;
  timestamp: number;
}

// ==================== 游戏会话结果 ====================
export interface SessionResult {
  results: GameResult[];
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  maxStreak: number;
  duration: number;
  mode: GameMode;
  difficulty: string;
  score: number;
  date: string;
}

// ==================== 难度配置 ====================
export interface DifficultyConfig {
  name: string;
  scoreMultiplier: number;
  experienceMultiplier: number;
  unlockRequirement?: {
    difficulty: string;
    minAccuracy: number;
    minSessions: number;
  } | null;
}

// ==================== 数字范围难度配置 ====================
export interface RangeDifficultyConfig {
  difficulty: DifficultyLevel;
  experienceMultiplier: number;
  minLevel?: number;
  maxLevel?: number;
}

// ==================== 特殊数字类型配置 ====================
export interface SpecialNumberConfig {
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  experienceMultiplier: number;
  category: string;
  unlockLevel?: number;
}

// ==================== 等级系统配置 ====================
export interface LevelSystemConfig {
  version: number;
  maxLevel: number;
  baseExperience: number;
  experienceMultiplier: number;
}

// ==================== 等级里程碑 ====================
export interface LevelMilestone {
  level: number;
  title: string;
  description: string;
  reward?: {
    type: 'badge' | 'title' | 'feature';
    value: string;
  };
}

// ==================== 成就定义 ====================
export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'streak' | 'accuracy' | 'sessions' | 'level' | 'perfect_scores' | 'total_correct' | 'consecutive_days';
    value: number;
    operator?: 'gte' | 'lte' | 'eq';
  };
  reward: {
    experience: number;
    title?: string;
    badge?: string;
  };
  category: 'basic' | 'advanced' | 'expert' | 'special';
  hidden?: boolean;
}

// ==================== 游戏统计 ====================
export interface GameStats {
  totalGames: number;
  totalCorrect: number;
  totalQuestions: number;
  averageAccuracy: number;
  bestStreak: number;
  totalPlayTime: number;
  favoriteMode: GameMode;
  difficultyProgress: Record<string, {
    played: number;
    bestScore: number;
    bestAccuracy: number;
  }>;
}

// ==================== 练习设置 ====================
export interface ExerciseSettings {
  mode: GameMode;
  difficulty: string;
  range: [number, number];
  quantity: number;
  speed: 'slow' | 'normal' | 'fast';
  interval: number;

  // 运算模式专用
  operations?: MathOperator[];
  maxResult?: number;

  // 数字模式专用
  specialNumbers?: string[];

  // 时间模式专用
  timeTypes?: ('year' | 'month' | 'day' | 'weekday' | 'fullDate')[];

  // 方位模式专用
  directionTypes?: ('cardinal' | 'relative' | 'spatial')[];

  // 长度模式专用
  lengthUnits?: string[];
  lengthRange?: [number, number];
}

// ==================== 数学问题 ====================
export interface MathProblem {
  operand1: number;
  operator: MathOperator;
  operand2: number;
  result: number;
  displayText: string; // 用于TTS的文本
  difficulty?: DifficultyLevel;
}

// ==================== 时间听写内容 ====================
export interface TimeContent {
  type: 'year' | 'month' | 'day' | 'weekday' | 'fullDate';
  value: string;
  displayText: string;
  acceptedAnswers: string[]; // 支持多种正确答案格式
}

// ==================== 方位听写内容 ====================
export interface DirectionContent {
  type: 'cardinal' | 'relative' | 'spatial'; // 基本方位、相对方位、空间方位
  value: string;
  displayText: string;
  buttonPosition: { x: number; y: number }; // 按钮在界面中的位置
}

// ==================== 长度听写内容 ====================
export interface LengthContent {
  value: number;
  unit: string;
  displayText: string;
  acceptedFormats: string[]; // 支持的输入格式
}

// ==================== 练习数据 ====================
export interface Exercise {
  id: string;
  mode: GameMode;
  settings: ExerciseSettings;
  questions: (number | MathProblem | TimeContent | DirectionContent | LengthContent)[];
  createdAt: string;
  estimatedDuration: number;
}

// ==================== 游戏状态 ====================
export interface GameState {
  isPlaying: boolean;
  currentQuestion: number;
  totalQuestions: number;
  currentStreak: number;
  maxStreak: number;
  correctAnswers: number;
  startTime: number;
  answers: string[];
  results: GameResult[];
  settings: ExerciseSettings;
}

// ==================== 推荐系统 ====================
export interface RecommendationConfig {
  accuracyThreshold: number;
  sessionThreshold: number;
  difficultyProgression: string[];
  adaptiveMode: boolean;
}

export interface RecommendationData {
  userLevel: number;
  recentAccuracy: number;
  recentSessions: number;
  weakNumbers: number[];
  strongNumbers: number[];
  preferredDifficulty: string;
  suggestedNextDifficulty: string;
}

// ==================== 排行榜 ====================
export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  level: number;
  experience: number;
  totalScore: number;
  averageAccuracy: number;
  rank: number;
  badge?: string;
}

// ==================== 游戏事件 ====================
export interface GameEvent {
  type: 'question_answered' | 'session_started' | 'session_completed' | 'level_up' | 'achievement_unlocked';
  timestamp: number;
  data: any;
}

// ==================== 类型守卫 ====================
export const isGameResult = (obj: any): obj is GameResult => {
  return obj &&
    typeof obj.number === 'number' &&
    typeof obj.userAnswer === 'string' &&
    typeof obj.correct === 'boolean' &&
    typeof obj.mode === 'string' &&
    typeof obj.timestamp === 'number';
};

export const isMathProblem = (obj: any): obj is MathProblem => {
  return obj &&
    typeof obj.operand1 === 'number' &&
    typeof obj.operator === 'string' &&
    typeof obj.operand2 === 'number' &&
    typeof obj.result === 'number' &&
    typeof obj.displayText === 'string';
};

export const isTimeContent = (obj: any): obj is TimeContent => {
  return obj &&
    typeof obj.type === 'string' &&
    ['year', 'month', 'day', 'weekday', 'fullDate'].includes(obj.type) &&
    typeof obj.value === 'string' &&
    typeof obj.displayText === 'string' &&
    Array.isArray(obj.acceptedAnswers);
};

export const isDirectionContent = (obj: any): obj is DirectionContent => {
  return obj &&
    typeof obj.type === 'string' &&
    ['cardinal', 'relative', 'spatial'].includes(obj.type) &&
    typeof obj.value === 'string' &&
    typeof obj.displayText === 'string' &&
    obj.buttonPosition &&
    typeof obj.buttonPosition.x === 'number' &&
    typeof obj.buttonPosition.y === 'number';
};

export const isLengthContent = (obj: any): obj is LengthContent => {
  return obj &&
    typeof obj.value === 'number' &&
    typeof obj.unit === 'string' &&
    typeof obj.displayText === 'string' &&
    Array.isArray(obj.acceptedFormats);
};

export const isExerciseSettings = (obj: any): obj is ExerciseSettings => {
  return obj &&
    typeof obj.mode === 'string' &&
    ['number', 'math', 'time', 'direction', 'length'].includes(obj.mode) &&
    typeof obj.difficulty === 'string' &&
    Array.isArray(obj.range) &&
    obj.range.length === 2 &&
    typeof obj.quantity === 'number' &&
    typeof obj.speed === 'string' &&
    ['slow', 'normal', 'fast'].includes(obj.speed) &&
    typeof obj.interval === 'number';
};

// ==================== 工具类型 ====================
export type GameModeSettings<T extends GameMode> = T extends 'math'
  ? ExerciseSettings & { operations: MathOperator[]; maxResult: number }
  : T extends 'time'
  ? ExerciseSettings & { timeTypes: ('year' | 'month' | 'day' | 'weekday' | 'fullDate')[] }
  : T extends 'direction'
  ? ExerciseSettings & { directionTypes: ('cardinal' | 'relative' | 'spatial')[] }
  : T extends 'length'
  ? ExerciseSettings & { lengthUnits: string[]; lengthRange: [number, number] }
  : ExerciseSettings & { specialNumbers?: string[] };

export type DifficultyMap = Record<TraditionalDifficulty, DifficultyConfig>;
export type SpecialNumberMap = Record<string, SpecialNumberConfig>;
export type AchievementMap = Record<string, AchievementDefinition>;

// ==================== 常量类型 ====================
export const GAME_MODES: readonly GameMode[] = ['number', 'math', 'time', 'direction', 'length'] as const;
export const MATH_OPERATORS: readonly MathOperator[] = ['+', '-', '×', '÷'] as const;
export const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = ['easy', 'medium', 'hard'] as const;
export const TRADITIONAL_DIFFICULTIES: readonly TraditionalDifficulty[] = ['Facile', 'Moyen', 'Difficile'] as const;

// ==================== 默认值创建函数 ====================
export const createDefaultExerciseSettings = (mode: GameMode = 'number'): ExerciseSettings => ({
  mode,
  difficulty: 'Facile',
  range: [0, 20],
  quantity: 20,
  speed: 'normal',
  interval: 1,
  ...(mode === 'math' && {
    operations: ['+'],
    maxResult: 100,
  }),
  ...(mode === 'time' && {
    timeTypes: ['year', 'month', 'day'],
  }),
  ...(mode === 'direction' && {
    directionTypes: ['cardinal'],
  }),
  ...(mode === 'length' && {
    lengthUnits: ['米', '厘米'],
    lengthRange: [1, 100],
  }),
});

export const createDefaultGameState = (settings: ExerciseSettings): GameState => ({
  isPlaying: false,
  currentQuestion: 0,
  totalQuestions: settings.quantity,
  currentStreak: 0,
  maxStreak: 0,
  correctAnswers: 0,
  startTime: Date.now(),
  answers: new Array(settings.quantity).fill(''),
  results: [],
  settings,
});

export const createDefaultGameStats = (): GameStats => ({
  totalGames: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  averageAccuracy: 0,
  bestStreak: 0,
  totalPlayTime: 0,
  favoriteMode: 'number',
  difficultyProgress: {},
});
