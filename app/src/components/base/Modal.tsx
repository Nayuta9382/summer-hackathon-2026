import { useEffect, type ReactNode } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    width?: string;
}

export default function Modal({ open, onClose, title, subtitle, icon, children, footer, width = 'max-w-lg' }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:items-center">
            <div className="absolute inset-0 bg-foreground-950/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
            <div role="dialog" aria-modal="true" className={`relative w-full ${width} bg-background-50 rounded-2xl border border-background-200 animate-slide-in my-8 max-h-[90vh] flex flex-col`}>
                {(title || icon) && (
                    <div className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-background-200">
                        {icon && <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">{icon}</span>}
                        <div className="min-w-0">
                            {title && <h2 className="font-heading font-extrabold text-lg text-foreground-950">{title}</h2>}
                            {subtitle && <p className="mt-0.5 text-sm text-foreground-600">{subtitle}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="閉じる"
                            className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-foreground-500 hover:bg-background-100 hover:text-foreground-800 cursor-pointer transition-colors"
                        >
                            <i className="ri-close-line text-lg" />
                        </button>
                    </div>
                )}
                <div className="px-6 py-5 overflow-y-auto">{children}</div>
                {footer && <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-background-200">{footer}</div>}
            </div>
        </div>
    );
}
