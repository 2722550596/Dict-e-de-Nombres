/**
 * 游戏数据管理器
 * 重构自原gameData.ts，提供更清晰的数据管理接口
 */

import { CONFIG } from '../../../config';
import { TRANSLATIONS } from '../../i18n/languages';
import type {
  NumberStats,
  RecommendationResult,
  RewardInfo,
  UserData
} from '../../types';
import { playSound } from '../audio/effects';
import { createGameLogicError, safeExecute } from '../core/errors';
import { numberStatsStorage, userDataStorage } from '../core/storage';
import { sanitizers, validateUserData } from '../core/validation';
import { MigrationSystem } from '../migrationSystem';

/**
 * 游戏数据管理器类
 */
export class GameDataManager {
  private static instance: GameDataManager;
  private userDataCache: UserData | null = null;
  private numberStatsCache: NumberStats | null = null;

  static getInstance(): GameDataManager {
    if (!GameDataManager.instance) {
      GameDataManager.instance = new GameDataManager();
    }
    return GameDataManager.instance;
  }

  /**
   * 获取当前语言的翻译
   */
  private getCurrentTranslations() {
    const currentLanguage = localStorage.getItem('selectedLanguage') || 'fr';
    return TRANSLATIONS[currentLanguage] || TRANSLATIONS.fr;
  }

  /**
   * 加载用户数据
   */
  async loadUserData(): Promise<UserData> {
    return safeExecute(async () => {
      // 检查缓存
      if (this.userDataCache) {
        return this.userDataCache;
      }

      const result = await userDataStorage.load();

      if (!result.success || !result.data) {
        throw createGameLogicError('Failed to load user data', { result });
      }

      // 检查是否需要数据迁移（8.1新增）
      if (MigrationSystem.needsMigration(result.data)) {
        console.log('Data migration required, performing migration...');
        const migrationResult = MigrationSystem.migrateAllData(result.data);

        if (migrationResult.success) {
          result.data = migrationResult.userData;
          console.log('Data migration completed successfully');
        } else {
          console.warn('Data migration failed:', migrationResult.error);
          // 继续使用原数据，但添加默认的新模式统计
          result.data = {
            ...result.data,
            timeDictationStats: result.data.timeDictationStats || {
              totalSessions: 0,
              totalCorrect: 0,
              totalQuestions: 0,
              bestAccuracy: 0,
              averageAccuracy: 0,
              favoriteTimeType: 'year',
              timeTypeStats: {},
            },
            directionDictationStats: result.data.directionDictationStats || {
              totalSessions: 0,
              totalCorrect: 0,
              totalQuestions: 0,
              bestAccuracy: 0,
              averageAccuracy: 0,
              favoriteDirectionType: 'cardinal',
              directionTypeStats: {},
            },
            lengthDictationStats: result.data.lengthDictationStats || {
              totalSessions: 0,
              totalCorrect: 0,
              totalQuestions: 0,
              bestAccuracy: 0,
              averageAccuracy: 0,
              favoriteUnit: '米',
              unitStats: {},
            },
            newModesDataVersion: 1,
          };
        }
      }

      // 验证数据
      const validation = validateUserData(result.data);
      if (!validation.isValid) {
        console.warn('User data validation failed, using sanitized data:', validation.errors);
        result.data = { ...result.data, ...sanitizers.sanitizeUserData(result.data) };
      }

      // 更新今日会话计数
      const today = new Date().toDateString();
      if (result.data.lastActiveDate !== today) {
        result.data.todaySessions = 0;
        result.data.lastActiveDate = today;
        await this.saveUserData(result.data);
      }

      this.userDataCache = result.data;
      return result.data;
    }, this.getDefaultUserData());
  }

  /**
   * 保存用户数据
   */
  async saveUserData(userData: UserData): Promise<boolean> {
    return safeExecute(async () => {
      const result = await userDataStorage.save(userData);

      if (!result.success) {
        throw createGameLogicError('Failed to save user data', { result });
      }

      // 更新缓存
      this.userDataCache = userData;

      const translations = this.getCurrentTranslations();
      console.log(translations.console.userDataSaved);

      return true;
    }, false);
  }

  /**
   * 获取默认用户数据
   */
  private getDefaultUserData(): UserData {
    return {
      ...CONFIG.GAME.DEFAULT_USER_DATA,
      lastActiveDate: new Date().toDateString(),
    };
  }

