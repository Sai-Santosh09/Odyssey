import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local guest session first
        const savedGuest = localStorage.getItem('odyssey_guest_user');
        if (savedGuest) {
            try {
                setUser(JSON.parse(savedGuest));
                setLoading(false);
                return;
            } catch (e) {}
        }

        // Fetch Supabase session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });

        // Listen for changes on auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
            }
            setLoading(false);
        });

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    const loginAsGuest = () => {
        const guestUser = {
            id: 'guest_odyssey_user',
            email: 'explorer@odyssey.app',
            user_metadata: { name: 'Odyssey Explorer' }
        };
        localStorage.setItem('odyssey_guest_user', JSON.stringify(guestUser));
        setUser(guestUser);
    };

    const logout = async () => {
        localStorage.removeItem('odyssey_guest_user');
        try {
            await supabase.auth.signOut();
        } catch (e) {}
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginAsGuest, logout }}>
            {!loading ? children : (
                <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;
