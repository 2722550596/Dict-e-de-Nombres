/**
 * 统一存储工具
 * 提供类型安全的localStorage操作、数据序列化和错误处理
 */

import { CONFIG } from '../../../config';
import { createStorageError, handleError, safeExecute } from './errors';
import { validateUserData, sanitizers } from './validation';
import type { UserData } from '../../types';

// 存储操作结果接口
export interface StorageResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 存储选项接口
export interface StorageOptions {
  validate?: boolean;
  sanitize?: boolean;
  backup?: boolean;
  compress?: boolean;
}

/**
 * 类型安全的存储管理器
 */
export class StorageManager {
  private static instance: StorageManager;
  private storageKeys = CONFIG.STORAGE;

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * 检查localStorage是否可用
   */
  private isStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 序列化数据
   */
  private serialize<T>(data: T, compress: boolean = false): string {
    try {
      const jsonString = JSON.stringify(data);
      
      // 简单的压缩（实际项目中可以使用更好的压缩算法）
      if (compress && jsonString.length > 1000) {
        // 这里可以集成压缩库
        return jsonString;
      }
      
      return jsonString;
    } catch (error) {
      throw createStorageError('Failed to serialize data', { data, error });
    }
  }

  /**
   * 反序列化数据
   */
  private deserialize<T>(jsonString: string): T {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw createStorageError('Failed to deserialize data', { jsonString, error });
    }
  }

  /**
   * 通用存储方法
   */
  async set<T>(key: string, data: T, options: StorageOptions = {}): Promise<StorageResult<T>> {
    const { validate = false, sanitize = false, backup = false, compress = false } = options;

    return safeExecute(async () => {
      if (!this.isStorageAvailable()) {
        throw createStorageError('localStorage is not available');
      }

      let processedData = data;

      // 数据清理
      if (sanitize && key === this.storageKeys.USER_DATA) {
        processedData = sanitizers.sanitizeUserData(data as any) as T;
      }

      // 数据验证
      if (validate && key === this.storageKeys.USER_DATA) {
        const validation = validateUserData(processedData as UserData);
        if (!validation.isValid) {
          throw createStorageError('Data validation failed', { errors: validation.errors });
        }
      }

      // 备份现有数据
      if (backup) {
        await this.createBackup(key);
      }

      // 序列化并存储
      const serializedData = this.serialize(processedData, compress);
      localStorage.setItem(key, serializedData);

      return { success: true, data: processedData };
    }, { success: false, error: 'Storage operation failed' });
  }

  /**
   * 通用获取方法
   */
  async get<T>(key: string, defaultValue?: T): Promise<StorageResult<T>> {
    return safeExecute(async () => {
      if (!this.isStorageAvailable()) {
        throw createStorageError('localStorage is not available');
      }

      const item = localStorage.getItem(key);
      
      if (item === null) {
        return { success: true, data: defaultValue };
      }

      const data = this.deserialize<T>(item);
      return { success: true, data };
    }, { success: false, data: defaultValue, error: 'Failed to retrieve data' });
  }

  /**
   * 删除数据
   */
  async remove(key: string): Promise<StorageResult<void>> {
    return safeExecute(async () => {
      if (!this.isStorageAvailable()) {
        throw createStorageError('localStorage is not available');
      }

      localStorage.removeItem(key);
      return { success: true };
    }, { success: false, error: 'Failed to remove data' });
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<StorageResult<void>> {
    return safeExecute(async () => {
      if (!this.isStorageAvailable()) {
        throw createStorageError('localStorage is not available');
      }

      localStorage.clear();
      return { success: true };
    }, { success: false, error: 'Failed to clear storage' });
  }

  /**
   * 创建备份
   */
  private async createBackup(key: string): Promise<void> {
    const backupKey = `${key}_backup_${Date.now()}`;
    const existingData = localStorage.getItem(key);
    
    if (existingData) {
      localStorage.setItem(backupKey, existingData);
      
      // 清理旧备份（保留最近5个）
      this.cleanupBackups(key);
    }
  }

  /**
   * 清理旧备份
   */
  private cleanupBackups(key: string): void {
    const backupPrefix = `${key}_backup_`;
    const backupKeys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && storageKey.startsWith(backupPrefix)) {
        backupKeys.push(storageKey);
      }
    }

    // 按时间戳排序，保留最新的5个
    backupKeys.sort().reverse();
    const keysToRemove = backupKeys.slice(5);

    keysToRemove.forEach(backupKey => {
      localStorage.removeItem(backupKey);
    });
  }

  /**
   * 获取存储使用情况
   */
  getStorageInfo(): {
    used: number;
    available: number;
    total: number;
    percentage: number;
  } {
    if (!this.isStorageAvailable()) {
      return { used: 0, available: 0, total: 0, percentage: 0 };
    }

    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        used += key.length + (value?.length || 0);
      }
    }

    // localStorage通常限制为5-10MB，这里假设5MB
    const total = 5 * 1024 * 1024; // 5MB in bytes
    const available = total - used;
    const percentage = (used / total) * 100;

    return { used, available, total, percentage };
  }

  /**
   * 检查存储空间是否充足
   */
  hasEnoughSpace(dataSize: number): boolean {
    const info = this.getStorageInfo();
    return info.available > dataSize * 1.2; // 留20%缓冲
  }
}

