/**
 * 跨模式学习进度分析 (8.2新增)
 * 分析用户在不同模式间的学习模式，识别强项和弱项，提供模式切换建议
 */

import type {
  CrossModeAnalysis,
  ModePerformanceAnalysis,
  UserData
} from '../../types/user.types';

import {
  analyzeAllNewModes,
  calculateBalanceScore,
  calculateDiversityScore,
  compareModePerformances
} from './mode-analysis';

// ==================== 跨模式分析主函数 ====================

/**
 * 执行完整的跨模式分析
 */
export function performCrossModeAnalysis(userData: UserData): CrossModeAnalysis {
  // 获取所有模式的分析结果
  const modeAnalyses = analyzeAllNewModes(userData);
  const { timeAnalysis, directionAnalysis, lengthAnalysis } = modeAnalyses;

  // 比较模式表现
  const comparison = compareModePerformances(modeAnalyses);

  // 计算平衡和多样性分数
  const balanceScore = calculateBalanceScore(modeAnalyses);
  const diversityScore = calculateDiversityScore(modeAnalyses);

  // 评估整体进度
  const overallProgress = evaluateOverallProgress([timeAnalysis, directionAnalysis, lengthAnalysis]);

  // 推荐重点练习模式
  const recommendedFocusMode = recommendFocusMode(comparison, balanceScore);

  return {
    strongestMode: comparison.strongestMode,
    weakestMode: comparison.weakestMode,
    modePerformances: [timeAnalysis, directionAnalysis, lengthAnalysis],
    overallProgress,
    balanceScore,
    recommendedFocusMode,
    diversityScore
  };
}

// ==================== 辅助分析函数 ====================

/**
 * 评估整体学习进度
 */
function evaluateOverallProgress(
  analyses: ModePerformanceAnalysis[]
): 'excellent' | 'good' | 'average' | 'needs_improvement' {
  const activeAnalyses = analyses.filter(analysis => analysis.totalSessions > 0);

  if (activeAnalyses.length === 0) {
    return 'needs_improvement';
  }

  // 计算平均准确率
  const avgAccuracy = activeAnalyses.reduce((sum, analysis) => sum + analysis.accuracy, 0) / activeAnalyses.length;

  // 计算总会话数
  const totalSessions = activeAnalyses.reduce((sum, analysis) => sum + analysis.totalSessions, 0);

  // 检查改进趋势
  const improvingCount = activeAnalyses.filter(analysis => analysis.improvementTrend === 'improving').length;
  const decliningCount = activeAnalyses.filter(analysis => analysis.improvementTrend === 'declining').length;

  // 综合评估
  let score = 0;

  // 准确率评分 (0-40分)
  if (avgAccuracy >= 0.9) score += 40;
  else if (avgAccuracy >= 0.8) score += 30;
  else if (avgAccuracy >= 0.7) score += 20;
  else if (avgAccuracy >= 0.6) score += 10;

  // 活跃度评分 (0-30分)
  if (totalSessions >= 50) score += 30;
  else if (totalSessions >= 30) score += 25;
  else if (totalSessions >= 15) score += 20;
  else if (totalSessions >= 5) score += 10;

  // 趋势评分 (0-30分)
  if (improvingCount > decliningCount) score += 30;
  else if (improvingCount === decliningCount) score += 15;

  // 根据总分判断等级
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'average';
  return 'needs_improvement';
}

/**
 * 推荐重点练习模式
 */
function recommendFocusMode(
  comparison: {
    strongestMode: 'time' | 'direction' | 'length';
    weakestMode: 'time' | 'direction' | 'length';
    modeRankings: Array<{
      mode: 'time' | 'direction' | 'length';
      score: number;
      accuracy: number;
      sessions: number;
    }>;
  },
  balanceScore: number
): 'time' | 'direction' | 'length' | undefined {
  const { modeRankings, weakestMode } = comparison;

  // 如果平衡分数很低，推荐最弱的模式
  if (balanceScore < 40) {
    return weakestMode;
  }

  // 如果有模式完全没有练习过，推荐该模式
  const untriedMode = modeRankings.find(ranking => ranking.sessions === 0);
  if (untriedMode) {
    return untriedMode.mode;
  }

  // 如果有模式会话数明显偏少，推荐该模式
  const totalSessions = modeRankings.reduce((sum, ranking) => sum + ranking.sessions, 0);
  const avgSessions = totalSessions / modeRankings.length;
  const underPracticedMode = modeRankings.find(ranking => ranking.sessions < avgSessions * 0.5);
  if (underPracticedMode) {
    return underPracticedMode.mode;
  }

  // 如果准确率有明显差距，推荐准确率最低的模式
  const accuracyGap = modeRankings[0].accuracy - modeRankings[modeRankings.length - 1].accuracy;
  if (accuracyGap > 0.2) { // 20%以上的差距
    return weakestMode;
  }

  // 否则不特别推荐某个模式
  return undefined;
}

// ==================== 学习模式识别 ====================

/**
 * 识别用户的学习模式和偏好
 */
