import React, { useState } from 'react';
import './SettingsContent.css';
import { useLanguage } from '../context/LanguageContext';
import { useLoading } from '../context/LoadingContext';

function SettingsContent() {
    const { t } = useLanguage();
    const { setIsLoading } = useLoading();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [activeModal, setActiveModal] = useState(null); 
    const [isClosing, setIsClosing] = useState(false);

    const openModal = (modalId) => {
        setIsClosing(false);
        setActiveModal(modalId);
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setActiveModal(null);
            setIsClosing(false);
        }, 400);
    };

    const executeAction = (actionCallback) => {
        setIsClosing(true);
        
        setTimeout(async () => {
            setActiveModal(null);
            setIsClosing(false);
            setIsLoading(true);

            try {
                await actionCallback();
            } catch (error) {
                console.error("Action failed:", error);
            } finally {
                setIsLoading(false);
            }
        }, 400); 
    };

    const handleBankSync = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/import-bank`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'token': token }
        });

        if (response.ok) {
            const updatedUser = { ...user, hasImportedBankData: true };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
        } else {
            console.error("Error during bank synchronization process.");
        }
    };

    const modalConfigs = {
        'BANK_SYNC': {
            title: t('settings.modalTitle'),
            desc: t('settings.modalDesc'),
            onConfirm: () => executeAction(handleBankSync)
        }
    };

    const currentModal = activeModal ? modalConfigs[activeModal] : null;

    return (
        <div className="settings-content-wrapper">

            <div className="settings-card">
                <div className="settings-card-info">
                    <h3>{t('settings.bankSyncTitle')}</h3>
                    <p>{t('settings.bankSyncDesc')}</p>
                </div>
                <div className="settings-card-action">
                    {user?.hasImportedBankData ? (
                        <button className="sync-btn synced" disabled>
                            {t('settings.syncedBtn')}
                        </button>
                    ) : (
                        <button className="sync-btn" onClick={() => openModal('BANK_SYNC')}>
                            {t('settings.syncBtn')}
                        </button>
                    )}
                </div>
            </div>

            {activeModal && currentModal && (
                <div className={`sync-modal-overlay ${isClosing ? 'closing' : ''}`}>
                    <div className="sync-modal-card">
                        <h3>{currentModal.title}</h3>
                        <p>{currentModal.desc}</p>
                        
                        <div className="sync-modal-actions">
                            <button className="modal-btn-no" onClick={closeModal}>
                                {t('settings.modalNo')}
                            </button>
                            <button className="modal-btn-yes" onClick={currentModal.onConfirm}>
                                {t('settings.modalYes')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default SettingsContent;