/**
 * 便捷的存储函数
 */
const storage = StorageManager.getInstance();

/**
 * 用户数据存储
 */
export const userDataStorage = {
  async save(userData: UserData): Promise<StorageResult<UserData>> {
    return storage.set(CONFIG.STORAGE.USER_DATA, userData, {
      validate: true,
      sanitize: true,
      backup: true,
    });
  },

  async load(): Promise<StorageResult<UserData>> {
    const defaultUserData: UserData = {
      ...CONFIG.GAME.DEFAULT_USER_DATA,
      lastActiveDate: new Date().toDateString(),
    };

    return storage.get(CONFIG.STORAGE.USER_DATA, defaultUserData);
  },

  async remove(): Promise<StorageResult<void>> {
    return storage.remove(CONFIG.STORAGE.USER_DATA);
  },
};

/**
 * 数字统计存储
 */
export const numberStatsStorage = {
  async save(stats: Record<string, any>): Promise<StorageResult<Record<string, any>>> {
    return storage.set(CONFIG.STORAGE.NUMBER_STATS, stats);
  },

  async load(): Promise<StorageResult<Record<string, any>>> {
    return storage.get(CONFIG.STORAGE.NUMBER_STATS, {});
  },

  async remove(): Promise<StorageResult<void>> {
    return storage.remove(CONFIG.STORAGE.NUMBER_STATS);
  },
};

/**
 * 通用存储操作
 */
export const storageUtils = {
  /**
   * 批量操作
   */
  async batch(operations: Array<() => Promise<StorageResult<any>>>): Promise<StorageResult<any[]>> {
    try {
      const results = await Promise.all(operations.map(op => op()));
      const hasError = results.some(result => !result.success);
      
      return {
        success: !hasError,
        data: results,
        error: hasError ? 'Some operations failed' : undefined,
      };
    } catch (error) {
      handleError(createStorageError('Batch operation failed', { error }));
      return { success: false, error: 'Batch operation failed' };
    }
  },

  /**
   * 导出所有数据
   */
  async exportAll(): Promise<StorageResult<Record<string, any>>> {
    return safeExecute(async () => {
      const data: Record<string, any> = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('frenchNumbers_')) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              data[key] = JSON.parse(value);
            } catch {
              data[key] = value;
            }
          }
        }
      }

      return { success: true, data };
    }, { success: false, error: 'Export failed' });
  },

  /**
   * 导入数据
   */
  async importAll(data: Record<string, any>): Promise<StorageResult<void>> {
    return safeExecute(async () => {
      for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('frenchNumbers_')) {
          const serialized = typeof value === 'string' ? value : JSON.stringify(value);
          localStorage.setItem(key, serialized);
        }
      }

      return { success: true };
    }, { success: false, error: 'Import failed' });
  },

  /**
   * 获取存储信息
   */
  getInfo: () => storage.getStorageInfo(),

  /**
   * 检查空间
   */
  hasSpace: (size: number) => storage.hasEnoughSpace(size),
};

export default storage;
