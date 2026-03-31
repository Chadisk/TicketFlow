import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import { getTranslations } from './i18n';
import './index.css';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.localStorage.getItem('ticketflow-theme') || 'light';
  });
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    const storedLang = window.localStorage.getItem('ticketflow-lang');
    if (storedLang === 'en' || storedLang === 'th') {
      return storedLang;
    }

    return window.navigator.language?.toLowerCase().startsWith('th') ? 'th' : 'en';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('ticketflow-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = getTranslations(lang).pageTitle;
    window.localStorage.setItem('ticketflow-lang', lang);
  }, [lang]);

  return (
    <Dashboard
      theme={theme}
      lang={lang}
      copy={getTranslations(lang)}
      onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
      onToggleLang={() => setLang((currentLang) => (currentLang === 'en' ? 'th' : 'en'))}
    />
  );
}

export default App;
