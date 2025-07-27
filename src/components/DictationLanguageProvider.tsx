/**
 * 听写语言提供者组件
 * 为应用提供听写语言上下文
 */

import React, { ReactNode } from 'react';
import { DictationLanguageContext, useDictationLanguageProvider } from '../hooks/useDictationLanguage';

interface DictationLanguageProviderProps {
  children: ReactNode;
}

export const DictationLanguageProvider: React.FC<DictationLanguageProviderProps> = ({ children }) => {
  const dictationLanguageValue = useDictationLanguageProvider();

  return (
    <DictationLanguageContext.Provider value={dictationLanguageValue}>
      {children}
    </DictationLanguageContext.Provider>
  );
};
