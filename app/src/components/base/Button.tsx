import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    icon?: ReactNode;
    children?: ReactNode;
    full?: boolean;
}

const variants: Record<Variant, string> = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-300',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-300',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-300',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-300',
    ghost: 'bg-transparent text-foreground-700 hover:bg-background-100 focus-visible:ring-background-300',
    outline: 'bg-background-50 text-foreground-700 border border-background-300 hover:bg-background-100 hover:border-background-400 focus-visible:ring-background-300',
};

const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-md',
    md: 'px-4 py-2 text-sm gap-2 rounded-md',
    lg: 'px-5 py-2.5 text-[15px] gap-2 rounded-lg',
};

export default function Button({ variant = 'primary', size = 'md', icon, children, full, className = '', ...rest }: ButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center whitespace-nowrap font-label font-bold cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
            {...rest}
        >
            {icon && <span className="flex items-center justify-center w-4 h-4 shrink-0">{icon}</span>}
            {children}
        </button>
    );
}
