/**
 * 游戏数据管理器
 * 重构自原gameData.ts，提供更清晰的数据管理接口
 */

import { CONFIG } from '../../../config';
import { TRANSLATIONS } from '../../i18n/languages';
import type { UserData, RewardInfo, NumberStats, RecommendationResult } from '../../types';
import { userDataStorage, numberStatsStorage } from '../core/storage';
import { validateUserData, sanitizers } from '../core/validation';
import { handleError, createGameLogicError, safeExecute } from '../core/errors';
import { playSound } from '../audio/effects';

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
   * 生成练习建议
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
        text: translations.recommendations.practiceRange.replace('{range}', worstRange.name),
        recommendedRange: worstRange.name,
      };
    }, {
      text: 'Continue practicing to improve your skills!',
      recommendedRange: '0-10',
    });
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
};

export default gameDataManager;
