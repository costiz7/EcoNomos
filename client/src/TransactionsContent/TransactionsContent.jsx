import { useEffect, useState } from 'react';
import './TransactionsContent.css';
import { useLanguage } from '../context/LanguageContext';
import { useLoading } from '../context/LoadingContext';
import Dropdown from '../Dropdown/Dropdown';
import Transaction from '../Transaction/Transaction';

function TransactionsContent() {
    const { t } = useLanguage();
    const { setIsLoading } = useLoading();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Stocăm starea paginării returnate de API
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 20
    });

    // Filtrele temporare, selectate din Dropdown-uri
    const [selectedFilters, setSelectedFilters] = useState({
        categoryId: '',
        type: '',
        month: '',
        year: ''
    });

    // Filtrele aplicate efectiv la request când se apasă butonul
    const [appliedFilters, setAppliedFilters] = useState({
        categoryId: '',
        type: '',
        month: '',
        year: ''
    });

    // Preia categoriile pentru Dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                    headers: { 'token': token }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Nu am putut prelua categoriile", error);
            }
        };
        fetchCategories();
    }, []);

    // Funcția care aduce tranzacțiile în funcție de pagină și filtre
    const fetchTransactions = async (page = 1, filters = appliedFilters) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            let queryUrl = `?page=${page}&limit=20`;

            if (filters.categoryId) queryUrl += `&categoryId=${filters.categoryId}`;
            if (filters.type) queryUrl += `&type=${filters.type}`;
            if (filters.month) queryUrl += `&month=${filters.month}`;
            if (filters.year) queryUrl += `&year=${filters.year}`;

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions${queryUrl}`, {
                headers: { 'token': token }
            });

            if (response.ok) {
                const data = await response.json();
                
                // Flatten the data to match the format expected by the Transaction component
                const formattedTransactions = data.transactions.map(obj => ({
                    id: obj.id,
                    amount: obj.amount,
                    date: obj.date,
                    title: obj.title,
                    description: obj.description,
                    source: obj.source,
                    name: obj.Category?.name,
                    iconFile: obj.Category?.iconFile,
                    type: obj.Category?.type
                }));

                setTransactions(formattedTransactions);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Eroare la preluarea tranzacțiilor", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Apelul inițial pe prima pagină
    useEffect(() => {
        fetchTransactions(1, appliedFilters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Aplică filtrele: se salvează în appliedFilters și forțează pagina 1
    const handleApplyFilters = () => {
        setAppliedFilters(selectedFilters);
        fetchTransactions(1, selectedFilters);
    };

    // Navigare pagini
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchTransactions(newPage, appliedFilters);
        }
    };

    // === Pregătire date pentru Dropdown-uri ===
    const typeData = [
        { id: '', name: 'None' },
        { id: 'income', name: 'Income' },
        { id: 'expense', name: 'Expense' }
    ];

    const categoryData = [
        { id: '', name: 'None' },
        ...categories.map(cat => ({
            id: cat.id, 
            name: t(`categories.${cat.name}`) !== `categories.${cat.name}` ? t(`categories.${cat.name}`) : cat.name
        }))
    ];

    const monthData = [
        { id: '', name: 'None' },
        ...Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `${i + 1}` }))
    ];

    const currentYear = new Date().getFullYear();
    const yearData = [
        { id: '', name: 'None' },
        ...Array.from({ length: 5 }, (_, i) => ({ id: currentYear - i, name: `${currentYear - i}` }))
    ];

    // Logica pentru numerele de paginare cu `...`
    const generatePaginationNumbers = () => {
        const { currentPage, totalPages } = pagination;
        const current = Number(currentPage);
        const last = Number(totalPages);
        const delta = 1;
        const left = current - delta;
        const right = current + delta;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= last; i++) {
            if (i === 1 || i === last || (i >= left && i <= right)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    return (
        <div className="transactions-content-wrapper">
            
            {/* Secțiunea Filtre */}
            <div className="transactions-filter-card">
                <div className="transactions-card-header">
                    <h2>Filtre</h2>
                </div>
                
                <div className="transactions-filters-container">
                    <div className="filter-item">
                        <label>Tip</label>
                        <Dropdown 
                            dataArr={typeData} 
                            width="100%" 
                            displayLabel="None" 
                            onSelect={(id) => setSelectedFilters({...selectedFilters, type: id})}
                            labelKey="name"
                        />
                    </div>
                    
                    <div className="filter-item">
                        <label>Categorie</label>
                        <Dropdown 
                            dataArr={categoryData} 
                            width="100%" 
                            displayLabel="None" 
                            onSelect={(id) => setSelectedFilters({...selectedFilters, categoryId: id})}
                            labelKey="name"
                        />
                    </div>

                    <div className="filter-item">
                        <label>Lună</label>
                        <Dropdown 
                            dataArr={monthData} 
                            width="100%" 
                            displayLabel="None" 
                            onSelect={(id) => setSelectedFilters({...selectedFilters, month: id})}
                            labelKey="name"
                        />
                    </div>

                    <div className="filter-item">
                        <label>An</label>
                        <Dropdown 
                            dataArr={yearData} 
                            width="100%" 
                            displayLabel="None" 
                            onSelect={(id) => setSelectedFilters({...selectedFilters, year: id})}
                            labelKey="name"
                        />
                    </div>

                    <button className="apply-filters-btn" onClick={handleApplyFilters}>
                        Aplica
                    </button>
                </div>
            </div>

            {/* Secțiunea Listă Tranzacții */}
            <div className="transactions-list-card">
                <div className="transactions-card-header">
                    <h2>Tranzacții</h2>
                </div>
                
                <div className="transactions-list">
                    {transactions.length > 0 ? (
                        transactions.map(transaction => (
                            <Transaction 
                                key={transaction.id} 
                                transaction={transaction} 
                                user={user}
                            />
                        ))
                    ) : (
                        <p className="no-transactions-message">Nu au fost găsite tranzacții.</p>
                    )}
                </div>

                {/* Paginare - Apare doar dacă avem mai mult de 1 pagină */}
                {pagination.totalPages > 1 && (
                    <div className="pagination-container">
                        <button 
                            className="pagination-btn"
                            disabled={pagination.currentPage === 1}
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                        >
                            Previous
                        </button>

                        {generatePaginationNumbers().map((pageNumber, index) => {
                            if (pageNumber === '...') {
                                return <span key={index} className="pagination-dots">...</span>;
                            }
                            return (
                                <button 
                                    key={index}
                                    className={`pagination-btn ${pagination.currentPage === pageNumber ? 'active' : ''}`}
                                    onClick={() => handlePageChange(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button 
                            className="pagination-btn"
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}

export default TransactionsContent;