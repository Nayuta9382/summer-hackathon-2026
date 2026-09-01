import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldProps {
    label: string;
    children: ReactNode;
    hint?: string;
    required?: boolean;
    htmlFor?: string;
}

export function Field({ label, children, hint, required, htmlFor }: FieldProps) {
    return (
        <div>
            <label htmlFor={htmlFor} className="block text-sm font-bold text-foreground-800 mb-1.5">
                {label}
                {required && <span className="ml-1 text-accent-500">*</span>}
            </label>
            {children}
            {hint && <p className="mt-1.5 text-xs text-foreground-500">{hint}</p>}
        </div>
    );
}

const inputBase =
    'w-full bg-background-50 border border-background-300 rounded-md px-3.5 py-2 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-shadow';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...rest }: InputProps) {
    return <input className={`${inputBase} ${className}`} {...rest} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = '', children, ...rest }: SelectProps) {
    return (
        <div className="relative">
            <select className={`${inputBase} appearance-none pr-9 cursor-pointer ${className}`} {...rest}>
                {children}
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-foreground-500 pointer-events-none text-lg flex items-center justify-center w-5 h-5" />
        </div>
    );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = '', ...rest }: TextareaProps) {
    return <textarea className={`${inputBase} resize-none ${className}`} {...rest} />;
}
