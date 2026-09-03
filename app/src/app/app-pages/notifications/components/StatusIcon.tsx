import type { SensorStatus } from '@/backend/types/sensorStatus';

interface Props {
    status: SensorStatus;
    isEnabled: boolean;
}

export default function StatusIcon({ status, isEnabled }: Props) {
    const isDisabled = !isEnabled;

    const style = isDisabled
        ? { color: '#94A3B8', bg: '#F1F5F9' }
        : status === 'DETECTING'
          ? { color: '#F97316', bg: '#FFF1E6' }
          : status === 'UNCONFIRMED'
            ? { color: '#F59E0B', bg: '#FFF8E1' }
            : { color: '#10B981', bg: '#E7F9F1' }; // 'NONE'(通常状態)

    return (
        <span className="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl shrink-0" style={{ backgroundColor: style.bg }}>
            {!isDisabled && status === 'DETECTING' && (
                <>
                    <span className="absolute inline-flex w-full h-full rounded-xl animate-ripple-expand" style={{ backgroundColor: `${style.color}33` }} />
                    <span className="absolute inline-flex w-full h-full rounded-xl animate-ripple-expand [animation-delay:0.6s]" style={{ backgroundColor: `${style.color}22` }} />
                </>
            )}
            <span className="relative flex items-center justify-center w-full h-full">
                <i
                    className={`${isDisabled ? 'ri-pause-circle-line' : status === 'DETECTING' ? 'ri-radar-fill animate-soft-bounce' : 'ri-radar-line'} text-xl md:text-2xl`}
                    style={{ color: style.color }}
                />
            </span>
            {!isDisabled && status === 'UNCONFIRMED' && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-secondary-500 text-white">
                    <i className="ri-notification-badge-fill text-[10px]" />
                </span>
            )}
        </span>
    );
}
