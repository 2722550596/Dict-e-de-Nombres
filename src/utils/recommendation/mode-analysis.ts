/**
 * 新模式统计分析算法 (8.2新增)
 * 为时间、方位、长度模式提供专门的表现分析功能
 */

import type {
  DirectionDictationStats,
  LengthDictationStats,
  ModePerformanceAnalysis,
  TimeDictationStats,
  UserData
} from '../../types/user.types';

// ==================== 工具函数 ====================

/**
 * 计算趋势（改进、稳定、下降）
 */
function calculateTrend(recentAccuracy: number, averageAccuracy: number): 'improving' | 'stable' | 'declining' {
  const difference = recentAccuracy - averageAccuracy;
  if (difference > 0.05) return 'improving'; // 5%以上改进
  if (difference < -0.05) return 'declining'; // 5%以上下降
  return 'stable';
}

/**
 * 计算最近准确率（基于最近的表现）
 */
function calculateRecentAccuracy(stats: any): number {
  // 如果有详细的会话记录，计算最近5次的平均值
  // 这里简化为使用平均准确率，实际实现中可以基于时间戳计算
  return stats.averageAccuracy || 0;
}

/**
 * 估算经验值获得（基于统计数据）
 */
function estimateExperienceGained(stats: any): number {
  // 基于正确答案数和基础经验值估算
  const baseExp = 10; // 基础经验值
  return stats.totalCorrect * baseExp;
}

// ==================== 时间模式分析 ====================

/**
 * 分析时间听写模式表现
 */
export function analyzeTimeMode(userData: UserData): ModePerformanceAnalysis {
  const stats = userData.timeDictationStats;

  if (!stats || stats.totalSessions === 0) {
    return {
      mode: 'time',
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      accuracy: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      recentAccuracy: 0,
      improvementTrend: 'stable',
      lastPlayDate: undefined,
      experienceGained: 0
    };
  }

  const accuracy = stats.totalQuestions > 0 ? stats.totalCorrect / stats.totalQuestions : 0;
  const recentAccuracy = calculateRecentAccuracy(stats);
  const trend = calculateTrend(recentAccuracy, stats.averageAccuracy);
  const experienceGained = estimateExperienceGained(stats);

  return {
    mode: 'time',
    totalSessions: stats.totalSessions,
    totalQuestions: stats.totalQuestions,
    totalCorrect: stats.totalCorrect,
    accuracy,
    averageAccuracy: stats.averageAccuracy,
    bestAccuracy: stats.bestAccuracy,
    recentAccuracy,
    improvementTrend: trend,
    lastPlayDate: stats.lastPlayDate,
    experienceGained
  };
}

/**
 * 分析时间类型偏好和表现
 */
export function analyzeTimeTypePerformance(stats: TimeDictationStats): {
  favoriteType: string;
  typePerformances: Array<{
    type: string;
    accuracy: number;
    sessions: number;
    preference: number;
  }>;
} {
  if (!stats.timeTypeStats) {
    return {
      favoriteType: stats.favoriteTimeType || 'year',
      typePerformances: []
    };
  }

  const typePerformances = Object.entries(stats.timeTypeStats).map(([type, typeStats]) => ({
    type,
    accuracy: typeStats.total > 0 ? typeStats.correct / typeStats.total : 0,
    sessions: typeStats.sessions || 0,
    preference: typeStats.sessions || 0
  }));

  // 找出最喜欢的类型（会话数最多）
  const favoriteType = typePerformances.reduce((prev, current) =>
    current.preference > prev.preference ? current : prev,
    typePerformances[0]
  )?.type || stats.favoriteTimeType || 'year';

  return {
    favoriteType,
    typePerformances
  };
}

// ==================== 方位模式分析 ====================

/**
 * 分析方位听写模式表现
 */
export function analyzeDirectionMode(userData: UserData): ModePerformanceAnalysis {
  const stats = userData.directionDictationStats;

  if (!stats || stats.totalSessions === 0) {
    return {
      mode: 'direction',
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      accuracy: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      recentAccuracy: 0,
      improvementTrend: 'stable',
      lastPlayDate: undefined,
      experienceGained: 0
    };
  }

  const accuracy = stats.totalQuestions > 0 ? stats.totalCorrect / stats.totalQuestions : 0;
  const recentAccuracy = calculateRecentAccuracy(stats);
  const trend = calculateTrend(recentAccuracy, stats.averageAccuracy);
  const experienceGained = estimateExperienceGained(stats);

  return {
    mode: 'direction',
    totalSessions: stats.totalSessions,
    totalQuestions: stats.totalQuestions,
    totalCorrect: stats.totalCorrect,
    accuracy,
    averageAccuracy: stats.averageAccuracy,
    bestAccuracy: stats.bestAccuracy,
    recentAccuracy,
    improvementTrend: trend,
    lastPlayDate: stats.lastPlayDate,
    experienceGained
  };
}

