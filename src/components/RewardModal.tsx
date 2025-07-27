import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CONFIG } from '../../config';
import { useGlobalAudioEffects } from '../hooks/useGlobalAudioEffects';
import { useLanguage } from '../hooks/useLanguage';
import type { RewardInfo } from '../types';
import { playCelebration, playSound } from '../utils/audioEffects';
import { GameDataManager } from '../utils/gameData';
import './RewardModal.css';
import SlotMachineNumber from './SlotMachineNumber';

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
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [showStreakBonus, setShowStreakBonus] = useState(false);

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
    celebrationText.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; justify-content: center;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5.8 11.3 2 22l10.7-3.79"/>
          <path d="M4 3h7a2 2 0 0 1 2 2v6.5"/>
          <path d="M9 12.2 2 22l10.7-3.79"/>
          <path d="m15 9 4-4 3 3-4 4-3-3"/>
          <path d="m18 5 3-3"/>
          <path d="m21 2 1 1"/>
          <path d="M9 12.2 2 22l10.7-3.79"/>
          <circle cx="19" cy="19" r="2"/>
          <path d="m20.5 17.5-1 1"/>
        </svg>
        <span>${translations.congratulations}</span>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5.8 11.3 2 22l10.7-3.79"/>
          <path d="M4 3h7a2 2 0 0 1 2 2v6.5"/>
          <path d="M9 12.2 2 22l10.7-3.79"/>
          <path d="m15 9 4-4 3 3-4 4-3-3"/>
          <path d="m18 5 3-3"/>
          <path d="m21 2 1 1"/>
          <path d="M9 12.2 2 22l10.7-3.79"/>
          <circle cx="19" cy="19" r="2"/>
          <path d="m20.5 17.5-1 1"/>
        </svg>
      </div>
    `;
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
      // 重置状态
      setShowSlotMachine(false);
      setShowStreakBonus(false);

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

          // 延迟后开始老虎机动画
          setTimeout(() => {
            setShowSlotMachine(true);
            // 播放老虎机音效
            playSound('click');
          }, CONFIG.TIMING.DELAY.SLOT_MACHINE_START);
        });
      });
    } else {
      setIsVisible(false);
      setShowSlotMachine(false);
      setShowStreakBonus(false);

      // 等待动画完成后移除渲染
      const removeTimer = setTimeout(() => {
        setIsRendered(false);
      }, 400); // 稍微增加延迟以确保动画完成

      return () => {
        clearTimeout(removeTimer);
      };
    }
  }, [show]); // 只依赖show，避免不必要的重新执行

  const handleSlotMachineComplete = useCallback(() => {
    // 老虎机动画完成后，显示连击奖励
    setTimeout(() => {
      setShowStreakBonus(true);
      // 播放连击奖励音效
      if (reward.streakBonus > 0) {
        playSound('success');
      }
    }, CONFIG.TIMING.DELAY.STREAK_BONUS_SHOW);
  }, [reward.streakBonus]);

  // 使用useMemo稳定SlotMachineNumber组件，避免因showStreakBonus变化而重新创建
  const slotMachineComponent = useMemo(() => {
    if (!showSlotMachine) return null;

    return (
      <SlotMachineNumber
        key={`slot-${reward.experience}-${reward.streakBonus}`}
        value={reward.experience - reward.streakBonus}
        onAnimationComplete={handleSlotMachineComplete}
        className="base-exp-slot"
        enableSound={true}
      />
    );
  }, [showSlotMachine, reward.experience, reward.streakBonus, handleSlotMachineComplete]);

  const handleClose = () => {
    playInteractionSound('click');
    setIsVisible(false);
    setTimeout(onClose, CONFIG.TIMING.ANIMATION.MODAL_FADE); // 等待动画完成后调用onClose
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
            {showSlotMachine ? (
              <>
                {slotMachineComponent}
                {reward.streakBonus > 0 && (
                  <>
                    <span className="streak-plus" style={{ opacity: showStreakBonus ? 1 : 0 }}> + </span>
                    <span className="streak-bonus" style={{ opacity: showStreakBonus ? 1 : 0 }}>
                      {reward.streakBonus}<span className="lightning">⚡</span>
                    </span>
                  </>
                )}
              </>
            ) : (
              // 占位符，保持布局稳定
              <span className="base-exp" style={{ opacity: 0 }}>+{reward.experience}</span>
            )}
          </div>
          <div className="experience-label">{translations.rewardModal.experience}</div>
        </div>

        {/* 次要数据网格 - 在老虎机动画完成后显示 */}
        <div
          className="stats-grid"
          style={{
            opacity: showStreakBonus ? 1 : 0,
            transform: showStreakBonus ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <div className="stat-card">
            <div className="stat-label">{translations.rewardModal.maxStreak}</div>
            <div className="stat-value">{reward.streak}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">{translations.rewardModal.accuracy}</div>
            <div className="stat-value">{Math.round(reward.accuracy * 100)}%</div>
          </div>
        </div>



        {/* 底部：经验条和按钮 - 在老虎机动画完成后显示 */}
        <div
          className="reward-footer"
          style={{
            opacity: showStreakBonus ? 1 : 0,
            transform: showStreakBonus ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s'
          }}
        >
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
