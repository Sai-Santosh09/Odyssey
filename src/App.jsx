import React from 'react';
import { useAuth } from './context/Authcontext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
    const { user } = useAuth();

    if (!user) {
        return <LandingPage />;
    }

    return <Dashboard />;
}

export default App;