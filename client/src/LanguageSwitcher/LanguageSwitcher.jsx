import { useState, useEffect } from 'react';
import './LanguageSwitcher.css';
import { useLanguage } from '../context/LanguageContext';
import EnIcon from '../Icons/EnIcon.jsx';
import RoIcon from '../Icons/RoIcon.jsx';

function LanguageSwitcher({ className }) {
    const [isOpen, setIsOpen] = useState(false);

    const { currentLang, setCurrentLang } = useLanguage();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        const localLang = localStorage.getItem('app_language');

        if (loggedInUser) {
            // Dacă userul e logat, limba principală este cea din baza lui de date
            const userObj = JSON.parse(loggedInUser);
            if (userObj.language) setCurrentLang(userObj.language);
        } else if (localLang) {
            // Setăm limba locală dacă e vizitator neautentificat
            setCurrentLang(localLang);
        }
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectLanguage = async (lang) => {
        // 1. Schimbăm limba vizual instant pentru UX
        setCurrentLang(lang);
        setIsOpen(false);
        
        // 2. O salvăm mereu local ca fallback
        localStorage.setItem('app_language', lang);

        // 3. Verificăm dacă userul e logat pentru a o salva în DB
        const token = localStorage.getItem('token');
        const loggedInUser = localStorage.getItem('user');

        if (token && loggedInUser) {
            try {
                const response = await fetch('http://localhost:3000/api/user', {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json',
                        // AM CORECTAT AICI: Trimitem exact cum cere tokenCheck.js
                        'token': token 
                    },
                    body: JSON.stringify({ language: lang })
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    // Actualizăm și obiectul user din localStorage cu noile date primite de la server
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    console.log("Limba salvată cu succes în DB:", updatedUser.language);
                } else {
                    console.error("Eroare la actualizarea limbii pe server");
                }
            } catch (error) {
                console.error("Eroare de rețea la salvarea limbii:", error);
            }
        }
    };

    return (
        <div className={`language-switcher-wrapper ${className}`}>
            
            <div className="current-language-btn" onClick={toggleDropdown}>
                {/* Trimitem clasa icon-large pentru cerculețul mare */}
                {currentLang === 'en' ? <EnIcon className="icon-large" /> : <RoIcon className="icon-large" />}
            </div>

            {isOpen && (
                <div className="language-dropdown slide-in-top">
                    <div className="language-option" onClick={() => selectLanguage('en')}>
                        {/* Trimitem clasa icon-small pentru meniul dinamic */}
                        <EnIcon className="icon-small" />
                    </div>
                    <div className="language-option" onClick={() => selectLanguage('ro')}>
                        <RoIcon className="icon-small" />
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default LanguageSwitcher;