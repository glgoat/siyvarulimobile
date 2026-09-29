import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type Language = 'ka' | 'en';

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({
  language: 'ka',
  setLanguage: () => undefined,
});

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>('ka');

  useEffect(() => {
    AsyncStorage.getItem('siyvaruli-language').then((value) => {
      if (value === 'ka' || value === 'en') setLanguageState(value);
    });
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    void AsyncStorage.setItem('siyvaruli-language', next);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
