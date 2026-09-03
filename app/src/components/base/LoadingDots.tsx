'use client';

interface Props {
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

const dotSizeMap = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
};

export default function LoadingDots({ label, size = 'md', fullScreen = false }: Props) {
    const dotSize = dotSizeMap[size];

    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-end gap-1.5 h-6">
                <span className={`${dotSize} rounded-full bg-primary-500 loading-dot`} style={{ animationDelay: '-0.3s' }} />
                <span className={`${dotSize} rounded-full bg-primary-500 loading-dot`} style={{ animationDelay: '-0.15s' }} />
                <span className={`${dotSize} rounded-full bg-primary-500 loading-dot`} />
            </div>
            {label && <p className="text-sm font-label font-bold text-foreground-500">{label}</p>}

            <style jsx>{`
                .loading-dot {
                    animation: loading-bounce 1s ease-in-out infinite;
                }
                @keyframes loading-bounce {
                    0%,
                    80%,
                    100% {
                        transform: translateY(0);
                        opacity: 0.5;
                    }
                    40% {
                        transform: translateY(-8px);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );

    if (fullScreen) {
        return <div className="min-h-[100dvh] flex items-center justify-center bg-background-50">{content}</div>;
    }

    return <div className="flex items-center justify-center py-10">{content}</div>;
}
