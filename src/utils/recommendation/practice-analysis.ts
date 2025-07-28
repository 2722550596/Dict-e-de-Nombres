/**
 * 练习频率和效果统计分析 (8.2新增)
 * 分析用户练习习惯，评估不同时间段的练习效果，提供最佳练习时机建议
 */

import type {
  PracticeAnalysis,
  UserData
} from '../../types/user.types';

// ==================== 练习分析主函数 ====================

/**
 * 执行完整的练习分析
 */
export function analyzePracticePatterns(userData: UserData): PracticeAnalysis {
  // 计算日均练习时间
  const dailyAverageMinutes = calculateDailyAverageMinutes(userData);

  // 计算周练习频率
  const weeklyFrequency = calculateWeeklyFrequency(userData);

  // 分析最佳练习时间
  const bestPerformanceTimeOfDay = analyzeBestPerformanceTime(userData);

  // 计算一致性评分
  const consistencyScore = calculateConsistencyScore(userData);

  // 计算效果评分
  const effectivenessScore = calculateEffectivenessScore(userData);

  // 生成频率建议
  const recommendedFrequency = generateFrequencyRecommendation(userData, consistencyScore);

  // 生成时长建议
  const recommendedDuration = generateDurationRecommendation(userData, effectivenessScore);

  // 生成最佳时间建议
  const optimalPracticeTime = generateOptimalTimeRecommendation(bestPerformanceTimeOfDay, userData);

  return {
    dailyAverageMinutes,
    weeklyFrequency,
    bestPerformanceTimeOfDay,
    consistencyScore,
    effectivenessScore,
    recommendedFrequency,
    recommendedDuration,
    optimalPracticeTime
  };
}

// ==================== 计算函数 ====================

/**
 * 计算日均练习时间（分钟）
 */
function calculateDailyAverageMinutes(userData: UserData): number {
  // 基于总会话数和平均会话时长估算
  const totalSessions = userData.totalSessions;

  if (totalSessions === 0) return 0;

  // 估算平均会话时长（基于题目数量）
  const avgQuestionsPerSession = userData.totalQuestions / totalSessions;
  const estimatedMinutesPerQuestion = 0.5; // 假设每题30秒
  const avgSessionMinutes = avgQuestionsPerSession * estimatedMinutesPerQuestion;

  // 估算活跃天数
  const activeDays = Math.max(1, estimateActiveDays(userData));

  // 计算日均时间
  const totalMinutes = totalSessions * avgSessionMinutes;
  return Math.round(totalMinutes / activeDays);
}

/**
 * 计算周练习频率
 */
function calculateWeeklyFrequency(userData: UserData): number {
  const activeDays = estimateActiveDays(userData);
  const weeks = Math.max(1, activeDays / 7);

  return Math.round(userData.totalSessions / weeks);
}

/**
 * 估算活跃天数
 */
function estimateActiveDays(userData: UserData): number {
  // 基于总会话数估算（假设用户不会每天练习很多次）
  const maxSessionsPerDay = 5;
  const estimatedDays = Math.ceil(userData.totalSessions / maxSessionsPerDay);

  // 限制在合理范围内（最多365天）
  return Math.min(estimatedDays, 365);
}

/**
 * 分析最佳练习时间
 */
function analyzeBestPerformanceTime(userData: UserData): 'morning' | 'afternoon' | 'evening' | 'night' | undefined {
  // 简化实现：基于用户的整体表现模式
  // 实际实现中应该基于详细的时间戳数据

  const accuracy = userData.totalQuestions > 0 ? userData.totalCorrect / userData.totalQuestions : 0;

  // 基于准确率模式推测最佳时间
  if (accuracy > 0.9) {
    return 'morning'; // 高准确率用户通常在上午表现更好
  } else if (accuracy > 0.7) {
    return 'afternoon'; // 中等准确率用户在下午较好
  } else if (accuracy > 0.5) {
    return 'evening'; // 较低准确率用户可能在晚上更专注
  }

  return undefined; // 数据不足
}

/**
 * 计算一致性评分
 */
function calculateConsistencyScore(userData: UserData): number {
  if (userData.totalSessions === 0) return 0;

  let score = 0;

  // 基于总会话数评分（0-40分）
  if (userData.totalSessions >= 50) score += 40;
  else if (userData.totalSessions >= 30) score += 30;
  else if (userData.totalSessions >= 15) score += 20;
  else if (userData.totalSessions >= 5) score += 10;

  // 基于今日练习评分（0-20分）
  if (userData.todaySessions > 0) score += 20;

  // 基于最近活跃度评分（0-20分）
  const today = new Date().toDateString();
  if (userData.lastActiveDate === today) score += 20;
  else if (userData.lastActiveDate) {
    const lastActive = new Date(userData.lastActiveDate);
    const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceActive <= 1) score += 15;
    else if (daysSinceActive <= 3) score += 10;
    else if (daysSinceActive <= 7) score += 5;
  }

  // 基于练习频率评分（0-20分）
  const activeDays = estimateActiveDays(userData);
  const avgSessionsPerDay = userData.totalSessions / activeDays;
  if (avgSessionsPerDay >= 2) score += 20;
  else if (avgSessionsPerDay >= 1) score += 15;
  else if (avgSessionsPerDay >= 0.5) score += 10;
  else if (avgSessionsPerDay >= 0.2) score += 5;

  return Math.min(100, score);
}

/**
 * 计算效果评分
 */
