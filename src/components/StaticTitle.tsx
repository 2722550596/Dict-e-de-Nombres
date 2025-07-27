/**
 * 静态标题组件
 * 用于练习页面，显示简单的应用标题，不包含语言选择器
 */

import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface StaticTitleProps {
  className?: string;
}

export const StaticTitle: React.FC<StaticTitleProps> = ({ className = '' }) => {
  const { translations } = useLanguage();

  return (
    <h1 className={`static-title ${className}`}>
      {translations.appTitle}
    </h1>
  );
};

/**
 * 静态副标题组件
 * 用于练习页面
 */
export const StaticSubtitle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { translations } = useLanguage();
  
  return (
    <p className={`app-subtitle ${className}`}>
      {translations.appSubtitle}
    </p>
  );
};

export default StaticTitle;
