import { useState } from 'react';
import Dropdown from '../../Dropdown/Dropdown.jsx';
import './RegisterForm.css';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useLoading } from '../../context/LoadingContext.jsx';

function RegisterForm({ onSwitchToLogin, onSwitchToSuccess }) {
    const { t } = useLanguage();
    const { setIsLoading } = useLoading(); 
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [language, setLanguage] = useState('en'); 
    const [currency, setCurrency] = useState('RON');

    const [isExiting, setIsExiting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const languageData = [
        { id: 'en', denumire: t('register.lang_en') },
        { id: 'ro', denumire: t('register.lang_ro') }
    ];

    const currencyData = [
        { id: 'RON', denumire: 'RON' },
        { id: 'EUR', denumire: 'EUR' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        if(!language || !currency) {
            setErrorMessage(t('register.error_dropdowns'));
            return;
        }

        const registerData = {
            firstName,
            lastName,
            username,
            email,
            password,
            language,
            currency
        };
    }

    const handleSwitchToLoginClick = (e) => {
        e.preventDefault();
        setIsExiting(true);

        setTimeout(() => {
            onSwitchToLogin();
        }, 300);
    }

    return (
        <>
            <div className={`register-form-wrapper ${isExiting ? 'register-slide-out-up' : 'register-slide-in-up'}`}>
                <h1>{t('register.welcome')}</h1>
                <div className="register-card-wrapper">
                    <div className="register-form-header">
                        <h1>{t('register.title')}</h1>
                    </div>
                    {errorMessage && (
                        <div className="register-form-error-message">
                            {errorMessage}
                        </div>
                    )}
                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="register-form-row">
                            <div className="register-form-input">
                                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder=' ' required />
                                <label htmlFor="firstName">{t('register.firstName')}</label>
                            </div>
                            <div className="register-form-input">
                                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder=' ' required />
                                <label htmlFor="lastName">{t('register.lastName')}</label>
                            </div>
                        </div>

                        <div className="register-form-input">
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder=' ' required />
                            <label htmlFor="username">{t('register.username')}</label>
                        </div>

                        <div className="register-form-input">
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' required />
                            <label htmlFor="email">{t('register.email')}</label>
                        </div>
                        
                        <div className="register-form-input">
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=' ' required />
                            <label htmlFor="password">{t('register.password')}</label>
                        </div>

                        {/* Grupul Language/Currency - Dropdown-uri învelite orizontal */}
                        <div className="register-form-row">
                            {/* Fiecare Dropdown este învelit într-un div pentru a respecta regula de stilizare a inputurilor */}
                            <div className="register-form-input dropdown-input-group">
                                <label className="dropdown-label-fix">{t('register.language')}</label>
                                <Dropdown 
                                    dataArr={languageData}
                                    width="100%" // Ocupă tot spațiul wrapper-ului
                                    displayLabel={t('register.select_lang')}
                                    onSelect={(id) => setLanguage(id)} // Salvăm ID-ul ('en'/'ro')
                                />
                            </div>
                            <div className="register-form-input dropdown-input-group">
                                <label className="dropdown-label-fix">{t('register.currency')}</label>
                                <Dropdown 
                                    dataArr={currencyData}
                                    width="100%"
                                    displayLabel={t('register.select_curr')}
                                    onSelect={(id) => setCurrency(id)} // Salvăm ID-ul ('RON'/'EUR')
                                />
                            </div>
                        </div>

                        <button type="submit" className="register-form-btn primary-btn">
                            {t('register.registerBtn')}
                        </button>
                        
                        <div className="horizontal-register-form-line"><span>{t('register.or')}</span></div>
                        
                        <button onClick={handleSwitchToLoginClick} className="register-form-btn">
                            {t('register.loginBtn')}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegisterForm;