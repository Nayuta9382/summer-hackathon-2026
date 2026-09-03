'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'info' | 'warning';
interface ToastItem {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    show: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function useToast() {
    return useContext(ToastContext);
}

const styleMap: Record<ToastType, { icon: string; iconWrap: string; border: string; bg: string; text: string }> = {
    success: { icon: 'ri-checkbox-circle-fill', iconWrap: 'bg-emerald-500 text-white', border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-900' },
    info: { icon: 'ri-information-fill', iconWrap: 'bg-primary-500 text-white', border: 'border-primary-300', bg: 'bg-background-50', text: 'text-primary-700' },
    warning: { icon: 'ri-error-warning-fill', iconWrap: 'bg-amber-500 text-white', border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-900' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const idRef = useRef(0);

    const show = useCallback((type: ToastType, message: string) => {
        const id = ++idRef.current;
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3200);
    }, []);

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div className="fixed top-[calc(3.5rem+0.75rem)] right-3 lg:top-5 lg:right-5 z-[100] flex flex-col gap-2.5 w-[340px] max-w-[calc(100vw-1.5rem)]">
                {toasts.map((t) => {
                    const s = styleMap[t.type];
                    return (
                        <div key={t.id} className={`flex items-start gap-3 ${s.bg} border-2 ${s.border} rounded-xl px-4 py-3 shadow-lg animate-toast-in`}>
                            <span className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${s.iconWrap}`}>
                                <i className={`${s.icon} text-base`} />
                            </span>
                            <p className={`text-sm font-bold leading-snug pt-0.5 ${s.text}`}>{t.message}</p>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}
