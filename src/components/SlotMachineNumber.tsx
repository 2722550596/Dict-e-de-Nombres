import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { playSound } from '../utils/audioEffects';
import './SlotMachineNumber.css';

interface SlotMachineNumberProps {
  value: number;
  onAnimationComplete?: () => void;
  className?: string;
  enableSound?: boolean;
}

interface DigitProps {
  targetDigit: number;
  delay: number;
  onComplete?: () => void;
}

const SlotDigit: React.FC<DigitProps> = ({ targetDigit, delay, onComplete }) => {
  const [currentDigit, setCurrentDigit] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 延迟开始动画
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(true);
      
      // 快速滚动阶段 (1秒)
      let currentValue = 0;
      const fastDuration = 1000;
      const fastInterval = 50; // 每50ms更新一次
      const totalFastSteps = fastDuration / fastInterval;
      let step = 0;

      intervalRef.current = setInterval(() => {
        step++;
        currentValue = Math.floor(Math.random() * 10);
        setCurrentDigit(currentValue);

        if (step >= totalFastSteps) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          
          // 减速阶段 (0.5秒)
          let slowStep = 0;
          const slowSteps = 5;
          const slowInterval = 100;
          
          intervalRef.current = setInterval(() => {
            slowStep++;
            if (slowStep < slowSteps) {
              // 逐渐接近目标值
              const progress = slowStep / slowSteps;
              const randomRange = Math.max(1, Math.floor((1 - progress) * 5));
              currentValue = Math.floor(Math.random() * randomRange) + 
                           Math.max(0, targetDigit - randomRange + 1);
              setCurrentDigit(currentValue);
            } else {
              // 最终停在目标值
              setCurrentDigit(targetDigit);
              setIsAnimating(false);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              onComplete?.();
            }
          }, slowInterval);
        }
      }, fastInterval);
    }, delay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [targetDigit, delay, onComplete]);

  return (
    <span className={`slot-digit ${isAnimating ? 'animating' : ''}`}>
      {currentDigit}
    </span>
  );
};

export const SlotMachineNumber: React.FC<SlotMachineNumberProps> = ({
  value,
  onAnimationComplete,
  className = '',
  enableSound = true
}) => {
  const [completedDigits, setCompletedDigits] = useState(new Set<number>());
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // 将数字转换为数字数组，确保至少有一位
  const digits = value.toString().split('').map(Number);
  const totalDigits = digits.length;

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = null;
      }
    };
  }, []);

  // 当value变化时重置状态
  useEffect(() => {
    setCompletedDigits(new Set<number>());
    // 清理之前的音效
    if (soundIntervalRef.current) {
      clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = null;
    }
  }, [value]);

  const handleDigitComplete = useCallback((digitIndex: number) => {
    if (!isMountedRef.current) return; // 组件已卸载，不处理

    setCompletedDigits(prev => {
      const newSet = new Set(prev);
      newSet.add(digitIndex);

      if (newSet.size === totalDigits && isMountedRef.current) {
        // 所有数位动画完成，停止音效
        if (soundIntervalRef.current) {
          clearInterval(soundIntervalRef.current);
          soundIntervalRef.current = null;
        }
        setTimeout(() => {
          if (isMountedRef.current) {
            onAnimationComplete?.();
          }
        }, 100);
      }
      return newSet;
    });
  }, [totalDigits, onAnimationComplete]);

  // 开始滚动音效 - 只在组件首次挂载时启动
  useEffect(() => {
    if (enableSound && isMountedRef.current) {
      // 延迟开始音效，与第一个数位的动画同步
      const soundTimeout = setTimeout(() => {
        if (isMountedRef.current) {
          // 播放持续的滚动音效
          soundIntervalRef.current = setInterval(() => {
            if (isMountedRef.current) {
              playSound('hover'); // 使用hover音效作为滚动音效
            }
          }, 100); // 每100ms播放一次
        }
      }, 100);

      return () => {
        clearTimeout(soundTimeout);
        if (soundIntervalRef.current) {
          clearInterval(soundIntervalRef.current);
          soundIntervalRef.current = null;
        }
      };
    }
  }, []); // 空依赖数组，只在挂载时执行一次

  // 使用useMemo创建稳定的回调函数数组
  const digitCallbacks = useMemo(() => {
    return digits.map((_, index) => () => handleDigitComplete(index));
  }, [digits.length, handleDigitComplete]);

  return (
    <div className={`slot-machine-number ${className}`}>
      <span className="plus-sign">+</span>
      {digits.map((digit, index) => (
        <SlotDigit
          key={index}
          targetDigit={digit}
          delay={index * 100} // 每个数位延迟100ms开始
          onComplete={digitCallbacks[index]} // 使用稳定的回调函数
        />
      ))}
    </div>
  );
};

export default SlotMachineNumber;
