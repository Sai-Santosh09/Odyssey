import { useAuth } from './context/Authcontext';
import LandingPage from './pages/LandingPage';
import { supabase } from './services/supabaseClient';

function App() {
    const { user } = useAuth();

    if (!user) {
        return <LandingPage />;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-indigo-400">Travel Planner Dashboard</h1>
                <button
                    onClick={() => supabase.auth.signOut()}
                    className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm font-semibold"
                >
                    Sign Out
                </button>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <p className="text-emerald-400 font-semibold mb-2">Authenticated Successfully!</p>
                <p className="text-slate-300">Logged in as: <span className="text-white underline">{user.email}</span></p>
            </div>
        </div>
    );
}

export default App;