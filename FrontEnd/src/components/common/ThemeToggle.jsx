import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle({ className = '' }) {
    const { theme, isDarkMode, toggleDarkMode } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-2xl bg-white dark:bg-[#131B2E] hover:bg-slate-100 dark:hover:bg-[#182238] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-150 active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${className}`}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
            ) : (
                <Moon className="w-4 h-4 text-slate-700" />
            )}
        </button>
    );
}
export default ThemeToggle;
