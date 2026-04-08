import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import './MainLayout.css';
import LogoIcon from "../Icons/LogoIcon";

function MainLayout() {
    const location = useLocation();
    const { t } = useLanguage();

    const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const getPageTitle = () => {
        switch(location.pathname) {
            case '/dashboard': return t('layout.titleDashboard');
            case '/savings': return t('layout.titleSavings');
            case '/settings': return t('layout.titleSettings');
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
                    {<Link to="/dashboard">{t('layout.menuDashboard')}</Link>}
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