export function identifyLearningPatterns(userData: UserData): {
  preferredModes: ('time' | 'direction' | 'length')[];
  learningStyle: 'balanced' | 'focused' | 'explorer' | 'beginner';
  consistencyLevel: 'high' | 'medium' | 'low';
  challengePreference: 'comfort_zone' | 'moderate_challenge' | 'high_challenge';
} {
  const modeAnalyses = analyzeAllNewModes(userData);
  const { timeAnalysis, directionAnalysis, lengthAnalysis } = modeAnalyses;

  // 识别偏好模式（按会话数排序）
  const modesByPreference = [
    { mode: 'time' as const, sessions: timeAnalysis.totalSessions },
    { mode: 'direction' as const, sessions: directionAnalysis.totalSessions },
    { mode: 'length' as const, sessions: lengthAnalysis.totalSessions }
  ]
    .filter(item => item.sessions > 0)
    .sort((a, b) => b.sessions - a.sessions)
    .map(item => item.mode);

  // 识别学习风格
  const activeModes = modesByPreference.length;
  const totalSessions = timeAnalysis.totalSessions + directionAnalysis.totalSessions + lengthAnalysis.totalSessions;

  let learningStyle: 'balanced' | 'focused' | 'explorer' | 'beginner';
  if (totalSessions < 5) {
    learningStyle = 'beginner';
  } else if (activeModes === 3) {
    const balanceScore = calculateBalanceScore(modeAnalyses);
    learningStyle = balanceScore > 60 ? 'balanced' : 'explorer';
  } else if (activeModes === 1) {
    learningStyle = 'focused';
  } else {
    learningStyle = 'explorer';
  }

  // 评估一致性水平
  const recentActivity = evaluateRecentActivity(userData);
  let consistencyLevel: 'high' | 'medium' | 'low';
  if (recentActivity.daysActive >= 7) consistencyLevel = 'high';
  else if (recentActivity.daysActive >= 3) consistencyLevel = 'medium';
  else consistencyLevel = 'low';

  // 评估挑战偏好
  const avgAccuracy = [timeAnalysis, directionAnalysis, lengthAnalysis]
    .filter(analysis => analysis.totalSessions > 0)
    .reduce((sum, analysis) => sum + analysis.accuracy, 0) / activeModes;

  let challengePreference: 'comfort_zone' | 'moderate_challenge' | 'high_challenge';
  if (avgAccuracy > 0.9) challengePreference = 'comfort_zone';
  else if (avgAccuracy > 0.7) challengePreference = 'moderate_challenge';
  else challengePreference = 'high_challenge';

  return {
    preferredModes: modesByPreference,
    learningStyle,
    consistencyLevel,
    challengePreference
  };
}

/**
 * 评估最近的活动情况
 */
function evaluateRecentActivity(userData: UserData): {
  daysActive: number;
  lastActiveDate: string | null;
  activityTrend: 'increasing' | 'stable' | 'decreasing';
} {
  // 简化实现，实际中可以基于详细的会话记录
  const today = new Date().toDateString();
  const lastActiveDate = userData.lastActiveDate || null;

  let daysActive = 0;
  if (lastActiveDate === today) {
    daysActive = userData.todaySessions > 0 ? 1 : 0;
  }

  // 基于总会话数估算活跃天数（简化）
  const totalSessions = userData.totalSessions;
  if (totalSessions > 0) {
    daysActive = Math.min(totalSessions, 30); // 假设最多30天活跃
  }

  return {
    daysActive,
    lastActiveDate,
    activityTrend: 'stable' // 简化实现
  };
}

// ==================== 模式切换建议 ====================

/**
 * 生成模式切换建议
 */
export function generateModeSwitchRecommendations(
  crossModeAnalysis: CrossModeAnalysis,
  learningPatterns: ReturnType<typeof identifyLearningPatterns>
): string[] {
  const recommendations: string[] = [];

  const { strongestMode, weakestMode, balanceScore, diversityScore } = crossModeAnalysis;
  const { learningStyle, challengePreference } = learningPatterns;

  // 基于学习风格的建议
  if (learningStyle === 'focused' && diversityScore < 40) {
    recommendations.push(`尝试练习其他模式以提高学习多样性，建议从${weakestMode === 'time' ? '时间听写' : weakestMode === 'direction' ? '方位听写' : '长度听写'}开始`);
  }

  if (learningStyle === 'balanced' && balanceScore > 80) {
    recommendations.push('保持当前的平衡练习模式，可以适当增加挑战难度');
  }

  if (learningStyle === 'explorer' && balanceScore < 50) {
    recommendations.push(`建议更多练习${weakestMode === 'time' ? '时间听写' : weakestMode === 'direction' ? '方位听写' : '长度听写'}以提高整体平衡性`);
  }

  // 基于表现差距的建议
  const strongestPerformance = crossModeAnalysis.modePerformances.find(p => p.mode === strongestMode);
  const weakestPerformance = crossModeAnalysis.modePerformances.find(p => p.mode === weakestMode);

  if (strongestPerformance && weakestPerformance) {
    const accuracyGap = strongestPerformance.accuracy - weakestPerformance.accuracy;
    if (accuracyGap > 0.3) {
      recommendations.push(`${strongestMode === 'time' ? '时间听写' : strongestMode === 'direction' ? '方位听写' : '长度听写'}表现优秀，可以尝试更高难度；同时加强${weakestMode === 'time' ? '时间听写' : weakestMode === 'direction' ? '方位听写' : '长度听写'}练习`);
    }
  }

  // 基于挑战偏好的建议
  if (challengePreference === 'comfort_zone') {
    recommendations.push('当前表现稳定，建议尝试更具挑战性的练习内容');
  } else if (challengePreference === 'high_challenge') {
    recommendations.push('建议适当降低难度，巩固基础后再挑战更高难度');
  }

  return recommendations;
}