  /**
   * 加载数字统计
   */
  async loadNumberStats(): Promise<NumberStats> {
    return safeExecute(async () => {
      // 检查缓存
      if (this.numberStatsCache) {
        return this.numberStatsCache;
      }

      const result = await numberStatsStorage.load();

      if (!result.success) {
        throw createGameLogicError('Failed to load number stats', { result });
      }

      this.numberStatsCache = result.data || {};
      return this.numberStatsCache;
    }, {});
  }

  /**
   * 保存数字统计
   */
  async saveNumberStats(stats: NumberStats): Promise<boolean> {
    return safeExecute(async () => {
      const result = await numberStatsStorage.save(stats);

      if (!result.success) {
        throw createGameLogicError('Failed to save number stats', { result });
      }

      // 更新缓存
      this.numberStatsCache = stats;

      return true;
    }, false);
  }

  /**
   * 更新数字统计
   */
  async updateNumberStats(number: number, isCorrect: boolean): Promise<void> {
    return safeExecute(async () => {
      const stats = await this.loadNumberStats();
      const key = number.toString();

      if (!stats[key]) {
        stats[key] = { correct: 0, total: 0 };
      }

      stats[key].total++;
      if (isCorrect) {
        stats[key].correct++;
      }

      await this.saveNumberStats(stats);
    });
  }

  /**
   * 计算奖励
   */
  calculateReward(
    correctAnswers: number,
    totalQuestions: number,
    streak: number,
    duration: number
  ): RewardInfo {
    return safeExecute(() => {
      const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
      const baseExperience = CONFIG.GAME.EXPERIENCE.BASE_EXP;

      // 基础经验
      let experience = correctAnswers * baseExperience;

      // 准确率奖励
      if (accuracy >= 0.9) {
        experience *= 1.5; // 90%以上准确率获得50%奖励
      } else if (accuracy >= 0.8) {
        experience *= 1.2; // 80%以上准确率获得20%奖励
      }

      // 连击奖励
      const streakBonus = Math.min(streak * 5, 100); // 每连击获得5经验，最多100

      // 速度奖励（快速完成获得奖励）
      const avgTimePerQuestion = duration / totalQuestions;
      let speedBonus = 0;
      if (avgTimePerQuestion < 3) {
        speedBonus = Math.floor(experience * 0.1); // 10%速度奖励
      }

      const totalExperience = Math.floor(experience + streakBonus + speedBonus);
      const perfectScore = accuracy === 1.0;

      return {
        experience: totalExperience,
        streak,
        streakBonus,
        accuracy,
        perfectScore,
      };
    }, {
      experience: 0,
      streak: 0,
      streakBonus: 0,
      accuracy: 0,
      perfectScore: false,
    });
  }

  /**
   * 应用奖励到用户数据
   */
  async applyReward(reward: RewardInfo): Promise<UserData> {
    return safeExecute(async () => {
      const userData = await this.loadUserData();
      const oldLevel = userData.level;

      // 更新经验和等级
      userData.experience += reward.experience;
      userData.level = this.calculateLevel(userData.experience);

      // 更新统计
      userData.totalSessions++;
      userData.todaySessions++;
      userData.maxStreak = Math.max(userData.maxStreak, reward.streak);

      // 检查是否升级
      const levelUp = userData.level > oldLevel;
      if (levelUp) {
        reward.levelUp = {
          oldLevel,
          newLevel: userData.level,
        };

        try {
          playSound('celebration');
        } catch (error) {
          console.warn('Failed to play level up sound:', error);
        }
      }

      await this.saveUserData(userData);
      return userData;
    }, await this.loadUserData());
  }

  /**
   * 计算等级（使用新的等级系统）
   */
  private calculateLevel(experience: number): number {
    // 这里应该使用新的等级系统，暂时使用简化版本
    return Math.floor(experience / 100) + 1;
  }

  /**
   * 获取经验进度
   */
  getExperienceProgress(experience: number): {
    level: number;
    currentLevelExp: number;
    nextLevelExp: number;
    progress: number;
  } {
    return safeExecute(() => {
      const level = this.calculateLevel(experience);
      const currentLevelTotalExp = (level - 1) * 100;
      const nextLevelTotalExp = level * 100;
      const currentLevelExp = experience - currentLevelTotalExp;
      const nextLevelExp = nextLevelTotalExp - currentLevelTotalExp;
      const progress = nextLevelExp > 0 ? currentLevelExp / nextLevelExp : 1;

      return {
        level,
        currentLevelExp,
        nextLevelExp,
        progress: Math.min(1, Math.max(0, progress)),
      };
    }, {
      level: 1,
      currentLevelExp: 0,
      nextLevelExp: 100,
      progress: 0,
    });
  }

