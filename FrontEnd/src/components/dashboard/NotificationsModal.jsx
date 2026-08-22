import { X, Bell, CheckCheck } from 'lucide-react';

export function NotificationsModal({
    isOpen,
    onClose,
    notifications = [],
    onMarkAsRead,
    onMarkAllAsRead,
    onDeleteNotification
}) {
    if (!isOpen) return null;

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#131B2E] rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-in zoom-in-95 duration-200 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#F06536] flex items-center justify-center">
                            <Bell className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Notifications
                            </h3>
                            <p className="text-[11px] text-slate-400">
                                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
                        aria-label="Close dialog"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Notifications list */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                            No notifications yet.
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => !n.isRead && onMarkAsRead?.(n.id)}
                                className={`p-3 rounded-2xl border transition-all text-xs cursor-pointer ${
                                    !n.isRead
                                        ? 'bg-orange-50/50 dark:bg-orange-950/20 border-[#F06536]/30 dark:border-[#F06536]/40 shadow-xs'
                                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/80 opacity-70'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        {!n.isRead && (
                                            <span className="w-2 h-2 rounded-full bg-[#F06536] flex-shrink-0" />
                                        )}
                                        <h4 className={`font-bold ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                            {n.title}
                                        </h4>
                                    </div>
                                    <span className="text-[10px] text-slate-400">{n.time}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                    {n.desc}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                    <div className="pt-1 flex gap-2">
                        <button
                            onClick={onMarkAllAsRead}
                            disabled={unreadCount === 0}
                            className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark all as read</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
