/**
 * 听写语言管理Hook
 * 管理听写语言状态，独立于界面语言
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { DictationLanguage, SUPPORTED_DICTATION_LANGUAGES } from '../i18n/languages';
import { SupportedDictationLanguage } from '../utils/math/operators-i18n';
import { playSound } from '../utils/audioEffects';

interface DictationLanguageContextType {
  currentDictationLanguage: DictationLanguage;
  changeDictationLanguage: (languageCode: string) => void;
  availableDictationLanguages: DictationLanguage[];
  getSpeechLanguageCode: () => SupportedDictationLanguage;
}

export const DictationLanguageContext = createContext<DictationLanguageContextType | null>(null);

export const useDictationLanguage = () => {
  const context = useContext(DictationLanguageContext);
  if (!context) {
    throw new Error('useDictationLanguage must be used within a DictationLanguageProvider');
  }
  return context;
};

export const useDictationLanguageProvider = () => {
  const [currentDictationLanguageCode, setCurrentDictationLanguageCode] = useState<string>(() => {
    // 从localStorage读取保存的听写语言，或使用默认法语
    const saved = localStorage.getItem('selectedDictationLanguage');
    if (saved && SUPPORTED_DICTATION_LANGUAGES.find(lang => lang.code === saved)) {
      return saved;
    }

    // 默认使用法语
    return 'fr';
  });

  const currentDictationLanguage = SUPPORTED_DICTATION_LANGUAGES.find(
    lang => lang.code === currentDictationLanguageCode
  ) || SUPPORTED_DICTATION_LANGUAGES[0];

  const changeDictationLanguage = (languageCode: string) => {
    const language = SUPPORTED_DICTATION_LANGUAGES.find(lang => lang.code === languageCode);
    if (language) {
      playSound('select'); // 语言切换时播放选择音效
      setCurrentDictationLanguageCode(languageCode);
      localStorage.setItem('selectedDictationLanguage', languageCode);
    }
  };

  const getSpeechLanguageCode = (): SupportedDictationLanguage => {
    return currentDictationLanguage.speechLang as SupportedDictationLanguage;
  };

  useEffect(() => {
    // 可以在这里添加语言变化时的副作用
    console.log('Dictation language changed to:', currentDictationLanguage.name);
  }, [currentDictationLanguage]);

  return {
    currentDictationLanguage,
    changeDictationLanguage,
    availableDictationLanguages: SUPPORTED_DICTATION_LANGUAGES,
    getSpeechLanguageCode
  };
};

/**
 * 检查浏览器是否支持指定的语音语言
 */
export const checkVoiceSupport = (speechLang: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve(false);
      return;
    }

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length === 0) {
        // 语音列表可能还在加载中，稍后重试
        setTimeout(checkVoices, 100);
        return;
      }

      // 检查是否有匹配的语音
      const hasMatchingVoice = voices.some(voice => 
        voice.lang.toLowerCase().startsWith(speechLang.toLowerCase().split('-')[0])
      );
      
      resolve(hasMatchingVoice);
    };

    checkVoices();
  });
};

/**
 * 获取指定语言的最佳语音
 */
export const getBestVoiceForLanguage = (speechLang: string): SpeechSynthesisVoice | null => {
  if (!window.speechSynthesis) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  const langCode = speechLang.split('-')[0].toLowerCase();

  // 首先检查用户是否保存了特定语音偏好
  const storageKey = `selectedVoice_${langCode}`;

  try {
    const savedVoiceData = localStorage.getItem(storageKey);
    if (savedVoiceData) {
      const voiceData = JSON.parse(savedVoiceData);

      // 尝试找到匹配的保存语音
      const savedVoice = voices.find(voice =>
        voice.voiceURI === voiceData.voiceURI ||
        (voice.name === voiceData.name && voice.lang === voiceData.lang)
      );

      if (savedVoice) {
        console.log(`🎤 使用用户保存的语音: ${savedVoice.name} (${savedVoice.lang})`);
        return savedVoice;
      } else {
        // 如果保存的语音不再可用，清除保存的数据
        localStorage.removeItem(storageKey);
        console.warn(`⚠️ 保存的语音不再可用，已清除: ${voiceData.name}`);
      }
    }
  } catch (error) {
    console.error('读取保存语音时出错:', error);
    localStorage.removeItem(storageKey);
  }

  // 如果没有保存的语音，使用自动选择逻辑
  // 首先尝试精确匹配
  let bestVoice = voices.find(voice =>
    voice.lang.toLowerCase() === speechLang.toLowerCase()
  );

  // 如果没有精确匹配，尝试语言代码匹配（如 'en' 匹配 'en-US'）
  if (!bestVoice) {
    bestVoice = voices.find(voice =>
      voice.lang.toLowerCase().startsWith(langCode)
    );
  }

  // 不强制优先选择本地语音，保持找到的最佳语音
  // 注释掉原来强制选择本地语音的逻辑，让用户可以使用Google语音
  // if (bestVoice && !bestVoice.localService) {
  //   const localVoice = voices.find(voice =>
  //     voice.lang.toLowerCase().startsWith(langCode) &&
  //     voice.localService
  //   );
  //   if (localVoice) {
  //     bestVoice = localVoice;
  //   }
  // }

  if (bestVoice) {
    console.log(`🎤 自动选择语音: ${bestVoice.name} (${bestVoice.lang})`);
  }

  return bestVoice || null;
};

/**
 * 测试指定语言的语音合成
 */
export const testVoiceForLanguage = (speechLang: string, testText?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve(false);
      return;
    }

    const voice = getBestVoiceForLanguage(speechLang);
    const text = testText || '123'; // 默认测试数字

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    if (voice) {
      utterance.voice = voice;
    }

    let resolved = false;

    utterance.onend = () => {
      if (!resolved) {
        resolved = true;
        resolve(true);
      }
    };

    utterance.onerror = () => {
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    };

    // 设置超时，避免无限等待
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        window.speechSynthesis.cancel();
        resolve(false);
      }
    }, 3000);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    }
  });
};

/**
 * 获取所有可用的语音语言列表
 */
export const getAvailableVoiceLanguages = (): string[] => {
  if (!window.speechSynthesis) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  const languages = new Set<string>();
  
  voices.forEach(voice => {
    languages.add(voice.lang);
  });

  return Array.from(languages).sort();
};

/**
 * 获取支持的听写语言中实际可用的语言
 */
export const getAvailableDictationLanguages = async (): Promise<DictationLanguage[]> => {
  const availableLanguages: DictationLanguage[] = [];

  for (const lang of SUPPORTED_DICTATION_LANGUAGES) {
    const isSupported = await checkVoiceSupport(lang.speechLang);
    if (isSupported) {
      availableLanguages.push(lang);
    }
  }

  return availableLanguages;
};
