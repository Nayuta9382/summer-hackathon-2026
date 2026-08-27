import type { SensorStatus } from '@/app/mocks/sensors';
import { sensorStatusMeta } from '@/app/mocks/sensors';

interface StatusBadgeProps {
    status: SensorStatus;
    pulse?: boolean;
    size?: 'sm' | 'md';
}

export default function StatusBadge({ status, pulse = false, size = 'md' }: StatusBadgeProps) {
    const meta = sensorStatusMeta[status];
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
