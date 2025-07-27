/**
 * 统一的游戏HUD组件
 * 合并了GameHUD和SimpleGameHUD的功能，提供统一的用户界面
 */

import React, { useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useUserDataWithLevelUp } from '../hooks/useUserData';
import type { UserData } from '../types';
import { playSound } from '../utils/audioEffects';
import './GameHUD.css';

// SVG图标组件
const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,22 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const TargetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// 组件属性接口
export interface UnifiedGameHUDProps {
  className?: string;
  variant?: 'full' | 'simple';
  enableSounds?: boolean;
  enableLevelUpAnimation?: boolean;
}

/**
 * 统一的游戏HUD组件
 */
export const UnifiedGameHUD: React.FC<UnifiedGameHUDProps> = ({
  className = '',
  variant = 'full',
  enableSounds = true,
  enableLevelUpAnimation = true,
}) => {
  // Hooks
  const { translations } = useLanguage();
  const { userData, expProgress, isLevelingUp, error } = useUserDataWithLevelUp();
  
  // 状态管理
  const [isPinned, setIsPinned] = useState(false);
  
  // 引用管理
  const levelContainerRef = useRef<HTMLSpanElement>(null);

  /**
   * 处理点击事件
   */
  const handleClick = () => {
    if (enableSounds) {
      try {
        playSound('click');
      } catch (error) {
        console.warn('UnifiedGameHUD: Could not play click sound:', error);
      }
    }
    setIsPinned(!isPinned);
  };

  /**
   * 处理鼠标悬停事件
   */
  const handleMouseEnter = () => {
    if (enableSounds) {
      try {
        playSound('hover');
      } catch (error) {
        console.warn('UnifiedGameHUD: Could not play hover sound:', error);
      }
    }
  };

  /**
   * 计算准确率
   */
  const calculateAccuracy = (userData: UserData): number => {
    if (userData.totalQuestions <= 0) return 0;
    return Math.round((userData.totalCorrect / userData.totalQuestions) * 100);
  };

  // 错误处理
  if (error) {
    console.error('UnifiedGameHUD: Error loading user data:', error);
    return null;
  }

  // 数据验证
  if (!userData || !expProgress) {
    return null;
  }

  // 根据变体决定显示内容
  const showTranslations = variant === 'full';
  const levelText = showTranslations 
    ? `${translations.hud.level} ${expProgress.level}`
    : `等级 ${expProgress.level}`;
  const expText = showTranslations
    ? `${expProgress.currentLevelExp}/${expProgress.nextLevelExp} ${translations.hud.exp}`
    : `${expProgress.currentLevelExp}/${expProgress.nextLevelExp} 经验`;

  return (
    <div
      className={`corner-widget ${isPinned ? 'pinned' : ''} ${enableLevelUpAnimation && isLevelingUp ? 'level-up-effect' : ''} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
      aria-label="游戏状态显示"
    >
      {/* 主显示区域 */}
      <div className="main-display">
        <div className="level-icon-container">
          <StarIcon />
        </div>
        <div className="level-info">
          <span className="level-text" ref={levelContainerRef}>
            {levelText}
          </span>
        </div>
      </div>

      {/* 展开的详细信息 */}
      <div className="details">
        <div className="details-content">
          {/* 经验值区域 */}
          <div className="exp-section">
            <div className="exp-text-small">
              {expText}
            </div>
            <div className="exp-bar-container">
              <div
                className="exp-bar-fill"
                style={{ width: `${expProgress.progress * 100}%` }}
                role="progressbar"
                aria-valuenow={expProgress.progress * 100}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="经验进度"
              />
            </div>
          </div>

          {/* 统计数据区域 */}
          <div className="stats-section">
            {/* 今日练习 */}
            <div className="stat-item" title="今日练习次数">
              <CalendarIcon />
              <span>{userData.todaySessions}</span>
            </div>

            {/* 最长连击 */}
            <div className="stat-item" title="最长连击记录">
              <FlameIcon />
              <span>{userData.maxStreak}</span>
            </div>

            {/* 准确率 */}
            <div className="stat-item" title="总体准确率">
              <TargetIcon />
              <span>{calculateAccuracy(userData)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 导出的组件由各自的文件处理，这里只导出统一组件

export default UnifiedGameHUD;
