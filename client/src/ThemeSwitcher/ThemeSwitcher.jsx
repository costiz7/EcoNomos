import { useState, useEffect } from 'react';
import './ThemeSwitcher.css';

function ThemeSwitcher({ className }) {
    // Check local storage for existing preference, default to light mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('app_theme');
        return savedTheme === 'dark';
    });

    // Side effect to sync the DOM class and localStorage with the state
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-theme');
            localStorage.setItem('app_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-theme');
            localStorage.setItem('app_theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    return (
        <div className={`theme-switcher-wrapper ${className}`}>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
                {isDarkMode ? (
                    /* Sun Icon - displayed when in dark mode to switch back to light */
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.22" x2="5.64" y2="17.78"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                ) : (
                    /* Moon Icon - displayed when in light mode to switch to dark */
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                )}
            </button>
        </div>
    );
}

export default ThemeSwitcher;