import React, { useEffect, useState, useCallback } from 'react';
import { RewardInfo, GameDataManager } from '../utils/gameData';
import { useLanguage } from '../hooks/useLanguage';
import { useGlobalAudioEffects } from '../hooks/useGlobalAudioEffects';
import { playCelebration } from '../utils/audioEffects';
import './RewardModal.css';

interface RewardModalProps {
  reward: RewardInfo;
  show: boolean;
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ reward, show, onClose }) => {
  const { translations } = useLanguage();
  const { playInteractionSound } = useGlobalAudioEffects();
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // 创建礼炮动画元素
  const createConfetti = useCallback(() => {
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';

    // 创建彩纸
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      overlay.appendChild(confetti);
    }

    // 创建烟花效果
    for (let i = 0; i < 20; i++) {
      const firework = document.createElement('div');
      firework.className = 'firework';
      firework.style.left = Math.random() * 100 + '%';
      firework.style.top = Math.random() * 100 + '%';
      firework.style.backgroundColor = [
        '#3b82f6', '#22c55e', '#fbbf24', '#f472b6', '#a78bfa'
      ][Math.floor(Math.random() * 5)];
      firework.style.animationDelay = Math.random() * 2 + 's';
      overlay.appendChild(firework);
    }

    // 创建庆祝文字
    const celebrationText = document.createElement('div');
    celebrationText.className = 'celebration-text';
    celebrationText.textContent = '🎉 ' + translations.congratulations + ' 🎉';
    overlay.appendChild(celebrationText);

    document.body.appendChild(overlay);

    // 3秒后移除动画
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 3000);
  }, [translations]);

  useEffect(() => {
    if (show) {
      // 立即渲染但不显示
      setIsRendered(true);

      // 如果是完美分数，触发礼炮动画
      if (reward.perfectScore) {
        createConfetti();
        setTimeout(() => playCelebration(), 100);
      }

      // 播放奖励音效
      if (reward.levelUp) {
        // 如果升级了，播放特殊的庆祝音效序列
        setTimeout(() => playInteractionSound('celebration'), 200);
      } else if (reward.perfectScore) {
        // 完美分数播放庆祝音效
        setTimeout(() => playInteractionSound('celebration'), 200);
      } else {
        // 普通完成音效
        setTimeout(() => playInteractionSound('success'), 200);
      }

      // 使用requestAnimationFrame确保DOM更新后再开始动画
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // 等待动画完成后移除渲染
      const removeTimer = setTimeout(() => {
        setIsRendered(false);
      }, 400); // 稍微增加延迟以确保动画完成

      return () => {
        clearTimeout(removeTimer);
      };
    }
  }, [show, playInteractionSound, reward.levelUp, reward.perfectScore, createConfetti]);

  const handleClose = () => {
    playInteractionSound('click');
    setIsVisible(false);
    setTimeout(onClose, 400); // 等待动画完成后调用onClose
  };

  // 如果没有渲染，直接返回null
  if (!isRendered) return null;



  // 获取经验进度信息
  const userData = GameDataManager.loadUserData();
  const expProgress = GameDataManager.getExperienceProgress(userData.experience);

  return (
    <div className={`reward-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`reward-modal ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>

        {/* 升级时显示 */}
        {reward.levelUp && (
          <div className="level-up-view">
            <h2 className="level-up-title">
              <span className="level-number">Niveau {reward.levelUp.newLevel}</span>
              <span className="level-text">atteint !</span>
            </h2>
          </div>
        )}

        {/* 普通时显示 */}
        {!reward.levelUp && (
          <div className="normal-view">
            <h2 className="session-title">{translations.rewardModal.sessionComplete}</h2>
            <p className="session-subtitle">{translations.rewardModal.youEarned}</p>
          </div>
        )}

        {/* 核心经验数据 */}
        <div className="experience-display">
          <div className="experience-value">
            {reward.streakBonus > 0 ? (
              <>
                <span className="base-exp">+{reward.experience - reward.streakBonus}</span>
                <span className="streak-plus"> + </span>
                <span className="streak-bonus">{reward.streakBonus}<span className="lightning">⚡</span></span>
              </>
            ) : (
              <span className="base-exp">+{reward.experience}</span>
            )}
          </div>
          <div className="experience-label">{translations.rewardModal.experience}</div>
        </div>

        {/* 次要数据网格 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">{translations.rewardModal.maxStreak}</div>
            <div className="stat-value">{reward.streak}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{translations.rewardModal.accuracy}</div>
            <div className="stat-value">{Math.round(reward.accuracy * 100)}%</div>
          </div>
        </div>



        {/* 底部：经验条和按钮 */}
        <div className="reward-footer">
          <div className="xp-bar-container">
            <div className="xp-bar-track">
              <div
                className="xp-bar-fill"
                style={{ width: `${expProgress.progress * 100}%` }}
              ></div>
            </div>
            <p className="xp-text">
              {expProgress.currentLevelExp} / {expProgress.nextLevelExp} XP
            </p>
          </div>
          <button className="reward-confirm-btn" onClick={handleClose}>
            {reward.levelUp ? translations.rewardModal.awesome : translations.rewardModal.continueButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
