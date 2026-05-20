import { useEffect, useState } from 'react';
import './StatisticsContent.css';
import { useLanguage } from '../context/LanguageContext';
import { useLoading } from '../context/LoadingContext';
import Dropdown from '../Dropdown/Dropdown';
import LineChartComponent from '../ChartComponents/LineChartComponent/LineChartComponent';
import DonutChartComponent from '../ChartComponents/DonutChartComponent/DonutChartComponent';
import BarChartComponent from '../ChartComponents/BarChartComponent/BarChartComponent';
import RadialGaugeComponent from '../ChartComponents/RadialGaugeComponent/RadialGaugeComponent';
import Transaction from '../Transaction/Transaction';

function StatisticsContent() {
    const { t } = useLanguage();
    const { setIsLoading } = useLoading();

    // User data state from local storage
    const [user] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Fallback to RON if currency is missing
    const userCurrency = user?.currency || 'RON';

    // Temporary filter states for dropdown selections
    const [selectedFilters, setSelectedFilters] = useState({
        month: '',
        year: ''
    });

    // Active applied filters that trigger the API requests
    const [appliedFilters, setAppliedFilters] = useState({
        month: '',
        year: ''
    });

    // Centralized state to hold all analytics and statistics dataset
    const [statsData, setStatsData] = useState({
        totals: { income: 0, expense: 0, balance: 0 },
        dailyAverage: 0,
        trend: [],
        breakdown: [],
        mom: { currentExpense: 0, previousExpense: 0, percentage: 0, trend: 'flat' },
        topExpenses: [],
        budgetGaugeValue: 0
    });

    // Master function to fetch data from all statistics endpoints using Promise.allSettled
    const fetchStatistics = async (filters = appliedFilters) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // Build query params conditionally
            let queryParams = '';
            if (filters.year) queryParams += `?year=${filters.year}`;
            if (filters.month) queryParams += `${queryParams ? '&' : '?'}month=${filters.month}`;

            // Define all endpoint urls
            const urls = [
                `${import.meta.env.VITE_API_URL}/api/transactions/totals${queryParams}`,
                `${import.meta.env.VITE_API_URL}/api/transactions/average${queryParams}`,
                `${import.meta.env.VITE_API_URL}/api/transactions/trend${queryParams}`,
                `${import.meta.env.VITE_API_URL}/api/transactions/breakdown${queryParams}`,
                `${import.meta.env.VITE_API_URL}/api/transactions/mom${queryParams}`,
                `${import.meta.env.VITE_API_URL}/api/transactions/top${queryParams}`,
                `${import.meta.env.VITE_API_URL}/api/budgets/status${queryParams}`
            ];

            // Execute all requests concurrently via Promise.allSettled
            // This ensures that if one endpoint fails, the rest of the page still loads perfectly
            const responses = await Promise.allSettled(
                urls.map(url => fetch(url, { headers: { 'token': token } }))
            );

            // Process responses: extract JSON only from successful requests, otherwise return null
            const jsonPromises = responses.map(res => 
                (res.status === 'fulfilled' && res.value.ok) ? res.value.json() : Promise.resolve(null)
            );

            // Wait for all JSON parsing to settle
            const dataResults = await Promise.allSettled(jsonPromises);

            // Map the resolved data, replacing failed ones with null
            const data = dataResults.map(res => res.status === 'fulfilled' ? res.value : null);

            // Destructure with default fallback values in case any endpoint returned null/failed
            const totals = data[0] || { income: 0, expense: 0, balance: 0 };
            const average = data[1] || { dailyAverage: 0 };
            const trend = data[2] || [];
            const breakdown = data[3] || [];
            const mom = data[4] || { currentExpense: 0, previousExpense: 0, percentage: 0, trend: 'flat' };
            const top = data[5] || [];
            const budgets = data[6] || [];

            // Calculate global budget consumption gauge dynamically from budget status response
            let totalLimit = 0;
            let totalSpent = 0;
            budgets.forEach(b => {
                totalLimit += parseFloat(b.limit || 0);
                totalSpent += parseFloat(b.spent || 0);
            });
            const dynamicGauge = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

            // Set centralized storage
            setStatsData({
                totals: totals,
                dailyAverage: average.dailyAverage || 0,
                trend: trend,
                breakdown: breakdown,
                mom: mom,
                topExpenses: top,
                budgetGaugeValue: dynamicGauge
            });

        } catch (error) {
            console.error("Error aggregating statistics data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch metrics on mount
    useEffect(() => {
        fetchStatistics(appliedFilters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Form submission handler for applying filters
    const handleApplyFilters = () => {
        setAppliedFilters(selectedFilters);
        fetchStatistics(selectedFilters);
    };

    // Custom handler to validate the Month selection rule (requires a Year first)
    const handleYearSelect = (yearId) => {
        setSelectedFilters(prev => {
            const newState = { ...prev, year: yearId };
            if (!yearId) newState.month = ''; // Automatically reset month if year is wiped
            return newState;
        });
    };

    // === Dropdown Dataset Preparation ===
    const currentYear = new Date().getFullYear();
    const yearData = [
        { id: '', name: t('statistics.all') || 'All' },
        ...Array.from({ length: 5 }, (_, i) => ({ id: currentYear - i, name: `${currentYear - i}` }))
    ];

    const monthData = [
        { id: '', name: t('statistics.all') || 'All' },
        ...Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `${i + 1}` }))
    ];

    // === Chart Data Transformations ===
    const incomeTrendData = statsData.trend.map(item => ({
        label: `${item.month}/${item.year.toString().slice(-2)}`,
        value: item.income
    }));

    const expenseTrendData = statsData.trend.map(item => ({
        label: `${item.month}/${item.year.toString().slice(-2)}`,
        value: item.expense
    }));

    const breakdownDonutData = statsData.breakdown.map(item => ({
        label: t(`categories.${item.category}`) !== `categories.${item.category}` ? t(`categories.${item.category}`) : item.category,
        value: item.total
    }));

    const momBarData = [
        { label: t('statistics.previousMonth') || 'Prev Month', value: statsData.mom.previousExpense },
        { label: t('statistics.currentMonth') || 'Current Month', value: statsData.mom.currentExpense }
    ];

    return (
        <div className="statistics-content-wrapper">
            
            {/* 1. Universal Filters Section */}
            <div className="statistics-filter-card">
                <div className="statistics-card-header">
                    <h2>{t('statistics.filtersTitle') || 'Filters'}</h2>
                </div>
                <div className="statistics-filters-container">
                    <div className="filter-item">
                        <label>{t('statistics.yearLabel') || 'Year'}</label>
                        <Dropdown 
                            dataArr={yearData} 
                            width="100%" 
                            displayLabel={t('statistics.all') || 'All'} 
                            onSelect={handleYearSelect} 
                            labelKey="name"
                        />
                    </div>
                    <div className="filter-item">
                        <label>{t('statistics.monthLabel') || 'Month'}</label>
                        <Dropdown 
                            dataArr={monthData} 
                            width="100%" 
                            displayLabel={t('statistics.all') || 'All'} 
                            onSelect={(id) => setSelectedFilters({...selectedFilters, month: id})}
                            labelKey="name"
                            disabled={!selectedFilters.year}
                        />
                    </div>
                    <button className="apply-filters-btn" onClick={handleApplyFilters}>
                        {t('statistics.applyBtn') || 'Apply Filters'}
                    </button>
                </div>
            </div>

            {/* 2. Metrics Totals Overview Cards */}
            <div className="statistics-totals-row">
                <div className="stat-mini-card income-card">
                    <span className="stat-card-title">{t('statistics.incomeTitle') || 'Income'}</span>
                    <span className="stat-card-value" style={{ color:"var(--green-color)" }}>+{parseFloat(statsData.totals.income).toFixed(2)} {userCurrency}</span>
                </div>
                <div className="stat-mini-card expense-card">
                    <span className="stat-card-title">{t('statistics.expenseTitle') || 'Expenses'}</span>
                    <span className="stat-card-value" style={{ color:"var(--red-color)" }}>-{parseFloat(statsData.totals.expense).toFixed(2)} {userCurrency}</span>
                </div>
                <div className="stat-mini-card balance-card">
                    <span className="stat-card-title">{t('statistics.balanceTitle') || 'Total Balance'}</span>
                    <span className="stat-card-value">{parseFloat(statsData.totals.balance).toFixed(2)} {userCurrency}</span>
                </div>
                <div className="stat-mini-card average-card">
                    <span className="stat-card-title">{t('statistics.dailyAverage') || 'Daily Average'}</span>
                    <span className="stat-card-value" style={{ color:"var(--orange-color)" }}>{parseFloat(statsData.dailyAverage).toFixed(2)} {userCurrency}</span>
                </div>
            </div>

            {/* 3. Historical Trends Section (Two Independent Line Charts) */}
            <div className="statistics-charts-row">
                <div className="statistics-large-card">
                    <div className="statistics-card-header">
                        <h2>{t('statistics.incomeTrendTitle')}</h2>
                    </div>
                    <LineChartComponent 
                        data={incomeTrendData} 
                        color="var(--green-color)" 
                        gradientColor="var(--green-color)" // Throws a clean green gradient underneath
                        lineThickness={7} // Makes the stroke thicker and updates interactive dots automatically
                        unit={userCurrency} 
                    />
                </div>
                <div className="statistics-large-card">
                    <div className="statistics-card-header">
                        <h2>{t('statistics.expenseTrendTitle')}</h2>
                    </div>
                    <LineChartComponent 
                        data={expenseTrendData} 
                        color="var(--red-color)" 
                        gradientColor="var(--red-color)" // Throws a clean red gradient underneath
                        lineThickness={7} // Makes the stroke thicker and updates interactive dots automatically
                        unit={userCurrency} 
                    />
                </div>
            </div>

            {/* 4. Distribution Breakdown / MoM / Budget Gauges Sections */}
            <div className="statistics-breakdown-row">
                <div className="statistics-grid-card">
                    <div className="statistics-card-header">
                        <h2>{t('statistics.breakdownTitle') || 'Expense Breakdown'}</h2>
                    </div>
                    <DonutChartComponent data={breakdownDonutData} unit={userCurrency} />
                </div>

                <div className="statistics-grid-card">
                    <div className="statistics-card-header">
                        <h2>{t('statistics.momTitle') || 'Month over Month'}</h2>
                    </div>
                    <BarChartComponent 
                        data={momBarData} 
                        colors={statsData.mom.trend === 'up' ? ["#ef4444"] : ["var(--green-color)"]} 
                        unit={userCurrency}
                        barThickness='100px'
                        gap="60px"
                    />
                </div>

                <div className="statistics-grid-card">
                    <div className="statistics-card-header">
                        <h2>{t('statistics.budgetConsumptionTitle') || 'Budget Consumption'}</h2>
                    </div>
                    <RadialGaugeComponent 
                        targetPercentage={statsData.budgetGaugeValue} 
                        color={statsData.budgetGaugeValue >= 80 ? "var(--red-color)" : "var(--green-color)"}
                    />
                </div>
            </div>

            {/* 5. Top Biggest Transactions Subsection using Transaction component */}
            <div className="statistics-top-card">
                <div className="statistics-card-header">
                    <h2>{t('statistics.topExpensesTitle') || 'Top Biggest Expenses'}</h2>
                </div>
                <div className="statistics-top-list">
                    {statsData.topExpenses.length > 0 ? (
                        statsData.topExpenses.map(tx => {
                            const formattedTx = {
                                ...tx,
                                name: tx.Category?.name,
                                iconFile: tx.Category?.iconFile,
                                type: tx.Category?.type
                            };
                            return <Transaction key={tx.id} transaction={formattedTx} user={user} />;
                        })
                    ) : (
                        <p className="no-statistics-message">{t('statistics.noData') || 'No transactions found.'}</p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default StatisticsContent;