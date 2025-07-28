/**
 * 个性化难度推荐逻辑 (8.2新增)
 * 基于用户历史表现推荐合适的难度，考虑学习曲线和进步速度
 */

import type {
  DifficultyRecommendation,
  ModePerformanceAnalysis,
  UserData
} from '../../types/user.types';

import { analyzeAllNewModes } from './mode-analysis';

// ==================== 难度级别定义 ====================

const DIFFICULTY_LEVELS = {
  beginner: { min: 0, max: 0.6, label: 'beginner' },
  intermediate: { min: 0.6, max: 0.8, label: 'intermediate' },
  advanced: { min: 0.8, max: 0.95, label: 'advanced' },
  expert: { min: 0.95, max: 1.0, label: 'expert' }
} as const;

// 模式特定的难度配置
const MODE_DIFFICULTY_CONFIGS = {
  time: {
    beginner: ['year-only', 'month-only'],
    intermediate: ['day-only', 'weekday-only'],
    advanced: ['full-date', 'mixed-time'],
    expert: ['complex-time', 'historical-dates']
  },
  direction: {
    beginner: ['cardinal-only'],
    intermediate: ['relative-only', 'spatial-only'],
    advanced: ['mixed-directions'],
    expert: ['complex-spatial', 'navigation-commands']
  },
  length: {
    beginner: ['metric-basic'],
    intermediate: ['metric-advanced', 'imperial-basic'],
    advanced: ['imperial-advanced', 'mixed-units'],
    expert: ['precision-measurements', 'scientific-notation']
  }
} as const;

// ==================== 主要推荐函数 ====================

/**
 * 为所有新模式生成个性化难度推荐
 */
export function generateDifficultyRecommendations(userData: UserData): DifficultyRecommendation[] {
  const modeAnalyses = analyzeAllNewModes(userData);

  return [
    generateModeSpecificRecommendation('time', modeAnalyses.timeAnalysis, userData),
    generateModeSpecificRecommendation('direction', modeAnalyses.directionAnalysis, userData),
    generateModeSpecificRecommendation('length', modeAnalyses.lengthAnalysis, userData)
  ];
}

/**
 * 为特定模式生成难度推荐
 */
function generateModeSpecificRecommendation(
  mode: 'time' | 'direction' | 'length',
  analysis: ModePerformanceAnalysis,
  userData: UserData
): DifficultyRecommendation {
  // 确定当前水平
  const currentLevel = determineCurrentLevel(analysis);

  // 推荐难度
  const recommendedDifficulty = recommendDifficulty(mode, analysis, userData);

  // 生成推荐理由
  const reason = generateRecommendationReason(analysis, currentLevel, recommendedDifficulty);

  // 计算置信度
  const confidenceScore = calculateConfidenceScore(analysis);

  // 确定下一个里程碑
  const nextMilestone = determineNextMilestone(currentLevel, analysis);

  // 估算掌握时间
  const estimatedTimeToMastery = estimateTimeToMastery(analysis, currentLevel);

  return {
    mode,
    currentLevel,
    recommendedDifficulty,
    reason,
    confidenceScore,
    nextMilestone,
    estimatedTimeToMastery
  };
}

// ==================== 辅助函数 ====================

/**
 * 确定用户当前水平
 */
function determineCurrentLevel(analysis: ModePerformanceAnalysis): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (analysis.totalSessions === 0) {
    return 'beginner';
  }

  const { accuracy, totalSessions, improvementTrend } = analysis;

  // 基于准确率的基础判断
  let level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  if (accuracy >= DIFFICULTY_LEVELS.expert.min) level = 'expert';
  else if (accuracy >= DIFFICULTY_LEVELS.advanced.min) level = 'advanced';
  else if (accuracy >= DIFFICULTY_LEVELS.intermediate.min) level = 'intermediate';
  else level = 'beginner';

  // 考虑经验因素调整
  if (totalSessions < 5) {
    // 新手期，即使准确率高也不能直接跳到高级
    if (level === 'expert') level = 'advanced';
    else if (level === 'advanced') level = 'intermediate';
  } else if (totalSessions >= 20) {
    // 有经验的用户，可以适当提升评级
    if (level === 'beginner' && accuracy > 0.5) level = 'intermediate';
  }

  // 考虑改进趋势
  if (improvementTrend === 'improving' && level !== 'expert') {
    // 正在改进的用户可以尝试更高难度
    const levels: ('beginner' | 'intermediate' | 'advanced' | 'expert')[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(level);
    if (currentIndex < levels.length - 1) {
      level = levels[currentIndex + 1];
    }
  }

  return level;
}

/**
 * 推荐合适的难度
 */