  /**
   * 生成练习建议（传统数字听写）
   */
  async generateRecommendation(): Promise<RecommendationResult> {
    return safeExecute(async () => {
      const stats = await this.loadNumberStats();
      const translations = this.getCurrentTranslations();

      // 找出准确率最低的数字范围
      const ranges = [
        { min: 0, max: 10, name: '0-10' },
        { min: 11, max: 20, name: '11-20' },
        { min: 21, max: 50, name: '21-50' },
        { min: 51, max: 100, name: '51-100' },
      ];

      let worstRange = ranges[0];
      let worstAccuracy = 1;

      for (const range of ranges) {
        let totalCorrect = 0;
        let totalQuestions = 0;

        for (let i = range.min; i <= range.max; i++) {
          const stat = stats[i.toString()];
          if (stat) {
            totalCorrect += stat.correct;
            totalQuestions += stat.total;
          }
        }

        if (totalQuestions > 0) {
          const accuracy = totalCorrect / totalQuestions;
          if (accuracy < worstAccuracy) {
            worstAccuracy = accuracy;
            worstRange = range;
          }
        }
      }

      return {
        text: translations.recommendation.prefix + ' ' + worstRange.name + ' ' + translations.recommendation.suffix,
        recommendedRange: worstRange.name,
      };
    }, {
      text: 'Continue practicing to improve your skills!',
      recommendedRange: '0-10',
    });
  }

  /**
   * 生成增强推荐（8.2新增）
   * 包含跨模式分析、个性化难度推荐、练习分析等
   */
  async generateEnhancedRecommendation(): Promise<import('../../types').EnhancedRecommendationResult> {
    const result = await safeExecute(async () => {
      const userData = await this.loadUserData();

      // 动态导入推荐引擎（避免循环依赖）
      const { generateEnhancedRecommendation, getCachedRecommendation, cacheRecommendation, generateUserDataHash } =
        await import('../recommendation/enhanced-recommendation-engine');

      // 检查缓存
      const userDataHash = generateUserDataHash(userData);
      const cachedResult = getCachedRecommendation(userDataHash);
      if (cachedResult) {
        return cachedResult;
      }

      // 生成新的推荐
      const result = await generateEnhancedRecommendation(userData);

      // 缓存结果
      cacheRecommendation(userDataHash, result);

      return result;
    }, this.getFallbackEnhancedRecommendation());

    return result || this.getFallbackEnhancedRecommendation();
  }

