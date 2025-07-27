/**
 * SimpleGameHUD组件 - 重构后使用统一的HUD组件
 * 保持向后兼容性，内部使用UnifiedGameHUD
 */

import React from 'react';
import UnifiedGameHUD from './UnifiedGameHUD';

/**
 * SimpleGameHUD组件 - 向后兼容的包装器
 */
export const SimpleGameHUD: React.FC = () => {
  return (
    <UnifiedGameHUD
      variant="simple"
      enableSounds={false}
      enableLevelUpAnimation={false}
    />
  );
};

export default SimpleGameHUD;