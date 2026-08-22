import React from 'react';
import { useAuth } from './context/Authcontext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {!user ? <LandingPage /> : <Dashboard />}
        </div>
    );
}

export default App;