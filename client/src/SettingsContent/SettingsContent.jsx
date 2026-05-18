import React, { useState } from 'react';
import './SettingsContent.css';
import { useLanguage } from '../context/LanguageContext';
import { useLoading } from '../context/LoadingContext';

function SettingsContent() {
    const { t } = useLanguage();
    const { setIsLoading } = useLoading();

    // 1. Get user from local storage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // 2. States to handle entry and exit modal lifecycle transitions smoothly
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // 3. Trigger initial opening states
    const handleOpenModal = () => {
        setIsClosing(false);
        setIsModalOpen(true);
    };

    // 4. Trigger closing animation first, then unmount modal after it flies up (400ms)
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, 400); // 400ms matches the slideOutUp CSS animation duration
    };

    // 5. Function to execute sync after waiting for the slide-out animation to finish
    const handleConfirmSync = () => {
        setIsClosing(true);
        
        // Wait exactly 400ms for the modal card to fly up off-screen before starting loading state
        setTimeout(async () => {
            setIsModalOpen(false);
            setIsClosing(false);
            setIsLoading(true); // Global loading screen takes over flawlessly here

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/import-bank`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                });

                if (response.ok) {
                    const updatedUser = { ...user, hasImportedBankData: true };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    setUser(updatedUser);
                } else {
                    console.error("Error during bank synchronization process.");
                }
            } catch (error) {
                console.error("Failed to import bank data:", error);
            } finally {
                setIsLoading(false); // Remove global loader mask
            }
        }, 400); 
    };

    return (
        <div className="settings-content-wrapper">
            
            {/* Header Section */}
            <div className="settings-header">
                <h2>{t('settings.pageTitle') || 'Settings'}</h2>
            </div>

            {/* Bank Synchronization Card */}
            <div className="settings-card">
                <div className="settings-card-info">
                    <h3>{t('settings.bankSyncTitle') || 'Bank Synchronization'}</h3>
                    <p>
                        {t('settings.bankSyncDesc') || 'Connect to your bank to automatically import your transaction history. This action uses AI to categorize your expenses.'}
                    </p>
                </div>
                
                <div className="settings-card-action">
                    {user?.hasImportedBankData ? (
                        <button className="sync-btn synced" disabled>
                            {t('settings.syncedBtn') || '✓ Synced & Active'}
                        </button>
                    ) : (
                        <button className="sync-btn" onClick={handleOpenModal}>
                            {t('settings.syncBtn') || 'Sync with Bank'}
                        </button>
                    )}
                </div>
            </div>

            {/* Confirmation Modal Overlay with dynamic closing trigger class */}
            {isModalOpen && (
                <div className={`sync-modal-overlay ${isClosing ? 'closing' : ''}`}>
                    <div className="sync-modal-card">
                        <h3>{t('settings.modalTitle') || 'Are you sure?'}</h3>
                        <p>{t('settings.modalDesc') || 'This will import your bank transactions from the last 7 months and activate daily synchronization. Do you want to continue?'}</p>
                        
                        <div className="sync-modal-actions">
                            <button className="modal-btn-no" onClick={handleCloseModal}>
                                {t('settings.modalNo') || 'No'}
                            </button>
                            <button className="modal-btn-yes" onClick={handleConfirmSync}>
                                {t('settings.modalYes') || 'Yes, Sync'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default SettingsContent;