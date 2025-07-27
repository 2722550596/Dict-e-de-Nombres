import { createContext, useContext, useEffect, useState } from 'react';
import { Language, SUPPORTED_LANGUAGES, TRANSLATIONS, Translations } from '../i18n/languages';
import { playSound } from '../utils/audioEffects';

interface LanguageContextType {
  currentLanguage: Language;
  translations: Translations;
  changeLanguage: (languageCode: string) => void;
  availableLanguages: Language[];
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageProvider = () => {
  const [currentLanguageCode, setCurrentLanguageCode] = useState<string>(() => {
    // 从localStorage读取保存的语言，或使用浏览器语言，或默认法语
    const saved = localStorage.getItem('selectedLanguage');
    if (saved && SUPPORTED_LANGUAGES.find(lang => lang.code === saved)) {
      return saved;
    }

    // 检测浏览器语言
    const browserLang = navigator.language.split('-')[0];
    const supportedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
    return supportedLang?.code || 'fr';
  });

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguageCode) || SUPPORTED_LANGUAGES[0];
  const translations = TRANSLATIONS[currentLanguageCode] || TRANSLATIONS.fr;

  const changeLanguage = (languageCode: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    if (language) {
      playSound('select'); // 语言切换时播放选择音效
      setCurrentLanguageCode(languageCode);
      localStorage.setItem('selectedLanguage', languageCode);
    }
  };

  useEffect(() => {
    // 更新HTML lang属性
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  return {
    currentLanguage,
    translations,
    changeLanguage,
    availableLanguages: SUPPORTED_LANGUAGES
  };
};