function recommendDifficulty(
  mode: 'time' | 'direction' | 'length',
  analysis: ModePerformanceAnalysis,
  _userData: UserData
): string {
  const currentLevel = determineCurrentLevel(analysis);
  const modeConfig = MODE_DIFFICULTY_CONFIGS[mode];

  // 基于当前水平选择难度
  let targetLevel = currentLevel;

  // 根据表现调整目标难度
  if (analysis.accuracy > 0.9 && analysis.totalSessions >= 5) {
    // 表现优秀，可以尝试更高难度
    const levels: ('beginner' | 'intermediate' | 'advanced' | 'expert')[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(currentLevel);
    if (currentIndex < levels.length - 1) {
      targetLevel = levels[currentIndex + 1];
    }
  } else if (analysis.accuracy < 0.6 && analysis.improvementTrend === 'declining') {
    // 表现不佳且在下降，建议降低难度
    const levels: ('beginner' | 'intermediate' | 'advanced' | 'expert')[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(currentLevel);
    if (currentIndex > 0) {
      targetLevel = levels[currentIndex - 1];
    }
  }

  // 从配置中选择具体难度
  const availableDifficulties = modeConfig[targetLevel];

  // 如果是新手，选择最简单的
  if (analysis.totalSessions < 3) {
    return availableDifficulties[0];
  }

  // 否则选择中等难度
  const middleIndex = Math.floor(availableDifficulties.length / 2);
  return availableDifficulties[middleIndex];
}

/**
 * 生成推荐理由
 */
function generateRecommendationReason(
  analysis: ModePerformanceAnalysis,
  _currentLevel: string,
  _recommendedDifficulty: string
): string {
  const { accuracy, totalSessions, improvementTrend } = analysis;

  if (totalSessions === 0) {
    return '建议从基础难度开始，逐步建立信心';
  }

  if (accuracy > 0.9) {
    return `当前准确率${Math.round(accuracy * 100)}%，表现优秀，可以尝试更具挑战性的内容`;
  }

  if (accuracy < 0.6) {
    return `当前准确率${Math.round(accuracy * 100)}%，建议巩固基础，提高准确率后再增加难度`;
  }

  if (improvementTrend === 'improving') {
    return `学习进步明显，建议适当增加难度以保持挑战性`;
  }

  if (improvementTrend === 'declining') {
    return `最近表现有所下降，建议回顾基础内容，稳定后再提升难度`;
  }

  return `基于当前${Math.round(accuracy * 100)}%的准确率，推荐继续当前难度水平的练习`;
}

/**
 * 计算推荐置信度
 */
function calculateConfidenceScore(analysis: ModePerformanceAnalysis): number {
  let confidence = 50; // 基础置信度

  // 基于会话数调整
  if (analysis.totalSessions >= 10) confidence += 30;
  else if (analysis.totalSessions >= 5) confidence += 20;
  else if (analysis.totalSessions >= 3) confidence += 10;

  // 基于准确率稳定性调整
  const accuracyDiff = Math.abs(analysis.accuracy - analysis.averageAccuracy);
  if (accuracyDiff < 0.05) confidence += 15; // 表现稳定
  else if (accuracyDiff > 0.2) confidence -= 15; // 表现不稳定

  // 基于改进趋势调整
  if (analysis.improvementTrend === 'improving') confidence += 10;
  else if (analysis.improvementTrend === 'declining') confidence -= 10;

  return Math.max(0, Math.min(100, confidence));
}

/**
 * 确定下一个里程碑
 */
function determineNextMilestone(
  currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  _analysis: ModePerformanceAnalysis
): string {
  if (currentLevel === 'expert') {
    return '保持专家水平，探索更复杂的应用场景';
  }

  const milestones = {
    beginner: '达到70%准确率，进入中级水平',
    intermediate: '达到85%准确率，进入高级水平',
    advanced: '达到95%准确率，成为专家级用户'
  };

  return milestones[currentLevel];
}

/**
 * 估算掌握时间
 */
function estimateTimeToMastery(
  analysis: ModePerformanceAnalysis,
  currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
): number {
  if (currentLevel === 'expert') {
    return 0; // 已经掌握
  }

  // 基于当前进度和改进趋势估算
  const targetAccuracy = {
    beginner: 0.7,
    intermediate: 0.85,
    advanced: 0.95
  }[currentLevel];

  const currentAccuracy = analysis.accuracy;
  const accuracyGap = targetAccuracy - currentAccuracy;

  if (accuracyGap <= 0) {
    return 7; // 一周内可以达到下一级别
  }

  // 基于改进趋势估算
  let baseTime = 14; // 基础时间2周

  if (analysis.improvementTrend === 'improving') {
    baseTime = Math.max(7, baseTime - 7); // 进步中的用户更快
  } else if (analysis.improvementTrend === 'declining') {
    baseTime += 14; // 下降中的用户需要更多时间
  }

  // 基于准确率差距调整
  const gapMultiplier = Math.max(1, accuracyGap * 5);

  return Math.round(baseTime * gapMultiplier);
}
