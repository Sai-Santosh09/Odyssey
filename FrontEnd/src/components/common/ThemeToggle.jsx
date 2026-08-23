import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle({ className = '' }) {
    const { theme, isDarkMode, toggleDarkMode } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-2xl bg-white dark:bg-odyssey-slate hover:bg-odyssey-cream/40 dark:hover:bg-odyssey-navy/60 border border-odyssey-tan dark:border-odyssey-brown text-odyssey-navy dark:text-odyssey-cream shadow-sm transition-all duration-150 active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-odyssey-brown/20 cursor-pointer ${className}`}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
            ) : (
                <Moon className="w-4 h-4 text-odyssey-slate" />
            )}
        </button>
    );
}
export default ThemeToggle;
