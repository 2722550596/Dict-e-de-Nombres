import { useCallback, useEffect } from 'react';
import { initAudioOnUserInteraction, playSound } from '../utils/audioEffects';

interface UseGlobalAudioEffectsOptions {
  enableHoverSounds?: boolean;
  enableClickSounds?: boolean;
  enableInputSounds?: boolean;
  enableSelectSounds?: boolean;
}

export const useGlobalAudioEffects = (options: UseGlobalAudioEffectsOptions = {}) => {
  const {
    enableHoverSounds = true,
    enableClickSounds = true,
    enableInputSounds = true,
    enableSelectSounds = true
  } = options;

  // 播放交互音效的便捷函数
  const playInteractionSound = useCallback((type: 'click' | 'hover' | 'input' | 'submit' | 'select' | 'tab' | 'navigation' | 'toggle' | 'success' | 'celebration') => {
    playSound(type);
  }, []);

  // 添加全局音效监听器
  useEffect(() => {
    const addGlobalSoundEffects = () => {
      // 为所有按钮添加音效
      if (enableClickSounds || enableHoverSounds) {
        const buttons = document.querySelectorAll('button');
        const buttonHandlers: Array<() => void> = [];

        buttons.forEach(button => {
          // 跳过已经有音效标记的按钮
          if (button.hasAttribute('data-sound-added')) return;
          button.setAttribute('data-sound-added', 'true');

          const handleClick = () => {
            if (enableClickSounds) {
              // 根据按钮类型播放不同音效
              if (button.classList.contains('mode-tab')) {
                playSound('tab');
              } else if (button.classList.contains('button-primary')) {
                playSound('navigation');
              } else {
                playSound('click');
              }
            }
          };

          const handleMouseEnter = () => {
            if (enableHoverSounds) {
              playSound('hover');
            }
          };

          button.addEventListener('click', handleClick);
          button.addEventListener('mouseenter', handleMouseEnter);

          // 保存清理函数
          buttonHandlers.push(() => {
            button.removeEventListener('click', handleClick);
            button.removeEventListener('mouseenter', handleMouseEnter);
            button.removeAttribute('data-sound-added');
          });
        });

        // 返回按钮清理函数
        return () => {
          buttonHandlers.forEach(cleanup => cleanup());
        };
      }
    };

    const addSelectSoundEffects = () => {
      if (!enableSelectSounds) return;

      const selects = document.querySelectorAll('select');
      const selectHandlers: Array<() => void> = [];

      selects.forEach(select => {
        if (select.hasAttribute('data-sound-added')) return;
        select.setAttribute('data-sound-added', 'true');

        const handleChange = () => {
          playSound('select');
        };

        const handleFocus = () => {
          playSound('hover');
        };

        select.addEventListener('change', handleChange);
        select.addEventListener('focus', handleFocus);

        selectHandlers.push(() => {
          select.removeEventListener('change', handleChange);
          select.removeEventListener('focus', handleFocus);
          select.removeAttribute('data-sound-added');
        });
      });

      return () => {
        selectHandlers.forEach(cleanup => cleanup());
      };
    };

    const addInputSoundEffects = () => {
      if (!enableInputSounds) return;

      const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="range"]');
      const inputHandlers: Array<() => void> = [];

      inputs.forEach(input => {
        if (input.hasAttribute('data-sound-added')) return;
        input.setAttribute('data-sound-added', 'true');

        const handleInput = () => {
          if (input.type === 'range') {
            // 音量滑块不播放音效，避免干扰
            return;
          }
          playSound('input');
        };

        const handleFocus = () => {
          playSound('hover');
        };

        input.addEventListener('input', handleInput);
        input.addEventListener('focus', handleFocus);

        inputHandlers.push(() => {
          input.removeEventListener('input', handleInput);
          input.removeEventListener('focus', handleFocus);
          input.removeAttribute('data-sound-added');
        });
      });

      return () => {
        inputHandlers.forEach(cleanup => cleanup());
      };
    };

    const addCheckboxSoundEffects = () => {
      if (!enableInputSounds) return;

      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const checkboxHandlers: Array<() => void> = [];

      checkboxes.forEach(checkbox => {
        if (checkbox.hasAttribute('data-sound-added')) return;
        checkbox.setAttribute('data-sound-added', 'true');

        const handleChange = () => {
          // 根据选中状态播放不同音效
          if ((checkbox as HTMLInputElement).checked) {
            playSound('toggle'); // 选中时播放toggle音效
          } else {
            playSound('click'); // 取消选中时播放click音效
          }
        };

        const handleFocus = () => {
          playSound('hover');
        };

        checkbox.addEventListener('change', handleChange);
        checkbox.addEventListener('focus', handleFocus);

        checkboxHandlers.push(() => {
          checkbox.removeEventListener('change', handleChange);
          checkbox.removeEventListener('focus', handleFocus);
          checkbox.removeAttribute('data-sound-added');
        });
      });

      return () => {
        checkboxHandlers.forEach(cleanup => cleanup());
      };
    };

    // 初始化音频上下文
    initAudioOnUserInteraction();

    // 添加所有音效
    const cleanupButtons = addGlobalSoundEffects();
    const cleanupSelects = addSelectSoundEffects();
    const cleanupInputs = addInputSoundEffects();
    const cleanupCheckboxes = addCheckboxSoundEffects();

    // 使用MutationObserver监听DOM变化，为新添加的元素添加音效
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        // 延迟执行，确保DOM完全更新
        setTimeout(() => {
          const newCleanupButtons = addGlobalSoundEffects();
          const newCleanupSelects = addSelectSoundEffects();
          const newCleanupInputs = addInputSoundEffects();
          const newCleanupCheckboxes = addCheckboxSoundEffects();

          // 注意：这里可能会导致内存泄漏，在实际应用中需要更好的清理机制
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 清理函数
    return () => {
      observer.disconnect();
      cleanupButtons?.();
      cleanupSelects?.();
      cleanupInputs?.();
      cleanupCheckboxes?.();
    };
  }, [enableHoverSounds, enableClickSounds, enableInputSounds, enableSelectSounds]);

  return {
    playInteractionSound
  };
};
