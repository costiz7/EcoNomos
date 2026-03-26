import { useState, useEffect } from 'react';
import './LanguageSwitcher.css';
import { useLanguage } from '../context/LanguageContext';

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
            
            {/* Butonul principal cu imagine în loc de emoji */}
            <div className="current-language-btn" onClick={toggleDropdown}>
                <img 
                    src={currentLang === 'en' ? 'https://flagcdn.com/w40/gb.png' : 'https://flagcdn.com/w40/ro.png'} 
                    width="24" 
                    alt="Current Language Flag" 
                    style={{ borderRadius: '2px', display: 'block' }}
                />
            </div>

            {/* Dropdown-ul cu imagini mici lângă text */}
            {isOpen && (
                <div className="language-dropdown slide-in-top">
                    <div className="language-option" onClick={() => selectLanguage('en')}>
                        <img src="https://flagcdn.com/w20/gb.png" width="20" alt="UK Flag" /> 
                        English
                    </div>
                    <div className="language-option" onClick={() => selectLanguage('ro')}>
                        <img src="https://flagcdn.com/w20/ro.png" width="20" alt="RO Flag" /> 
                        Română
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default LanguageSwitcher;