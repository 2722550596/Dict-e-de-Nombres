// 新等级系统单元测试
import { NewLevelSystem, LEVEL_SYSTEM_CONFIG, LEVEL_MILESTONES } from '../levelSystem';

describe('NewLevelSystem', () => {
  beforeEach(() => {
    // 清空缓存确保测试独立性
    NewLevelSystem.clearCache();
  });

  describe('getExperienceRequiredForLevel', () => {
    test('should return 0 for level 1', () => {
      expect(NewLevelSystem.getExperienceRequiredForLevel(1)).toBe(0);
    });

    test('should return correct experience for early levels (phase 1)', () => {
      // Level 2: 100 * 1.4^0 = 100
      expect(NewLevelSystem.getExperienceRequiredForLevel(2)).toBe(100);
      
      // Level 3: 100 + (100 * 1.4^1) = 100 + 140 = 240
      expect(NewLevelSystem.getExperienceRequiredForLevel(3)).toBe(240);
      
      // Level 4: 240 + (100 * 1.4^2) = 240 + 196 = 436
      expect(NewLevelSystem.getExperienceRequiredForLevel(4)).toBe(436);
    });

    test('should handle phase transitions correctly', () => {
      const level10Exp = NewLevelSystem.getExperienceRequiredForLevel(10);
      const level11Exp = NewLevelSystem.getExperienceRequiredForLevel(11);
      
      // Level 11 should be significantly higher than level 10
      expect(level11Exp).toBeGreaterThan(level10Exp);
      
      const level30Exp = NewLevelSystem.getExperienceRequiredForLevel(30);
      const level31Exp = NewLevelSystem.getExperienceRequiredForLevel(31);
      
      // Level 31 should be significantly higher than level 30
      expect(level31Exp).toBeGreaterThan(level30Exp);
    });

    test('should handle edge cases', () => {
      // Negative level should return 0
      expect(NewLevelSystem.getExperienceRequiredForLevel(-5)).toBe(0);
      
      // Level 0 should return 0
      expect(NewLevelSystem.getExperienceRequiredForLevel(0)).toBe(0);
      
      // Level above max should be capped
      const maxExp = NewLevelSystem.getExperienceRequiredForLevel(LEVEL_SYSTEM_CONFIG.maxLevel);
      const overMaxExp = NewLevelSystem.getExperienceRequiredForLevel(LEVEL_SYSTEM_CONFIG.maxLevel + 10);
      expect(overMaxExp).toBe(maxExp);
    });

    test('should use caching for performance', () => {
      // First call
      const start1 = performance.now();
      const exp1 = NewLevelSystem.getExperienceRequiredForLevel(50);
      const time1 = performance.now() - start1;
      
      // Second call (should be faster due to caching)
      const start2 = performance.now();
      const exp2 = NewLevelSystem.getExperienceRequiredForLevel(50);
      const time2 = performance.now() - start2;
      
      expect(exp1).toBe(exp2);
      expect(time2).toBeLessThan(time1);
    });
  });

  describe('getExperienceForNextLevel', () => {
    test('should return correct experience needed for next level', () => {
      const level1ToLevel2 = NewLevelSystem.getExperienceForNextLevel(1);
      expect(level1ToLevel2).toBe(100);
      
      const level2ToLevel3 = NewLevelSystem.getExperienceForNextLevel(2);
      expect(level2ToLevel3).toBe(140);
    });

    test('should return 0 for max level', () => {
      const maxLevelNext = NewLevelSystem.getExperienceForNextLevel(LEVEL_SYSTEM_CONFIG.maxLevel);
      expect(maxLevelNext).toBe(0);
    });

    test('should handle edge cases', () => {
      // Negative level
      const negativeNext = NewLevelSystem.getExperienceForNextLevel(-1);
      expect(negativeNext).toBeGreaterThanOrEqual(0);
      
      // Level 0
      const zeroNext = NewLevelSystem.getExperienceForNextLevel(0);
      expect(zeroNext).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateLevel', () => {
    test('should return 1 for 0 experience', () => {
      expect(NewLevelSystem.calculateLevel(0)).toBe(1);
    });

    test('should return correct level for various experience values', () => {
      // Just enough for level 2
      expect(NewLevelSystem.calculateLevel(100)).toBe(2);
      
      // Just short of level 2
      expect(NewLevelSystem.calculateLevel(99)).toBe(1);
      
      // Just enough for level 3
      expect(NewLevelSystem.calculateLevel(240)).toBe(3);
      
      // Just short of level 3
      expect(NewLevelSystem.calculateLevel(239)).toBe(2);
    });

    test('should handle large experience values efficiently', () => {
      const start = performance.now();
      const level = NewLevelSystem.calculateLevel(1000000);
      const time = performance.now() - start;
      
      expect(level).toBeGreaterThan(1);
      expect(level).toBeLessThanOrEqual(LEVEL_SYSTEM_CONFIG.maxLevel);
      expect(time).toBeLessThan(10); // Should complete in less than 10ms
    });

    test('should handle negative experience', () => {
      expect(NewLevelSystem.calculateLevel(-100)).toBe(1);
    });

    test('should be consistent with getExperienceRequiredForLevel', () => {
      // Test consistency for various levels
      for (let level = 1; level <= 20; level++) {
        const requiredExp = NewLevelSystem.getExperienceRequiredForLevel(level);
        const calculatedLevel = NewLevelSystem.calculateLevel(requiredExp);
        expect(calculatedLevel).toBe(level);
      }
    });
  });

  describe('getExperienceProgress', () => {
    test('should return correct progress information', () => {
      const progress = NewLevelSystem.getExperienceProgress(150); // Level 2 with 50 extra exp
      
      expect(progress.level).toBe(2);
      expect(progress.currentLevelExp).toBe(50);
      expect(progress.nextLevelExp).toBe(140); // Experience needed for level 3
      expect(progress.progress).toBeCloseTo(50 / 140, 2);
    });

    test('should handle exact level boundaries', () => {
      const level2Exp = NewLevelSystem.getExperienceRequiredForLevel(2);
      const progress = NewLevelSystem.getExperienceProgress(level2Exp);
      
      expect(progress.level).toBe(2);
      expect(progress.currentLevelExp).toBe(0);
      expect(progress.progress).toBe(0);
    });

    test('should handle max level', () => {
      const maxExp = NewLevelSystem.getExperienceRequiredForLevel(LEVEL_SYSTEM_CONFIG.maxLevel);
      const progress = NewLevelSystem.getExperienceProgress(maxExp + 1000);
      
      expect(progress.level).toBe(LEVEL_SYSTEM_CONFIG.maxLevel);
      expect(progress.progress).toBe(1);
      expect(progress.nextLevelExp).toBe(0);
    });

    test('should handle negative experience', () => {
      const progress = NewLevelSystem.getExperienceProgress(-100);
      
      expect(progress.level).toBe(1);
      expect(progress.currentLevelExp).toBe(0);
      expect(progress.progress).toBe(0);
    });
  });

  describe('milestone system', () => {
    test('should return correct milestone for milestone levels', () => {
      const milestone5 = NewLevelSystem.getMilestone(5);
      expect(milestone5).not.toBeNull();
      expect(milestone5?.level).toBe(5);
      expect(milestone5?.title).toBe("初学者");
      
      const milestone10 = NewLevelSystem.getMilestone(10);
      expect(milestone10).not.toBeNull();
      expect(milestone10?.level).toBe(10);
      expect(milestone10?.title).toBe("练习者");
    });

    test('should return null for non-milestone levels', () => {
      const nonMilestone = NewLevelSystem.getMilestone(7);
      expect(nonMilestone).toBeNull();
    });

    test('should return correct next milestone', () => {
      const nextMilestone = NewLevelSystem.getNextMilestone(3);
      expect(nextMilestone).not.toBeNull();
      expect(nextMilestone?.level).toBe(5);
      
      const nextMilestone2 = NewLevelSystem.getNextMilestone(15);
      expect(nextMilestone2).not.toBeNull();
      expect(nextMilestone2?.level).toBe(20);
    });

    test('should return null when no next milestone exists', () => {
      const lastMilestone = LEVEL_MILESTONES[LEVEL_MILESTONES.length - 1];
      const noNextMilestone = NewLevelSystem.getNextMilestone(lastMilestone.level);
      expect(noNextMilestone).toBeNull();
    });
  });

  describe('level distribution analysis', () => {
    test('should return correct level distribution', () => {
      const distribution = NewLevelSystem.getLevelDistribution(10);
      
      expect(distribution).toHaveLength(10);
      expect(distribution[0].level).toBe(1);
      expect(distribution[0].totalExp).toBe(0);
      expect(distribution[0].phase).toBe('快速升级期');
      
      expect(distribution[1].level).toBe(2);
      expect(distribution[1].totalExp).toBe(100);
      expect(distribution[1].expForLevel).toBe(100);
    });

    test('should show correct phase transitions', () => {
      const distribution = NewLevelSystem.getLevelDistribution(35);
      
      // Check phase 1 (levels 1-10)
      const phase1Levels = distribution.filter(d => d.level <= 10);
      expect(phase1Levels.every(d => d.phase === '快速升级期')).toBe(true);
      
      // Check phase 2 (levels 11-30)
      const phase2Levels = distribution.filter(d => d.level > 10 && d.level <= 30);
      expect(phase2Levels.every(d => d.phase === '稳定增长期')).toBe(true);
      
      // Check phase 3 (levels 31+)
      const phase3Levels = distribution.filter(d => d.level > 30);
      expect(phase3Levels.every(d => d.phase === '挑战期')).toBe(true);
    });
  });

  describe('performance tests', () => {
    test('should handle high level calculations efficiently', () => {
      const start = performance.now();
      
      // Calculate experience for high levels
      for (let level = 80; level <= 100; level++) {
        NewLevelSystem.getExperienceRequiredForLevel(level);
      }
      
      const time = performance.now() - start;
      expect(time).toBeLessThan(50); // Should complete in less than 50ms
    });

    test('should handle reverse lookups efficiently', () => {
      const start = performance.now();
      
      // Test reverse lookups for various experience values
      const testExperiences = [1000, 10000, 100000, 500000, 1000000];
      testExperiences.forEach(exp => {
        NewLevelSystem.calculateLevel(exp);
      });
      
      const time = performance.now() - start;
      expect(time).toBeLessThan(20); // Should complete in less than 20ms
    });
  });
});