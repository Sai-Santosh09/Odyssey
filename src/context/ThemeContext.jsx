import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'dark',
    isDarkMode: true,
    toggleDarkMode: () => {},
    setTheme: () => {},
});

export function ThemeProvider({ children }) {
    const [theme] = useState('dark');
    const isDarkMode = true;

    useEffect(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.setItem('odyssey-theme', 'dark');
    }, []);

    const toggleDarkMode = () => {};
    const setTheme = () => {};

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleDarkMode, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