/**
 * 分析方位类型偏好和表现
 */
export function analyzeDirectionTypePerformance(stats: DirectionDictationStats): {
  favoriteType: string;
  typePerformances: Array<{
    type: string;
    accuracy: number;
    sessions: number;
    preference: number;
  }>;
} {
  if (!stats.directionTypeStats) {
    return {
      favoriteType: stats.favoriteDirectionType || 'cardinal',
      typePerformances: []
    };
  }

  const typePerformances = Object.entries(stats.directionTypeStats).map(([type, typeStats]) => ({
    type,
    accuracy: typeStats.total > 0 ? typeStats.correct / typeStats.total : 0,
    sessions: typeStats.sessions || 0,
    preference: typeStats.sessions || 0
  }));

  const favoriteType = typePerformances.reduce((prev, current) =>
    current.preference > prev.preference ? current : prev,
    typePerformances[0]
  )?.type || stats.favoriteDirectionType || 'cardinal';

  return {
    favoriteType,
    typePerformances
  };
}

// ==================== 长度模式分析 ====================

/**
 * 分析长度听写模式表现
 */
export function analyzeLengthMode(userData: UserData): ModePerformanceAnalysis {
  const stats = userData.lengthDictationStats;

  if (!stats || stats.totalSessions === 0) {
    return {
      mode: 'length',
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      accuracy: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      recentAccuracy: 0,
      improvementTrend: 'stable',
      lastPlayDate: undefined,
      experienceGained: 0
    };
  }

  const accuracy = stats.totalQuestions > 0 ? stats.totalCorrect / stats.totalQuestions : 0;
  const recentAccuracy = calculateRecentAccuracy(stats);
  const trend = calculateTrend(recentAccuracy, stats.averageAccuracy);
  const experienceGained = estimateExperienceGained(stats);

  return {
    mode: 'length',
    totalSessions: stats.totalSessions,
    totalQuestions: stats.totalQuestions,
    totalCorrect: stats.totalCorrect,
    accuracy,
    averageAccuracy: stats.averageAccuracy,
    bestAccuracy: stats.bestAccuracy,
    recentAccuracy,
    improvementTrend: trend,
    lastPlayDate: stats.lastPlayDate,
    experienceGained
  };
}

/**
 * 分析长度单位偏好和表现
 */
export function analyzeLengthUnitPerformance(stats: LengthDictationStats): {
  favoriteUnit: string;
  unitPerformances: Array<{
    unit: string;
    accuracy: number;
    sessions: number;
    preference: number;
  }>;
} {
  if (!stats.unitStats) {
    return {
      favoriteUnit: stats.favoriteUnit || '米',
      unitPerformances: []
    };
  }

  const unitPerformances = Object.entries(stats.unitStats).map(([unit, unitStats]) => ({
    unit,
    accuracy: unitStats.total > 0 ? unitStats.correct / unitStats.total : 0,
    sessions: unitStats.sessions || 0,
    preference: unitStats.sessions || 0
  }));

  const favoriteUnit = unitPerformances.reduce((prev, current) =>
    current.preference > prev.preference ? current : prev,
    unitPerformances[0]
  )?.unit || stats.favoriteUnit || '米';

  return {
    favoriteUnit,
    unitPerformances
  };
}

// ==================== 综合分析函数 ====================

/**
 * 获取所有新模式的表现分析
 */
export function analyzeAllNewModes(userData: UserData): {
  timeAnalysis: ModePerformanceAnalysis;
  directionAnalysis: ModePerformanceAnalysis;
  lengthAnalysis: ModePerformanceAnalysis;
} {
  return {
    timeAnalysis: analyzeTimeMode(userData),
    directionAnalysis: analyzeDirectionMode(userData),
    lengthAnalysis: analyzeLengthMode(userData)
  };
}

// ==================== 模式比较和评估 ====================

/**
 * 比较不同模式的表现，识别强项和弱项
 */
export function compareModePerformances(analyses: {
  timeAnalysis: ModePerformanceAnalysis;
  directionAnalysis: ModePerformanceAnalysis;
  lengthAnalysis: ModePerformanceAnalysis;
}): {
  strongestMode: 'time' | 'direction' | 'length';
  weakestMode: 'time' | 'direction' | 'length';
  modeRankings: Array<{
    mode: 'time' | 'direction' | 'length';
    score: number;
    accuracy: number;
    sessions: number;
  }>;
} {
  const { timeAnalysis, directionAnalysis, lengthAnalysis } = analyses;

  // 计算每个模式的综合评分
  const calculateModeScore = (analysis: ModePerformanceAnalysis): number => {
    if (analysis.totalSessions === 0) return 0;

    // 综合评分考虑准确率、会话数和改进趋势
    let score = analysis.accuracy * 100; // 基础分数

    // 会话数奖励（鼓励多练习）
    const sessionBonus = Math.min(analysis.totalSessions * 2, 20);
    score += sessionBonus;

    // 改进趋势奖励
    if (analysis.improvementTrend === 'improving') score += 10;
    else if (analysis.improvementTrend === 'declining') score -= 10;

    // 最佳准确率奖励
    if (analysis.bestAccuracy > 0.9) score += 5;

    return Math.max(0, score);
  };

  const modeRankings = [
    {
      mode: 'time' as const,
      score: calculateModeScore(timeAnalysis),
      accuracy: timeAnalysis.accuracy,
      sessions: timeAnalysis.totalSessions
    },
    {
      mode: 'direction' as const,
      score: calculateModeScore(directionAnalysis),
      accuracy: directionAnalysis.accuracy,
      sessions: directionAnalysis.totalSessions
    },
    {
      mode: 'length' as const,
      score: calculateModeScore(lengthAnalysis),
      accuracy: lengthAnalysis.accuracy,
      sessions: lengthAnalysis.totalSessions
    }
  ].sort((a, b) => b.score - a.score);

  return {
    strongestMode: modeRankings[0].mode,
    weakestMode: modeRankings[modeRankings.length - 1].mode,
    modeRankings
  };
}

/**
 * 计算模式间的平衡分数
 */
export function calculateBalanceScore(analyses: {
  timeAnalysis: ModePerformanceAnalysis;
  directionAnalysis: ModePerformanceAnalysis;
  lengthAnalysis: ModePerformanceAnalysis;
}): number {
  const { timeAnalysis, directionAnalysis, lengthAnalysis } = analyses;

  const accuracies = [
    timeAnalysis.accuracy,
    directionAnalysis.accuracy,
    lengthAnalysis.accuracy
  ];

  const sessions = [
    timeAnalysis.totalSessions,
    directionAnalysis.totalSessions,
    lengthAnalysis.totalSessions
  ];

  // 计算准确率的标准差（越小越平衡）
  const avgAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
  const accuracyVariance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - avgAccuracy, 2), 0) / accuracies.length;
  const accuracyStdDev = Math.sqrt(accuracyVariance);

  // 计算会话数的平衡性
  const totalSessions = sessions.reduce((sum, s) => sum + s, 0);
  if (totalSessions === 0) return 0;

  const sessionBalance = 1 - (Math.max(...sessions) - Math.min(...sessions)) / totalSessions;

  // 综合平衡分数（0-100）
  const accuracyBalance = Math.max(0, 1 - accuracyStdDev * 2); // 标准差越小，平衡性越好
  const overallBalance = (accuracyBalance * 0.6 + sessionBalance * 0.4) * 100;

  return Math.round(Math.max(0, Math.min(100, overallBalance)));
}

/**
 * 计算练习多样性分数
 */
export function calculateDiversityScore(analyses: {
  timeAnalysis: ModePerformanceAnalysis;
  directionAnalysis: ModePerformanceAnalysis;
  lengthAnalysis: ModePerformanceAnalysis;
}): number {
  const { timeAnalysis, directionAnalysis, lengthAnalysis } = analyses;

  // 计算有练习记录的模式数量
  const activeModes = [timeAnalysis, directionAnalysis, lengthAnalysis]
    .filter(analysis => analysis.totalSessions > 0).length;

  // 基础多样性分数
  let diversityScore = (activeModes / 3) * 60; // 最多60分

  // 会话分布奖励
  const totalSessions = timeAnalysis.totalSessions + directionAnalysis.totalSessions + lengthAnalysis.totalSessions;
  if (totalSessions > 0) {
    const sessionDistribution = [
      timeAnalysis.totalSessions / totalSessions,
      directionAnalysis.totalSessions / totalSessions,
      lengthAnalysis.totalSessions / totalSessions
    ];

    // 计算分布的均匀程度
    const idealDistribution = 1 / 3;
    const distributionVariance = sessionDistribution.reduce(
      (sum, dist) => sum + Math.pow(dist - idealDistribution, 2), 0
    ) / sessionDistribution.length;

    const distributionBonus = Math.max(0, 40 - distributionVariance * 1000); // 最多40分
    diversityScore += distributionBonus;
  }

  return Math.round(Math.max(0, Math.min(100, diversityScore)));
}