function calculateEffectivenessScore(userData: UserData): number {
  if (userData.totalQuestions === 0) return 0;

  let score = 0;

  // 基于准确率评分（0-50分）
  const accuracy = userData.totalCorrect / userData.totalQuestions;
  score += accuracy * 50;

  // 基于经验获得评分（0-25分）
  const avgExpPerSession = userData.totalSessions > 0 ? userData.experience / userData.totalSessions : 0;
  if (avgExpPerSession >= 100) score += 25;
  else if (avgExpPerSession >= 75) score += 20;
  else if (avgExpPerSession >= 50) score += 15;
  else if (avgExpPerSession >= 25) score += 10;
  else if (avgExpPerSession > 0) score += 5;

  // 基于连击记录评分（0-15分）
  if (userData.maxStreak >= 20) score += 15;
  else if (userData.maxStreak >= 15) score += 12;
  else if (userData.maxStreak >= 10) score += 9;
  else if (userData.maxStreak >= 5) score += 6;
  else if (userData.maxStreak > 0) score += 3;

  // 基于等级进步评分（0-10分）
  if (userData.level >= 10) score += 10;
  else if (userData.level >= 5) score += 7;
  else if (userData.level >= 3) score += 5;
  else if (userData.level >= 2) score += 3;

  return Math.min(100, Math.round(score));
}

// ==================== 建议生成函数 ====================

/**
 * 生成频率建议
 */
function generateFrequencyRecommendation(userData: UserData, consistencyScore: number): string {
  const weeklyFrequency = calculateWeeklyFrequency(userData);

  if (consistencyScore >= 80) {
    return '保持当前练习频率，表现优秀';
  } else if (consistencyScore >= 60) {
    return '建议每周练习4-5次，保持学习动力';
  } else if (consistencyScore >= 40) {
    return '建议每周练习3-4次，逐步建立习惯';
  } else if (weeklyFrequency < 2) {
    return '建议每周至少练习2-3次，建立基础习惯';
  } else {
    return '建议保持规律练习，每周2-3次即可';
  }
}

/**
 * 生成时长建议
 */
function generateDurationRecommendation(userData: UserData, effectivenessScore: number): string {
  const dailyMinutes = calculateDailyAverageMinutes(userData);

  if (effectivenessScore >= 80) {
    if (dailyMinutes < 10) {
      return '可以适当延长练习时间至15-20分钟';
    } else {
      return '保持当前练习时长，效果很好';
    }
  } else if (effectivenessScore >= 60) {
    return '建议每次练习10-15分钟，保持专注度';
  } else if (effectivenessScore >= 40) {
    return '建议每次练习5-10分钟，重质量而非数量';
  } else {
    return '建议从每次5分钟开始，逐步增加练习时间';
  }
}

/**
 * 生成最佳时间建议
 */
function generateOptimalTimeRecommendation(
  bestTime: 'morning' | 'afternoon' | 'evening' | 'night' | undefined,
  _userData: UserData
): string {
  if (!bestTime) {
    return '建议尝试不同时间段练习，找到最适合的时间';
  }

  const timeDescriptions = {
    morning: '上午（9-11点）',
    afternoon: '下午（2-4点）',
    evening: '晚上（7-9点）',
    night: '深夜（9点后）'
  };

  const timeAdvice = {
    morning: '上午精神状态最佳，适合挑战性练习',
    afternoon: '下午注意力集中，适合常规练习',
    evening: '晚上相对放松，适合复习巩固',
    night: '深夜安静专注，适合深度学习'
  };

  return `建议在${timeDescriptions[bestTime]}练习，${timeAdvice[bestTime]}`;
}

// ==================== 练习效果趋势分析 ====================

/**
 * 分析练习效果趋势
 */
export function analyzePracticeEffectiveness(userData: UserData): {
  overallTrend: 'improving' | 'stable' | 'declining';
  strengthAreas: string[];
  improvementAreas: string[];
  recommendations: string[];
} {
  const accuracy = userData.totalQuestions > 0 ? userData.totalCorrect / userData.totalQuestions : 0;
  const practiceAnalysis = analyzePracticePatterns(userData);

  // 判断整体趋势（简化实现）
  let overallTrend: 'improving' | 'stable' | 'declining';
  if (practiceAnalysis.effectivenessScore >= 70) {
    overallTrend = 'improving';
  } else if (practiceAnalysis.effectivenessScore >= 50) {
    overallTrend = 'stable';
  } else {
    overallTrend = 'declining';
  }

  // 识别优势领域
  const strengthAreas: string[] = [];
  if (accuracy > 0.8) strengthAreas.push('答题准确率');
  if (userData.maxStreak >= 10) strengthAreas.push('连续答对能力');
  if (practiceAnalysis.consistencyScore >= 70) strengthAreas.push('练习一致性');
  if (userData.level >= 5) strengthAreas.push('整体水平');

  // 识别改进领域
  const improvementAreas: string[] = [];
  if (accuracy < 0.6) improvementAreas.push('答题准确率');
  if (userData.maxStreak < 5) improvementAreas.push('连续答对能力');
  if (practiceAnalysis.consistencyScore < 50) improvementAreas.push('练习规律性');
  if (practiceAnalysis.effectivenessScore < 60) improvementAreas.push('练习效果');

  // 生成建议
  const recommendations: string[] = [];
  if (overallTrend === 'declining') {
    recommendations.push('建议回顾基础内容，巩固已学知识');
    recommendations.push('适当降低练习难度，重建信心');
  } else if (overallTrend === 'stable') {
    recommendations.push('尝试增加练习挑战性，突破瓶颈');
    recommendations.push('保持当前练习节奏，稳步提升');
  } else {
    recommendations.push('保持良好的学习势头');
    recommendations.push('可以尝试更高难度的挑战');
  }

  return {
    overallTrend,
    strengthAreas,
    improvementAreas,
    recommendations
  };
}
