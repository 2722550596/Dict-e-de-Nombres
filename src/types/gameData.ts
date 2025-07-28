// 游戏数据类型定义
export interface PlayerStats {
  totalCorrect: number;
  totalAttempts: number;
  totalSessions: number;
  totalPlayTime: number; // 总游戏时间（秒）
  averageAccuracy: number;
  bestAccuracy: number;
  lastPlayDate: string;
  consecutiveDays: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface DifficultyStats {
  [key: string]: {
    highScore: number;
    bestAccuracy: number;
    timesPlayed: number;
    averageScore: number;
    unlocked: boolean;
  };
}

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
}

export interface PlayerData {
  version: string;
  playerId: string;
  playerName?: string;
  level: number;
  experience: number;
  experienceToNext: number;

  // 总体统计
  stats: PlayerStats;

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

  // 设置
  preferences: {
    soundEnabled: boolean;
    celebrationEnabled: boolean;
    showHints: boolean;
  };
}

// 成就定义
export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'first_practice',
    name: '初学者',
    description: '完成第一次练习',
    icon: '🌟',
    maxProgress: 1
  },
  {
    id: 'perfect_score',
    name: '完美主义者',
    description: '单次练习达到100%正确率',
    icon: '💯',
    maxProgress: 1
  },
  {
    id: 'speed_demon',
    name: '速度之王',
    description: '在最快速度下完成练习',
    icon: '⚡',
    maxProgress: 1
  },
  {
    id: 'streak_master',
    name: '连击高手',
    description: '达到50连击',
    icon: '🔥',
    maxProgress: 50
  },
  {
    id: 'hundred_correct',
    name: '百题斩',
    description: '累计答对100题',
    icon: '🎯',
    maxProgress: 100
  },
  {
    id: 'daily_player',
    name: '坚持不懈',
    description: '连续7天练习',
    icon: '📅',
    maxProgress: 7
  },
  {
    id: 'math_master',
    name: '数学大师',
    description: '数学模式达到1000分',
    icon: '🧮',
    maxProgress: 1000
  },
  {
    id: 'number_expert',
    name: '法语专家',
    description: '数字模式达到1000分',
    icon: '🇫🇷',
    maxProgress: 1000
  },
  {
    id: 'level_up',
    name: '升级达人',
    description: '达到10级',
    icon: '⬆️',
    maxProgress: 10
  },
  {
    id: 'session_marathon',
    name: '马拉松选手',
    description: '单次练习超过200题',
    icon: '🏃',
    maxProgress: 200
  }
];

// 特殊数字类型配置
export const SPECIAL_NUMBER_CONFIG = {
  'tens': {
    name: '整十数',
    description: '10, 20, 30, ..., 90',
    difficulty: 'easy',
    experienceMultiplier: 1.2,
    category: 'special_patterns'
  },
  'years': {
    name: '年份',
    description: '1700-2050年份数字',
    difficulty: 'hard',
    experienceMultiplier: 2.5,
    category: 'historical'
  },
  'hundreds': {
    name: '整百数',
    description: '100, 200, 300, ..., 900',
    difficulty: 'medium',
    experienceMultiplier: 1.8,
    category: 'special_patterns'
  },
  'thousands': {
    name: '整千数',
    description: '1000, 2000, 3000, ..., 9000',
    difficulty: 'hard',
    experienceMultiplier: 2.2,
    category: 'large_numbers'
  }
};

// 数字范围难度配置
export const RANGE_DIFFICULTY_CONFIG = {
  // 基础范围 (简单)
  '0-9': { difficulty: 'easy', experienceMultiplier: 1.0 },
  '0-16': { difficulty: 'easy', experienceMultiplier: 1.0 },
  '0-20': { difficulty: 'easy', experienceMultiplier: 1.0 },
  '0-30': { difficulty: 'easy', experienceMultiplier: 1.1 },

  // 中级范围 (中等)
  '0-50': { difficulty: 'medium', experienceMultiplier: 1.2 },
  '0-69': { difficulty: 'medium', experienceMultiplier: 1.3 },
  '20-69': { difficulty: 'medium', experienceMultiplier: 1.4 },
  '50-99': { difficulty: 'medium', experienceMultiplier: 1.5 },
  '70-99': { difficulty: 'medium', experienceMultiplier: 1.6 },
  '0-99': { difficulty: 'medium', experienceMultiplier: 1.4 },

  // 困难范围 (困难)
  '100-199': { difficulty: 'hard', experienceMultiplier: 1.8 },
  '100-999': { difficulty: 'hard', experienceMultiplier: 2.0 },
  '200-999': { difficulty: 'hard', experienceMultiplier: 2.2 },
  '1000-1999': { difficulty: 'hard', experienceMultiplier: 2.5 },
  '1000-9999': { difficulty: 'hard', experienceMultiplier: 3.0 },
  '1700-2050': { difficulty: 'hard', experienceMultiplier: 2.5 }
};

// 传统难度配置 (保持向后兼容)
export const DIFFICULTY_CONFIG = {
  'Facile': {
    name: '简单',
    scoreMultiplier: 1.0,
    experienceMultiplier: 1.0,
    unlockRequirement: null
  },
  'Moyen': {
    name: '中等',
    scoreMultiplier: 1.5,
    experienceMultiplier: 1.5,
    unlockRequirement: {
      difficulty: 'Facile',
      minAccuracy: 80,
      minSessions: 3
    }
  },
  'Difficile': {
    name: '困难',
    scoreMultiplier: 2.0,
    experienceMultiplier: 2.0,
    unlockRequirement: {
      difficulty: 'Moyen',
      minAccuracy: 75,
      minSessions: 5
    }
  }
};

// 等级系统配置
export const LEVEL_CONFIG = {
  baseExperience: 100,
  experienceMultiplier: 1.2,
  maxLevel: 50
};
