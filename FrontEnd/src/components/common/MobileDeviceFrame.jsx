import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

export function MobileDeviceFrame({
    children,
    isMobileFrame = false,
    onToggleFrame,
    currentLocation = 'Hyderabad'
}) {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes();
            hours = hours % 12;
            hours = hours ? hours : 12;
            const strTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
            setCurrentTime(strTime);
        };
        updateTime();
        const interval = setInterval(updateTime, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!isMobileFrame) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-900/95 dark:bg-[#070A0F] py-3 sm:py-6 px-2 flex flex-col items-center justify-center transition-all duration-300 relative selection:bg-[#F06536]/20 selection:text-[#F06536]">
            {/* Top Device Controls Floating Bar */}
            <div className="mb-3 flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/90 border border-slate-700/80 backdrop-blur-md shadow-xl text-xs font-semibold text-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Mobile App View</span>
                </div>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 hidden xs:inline">390 × 844 px</span>
                <span className="text-slate-600 hidden xs:inline">•</span>
                <button
                    onClick={onToggleFrame}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all active:scale-95 text-[11px]"
                    title="Switch to Full Layout"
                >
                    <Monitor className="w-3 h-3" />
                    <span>Exit to Full Layout</span>
                </button>
            </div>

            {/* Smartphone Outer Shell */}
            <div className="relative w-full max-w-[390px] sm:max-w-[412px] h-[820px] max-h-[88vh] rounded-[48px] p-3 bg-gradient-to-b from-slate-700 via-slate-850 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)] border-4 border-slate-700/60 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Physical Side Buttons simulation */}
                <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-slate-600 rounded-l-sm" />
                <div className="absolute -left-[7px] top-42 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
                <div className="absolute -left-[7px] top-56 w-[3px] h-12 bg-slate-600 rounded-l-sm" />
                <div className="absolute -right-[7px] top-36 w-[3px] h-16 bg-slate-600 rounded-r-sm" />

                {/* Smartphone Screen Viewport Container */}
                <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-odyssey-blue-poppy dark:bg-odyssey-navy flex flex-col shadow-inner select-none">
                    {/* Native Mobile Status Bar with Dynamic Island */}
                    <div className="shrink-0 z-50 w-full px-5 pt-3 pb-1.5 flex items-center justify-between text-xs font-semibold text-odyssey-navy dark:text-odyssey-cream bg-odyssey-blue-poppy/80 dark:bg-odyssey-navy/80 backdrop-blur-md border-b border-odyssey-tan/20 dark:border-odyssey-brown/30 select-none">
                        <span className="font-bold tracking-tight text-[12px]">{currentTime || '9:41'}</span>

                        <div className="w-20 h-4.5 rounded-full bg-black flex items-center justify-center gap-1.5 shadow-xs">
                            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 text-[11px]">
                            <Signal className="w-3 h-3" />
                            <Wifi className="w-3 h-3" />
                            <Battery className="w-3.5 h-3.5 fill-current" />
                        </div>
                    </div>

                    {/* Scrollable Screen Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar relative">
                        {children}
                    </div>

                    {/* Bottom Home Indicator Gesture Bar */}
                    <div className="shrink-0 z-50 w-full py-1.5 flex justify-center bg-white/60 dark:bg-[#0B0F17]/60 backdrop-blur-sm pointer-events-none">
                        <div className="w-28 h-1 rounded-full bg-slate-400/80 dark:bg-slate-600/80" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MobileDeviceFrame;
