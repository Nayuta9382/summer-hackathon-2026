import type { SensorStatus } from '@/backend/types/sensorStatus';

interface StatusMeta {
    label: string;
    dot: string;
    text: string;
    bg: string;
}

const statusMeta: Record<SensorStatus, StatusMeta> = {
    DETECTING: {
        label: '検知中',
        dot: 'bg-orange-500',
        text: 'text-orange-700',
        bg: 'bg-orange-50',
    },
    UNCONFIRMED: {
        label: '未確認',
        dot: 'bg-amber-500',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
    },
    NONE: {
        label: '待機中',
        dot: 'bg-emerald-500',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
    },
};

const disabledMeta: StatusMeta = {
    label: '無効',
    dot: 'bg-slate-400',
    text: 'text-slate-500',
    bg: 'bg-slate-100',
};

interface StatusBadgeProps {
    status: SensorStatus;
    isDisabled?: boolean;
    pulse?: boolean;
    size?: 'sm' | 'md';
}

export default function StatusBadge({ status, isDisabled = false, pulse = false, size = 'md' }: StatusBadgeProps) {
    const meta = isDisabled ? disabledMeta : statusMeta[status];
    const sizing = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-[13px]';

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-label font-bold whitespace-nowrap ${sizing} ${meta.bg} ${meta.text}`}>
            <span className="relative flex items-center justify-center w-2 h-2">
                <span className={`absolute inline-flex w-2 h-2 rounded-full ${meta.dot} ${pulse ? 'animate-ping opacity-60' : ''}`} />
                <span className={`relative inline-flex w-2 h-2 rounded-full ${meta.dot}`} />
            </span>
            {meta.label}
        </span>
    );
}
