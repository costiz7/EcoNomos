import { createContext, useState, useEffect, useContext } from 'react';
import en from '../locales/en.json';
import ro from '../locales/ro.json';

// Unificăm traducerile într-un obiect
const translations = { en, ro };

// Creăm Contextul
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [currentLang, setCurrentLang] = useState('en');

    // La prima încărcare a aplicației, verificăm ce limbă era setată (ca în Switcher-ul tău)
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        const localLang = localStorage.getItem('app_language');

        if (loggedInUser) {
            const userObj = JSON.parse(loggedInUser);
            if (userObj.language) setCurrentLang(userObj.language);
        } else if (localLang) {
            setCurrentLang(localLang);
        }
    }, []);

    // Funcția magică 't' care traduce cheile din JSON (ex: t('login.welcome'))
    const t = (path) => {
        const keys = path.split('.'); // Împarte 'login.welcome' în ['login', 'welcome']
        let text = translations[currentLang];
        
        // Navigăm prin JSON după chei
        for (let key of keys) {
            if (text[key] === undefined) return path; // Dacă nu găsește traducerea, returnează cheia
            text = text[key];
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{ currentLang, setCurrentLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

// Un hook mic ca să ne fie super ușor să importăm în componente
export const useLanguage = () => useContext(LanguageContext);