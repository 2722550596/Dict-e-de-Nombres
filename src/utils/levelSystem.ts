// 新的等级系统 - 分段式指数增长
export interface LevelSystemConfig {
  version: number;
  maxLevel: number;
}

export interface LevelMilestone {
  level: number;
  title: string;
  description: string;
  reward?: {
    type: 'badge' | 'title' | 'feature';
    value: string;
  };
}

export interface MigrationResult {
  oldLevel: number;
  newLevel: number;
  adjustedExperience: number;
  bonusExperience?: number;
  migrationDate: string;
}

// 等级系统配置
export const LEVEL_SYSTEM_CONFIG: LevelSystemConfig = {
  version: 2,
  maxLevel: 100
};

// 等级里程碑定义
export const LEVEL_MILESTONES: LevelMilestone[] = [
  { level: 5, title: "初学者", description: "完成基础练习" },
  { level: 10, title: "练习者", description: "建立学习习惯" },
  { level: 20, title: "熟练者", description: "掌握核心技能" },
  { level: 30, title: "专家", description: "达到高级水平" },
  { level: 50, title: "大师", description: "成为数字听写大师" }
];

// 经验需求缓存
const experienceCache = new Map<number, number>();

/**
 * 新的等级计算系统 - 分段式指数增长
 * 
 * 第一阶段 (2-10级): 快速升级期 - 保持用户参与度
 * 第二阶段 (11-30级): 稳定增长期 - 建立学习习惯  
 * 第三阶段 (31级+): 挑战期 - 长期目标
 */
export class NewLevelSystem {

  /**
   * 计算指定等级所需的总经验值
   * @param level 目标等级
   * @returns 达到该等级所需的总经验值
   */
  static getExperienceRequiredForLevel(level: number): number {
    // 输入验证
    const safeLevel = Math.max(1, Math.min(level, LEVEL_SYSTEM_CONFIG.maxLevel));

    if (safeLevel <= 1) return 0;

    // 检查缓存
    if (experienceCache.has(safeLevel)) {
      return experienceCache.get(safeLevel)!;
    }

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

    // 缓存结果
    experienceCache.set(safeLevel, totalExp);

    return totalExp;
  }

  /**
   * 计算从当前等级升到下一等级所需的经验值
   * @param level 当前等级
   * @returns 升级所需的经验值
   */
  static getExperienceForNextLevel(level: number): number {
    const safeLevel = Math.max(1, Math.min(level, LEVEL_SYSTEM_CONFIG.maxLevel));

    if (safeLevel >= LEVEL_SYSTEM_CONFIG.maxLevel) {
      return 0; // 已达到最高等级
    }

    const currentLevelExp = this.getExperienceRequiredForLevel(safeLevel);
    const nextLevelExp = this.getExperienceRequiredForLevel(safeLevel + 1);

    return nextLevelExp - currentLevelExp;
  }

  /**
   * 根据总经验值计算当前等级
   * @param experience 总经验值
   * @returns 当前等级
   */
  static calculateLevel(experience: number): number {
    const safeExperience = Math.max(0, experience);

    if (safeExperience === 0) return 1;

    // 使用二分查找优化性能
    let left = 1;
    let right = LEVEL_SYSTEM_CONFIG.maxLevel;
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

  /**
   * 获取经验值进度信息
   * @param experience 总经验值
   * @returns 等级进度信息
   */
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

  /**
   * 检查是否达到里程碑等级
   * @param level 等级
   * @returns 里程碑信息，如果不是里程碑等级则返回null
   */
  static getMilestone(level: number): LevelMilestone | null {
    return LEVEL_MILESTONES.find(milestone => milestone.level === level) || null;
  }

  /**
   * 获取下一个里程碑
   * @param currentLevel 当前等级
   * @returns 下一个里程碑信息，如果没有则返回null
   */
  static getNextMilestone(currentLevel: number): LevelMilestone | null {
    return LEVEL_MILESTONES.find(milestone => milestone.level > currentLevel) || null;
  }

  /**
   * 清空经验需求缓存
   */
  static clearCache(): void {
    experienceCache.clear();
  }

  /**
   * 获取等级分布统计（用于调试和分析）
   * @param maxLevel 最大等级
   * @returns 等级分布数据
   */
  static getLevelDistribution(maxLevel: number = 50): Array<{
    level: number;
    totalExp: number;
    expForLevel: number;
    phase: string;
  }> {
    const distribution = [];

    for (let level = 1; level <= Math.min(maxLevel, LEVEL_SYSTEM_CONFIG.maxLevel); level++) {
      const totalExp = this.getExperienceRequiredForLevel(level);
      const expForLevel = level === 1 ? 0 : this.getExperienceForNextLevel(level - 1);

      let phase = '';
      if (level <= 10) phase = '快速升级期';
      else if (level <= 30) phase = '稳定增长期';
      else phase = '挑战期';

      distribution.push({
        level,
        totalExp,
        expForLevel,
        phase
      });
    }

    return distribution;
  }
}