import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  return (
    <div className={`language-selector ${className}`}>
      <select 
        value={currentLanguage.code} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
        title="Select Language / Choisir la langue"
      >
        {availableLanguages.map(language => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};