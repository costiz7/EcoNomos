import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import './MainLayout.css';
import LogoIcon from "../Icons/LogoIcon";
import DashboardIcon from "../Icons/DashboardIcon";
import TransactionsIcon from "../Icons/TransactionsIcon";
import StatisticsIcon from "../Icons/StatisticsIcon";
import SavingsIcon from "../Icons/SavingsIcon";
import BudgetsIcon from "../Icons/BudgetsIcon";
import ProfileIcon from "../Icons/ProfileIcon";
import SettingsIcon from "../Icons/SettingsIcon";

function MainLayout() {
    const location = useLocation();
    const { t } = useLanguage();

    const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const getPageTitle = () => {
        switch(location.pathname) {
            case '/dashboard': return t('layout.menuDashboard');
            case '/transactions': return t('layout.menuTransactions');
            case '/savings': return t('layout.menuSavings');
            case '/settings': return t('layout.menuSettings');
            case '/statistics': return t('layout.menuStatistics');
            case '/budgets': return t('layout.menuBudgets');
            case '/myprofile': return t('layout.menuProfile');
            default: return 'EcoNomos';
        }
    };

    return (
        <>
        <div className="main-layout-wrapper">
            <div className="main-layout-topbar">
                <div className="topbar-left-side">
                    <div className={`hamburger-menu ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                    <div className="universal-content">
                        <LogoIcon style={{ width: '50px', height: 'auto' }}/>
                        <h2>/{getPageTitle().toLowerCase()}</h2>
                    </div>
                </div>
                <div className="topbar-right-side">
                    {/*Avatar Profile */}
                </div>
            </div>
            <div className="main-layout">
                <div className={`main-layout-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    {/* Links */}
                    {<Link to="/dashboard">
                        <DashboardIcon className="sidebar-icons" style={{ color: "var(--blue-color)" }}/>{t('layout.menuDashboard')}
                    </Link>}
                    {<Link to="/transactions">
                        <TransactionsIcon className="sidebar-icons" style={{ color: "var(--green-color)" }}/>{t('layout.menuTransactions')}
                    </Link>}
                    {<Link to="/statistics">
                        <StatisticsIcon className="sidebar-icons" style={{ color: "var(--dark-yellow-color)" }}/>{t('layout.menuStatistics')}
                    </Link>}
                    {<Link to="/savings">
                        <SavingsIcon className="sidebar-icons" style={{ color: "var(--light-red-color)" }}/>{t('layout.menuSavings')}
                    </Link>}
                    {<Link to="/budgets">
                        <BudgetsIcon className="sidebar-icons" style={{ color: "var(--dark-green-color)" }}/>{t('layout.menuBudgets')}
                    </Link>}
                    {<Link to="/myprofile">
                        <ProfileIcon className="sidebar-icons" style={{ color: "var(--purple-color)" }}/>{t('layout.menuProfile')}
                    </Link>}
                    {<Link to="/settings">
                        <SettingsIcon className="sidebar-icons" style={{ color: "var(--black-color)" }}/>{t('layout.menuSettings')}
                    </Link>}
                </div>
                <div className="main-layout-content">
                    <Outlet />
                </div>
            </div>
        </div>
        {isSidebarOpen && (
            <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        )}
        </>
    );
}

export default MainLayout;