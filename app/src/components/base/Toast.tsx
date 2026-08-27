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

const styleMap: Record<ToastType, { icon: string; accent: string }> = {
    success: { icon: 'ri-checkbox-circle-fill', accent: 'text-emerald-500' },
    info: { icon: 'ri-information-fill', accent: 'text-primary-500' },
    warning: { icon: 'ri-error-warning-fill', accent: 'text-amber-500' },
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
            <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 w-[340px] max-w-[calc(100vw-2.5rem)]">
                {toasts.map((t) => {
                    const s = styleMap[t.type];
                    return (
                        <div key={t.id} className="flex items-start gap-3 bg-background-50 border border-background-200 rounded-xl px-4 py-3 shadow-soft animate-toast-in">
                            <span className={`flex items-center justify-center w-5 h-5 shrink-0 ${s.accent}`}>
                                <i className={`${s.icon} text-lg`} />
                            </span>
                            <p className="text-sm text-foreground-800 font-medium leading-snug pt-0.5">{t.message}</p>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}
