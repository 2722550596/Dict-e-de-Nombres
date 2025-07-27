/**
 * GameHUD组件 - 重构后使用统一的HUD组件
 * 保持向后兼容性，内部使用UnifiedGameHUD
 */

import React from 'react';
import './GameHUD.css';
import UnifiedGameHUD from './UnifiedGameHUD';

// 组件属性接口
export interface GameHUDProps {
  className?: string;
}

/**
 * GameHUD组件 - 向后兼容的包装器
 */
export const GameHUD: React.FC<GameHUDProps> = ({ className }) => {
  return (
    <UnifiedGameHUD
      className={className}
      variant="full"
      enableSounds={true}
      enableLevelUpAnimation={true}
    />
  );
};

export default GameHUD;
