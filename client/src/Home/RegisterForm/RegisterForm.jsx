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
    const [confirmPassword, setConfirmPassword] = useState('');

    const [language, setLanguage] = useState('en'); 
    const [currency, setCurrency] = useState('RON');

    const [isExiting, setIsExiting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const languageData = [
        { id: 'en', name: t('register.lang_en') },
        { id: 'ro', name: t('register.lang_ro') }
    ];

    const currencyData = [
        { id: 'RON', name: 'RON' },
        { id: 'EUR', name: 'EUR' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setErrorMessage(t('errors.MISSING_FIELDS'));
            return;
        }

        if (password.length < 6) {
            setErrorMessage(t('errors.PASSWORD_TOO_SHORT'));
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage(t('errors.PASSWORDS_DONT_MATCH'));
            return;
        }

        if (!language || !currency) {
            setErrorMessage(t('errors.MISSING_DROPDOWNS'));
            return;
        }

        setIsLoading(true);

        const registerData = {
            firstName,
            lastName,
            username,
            email,
            password,
            language,
            currency
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            if (!response.ok) {
                const code = data.errorCode || 'SERVER_ERROR';
                setErrorMessage(t(`errors.${code}`));
                return;
            }

            onSwitchToSuccess();
        } catch (error) {
            setErrorMessage(t('errors.NETWORK_ERROR'));
        } finally {
            setIsLoading(false);
        }
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
                <div className="register-card-wrapper" style={{padding: '5px 20px 20px 20px'}}>
                    <div className="register-form-header">
                        <h1>{t('register.title')}</h1>
                    </div>
                    {errorMessage && (
                        <div className="register-form-error-message">
                            {errorMessage}
                        </div>
                    )}
                    <form className="register-form" noValidate onSubmit={handleSubmit} style={{gap: '20px'}}>
                        <div className="register-form-row">
                            <div className="register-form-input">
                                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder=' ' />
                                <label htmlFor="firstName">{t('register.firstName')}</label>
                            </div>
                            <div className="register-form-input">
                                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder=' ' />
                                <label htmlFor="lastName">{t('register.lastName')}</label>
                            </div>
                        </div>

                        <div className="register-form-input">
                            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder=' ' />
                            <label htmlFor="username">{t('register.username')}</label>
                        </div>

                        <div className="register-form-input">
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=' ' />
                            <label htmlFor="email">{t('register.email')}</label>
                        </div>
                        
                        <div className="register-form-row">
                            <div className="register-form-input">
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=' ' />
                                <label htmlFor="password">{t('register.password')}</label>
                            </div>
                            <div className="register-form-input">
                                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder=' ' />
                                <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
                            </div>
                        </div>

                        <div className="register-form-row">
                            <div className="register-form-input dropdown-input-group">
                                <Dropdown 
                                    dataArr={languageData}
                                    width="100%"
                                    displayLabel={t('register.select_lang')}
                                    onSelect={(id) => setLanguage(id)}
                                    labelKey="name"
                                />
                            </div>
                            <div className="register-form-input dropdown-input-group">
                                <Dropdown 
                                    dataArr={currencyData}
                                    width="100%"
                                    displayLabel={t('register.select_curr')}
                                    onSelect={(id) => setCurrency(id)}
                                    labelKey="name"
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