import React, { createContext, useContext, ReactNode } from 'react';
import { useLanguageProvider, LanguageContext } from '../hooks/useLanguage';

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const languageValue = useLanguageProvider();

  return (
    <LanguageContext.Provider value={languageValue}>
      {children}
    </LanguageContext.Provider>
  );
};