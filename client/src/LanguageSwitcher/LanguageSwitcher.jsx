import { useState, useEffect } from 'react';
import './LanguageSwitcher.css';
import { useLanguage } from '../context/LanguageContext';
import EnIcon from '../Icons/EnIcon.jsx';
import RoIcon from '../Icons/RoIcon.jsx';

function LanguageSwitcher({ className }) {
    const [isOpen, setIsOpen] = useState(false);

    const { currentLang, setCurrentLang } = useLanguage();

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectLanguage = async (lang) => {
        setCurrentLang(lang);
        setIsOpen(false);
        
        localStorage.setItem('app_language', lang);

        const token = localStorage.getItem('token');
        const loggedInUser = localStorage.getItem('user');

        if (token && loggedInUser) {
            try {
                const response = await fetch('http://localhost:3000/api/user', {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token 
                    },
                    body: JSON.stringify({ language: lang })
                });

                if (response.ok) {
                    const updatedUser = await response.json();
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
                {currentLang === 'en' ? <EnIcon className="icon-large" /> : <RoIcon className="icon-large" />}
            </div>

            {isOpen && (
                <div className="language-dropdown slide-in-top">
                    <div className="language-option" onClick={() => selectLanguage('en')}>
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