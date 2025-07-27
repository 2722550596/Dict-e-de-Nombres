/**
 * 动态标题组件
 * 在标题中集成听写语言选择器，实现如下效果：
 * - 法语界面：Dictée de Nombres en [Français▼]
 * - 英语界面：[French▼] Number Dictation  
 * - 中文界面：[法语▼]数字听写
 */

import React from 'react';
import { useDictationLanguage } from '../hooks/useDictationLanguage';
import { useLanguage } from '../hooks/useLanguage';

interface DynamicTitleProps {
  className?: string;
}

export const DynamicTitle: React.FC<DynamicTitleProps> = ({ className = '' }) => {
  const { translations } = useLanguage();
  const { currentDictationLanguage, changeDictationLanguage, availableDictationLanguages } = useDictationLanguage();

  // 获取当前听写语言在界面语言下的显示名称
  const getCurrentDictationLanguageName = () => {
    return translations.dictationLanguageNames[currentDictationLanguage.code] || currentDictationLanguage.name;
  };

  // 处理语言选择变化
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeDictationLanguage(event.target.value);
  };

  // 创建语言选择器下拉菜单
  const renderLanguageSelector = () => {
    return (
      <select
        value={currentDictationLanguage.code}
        onChange={handleLanguageChange}
        className="dictation-language-dropdown"
        title={translations.dictationLanguage.tooltip}
      >
        {availableDictationLanguages.map(language => (
          <option key={language.code} value={language.code}>
            {translations.dictationLanguageNames[language.code] || language.name}
          </option>
        ))}
      </select>
    );
  };

  // 解析模板并插入语言选择器
  const renderDynamicTitle = () => {
    const template = translations.dynamicTitle.template;
    const languageName = getCurrentDictationLanguageName();

    // 将模板中的 {language} 替换为语言选择器
    const parts = template.split('{language}');

    if (parts.length === 2) {
      // 检查前一部分是否以介词结尾（如 "en " 或 "in "）
      const beforePart = parts[0];
      const afterPart = parts[1];
      const hasPreposition = beforePart.match(/\b(en|in)\s*$/);

      if (hasPreposition) {
        // 如果有介词，将介词和语言选择器包装在一起防止换行
        const prepositionMatch = beforePart.match(/^(.*?)(\b(?:en|in)\s*)$/);
        if (prepositionMatch) {
          const beforePreposition = prepositionMatch[1];
          const preposition = prepositionMatch[2];

          return (
            <>
              {beforePreposition}
              <span className="language-selector-wrapper">
                {preposition}
                {renderLanguageSelector()}
              </span>
              {afterPart}
            </>
          );
        }
      }

      // 默认处理方式
      return (
        <>
          {beforePart}
          <span className="language-selector-wrapper">
            {renderLanguageSelector()}
          </span>
          {afterPart}
        </>
      );
    }

    // 如果模板格式不正确，回退到简单显示
    return template.replace('{language}', languageName);
  };

  return (
    <h1 className={`dynamic-title ${className}`}>
      {renderDynamicTitle()}
    </h1>
  );
};

/**
 * 动态副标题组件
 * 显示应用的副标题
 */
export const DynamicSubtitle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { translations } = useLanguage();
  
  return (
    <p className={`app-subtitle ${className}`}>
      {translations.appSubtitle}
    </p>
  );
};

export default DynamicTitle;
