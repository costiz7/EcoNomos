import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useLoading } from '../../context/LoadingContext.jsx';

function LoginForm({ onSwitchToRegister }) {
    const { t } = useLanguage();
    const { setIsLoading } = useLoading(); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isExiting, setIsExiting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if(!response.ok) {
                const code = data.errorCode || 'SERVER_ERROR';
                
                setErrorMessage(t(`errors.${code}`));
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard');
        } catch (error) {
            setErrorMessage(t('errors.NETWORK_ERROR'));
        } finally {
            setIsLoading(false);
        }
    }

    const handleSwitchClick = (e) => {
        e.preventDefault();
        setIsExiting(true);

        setTimeout(() => {
            onSwitchToRegister();
        }, 300);
    }

    return (
        <>
            <div className={`login-form-wrapper ${isExiting ? 'slide-out-up' : 'slide-in-up'}`}>
                <h1>{t('login.welcome')}</h1>
                <div className="login-card-wrapper">
                    <div className="login-form-header">
                        <h1>{t('login.title')}</h1>
                    </div>
                    {errorMessage && (
                        <div className="login-form-error-message">
                            {errorMessage}
                        </div>
                    )}
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-form-input">
                            <input type="text" 
                                    id="email" 
                                    value={email}
                                    onChange={ (e) => setEmail(e.target.value) }
                                    placeholder=' ' />
                            <label htmlFor="email">{t('login.email')}</label>
                        </div>
                        <div className="login-form-input">
                            <input type="password"  
                                    id="password"
                                    value={password}
                                    onChange={ (e) => setPassword(e.target.value) }
                                    placeholder=' ' />
                            <label htmlFor="password">{t('login.password')}</label>
                        </div>
                        <button type="submit" className="login-form-btn">
                            {t('login.loginBtn')}
                        </button>
                        <div className="horizontal-login-form-line"><span>{t('login.or')}</span></div>
                        <button onClick={handleSwitchClick} className="login-form-btn">
                            {t('login.registerBtn')}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginForm;