import React, { useState, useEffect, useRef } from 'react';
import { GameDataManager, UserData } from '../utils/gameData';
import { useLanguage } from '../hooks/useLanguage';
import { playSound } from '../utils/audioEffects';
import './GameHUD.css';

// SVG图标组件 - 和谐的黄色搭配
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

interface GameHUDProps {
  className?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ className }) => {
  const { translations } = useLanguage();
  const [userData, setUserData] = useState<UserData>(GameDataManager.loadUserData());
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [isPinned, setIsPinned] = useState(false); // 是否锁定展开状态
  const previousLevelRef = useRef(userData.level);
  const levelContainerRef = useRef<HTMLSpanElement>(null);

  // 监听用户数据变化
  useEffect(() => {
    const handleStorageChange = () => {
      const newUserData = GameDataManager.loadUserData();

      // 检查是否升级
      if (newUserData.level > previousLevelRef.current) {
        setIsLevelingUp(true);

        // 播放升级动画
        if (levelContainerRef.current) {
          levelContainerRef.current.classList.remove('level-up-effect');
          // 强制重绘
          void levelContainerRef.current.offsetWidth;
          levelContainerRef.current.classList.add('level-up-effect');

          // 监听动画结束事件
          const handleAnimationEnd = () => {
            if (levelContainerRef.current) {
              levelContainerRef.current.classList.remove('level-up-effect');
              levelContainerRef.current.style.transform = 'scale(1)';
            }
            setIsLevelingUp(false);
          };

          levelContainerRef.current.addEventListener('animationend', handleAnimationEnd, { once: true });
        }

        previousLevelRef.current = newUserData.level;
      }

      setUserData(newUserData);
    };

    // 监听localStorage变化
    window.addEventListener('storage', handleStorageChange);

    // 定期刷新数据（处理同一页面内的更新）
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const expProgress = GameDataManager.getExperienceProgress(userData.experience);

  // 点击切换锁定状态
  const handleClick = () => {
    playSound('click'); // 播放点击音效
    setIsPinned(!isPinned);
  };

  // 悬浮音效
  const handleMouseEnter = () => {
    playSound('hover'); // 播放悬浮音效
  };

  return (
    <div
      className={`corner-widget ${isPinned ? 'pinned' : ''} ${className || ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {/* 主显示区域 */}
      <div className="main-display">
        <div className="level-icon-container">
          <StarIcon />
        </div>
        <div className="level-info">
          <span className="level-text" ref={levelContainerRef}>
            {translations.hud.level} {expProgress.level}
          </span>
        </div>
      </div>

      {/* 展开的详细信息 */}
      <div className="details">
        <div className="details-content">
          {/* 经验值区域 */}
          <div className="exp-section">
            <div className="exp-text-small">
              {expProgress.currentLevelExp}/{expProgress.nextLevelExp} {translations.hud.exp}
            </div>
            <div className="exp-bar-container">
              <div
                className="exp-bar-fill"
                style={{ width: `${expProgress.progress * 100}%` }}
              />
            </div>
          </div>

          {/* 统计数据区域 */}
          <div className="stats-section">
            {/* 今日练习 */}
            <div className="stat-item">
              <CalendarIcon />
              <span>{userData.todaySessions}</span>
            </div>

            {/* 最长连击 */}
            <div className="stat-item">
              <FlameIcon />
              <span>{userData.maxStreak}</span>
            </div>

            {/* 准确率 */}
            <div className="stat-item">
              <TargetIcon />
              <span>
                {userData.totalQuestions > 0
                  ? Math.round((userData.totalCorrect / userData.totalQuestions) * 100)
                  : 0
                }%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
