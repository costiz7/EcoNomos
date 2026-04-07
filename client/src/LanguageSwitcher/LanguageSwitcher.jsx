import { useState } from 'react';
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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
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
                } else {
                    console.error("Can't update language on server");
                }
            } catch (error) {
                console.error("Server Error:", error);
            }
        }
    };

    return (
        <div className={`language-switcher-wrapper ${className}`}>
            
            <div className="current-language-btn" onClick={toggleDropdown}>
                {currentLang === 'en' ? <EnIcon className="icon-large" /> : <RoIcon className="icon-large" />}
            </div>

            <div className={`language-dropdown ${isOpen ? 'open' : ''}`}>
                <div className="language-option" onClick={() => selectLanguage('en')}>
                    <EnIcon className="icon-small" />
                </div>
                <div className="language-option" onClick={() => selectLanguage('ro')}>
                    <RoIcon className="icon-small" />
                </div>
            </div>
            
        </div>
    );
}

export default LanguageSwitcher;