import type { ReactNode } from 'react';
import type { Sensor } from '@/app/mocks/sensors';

export function StatusIcon({ sensor }: { sensor: Sensor }) {
    const style =
        sensor.status === 'detecting'
            ? { color: '#F97316', bg: '#FFF1E6' }
            : sensor.status === 'unconfirmed'
              ? { color: '#F59E0B', bg: '#FFF8E1' }
              : sensor.status === 'offline'
                ? { color: '#FB7185', bg: '#FFEEF1' }
                : sensor.status === 'disabled'
                  ? { color: '#94A3B8', bg: '#F1F5F9' }
                  : { color: '#10B981', bg: '#E7F9F1' };

    return (
        <span className="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl shrink-0" style={{ backgroundColor: style.bg }}>
            {sensor.status === 'detecting' && (
                <>
                    <span className="absolute inline-flex w-full h-full rounded-xl animate-ripple-expand" style={{ backgroundColor: `${style.color}33` }} />
                    <span className="absolute inline-flex w-full h-full rounded-xl animate-ripple-expand [animation-delay:0.6s]" style={{ backgroundColor: `${style.color}22` }} />
                </>
            )}
            <span className="relative flex items-center justify-center w-full h-full">
                <i
                    className={`${
                        sensor.status === 'detecting'
                            ? 'ri-radar-fill animate-soft-bounce'
                            : sensor.status === 'offline'
                              ? 'ri-wifi-off-line'
                              : sensor.status === 'disabled'
                                ? 'ri-pause-circle-line'
                                : 'ri-radar-line'
                    } text-xl md:text-2xl`}
                    style={{ color: style.color }}
                />
            </span>
            {sensor.status === 'unconfirmed' && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-secondary-500 text-white">
                    <i className="ri-notification-badge-fill text-[10px]" />
                </span>
            )}
        </span>
    );
}

export function SensorCardShell({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-background-50 border border-background-200 rounded-xl p-4 md:p-5 hover:border-background-300 transition-colors duration-150">
            {children}
        </div>
    );
}
