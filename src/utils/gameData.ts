// 游戏化数据管理系统
import { CONFIG } from '../../config';
import { TRANSLATIONS } from '../i18n/languages';
import type {
  NumberStats,
  RecommendationResult,
  RewardInfo,
  UserData
} from '../types';
import { playSound } from './audioEffects';

// 使用统一的存储键配置
const STORAGE_KEYS = CONFIG.STORAGE;

// 获取当前语言的翻译
const getCurrentTranslations = () => {
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'fr';
  return TRANSLATIONS[currentLanguage] || TRANSLATIONS.fr;
};

// 默认用户数据
const DEFAULT_USER_DATA: UserData = {
  ...CONFIG.GAME.DEFAULT_USER_DATA,
  lastActiveDate: new Date().toDateString(),
};

export class GameDataManager {
  // 加载用户数据
  static loadUserData(): UserData {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!saved) return DEFAULT_USER_DATA;

      const data = JSON.parse(saved);
      const today = new Date().toDateString();

      // 如果是新的一天，重置今日练习次数
      if (data.lastActiveDate !== today) {
        data.todaySessions = 0;
        data.lastActiveDate = today;
      }

      return { ...DEFAULT_USER_DATA, ...data };
    } catch (error) {
      console.error('Failed to load user data:', error);
      return DEFAULT_USER_DATA;
    }
  }

  // 保存用户数据
  static saveUserData(userData: UserData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      // 保存成功时播放成功音效（静默，避免过于频繁）
    } catch (error) {
      const translations = getCurrentTranslations();
      console.error(translations.console.failedToSaveUserData, error);
      playSound('error'); // 保存失败时播放错误音效
    }
  }

  // 加载数字统计
  static loadNumberStats(): NumberStats {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NUMBER_STATS);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      const translations = getCurrentTranslations();
      console.error(translations.console.failedToLoadNumberStats, error);
      return {};
    }
  }

  // 保存数字统计
  static saveNumberStats(stats: NumberStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NUMBER_STATS, JSON.stringify(stats));
      // 保存成功时播放成功音效（静默，避免过于频繁）
    } catch (error) {
      const translations = getCurrentTranslations();
      console.error(translations.console.failedToSaveNumberStats, error);
      playSound('error'); // 保存失败时播放错误音效
    }
  }

  // 清空数字统计
  static clearNumberStats(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.NUMBER_STATS);
      playSound('success'); // 清空成功时播放成功音效
    } catch (error) {
      const translations = getCurrentTranslations();
      console.error(translations.console.failedToClearNumberStats, error);
      playSound('error'); // 清空失败时播放错误音效
    }
  }

  // 清空用户数据（重置经验和等级）
  static clearUserData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      const translations = getCurrentTranslations();
      console.log(translations.console.userDataCleared);
      playSound('success'); // 清空成功时播放成功音效
    } catch (error) {
      const translations = getCurrentTranslations();
      console.error(translations.console.failedToClearUserData, error);
      playSound('error'); // 清空失败时播放错误音效
    }
  }

  // 重置所有游戏数据
  static resetAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.NUMBER_STATS);
      const translations = getCurrentTranslations();
      console.log(translations.console.allDataReset);
      playSound('success'); // 重置成功时播放成功音效
    } catch (error) {
      const translations = getCurrentTranslations();
      console.error(translations.console.failedToResetAllData, error);
      playSound('error'); // 重置失败时播放错误音效
    }
  }

  // 计算经验值
  static calculateExperience(
    sessionResults: {
      number: number;
      correct: boolean;
      userAnswer: string;
      mode: 'number' | 'math' | 'time' | 'direction' | 'length';
      operator?: string;
    }[]
  ): number {
    // 过滤掉空白答案
    const validResults = sessionResults.filter(r => r.userAnswer.trim() !== '');
    if (validResults.length === 0) return 0;

    const correctCount = validResults.filter(r => r.correct).length;
    const totalCount = validResults.length;

    let totalExp = 0;

    validResults.forEach(result => {
      let baseExp = CONFIG.GAME.EXPERIENCE.BASE_EXP;

      // 运算听写模式的倍数
      if (result.mode === 'math' && result.operator) {
        const multiplier = CONFIG.GAME.EXPERIENCE.MATH_MULTIPLIERS[result.operator as keyof typeof CONFIG.GAME.EXPERIENCE.MATH_MULTIPLIERS];
        if (multiplier) {
          baseExp *= multiplier;
        }
      }

      // 只有正确答案才获得经验
      if (result.correct) {
        totalExp += baseExp;
      }
    });

    // 准确率奖励
    const accuracy = correctCount / totalCount;
    const accuracyBonus = Math.floor(accuracy * totalCount * 10);

    // 连击奖励
    const streak = this.calculateStreak(sessionResults.map(r => r.correct));
    const streakBonus = this.calculateStreakBonus(streak);

    return Math.round(totalExp + accuracyBonus + streakBonus);
  }

  // 计算连击奖励
  static calculateStreakBonus(streak: number): number {
    if (streak < 3) return 0;

    // 连击奖励：3连击开始有奖励，每增加1连击奖励递增
    // 3-5连击：每连击+2经验
    // 6-10连击：每连击+3经验
    // 11-20连击：每连击+5经验
    // 21+连击：每连击+8经验
    let bonus = 0;

    if (streak >= 3) {
      const baseStreaks = Math.min(streak, 5) - 2; // 3-5连击
      bonus += baseStreaks * 2;
    }

    if (streak >= 6) {
      const midStreaks = Math.min(streak, 10) - 5; // 6-10连击
      bonus += midStreaks * 3;
    }

    if (streak >= 11) {
      const highStreaks = Math.min(streak, 20) - 10; // 11-20连击
      bonus += highStreaks * 5;
    }

    if (streak >= 21) {
      const maxStreaks = streak - 20; // 21+连击
      bonus += maxStreaks * 8;
    }

    return bonus;
  }

  // 计算等级 - 分段式指数增长系统
  static calculateLevel(experience: number): number {
    const safeExperience = Math.max(0, experience);

    if (safeExperience === 0) return 1;

    // 使用二分查找优化性能
    let left = 1;
    let right = 100; // 最大等级
    let result = 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const requiredExp = this.getExperienceRequiredForLevel(mid);

      if (requiredExp <= safeExperience) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  }

  // 获取当前等级的经验需求
  static getExperienceRequiredForLevel(level: number): number {
    const safeLevel = Math.max(1, Math.min(level, 100));

    if (safeLevel <= 1) return 0;

    let totalExp = 0;

    // 第一阶段 (2-10级): 快速升级期
    for (let i = 2; i <= Math.min(safeLevel, 10); i++) {
      const expForLevel = Math.floor(100 * Math.pow(1.4, i - 2));
      totalExp += expForLevel;
    }

    // 第二阶段 (11-30级): 稳定增长期
    if (safeLevel > 10) {
      for (let i = 11; i <= Math.min(safeLevel, 30); i++) {
        const additionalLevel = i - 10;
        const expForLevel = Math.floor(500 * Math.pow(1.3, additionalLevel - 1));
        totalExp += expForLevel;
      }
    }

    // 第三阶段 (31级+): 挑战期
    if (safeLevel > 30) {
      for (let i = 31; i <= safeLevel; i++) {
        const additionalLevel = i - 30;
        const expForLevel = Math.floor(2000 * Math.pow(1.25, additionalLevel - 1));
        totalExp += expForLevel;
      }
    }

    return totalExp;
  }

  // 获取下一级所需经验
  static getExperienceForNextLevel(level: number): number {
    const safeLevel = Math.max(1, Math.min(level, 100));

    if (safeLevel >= 100) {
      return 0; // 已达到最高等级
    }

    const currentLevelExp = this.getExperienceRequiredForLevel(safeLevel);
    const nextLevelExp = this.getExperienceRequiredForLevel(safeLevel + 1);

    return nextLevelExp - currentLevelExp;
  }

  // 计算连击
  static calculateStreak(results: boolean[]): number {
    let maxStreak = 0;
    let currentStreak = 0;

    for (const isCorrect of results) {
      if (isCorrect) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }

  // 更新练习结果
  static updateSessionResults(
    sessionResults: {
      number: number;
      correct: boolean;
      userAnswer: string;
      mode: 'number' | 'math' | 'time' | 'direction' | 'length';
      operator?: string;
    }[]
  ): RewardInfo {
    const userData = this.loadUserData();
    const numberStats = this.loadNumberStats();

    // 计算本次结果
    const validResults = sessionResults.filter(r => r.userAnswer.trim() !== '');
    const correctCount = validResults.filter(r => r.correct).length;
    const totalCount = validResults.length;
    const experience = this.calculateExperience(sessionResults);
    const streak = this.calculateStreak(sessionResults.map(r => r.correct));

    // 更新用户数据
    const oldLevel = this.calculateLevel(userData.experience);
    userData.experience += experience;
    const newLevel = this.calculateLevel(userData.experience);
    userData.level = newLevel;
    userData.totalSessions += 1;
    userData.todaySessions += 1;
    userData.totalQuestions += totalCount;
    userData.totalCorrect += correctCount;
    userData.maxStreak = Math.max(userData.maxStreak, streak);
    userData.lastActiveDate = new Date().toDateString();

    // 更新数字统计
    sessionResults.forEach(result => {
      const numStr = result.number.toString();
      if (!numberStats[numStr]) {
        numberStats[numStr] = { correct: 0, total: 0 };
      }
      numberStats[numStr].total += 1;
      if (result.correct) {
        numberStats[numStr].correct += 1;
      }
    });

    // 保存数据
    this.saveUserData(userData);
    this.saveNumberStats(numberStats);

    // 计算详细奖励信息
    const accuracy = totalCount > 0 ? correctCount / totalCount : 0;
    const streakBonus = this.calculateStreakBonus(streak);
    const perfectScore = accuracy === 1.0 && totalCount > 0;

    // 返回奖励信息
    const rewardInfo: RewardInfo = {
      experience,
      streak,
      streakBonus,
      accuracy,
      perfectScore
    };

    if (newLevel > oldLevel) {
      rewardInfo.levelUp = {
        oldLevel,
        newLevel
      };
    }

    return rewardInfo;
  }

  // 智能推荐算法
  static getRecommendation(numberStats: NumberStats, translations: any): RecommendationResult {
    // 定义数字范围 - 与DifficultySelector保持一致
    const ranges = [
      // 基础范围
      { name: "0-9", min: 0, max: 9, key: "0-9" },
      { name: "0-16", min: 0, max: 16, key: "0-16" },
      { name: "0-20", min: 0, max: 20, key: "0-20" },
      { name: "0-30", min: 0, max: 30, key: "0-30" },

      // 中级范围
      { name: "0-50", min: 0, max: 50, key: "0-50" },
      { name: "0-69", min: 0, max: 69, key: "0-69" },
      { name: "20-69", min: 20, max: 69, key: "20-69" },
      { name: "50-99", min: 50, max: 99, key: "50-99" },
      { name: "70-99", min: 70, max: 99, key: "70-99" },
      { name: "0-99", min: 0, max: 99, key: "0-99" },

      // 困难范围
      { name: "100-199", min: 100, max: 199, key: "100-199" },
      { name: "100-999", min: 100, max: 999, key: "100-999" },
      { name: "200-999", min: 200, max: 999, key: "200-999" },
      { name: "1000-1999", min: 1000, max: 1999, key: "1000-1999" },
      { name: "1000-9999", min: 1000, max: 9999, key: "1000-9999" },

      // 特殊范围
      { name: "年份", min: 1700, max: 2050, key: "1700-2050" }
    ];

    // 分析各范围表现
    const rangeStats = ranges.map(range => {
      const numbersInRange = Object.entries(numberStats)
        .filter(([num, _]) => {
          const n = parseInt(num);
          return n >= range.min && n <= range.max;
        });

      if (numbersInRange.length === 0) {
        return { ...range, accuracy: 1, total: 0 };
      }

      const totalCorrect = numbersInRange.reduce((sum, [_, stats]) => sum + stats.correct, 0);
      const totalAttempts = numbersInRange.reduce((sum, [_, stats]) => sum + stats.total, 0);

      return {
        ...range,
        accuracy: totalCorrect / totalAttempts,
        total: totalAttempts
      };
    });

    // 找出需要练习的范围（准确率<70%且有足够数据）
    const weakRanges = rangeStats.filter(r => r.total >= 5 && r.accuracy < 0.7);

    if (weakRanges.length === 0) {
      return {
        text: translations.recommendation.allGood,
        recommendedRange: "0-99"
      };
    }

    // 找出最需要练习的范围
    const weakestRange = weakRanges.sort((a, b) => a.accuracy - b.accuracy)[0];
    const accuracyPercent = Math.round(weakestRange.accuracy * 100);

    return {
      text: `${translations.recommendation.prefix} ${weakestRange.name} ${accuracyPercent}% ${translations.recommendation.suffix} "${weakestRange.key}"`,
      recommendedRange: weakestRange.key
    };
  }

  // 获取经验值进度信息
  static getExperienceProgress(experience: number): {
    level: number;
    currentLevelExp: number;
    nextLevelExp: number;
    progress: number;
  } {
    const safeExperience = Math.max(0, experience);
    const level = this.calculateLevel(safeExperience);

    const currentLevelRequiredExp = this.getExperienceRequiredForLevel(level);
    const nextLevelRequiredExp = this.getExperienceRequiredForLevel(level + 1);

    const currentLevelExp = Math.max(0, safeExperience - currentLevelRequiredExp);
    const nextLevelExp = nextLevelRequiredExp - currentLevelRequiredExp;

    let progress = 0;
    if (nextLevelExp > 0) {
      progress = currentLevelExp / nextLevelExp;
    } else {
      progress = 1; // 已达到最高等级
    }

    return {
      level,
      currentLevelExp: Math.max(0, currentLevelExp),
      nextLevelExp: Math.max(0, nextLevelExp),
      progress: Math.min(1, Math.max(0, progress))
    };
  }
}
