/**
 * 听写语言选择器组件
 * 允许用户选择听写语言，独立于界面语言
 */

import React, { useEffect, useState } from 'react';
import { useDictationLanguage, checkVoiceSupport } from '../hooks/useDictationLanguage';
import { useLanguage } from '../hooks/useLanguage';
import { DictationLanguage } from '../i18n/languages';

interface DictationLanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export const DictationLanguageSelector: React.FC<DictationLanguageSelectorProps> = ({ 
  className = '', 
  showLabel = true,
  compact = false 
}) => {
  const { translations } = useLanguage();
  const { 
    currentDictationLanguage, 
    changeDictationLanguage, 
    availableDictationLanguages 
  } = useDictationLanguage();
  
  const [supportedLanguages, setSupportedLanguages] = useState<DictationLanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 检查浏览器支持的语言
  useEffect(() => {
    const checkLanguageSupport = async () => {
      setIsLoading(true);
      const supported: DictationLanguage[] = [];

      for (const lang of availableDictationLanguages) {
        const isSupported = await checkVoiceSupport(lang.speechLang);
        if (isSupported) {
          supported.push(lang);
        }
      }

      // 如果没有找到支持的语言，至少保留当前选择的语言
      if (supported.length === 0) {
        supported.push(currentDictationLanguage);
      }

      setSupportedLanguages(supported);
      setIsLoading(false);
    };

    checkLanguageSupport();
  }, [availableDictationLanguages, currentDictationLanguage]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeDictationLanguage(event.target.value);
  };

  if (isLoading) {
    return (
      <div className={`dictation-language-selector loading ${className}`}>
        {showLabel && !compact && (
          <label className="dictation-language-label">
            {translations.dictationLanguage.label}
          </label>
        )}
        <select disabled className="dictation-language-select">
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  return (
    <div className={`dictation-language-selector ${compact ? 'compact' : ''} ${className}`}>
      {showLabel && !compact && (
        <label 
          htmlFor="dictation-language-select"
          className="dictation-language-label"
        >
          {translations.dictationLanguage.label}
        </label>
      )}
      <select
        id="dictation-language-select"
        value={currentDictationLanguage.code}
        onChange={handleLanguageChange}
        className="dictation-language-select"
        title={translations.dictationLanguage.tooltip}
      >
        {supportedLanguages.map(language => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
      {supportedLanguages.length < availableDictationLanguages.length && (
        <div className="dictation-language-warning">
          <small>
            {supportedLanguages.length} / {availableDictationLanguages.length} languages available
          </small>
        </div>
      )}
    </div>
  );
};

/**
 * 紧凑版听写语言选择器（用于工具栏等空间有限的地方）
 */
export const CompactDictationLanguageSelector: React.FC<{className?: string}> = ({ className }) => {
  return (
    <DictationLanguageSelector 
      className={className}
      showLabel={false}
      compact={true}
    />
  );
};

/**
 * 带状态指示的听写语言选择器
 */
export const DictationLanguageSelectorWithStatus: React.FC<DictationLanguageSelectorProps> = (props) => {
  const { currentDictationLanguage } = useDictationLanguage();
  const [voiceStatus, setVoiceStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  useEffect(() => {
    const checkCurrentLanguageSupport = async () => {
      setVoiceStatus('checking');
      const isSupported = await checkVoiceSupport(currentDictationLanguage.speechLang);
      setVoiceStatus(isSupported ? 'available' : 'unavailable');
    };

    checkCurrentLanguageSupport();
  }, [currentDictationLanguage]);

  const getStatusIcon = () => {
    switch (voiceStatus) {
      case 'checking':
        return '⏳';
      case 'available':
        return '✅';
      case 'unavailable':
        return '❌';
      default:
        return '';
    }
  };

  const getStatusText = () => {
    switch (voiceStatus) {
      case 'checking':
        return 'Checking voice support...';
      case 'available':
        return 'Voice available';
      case 'unavailable':
        return 'Voice not available';
      default:
        return '';
    }
  };

  return (
    <div className="dictation-language-selector-with-status">
      <DictationLanguageSelector {...props} />
      <div className="voice-status" title={getStatusText()}>
        <span className="status-icon">{getStatusIcon()}</span>
        {!props.compact && (
          <span className="status-text">{getStatusText()}</span>
        )}
      </div>
    </div>
  );
};

export default DictationLanguageSelector;
