import React from 'react';
import { Home, Compass, Luggage, Calendar, User } from 'lucide-react';

export function BottomNav({ activeTab = 'home', onChangeTab }) {
    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'explore', label: 'Explore', icon: Compass },
        { id: 'trips', label: 'Trips', icon: Luggage },
        { id: 'itinerary', label: 'Itinerary', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 py-2.5 bg-white/90 backdrop-blur-lg border-t border-stone-200/80 sm:hidden pb-safe">
            <nav className="max-w-md mx-auto flex items-center justify-around">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChangeTab(tab.id)}
                            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 touch-manipulation relative ${
                                isActive ? 'text-[#F06536]' : 'text-stone-400 hover:text-stone-600'
                            }`}
                        >
                            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-orange-50' : ''}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                            </div>
                            <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-[#F06536]' : 'text-stone-500'}`}>
                                {tab.label}
                            </span>
                            {isActive && (
                                <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#F06536]" />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
