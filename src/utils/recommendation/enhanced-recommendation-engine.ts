/**
 * 增强推荐引擎 (8.2新增)
 * 集成所有推荐算法，提供统一的推荐接口
 */

import type {
  EnhancedRecommendationResult,
  RecommendationResult,
  UserData
} from '../../types/user.types';

import { identifyLearningPatterns, performCrossModeAnalysis } from './cross-mode-analysis';
import { generateDifficultyRecommendations } from './difficulty-recommendation';
import { analyzePracticePatterns } from './practice-analysis';

// ==================== 主要推荐引擎 ====================

/**
 * 生成完整的增强推荐结果
 */
export async function generateEnhancedRecommendation(userData: UserData): Promise<EnhancedRecommendationResult> {
  try {
    // 执行跨模式分析
    const crossModeAnalysis = performCrossModeAnalysis(userData);

    // 生成难度推荐
    const difficultyRecommendations = generateDifficultyRecommendations(userData);

    // 分析练习模式
    const practiceAnalysis = analyzePracticePatterns(userData);

    // 识别学习模式
    const learningPatterns = identifyLearningPatterns(userData);

    // 生成基础推荐（兼容现有系统）
    const primaryRecommendation = generatePrimaryRecommendation(userData, crossModeAnalysis);

    // 生成具体建议
    const suggestions = generateComprehensiveSuggestions(
      userData,
      crossModeAnalysis,
      difficultyRecommendations,
      practiceAnalysis,
      learningPatterns
    );

    // 评估数据质量
    const dataQuality = assessDataQuality(userData);

    return {
      primaryRecommendation,
      crossModeAnalysis,
      difficultyRecommendations,
      practiceAnalysis,
      suggestions,
      generatedAt: new Date().toISOString(),
      dataQuality,
      recommendationVersion: '8.2.0'
    };
  } catch (error) {
    console.error('Enhanced recommendation generation failed:', error);

    // 降级到基础推荐
    return generateFallbackRecommendation(userData);
  }
}

// ==================== 辅助函数 ====================

/**
 * 生成主要推荐（兼容现有系统）
 */
function generatePrimaryRecommendation(_userData: UserData, crossModeAnalysis: any): RecommendationResult {
  const { weakestMode, overallProgress } = crossModeAnalysis;

  // 基于跨模式分析生成主要建议
  let text = '';
  let recommendedRange = '';
  let difficulty = '';
  let reason = '';

  if (overallProgress === 'excellent') {
    text = '各模式表现优秀，建议尝试更高难度或混合练习';
    recommendedRange = 'advanced';
    difficulty = 'advanced';
    reason = '整体表现优秀，可以接受更大挑战';
  } else if (overallProgress === 'good') {
    text = `表现良好，建议重点练习${getModeDisplayName(weakestMode)}模式`;
    recommendedRange = 'intermediate';
    difficulty = 'intermediate';
    reason = '整体表现良好，需要平衡发展';
  } else if (overallProgress === 'average') {
    text = `建议加强${getModeDisplayName(weakestMode)}模式练习，提高整体水平`;
    recommendedRange = 'basic';
    difficulty = 'beginner';
    reason = '需要巩固基础，提高薄弱环节';
  } else {
    text = '建议从基础开始，逐步建立各模式的练习习惯';
    recommendedRange = 'basic';
    difficulty = 'beginner';
    reason = '需要建立基础练习习惯';
  }

  return {
    text,
    recommendedRange,
    difficulty,
    reason
  };
}

/**
 * 生成综合建议
 */
function generateComprehensiveSuggestions(
  _userData: UserData,
  crossModeAnalysis: any,
  difficultyRecommendations: any[],
  practiceAnalysis: any,
  learningPatterns: any
): {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
} {
  const immediate: string[] = [];
  const shortTerm: string[] = [];
  const longTerm: string[] = [];

  // 立即行动建议
  if (practiceAnalysis.consistencyScore < 50) {
    immediate.push('建立规律的练习习惯，每天至少练习5分钟');
  }

  if (crossModeAnalysis.diversityScore < 40) {
    immediate.push(`尝试${getModeDisplayName(crossModeAnalysis.weakestMode)}模式练习`);
  }

  if (practiceAnalysis.effectivenessScore < 60) {
    immediate.push('专注于提高答题准确率，而非练习数量');
  }

  // 短期目标建议
  const weakDifficultyRec = difficultyRecommendations.find(rec =>
    rec.mode === crossModeAnalysis.weakestMode
  );
  if (weakDifficultyRec) {
    shortTerm.push(`在${getModeDisplayName(weakDifficultyRec.mode)}模式中达到${weakDifficultyRec.nextMilestone}`);
  }

  if (crossModeAnalysis.balanceScore < 60) {
    shortTerm.push('平衡各模式练习时间，提高整体均衡性');
  }

  if (practiceAnalysis.optimalPracticeTime) {
    shortTerm.push(`在${practiceAnalysis.optimalPracticeTime}进行练习以获得最佳效果`);
  }

  // 长期目标建议
  if (learningPatterns.learningStyle === 'focused') {
    longTerm.push('逐步扩展到其他模式，成为全能型学习者');
  } else if (learningPatterns.learningStyle === 'explorer') {
    longTerm.push('在保持多样性的同时，深化某个专长模式');
  }

  longTerm.push('达到所有模式的高级水平，成为专家级用户');

  if (crossModeAnalysis.overallProgress !== 'excellent') {
    longTerm.push('建立长期学习计划，持续提升各项技能');
  }

  return { immediate, shortTerm, longTerm };
}

