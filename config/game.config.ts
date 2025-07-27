/**
 * 游戏配置管理
 * 包含难度、经验值、等级系统等游戏相关配置
 */

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

export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
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
} as const;

// ==================== 数字范围难度配置 ====================
export interface RangeDifficultyConfig {
  difficulty: 'easy' | 'medium' | 'hard';
  experienceMultiplier: number;
}

export const RANGE_DIFFICULTY_CONFIGS: Record<string, RangeDifficultyConfig> = {
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

  // 高级范围 (困难)
  '0-999': { difficulty: 'hard', experienceMultiplier: 2.0 },
  '100-999': { difficulty: 'hard', experienceMultiplier: 2.2 },
  '1000-9999': { difficulty: 'hard', experienceMultiplier: 3.0 },
} as const;

// ==================== 特殊数字类型配置 ====================
export interface SpecialNumberConfig {
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  experienceMultiplier: number;
  category: string;
}

export const SPECIAL_NUMBER_CONFIGS: Record<string, SpecialNumberConfig> = {
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
} as const;

// ==================== 等级系统配置 ====================
export interface LevelSystemConfig {
  version: number;
  maxLevel: number;
  baseExperience: number;
  experienceMultiplier: number;
}

export const LEVEL_SYSTEM_CONFIG: LevelSystemConfig = {
  version: 2,
  maxLevel: 100,
  baseExperience: 100,
  experienceMultiplier: 1.2,
} as const;

// ==================== 等级里程碑配置 ====================
export interface LevelMilestone {
  level: number;
  title: string;
  description: string;
  reward?: {
    type: 'badge' | 'title' | 'feature';
    value: string;
  };
}

export const LEVEL_MILESTONES: LevelMilestone[] = [
  {
    level: 5,
    title: '初学者',
    description: '完成了第一阶段的学习',
    reward: { type: 'badge', value: 'beginner' }
  },
  {
    level: 10,
    title: '数字学徒',
    description: '掌握了基础数字',
    reward: { type: 'badge', value: 'apprentice' }
  },
  {
    level: 20,
    title: '数字专家',
    description: '熟练掌握中级数字',
    reward: { type: 'feature', value: 'advanced_mode' }
  },
  {
    level: 50,
    title: '数字大师',
    description: '成为真正的数字专家',
    reward: { type: 'title', value: 'master' }
  },
  {
    level: 100,
    title: '传奇',
    description: '达到了最高等级',
    reward: { type: 'title', value: 'legend' }
  }
] as const;

// ==================== 成就系统配置 ====================
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'streak' | 'accuracy' | 'sessions' | 'level' | 'perfect_scores';
    value: number;
  };
  reward: {
    experience: number;
    title?: string;
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_perfect',
    name: '完美开始',
    description: '获得第一个满分',
    icon: '🎯',
    condition: { type: 'perfect_scores', value: 1 },
    reward: { experience: 50 }
  },
  {
    id: 'streak_master',
    name: '连击大师',
    description: '达到20连击',
    icon: '🔥',
    condition: { type: 'streak', value: 20 },
    reward: { experience: 100, title: '连击大师' }
  },
  {
    id: 'accuracy_expert',
    name: '精准专家',
    description: '保持90%以上准确率完成10次练习',
    icon: '🎪',
    condition: { type: 'accuracy', value: 90 },
    reward: { experience: 150 }
  },
  {
    id: 'dedicated_learner',
    name: '专注学习者',
    description: '完成100次练习',
    icon: '📚',
    condition: { type: 'sessions', value: 100 },
    reward: { experience: 200, title: '专注学习者' }
  }
] as const;

// ==================== 推荐系统配置 ====================
export interface RecommendationConfig {
  accuracyThreshold: number;
  sessionThreshold: number;
  difficultyProgression: string[];
}

export const RECOMMENDATION_CONFIG: RecommendationConfig = {
  accuracyThreshold: 80,
  sessionThreshold: 3,
  difficultyProgression: ['Facile', 'Moyen', 'Difficile']
} as const;

// ==================== 类型导出 ====================
export type DifficultyLevel = keyof typeof DIFFICULTY_CONFIGS;
export type SpecialNumberType = keyof typeof SPECIAL_NUMBER_CONFIGS;
export type AchievementId = typeof ACHIEVEMENTS[number]['id'];
