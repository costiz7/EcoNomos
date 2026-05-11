import './Transaction.css';
import CategoryIcon from '../Icons/Categories/CategoryIcon';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function Transaction({ transaction, user }) {
    const [ isExpanded, setIsExpanded ] = useState(false);
    const { t } = useLanguage();

    function toggleExpansion() {
        setIsExpanded(!isExpanded);
    }

    return (
        <>
            <div className="transaction-wrapper">
                <div className="transaction-header" onClick={toggleExpansion}>
                    <div className="header-right-side">
                        <CategoryIcon iconFile={transaction.iconFile} style={{ height: "35px", width: "auto" }}/>
                        <p className="header-transaction-title">{transaction.title}</p>       
                    </div>
                    <div className="header-left-side">
                        <div className="header-transaction-amount">
                            {transaction.amount} {user ? user.currency : "RON"}
                        </div>
                    </div>
                </div>
                <div className={`transaction-body-wrapper ${isExpanded ? 'expanded' : ''}`}>
                    <div className="transaction-body">
                        <div className="body-transaction-details">
                            <span className="body-detail-label">{t('transaction.description')}</span>
                            <span className="body-detail-value">{transaction.description || "-"}</span>

                            <span className="body-detail-label">{t('transaction.amount')}</span>
                            <span className="body-detail-value">{transaction.amount} {user ? user.currency : "RON"}</span>

                            <span className="body-detail-label">{t('transaction.date')}</span>
                            <span className="body-detail-value">{transaction.date}</span>

                            <span className="body-detail-label">{t('transaction.category')}</span>
                            <span className="body-detail-value">{t(`categories.${transaction.name}`) !== `categories.${transaction.name}` 
                                                                ? t(`categories.${transaction.name}`) 
                                                                : transaction.name}
                            </span>

                            <span className="body-detail-label">{t('transaction.type')}</span>
                            <span className="body-detail-value">{transaction.type}</span>

                            <span className="body-detail-label">{t('transaction.source')}</span>
                            <span className="body-detail-value">{transaction.source}</span>
                        </div>
                    </div>    
                </div>
            </div>
        </>
    );
}

export default Transaction;