  /**
   * 获取降级推荐结果
   */
  private getFallbackEnhancedRecommendation(): import('../../types').EnhancedRecommendationResult {
    return {
      primaryRecommendation: {
        text: '继续练习以提高技能水平',
        recommendedRange: 'basic',
        difficulty: 'beginner',
        reason: '系统推荐暂时不可用'
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
   * 重置所有数据
   */
  async resetAllData(): Promise<boolean> {
    return safeExecute(async () => {
      await userDataStorage.remove();
      await numberStatsStorage.remove();

      // 清除缓存
      this.userDataCache = null;
      this.numberStatsCache = null;

      const translations = this.getCurrentTranslations();
      console.log(translations.console.allDataReset);

      try {
        playSound('success');
      } catch (error) {
        console.warn('Failed to play reset sound:', error);
      }

      return true;
    }, false);
  }

  /**
   * 更新新模式统计（8.1新增）
   */
  async updateModeStats(
    mode: 'time' | 'direction' | 'length',
    sessionResult: {
      correct: number;
      total: number;
      accuracy: number;
      typeUsed?: string; // timeType, directionType, or unit
    }
  ): Promise<boolean> {
    return safeExecute(async () => {
      const userData = await this.loadUserData();

      let statsField: string;
      let typeStatsField: string;

      switch (mode) {
        case 'time':
          statsField = 'timeDictationStats';
          typeStatsField = 'timeTypeStats';
          break;
        case 'direction':
          statsField = 'directionDictationStats';
          typeStatsField = 'directionTypeStats';
          break;
        case 'length':
          statsField = 'lengthDictationStats';
          typeStatsField = 'unitStats';
          break;
      }

      // 确保统计对象存在
      if (!userData[statsField]) {
        userData[statsField] = this.createDefaultModeStats(mode);
      }

      const stats = userData[statsField];

      // 更新基础统计
      stats.totalSessions += 1;
      stats.totalCorrect += sessionResult.correct;
      stats.totalQuestions += sessionResult.total;
      stats.bestAccuracy = Math.max(stats.bestAccuracy, sessionResult.accuracy);

      // 重新计算平均准确率
      if (stats.totalQuestions > 0) {
        stats.averageAccuracy = stats.totalCorrect / stats.totalQuestions;
      }

      // 更新类型特定统计
      if (sessionResult.typeUsed && stats[typeStatsField]) {
        const typeStats = stats[typeStatsField];
        if (!typeStats[sessionResult.typeUsed]) {
          typeStats[sessionResult.typeUsed] = {
            sessions: 0,
            correct: 0,
            total: 0,
            accuracy: 0,
          };
        }

        const typeData = typeStats[sessionResult.typeUsed];
        typeData.sessions += 1;
        typeData.correct += sessionResult.correct;
        typeData.total += sessionResult.total;
        typeData.accuracy = typeData.total > 0 ? typeData.correct / typeData.total : 0;

        // 更新最喜欢的类型（基于使用次数）
        const mostUsedType = Object.entries(typeStats)
          .sort(([, a], [, b]) => (b as any).sessions - (a as any).sessions)[0];

        if (mostUsedType) {
          switch (mode) {
            case 'time':
              stats.favoriteTimeType = mostUsedType[0];
              break;
            case 'direction':
              stats.favoriteDirectionType = mostUsedType[0];
              break;
            case 'length':
              stats.favoriteUnit = mostUsedType[0];
              break;
          }
        }
      }

      // 更新最后练习日期
      stats.lastPlayDate = new Date().toDateString();

      // 保存更新后的数据
      await this.saveUserData(userData);

      return true;
    }, false);
  }

  /**
   * 创建默认模式统计（8.1新增）
   */
  private createDefaultModeStats(mode: 'time' | 'direction' | 'length'): any {
    const baseStats = {
      totalSessions: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      bestAccuracy: 0,
      averageAccuracy: 0,
    };

    switch (mode) {
      case 'time':
        return { ...baseStats, favoriteTimeType: 'year', timeTypeStats: {} };
      case 'direction':
        return { ...baseStats, favoriteDirectionType: 'cardinal', directionTypeStats: {} };
      case 'length':
        return { ...baseStats, favoriteUnit: '米', unitStats: {} };
    }
  }

  /**
   * 重置新模式统计（8.1新增）
   */
  async resetModeStats(mode: 'time' | 'direction' | 'length'): Promise<boolean> {
    return safeExecute(async () => {
      const userData = await this.loadUserData();

      switch (mode) {
        case 'time':
          userData.timeDictationStats = this.createDefaultModeStats('time');
          break;
        case 'direction':
          userData.directionDictationStats = this.createDefaultModeStats('direction');
          break;
        case 'length':
          userData.lengthDictationStats = this.createDefaultModeStats('length');
          break;
      }

      await this.saveUserData(userData);
      return true;
    }, false);
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.userDataCache = null;
    this.numberStatsCache = null;
  }
}

// 导出单例实例
export const gameDataManager = GameDataManager.getInstance();

// 向后兼容的静态方法
export const GameDataManagerCompat = {
  loadUserData: () => gameDataManager.loadUserData(),
  saveUserData: (data: UserData) => gameDataManager.saveUserData(data),
  loadNumberStats: () => gameDataManager.loadNumberStats(),
  saveNumberStats: (stats: NumberStats) => gameDataManager.saveNumberStats(stats),
  updateNumberStats: (number: number, isCorrect: boolean) => gameDataManager.updateNumberStats(number, isCorrect),
  calculateReward: (correct: number, total: number, streak: number, duration: number) =>
    gameDataManager.calculateReward(correct, total, streak, duration),
  applyReward: (reward: RewardInfo) => gameDataManager.applyReward(reward),
  getExperienceProgress: (experience: number) => gameDataManager.getExperienceProgress(experience),
  generateRecommendation: () => gameDataManager.generateRecommendation(),
  resetAllData: () => gameDataManager.resetAllData(),
  // 新模式统计方法（8.1新增）
  updateModeStats: (mode: 'time' | 'direction' | 'length', sessionResult: any) =>
    gameDataManager.updateModeStats(mode, sessionResult),
  resetModeStats: (mode: 'time' | 'direction' | 'length') =>
    gameDataManager.resetModeStats(mode),
  // 增强推荐方法（8.2新增）
  generateEnhancedRecommendation: () => gameDataManager.generateEnhancedRecommendation(),
};

export default gameDataManager;
