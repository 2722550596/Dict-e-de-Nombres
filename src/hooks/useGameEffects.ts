import { useEffect, useCallback, useState } from 'react';
import { playSound, playCelebration, initAudioOnUserInteraction } from '../utils/audioEffects';
import { useLanguage } from './useLanguage';

interface UseGameEffectsProps {
  userAnswers: string[];
  correctAnswers: (number | string)[];
  isSubmitted: boolean;
}

export const useGameEffects = ({ userAnswers, correctAnswers, isSubmitted }: UseGameEffectsProps) => {
  const { translations } = useLanguage();
  const [showCelebration, setShowCelebration] = useState(false);

  // 检查是否全部正确
  const checkAllCorrect = useCallback(() => {
    if (!isSubmitted || userAnswers.length === 0) return false;
    
    return userAnswers.every((answer, index) => {
      const correctAnswer = correctAnswers[index];
      return answer === correctAnswer?.toString();
    });
  }, [userAnswers, correctAnswers, isSubmitted]);

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

  // 播放庆祝效果
  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
    createConfetti();
    playCelebration();
    
    // 重置庆祝状态
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  }, [createConfetti]);

  // 播放交互音效
  const playInteractionSound = useCallback((type: 'click' | 'hover' | 'input' | 'submit') => {
    playSound(type);
  }, []);

  // 监听提交状态变化 - 礼炮功能已移至RewardModal
  // useEffect(() => {
  //   if (isSubmitted && checkAllCorrect()) {
  //     triggerCelebration();
  //   }
  // }, [isSubmitted, checkAllCorrect, triggerCelebration]);

  // 初始化音频上下文
  useEffect(() => {
    initAudioOnUserInteraction();
  }, []);

  // 为按钮添加音效事件监听器
  useEffect(() => {
    const addSoundToButtons = () => {
      // 为所有按钮添加点击音效
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        const handleClick = () => playSound('click');
        const handleMouseEnter = () => playSound('hover');
        
        button.addEventListener('click', handleClick);
        button.addEventListener('mouseenter', handleMouseEnter);
        
        // 清理函数
        return () => {
          button.removeEventListener('click', handleClick);
          button.removeEventListener('mouseenter', handleMouseEnter);
        };
      });

      // 为输入框添加输入音效
      const inputs = document.querySelectorAll('input[type="text"]');
      inputs.forEach(input => {
        const handleInput = () => playSound('input');
        input.addEventListener('input', handleInput);
        
        return () => {
          input.removeEventListener('input', handleInput);
        };
      });
    };

    // 延迟添加事件监听器，确保DOM已渲染
    const timeoutId = setTimeout(addSoundToButtons, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isSubmitted]); // 当提交状态改变时重新添加监听器

  // 检查单个答案的正确性并播放相应音效
  const checkAnswerSound = useCallback((index: number, answer: string) => {
    if (!isSubmitted) return;
    
    const correctAnswer = correctAnswers[index];
    if (answer === correctAnswer?.toString()) {
      playSound('success');
    } else if (answer && answer !== correctAnswer?.toString()) {
      playSound('error');
    }
  }, [correctAnswers, isSubmitted]);

  return {
    showCelebration,
    playInteractionSound,
    checkAnswerSound,
    triggerCelebration
  };
};
