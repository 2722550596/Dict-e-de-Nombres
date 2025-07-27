/**
 * 用户数据管理Hook
 * 统一管理用户数据的加载、更新和错误处理
 */

import { useState, useEffect, useRef } from 'react';
import { GameDataManager } from '../utils/gameData';
import type { UserData } from '../types';
import { CONFIG } from '../../config';

// 默认用户数据
const createDefaultUserData = (): UserData => ({
  level: 1,
  experience: 0,
  totalSessions: 0,
  todaySessions: 0,
  lastActiveDate: new Date().toDateString(),
  totalQuestions: 0,
  totalCorrect: 0,
  maxStreak: 0,
});

// 经验进度接口
export interface ExperienceProgress {
  level: number;
  currentLevelExp: number;
  nextLevelExp: number;
  progress: number;
}

// Hook选项接口
export interface UseUserDataOptions {
  autoUpdate?: boolean;
  updateInterval?: number;
  enableLevelUpDetection?: boolean;
}

// Hook返回值接口
export interface UseUserDataReturn {
  userData: UserData;
  expProgress: ExperienceProgress;
  isLoading: boolean;
  error: string | null;
  isLevelingUp: boolean;
  refreshUserData: () => void;
  setUserData: (data: UserData) => void;
}

/**
 * 用户数据管理Hook
 */
export const useUserData = (options: UseUserDataOptions = {}): UseUserDataReturn => {
  const {
    autoUpdate = false,
    updateInterval = 2000,
    enableLevelUpDetection = false,
  } = options;

  // 状态管理
  const [userData, setUserData] = useState<UserData>(createDefaultUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  // 引用管理
  const previousLevelRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 加载用户数据
   */
  const loadUserData = async (): Promise<UserData> => {
    try {
      setError(null);
      const data = GameDataManager.loadUserData();
      
      // 数据验证
      if (!data || typeof data.level !== 'number') {
        throw new Error('Invalid user data structure');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
      setError(errorMessage);
      console.error('useUserData: Error loading user data:', err);
      return createDefaultUserData();
    }
  };

  /**
   * 刷新用户数据
   */
  const refreshUserData = async () => {
    setIsLoading(true);
    try {
      const newData = await loadUserData();
      
      // 等级提升检测
      if (enableLevelUpDetection && previousLevelRef.current > 0) {
        if (newData.level > previousLevelRef.current) {
          setIsLevelingUp(true);
          // 等级提升动画持续时间
          setTimeout(() => setIsLevelingUp(false), CONFIG.TIMING.ANIMATION.CELEBRATION);
        }
      }
      
      previousLevelRef.current = newData.level;
      setUserData(newData);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 计算经验进度
   */
  const calculateExpProgress = (userData: UserData): ExperienceProgress => {
    try {
      const progress = GameDataManager.getExperienceProgress(userData.experience);
      
      // 安全检查和数据清理
      return {
        level: Math.max(1, progress.level || 1),
        currentLevelExp: Math.max(0, progress.currentLevelExp || 0),
        nextLevelExp: Math.max(0, progress.nextLevelExp || 0),
        progress: Math.min(1, Math.max(0, progress.progress || 0)),
      };
    } catch (err) {
      console.error('useUserData: Error calculating experience progress:', err);
      return {
        level: 1,
        currentLevelExp: 0,
        nextLevelExp: 100,
        progress: 0,
      };
    }
  };

  // 初始化数据加载
  useEffect(() => {
    refreshUserData();
  }, []);

  // 自动更新设置
  useEffect(() => {
    if (!autoUpdate) return;

    intervalRef.current = setInterval(() => {
      refreshUserData();
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoUpdate, updateInterval]);

  // 存储变化监听
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CONFIG.STORAGE.USER_DATA) {
        refreshUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 计算经验进度
  const expProgress = calculateExpProgress(userData);

  return {
    userData,
    expProgress,
    isLoading,
    error,
    isLevelingUp,
    refreshUserData,
    setUserData,
  };
};

/**
 * 简化版用户数据Hook（仅用于显示）
 */
export const useUserDataDisplay = () => {
  return useUserData({
    autoUpdate: true,
    updateInterval: 2000,
    enableLevelUpDetection: false,
  });
};

/**
 * 完整版用户数据Hook（包含等级提升检测）
 */
export const useUserDataWithLevelUp = () => {
  return useUserData({
    autoUpdate: true,
    updateInterval: 1000,
    enableLevelUpDetection: true,
  });
};