/**
 * 评估数据质量
 */
function assessDataQuality(userData: UserData): 'excellent' | 'good' | 'limited' | 'insufficient' {
  const totalSessions = userData.totalSessions;
  const totalQuestions = userData.totalQuestions;

  // 检查新模式数据
  const hasNewModeData = Boolean(
    userData.timeDictationStats?.totalSessions ||
    userData.directionDictationStats?.totalSessions ||
    userData.lengthDictationStats?.totalSessions
  );

  if (totalSessions >= 20 && totalQuestions >= 100 && hasNewModeData) {
    return 'excellent';
  } else if (totalSessions >= 10 && totalQuestions >= 50) {
    return 'good';
  } else if (totalSessions >= 3 && totalQuestions >= 10) {
    return 'limited';
  } else {
    return 'insufficient';
  }
}

/**
 * 生成降级推荐（错误处理）
 */
function generateFallbackRecommendation(userData: UserData): EnhancedRecommendationResult {
  const accuracy = userData.totalQuestions > 0 ? userData.totalCorrect / userData.totalQuestions : 0;

  return {
    primaryRecommendation: {
      text: '继续练习以提高技能水平',
      recommendedRange: accuracy > 0.7 ? 'intermediate' : 'basic',
      difficulty: accuracy > 0.7 ? 'intermediate' : 'beginner',
      reason: '基于当前表现的基础建议'
    },
    crossModeAnalysis: {
      strongestMode: 'time',
      weakestMode: 'length',
      modePerformances: [],
      overallProgress: 'average',
      balanceScore: 50,
      diversityScore: 30
    },
    difficultyRecommendations: [],
    practiceAnalysis: {
      dailyAverageMinutes: 10,
      weeklyFrequency: 3,
      consistencyScore: 50,
      effectivenessScore: 50,
      recommendedFrequency: '每周3-4次',
      recommendedDuration: '每次10-15分钟'
    },
    suggestions: {
      immediate: ['建立规律练习习惯'],
      shortTerm: ['提高练习一致性'],
      longTerm: ['成为全能型学习者']
    },
    generatedAt: new Date().toISOString(),
    dataQuality: 'insufficient',
    recommendationVersion: '8.2.0-fallback'
  };
}

/**
 * 获取模式显示名称
 */
function getModeDisplayName(mode: 'time' | 'direction' | 'length'): string {
  const names = {
    time: '时间听写',
    direction: '方位听写',
    length: '长度听写'
  };
  return names[mode];
}

// ==================== 推荐缓存和优化 ====================

/**
 * 推荐结果缓存
 */
const recommendationCache = new Map<string, {
  result: EnhancedRecommendationResult;
  timestamp: number;
}>();

/**
 * 获取缓存的推荐结果
 */
export function getCachedRecommendation(userDataHash: string): EnhancedRecommendationResult | null {
  const cached = recommendationCache.get(userDataHash);
  if (!cached) return null;

  // 缓存有效期：1小时
  const cacheValidityMs = 60 * 60 * 1000;
  if (Date.now() - cached.timestamp > cacheValidityMs) {
    recommendationCache.delete(userDataHash);
    return null;
  }

  return cached.result;
}

/**
 * 缓存推荐结果
 */
export function cacheRecommendation(userDataHash: string, result: EnhancedRecommendationResult): void {
  recommendationCache.set(userDataHash, {
    result,
    timestamp: Date.now()
  });

  // 限制缓存大小
  if (recommendationCache.size > 100) {
    const oldestKey = recommendationCache.keys().next().value;
    if (oldestKey) {
      recommendationCache.delete(oldestKey);
    }
  }
}

/**
 * 生成用户数据哈希（用于缓存键）
 */
export function generateUserDataHash(userData: UserData): string {
  const key = `${userData.totalSessions}-${userData.totalCorrect}-${userData.experience}-${userData.level}`;
  return btoa(key).slice(0, 16); // 简化的哈希
}
