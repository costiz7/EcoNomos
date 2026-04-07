import { useState } from 'react';
import './SuccessForm.css';
import { useLanguage } from '../../context/LanguageContext.jsx';

function SuccessForm({ onSwitchToLogin }) {
    const { t } = useLanguage();
    const [isExiting, setIsExiting] = useState(false);

    const handleSwitchClick = (e) => {
        e.preventDefault();
        setIsExiting(true);

        setTimeout(() => {
            onSwitchToLogin();
        }, 300);
    }

    return (
        <>
            <div className={`success-form-wrapper ${isExiting ? 'success-slide-out-up' : 'success-slide-in-up'}`}>
                <div className="success-card-wrapper">
                    <div className="success-form-header">
                        <h1>{t('success.title')}</h1>
                    </div>
                    
                    <div className="success-icon-wrapper">
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <path fill="var(--black-color)" d="M16,31A15,15,0,1,1,31,16,15,15,0,0,1,16,31ZM16,3A13,13,0,1,0,29,16,13,13,0,0,0,16,3Z"/>
                            <path fill="var(--black-color)" d="M13.67,22a1,1,0,0,1-.73-.32l-4.67-5a1,1,0,0,1,1.46-1.36l3.94,4.21,8.6-9.21a1,1,0,1,1,1.46,1.36l-9.33,10A1,1,0,0,1,13.67,22Z"/>
                        </svg>
                    </div>

                    <button onClick={handleSwitchClick} className="success-form-btn primary-btn">
                        {t('success.loginBtn')}
                    </button>
                </div>
            </div>
        </>
    );
}

export default SuccessForm;