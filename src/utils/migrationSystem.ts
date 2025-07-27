// 等级系统迁移和备份系统
import type { BackupData, MigrationLog, MigrationResult, UserData } from '../types';
import { LEVEL_SYSTEM_CONFIG, NewLevelSystem } from './levelSystem';

// 存储键
const STORAGE_KEYS = {
  BACKUP: 'frenchNumbers_backup',
  MIGRATION_LOG: 'frenchNumbers_migrationLog',
  USER_DATA: 'frenchNumbers_userData'
};

export class MigrationSystem {

  /**
   * 创建用户数据备份
   * @param userData 用户数据
   * @returns 备份结果
   */
  static createBackup(userData: UserData): { success: boolean; error?: string } {
    try {
      const timestamp = new Date().toISOString();
      const version = '1.0'; // 当前版本

      // 计算校验和
      const dataString = JSON.stringify(userData);
      const checksum = this.calculateChecksum(dataString);

      const backupData: BackupData = {
        userData: { ...userData },
        timestamp,
        version,
        checksum
      };

      // 保存备份
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backupData));

      // 记录日志
      this.logMigration('backup', true, `Backup created at ${timestamp}`);

      return { success: true };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logMigration('backup', false, 'Failed to create backup', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * 验证备份数据完整性
   * @returns 验证结果
   */
  static validateBackup(): { valid: boolean; error?: string } {
    try {
      const backupStr = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!backupStr) {
        return { valid: false, error: 'No backup found' };
      }

      const backup: BackupData = JSON.parse(backupStr);

      // 验证必要字段
      if (!backup.userData || !backup.timestamp || !backup.checksum) {
        return { valid: false, error: 'Backup data incomplete' };
      }

      // 验证校验和
      const dataString = JSON.stringify(backup.userData);
      const calculatedChecksum = this.calculateChecksum(dataString);

      if (calculatedChecksum !== backup.checksum) {
        return { valid: false, error: 'Backup data corrupted (checksum mismatch)' };
      }

      this.logMigration('verify', true, 'Backup validation successful');
      return { valid: true };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logMigration('verify', false, 'Backup validation failed', errorMsg);
      return { valid: false, error: errorMsg };
    }
  }

  /**
   * 恢复备份数据
   * @returns 恢复结果
   */
  static restoreBackup(): { success: boolean; userData?: UserData; error?: string } {
    try {
      // 先验证备份
      const validation = this.validateBackup();
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const backupStr = localStorage.getItem(STORAGE_KEYS.BACKUP);
      const backup: BackupData = JSON.parse(backupStr!);

      // 恢复用户数据
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(backup.userData));

      this.logMigration('rollback', true, `Data restored from backup created at ${backup.timestamp}`);

      return { success: true, userData: backup.userData };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logMigration('rollback', false, 'Failed to restore backup', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * 执行等级系统迁移
   * @param userData 当前用户数据
   * @returns 迁移结果
   */
  static migrateUserLevel(userData: UserData): MigrationResult {
    const migrationDate = new Date().toISOString();

    try {
      // 创建备份
      const backupResult = this.createBackup(userData);
      if (!backupResult.success) {
        return {
          success: false,
          oldLevel: userData.level,
          newLevel: userData.level,
          oldExperience: userData.experience,
          adjustedExperience: userData.experience,
          migrationDate,
          error: `Backup failed: ${backupResult.error}`
        };
      }

      const oldLevel = userData.level;
      const oldExperience = userData.experience;

      // 使用新系统计算等级
      const newLevel = NewLevelSystem.calculateLevel(oldExperience);

      let adjustedExperience = oldExperience;
      let bonusExperience: number | undefined;

      // 如果新等级低于当前等级，给予补偿经验
      if (newLevel < oldLevel) {
        const targetExp = NewLevelSystem.getExperienceRequiredForLevel(oldLevel);
        bonusExperience = Math.max(0, targetExp - oldExperience);
        adjustedExperience = targetExp;

        this.logMigration('migrate', true,
          `Level adjustment: ${oldLevel} -> ${newLevel}, bonus experience: ${bonusExperience}`);
      } else {
        this.logMigration('migrate', true,
          `Level migration: ${oldLevel} -> ${newLevel}, no adjustment needed`);
      }

      return {
        success: true,
        oldLevel,
        newLevel: bonusExperience ? oldLevel : newLevel,
        oldExperience,
        adjustedExperience,
        bonusExperience,
        migrationDate
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logMigration('migrate', false, 'Migration failed', errorMsg);

      return {
        success: false,
        oldLevel: userData.level,
        newLevel: userData.level,
        oldExperience: userData.experience,
        adjustedExperience: userData.experience,
        migrationDate,
        error: errorMsg
      };
    }
  }

  /**
   * 检查是否需要迁移
   * @param userData 用户数据
   * @returns 是否需要迁移
   */
  static needsMigration(userData: UserData): boolean {
    // 检查是否有版本字段
    const userDataWithVersion = userData as UserData & { levelSystemVersion?: number };

    // 如果没有版本字段或版本低于当前版本，需要迁移
    return !userDataWithVersion.levelSystemVersion ||
      userDataWithVersion.levelSystemVersion < LEVEL_SYSTEM_CONFIG.version;
  }

  /**
   * 获取迁移日志
   * @param limit 返回条数限制
   * @returns 迁移日志数组
   */
  static getMigrationLogs(limit: number = 50): MigrationLog[] {
    try {
      const logsStr = localStorage.getItem(STORAGE_KEYS.MIGRATION_LOG);
      if (!logsStr) return [];

      const logs: MigrationLog[] = JSON.parse(logsStr);
      return logs.slice(-limit); // 返回最新的记录
    } catch (error) {
      console.error('Failed to load migration logs:', error);
      return [];
    }
  }

  /**
   * 清空迁移日志
   */
  static clearMigrationLogs(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.MIGRATION_LOG);
    } catch (error) {
      console.error('Failed to clear migration logs:', error);
    }
  }

  /**
   * 记录迁移日志
   * @param action 操作类型
   * @param success 是否成功
   * @param details 详细信息
   * @param error 错误信息
   */
  private static logMigration(
    action: MigrationLog['action'],
    success: boolean,
    details: string,
    error?: string
  ): void {
    try {
      const timestamp = new Date().toISOString();
      const logEntry: MigrationLog = {
        timestamp,
        action,
        success,
        details,
        error
      };

      // 获取现有日志
      const existingLogsStr = localStorage.getItem(STORAGE_KEYS.MIGRATION_LOG);
      const existingLogs: MigrationLog[] = existingLogsStr ? JSON.parse(existingLogsStr) : [];

      // 添加新日志
      existingLogs.push(logEntry);

      // 保持最多100条日志
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }

      // 保存日志
      localStorage.setItem(STORAGE_KEYS.MIGRATION_LOG, JSON.stringify(existingLogs));
    } catch (error) {
      console.error('Failed to log migration:', error);
    }
  }

  /**
   * 计算数据校验和
   * @param data 数据字符串
   * @returns 校验和
   */
  private static calculateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return hash.toString(16);
  }

  /**
   * 获取迁移统计信息
   * @returns 统计信息
   */
  static getMigrationStats(): {
    totalMigrations: number;
    successfulMigrations: number;
    failedMigrations: number;
    lastMigration?: string;
    hasBackup: boolean;
  } {
    const logs = this.getMigrationLogs();
    const migrationLogs = logs.filter(log => log.action === 'migrate');

    const totalMigrations = migrationLogs.length;
    const successfulMigrations = migrationLogs.filter(log => log.success).length;
    const failedMigrations = totalMigrations - successfulMigrations;
    const lastMigration = migrationLogs.length > 0 ?
      migrationLogs[migrationLogs.length - 1].timestamp : undefined;

    const hasBackup = !!localStorage.getItem(STORAGE_KEYS.BACKUP);

    return {
      totalMigrations,
      successfulMigrations,
      failedMigrations,
      lastMigration,
      hasBackup
    };
  }
}