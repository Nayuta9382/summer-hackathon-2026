import type { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import type { SensorStatus } from '@/backend/types/sensorStatus';

interface Props {
    sensor: GetSensorResponse;
}

const hexColor: Record<SensorStatus, { color: string; bg: string; icon: string; sweepSpeed: string }> = {
    NONE: { color: '#10B981', bg: '#E7F9F1', icon: 'ri-radar-line', sweepSpeed: '3.2s' },
    DETECTING: { color: '#F97316', bg: '#FFF1E6', icon: 'ri-radar-fill', sweepSpeed: '1.8s' },
    UNCONFIRMED: { color: '#F59E0B', bg: '#FFF8E1', icon: 'ri-radar-fill', sweepSpeed: '2.4s' },
};

const disabledColor = { color: '#94A3B8', bg: '#F1F5F9', icon: 'ri-pause-circle-line', sweepSpeed: '0s' };

export default function RadarVisual({ sensor }: Props) {
    const isDisabled = !sensor.isEnabled;
    const c = isDisabled ? disabledColor : hexColor[sensor.status];
    const detecting = !isDisabled && sensor.status === 'DETECTING';
    const isIdle = !isDisabled && (sensor.status === 'NONE' || sensor.status === 'UNCONFIRMED');
    const swept = !isDisabled;

    return (
        <div className="relative flex items-center justify-center w-[220px] h-[220px] md:w-[280px] md:h-[280px] shrink-0">
            {/* 検知中: 大きく広がる波紋 */}
            {detecting && (
                <>
                    <span className="absolute inset-0 rounded-full animate-ripple-pop" style={{ backgroundColor: `${c.color}22` }} />
                    <span className="absolute inset-0 rounded-full animate-ripple-pop [animation-delay:0.6s]" style={{ backgroundColor: `${c.color}18` }} />
                    <span className="absolute inset-0 rounded-full animate-ripple-pop [animation-delay:1.2s]" style={{ backgroundColor: `${c.color}12` }} />
                </>
            )}

            {/* 待機中: ゆっくりと穏やかな波紋 */}
            {isIdle && (
                <>
                    <span className="absolute inset-8 rounded-full animate-ripple-pop [animation-delay:0.4s]" style={{ backgroundColor: `${c.color}14` }} />
                    <span className="absolute inset-8 rounded-full animate-ripple-pop [animation-delay:1.7s]" style={{ backgroundColor: `${c.color}10` }} />
                </>
            )}

            {/* メインのセンサーディスク */}
            <div
                className="relative flex items-center justify-center w-[150px] h-[150px] md:w-[180px] md:h-[180px] rounded-full border-4"
                style={{ backgroundColor: c.bg, borderColor: `${c.color}55`, opacity: isDisabled ? 0.85 : 1 }}
            >
                {/* レーダー走査 */}
                {swept && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-0 animate-radar-sweep"
                            style={{
                                background: `conic-gradient(from 0deg, transparent 0deg, transparent 320deg, ${c.color}45 360deg)`,
                                animationDuration: c.sweepSpeed,
                            }}
                        />
                    </div>
                )}

                {/* グリッドライン */}
                <div className="absolute inset-0 rounded-full">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: `${c.color}26` }} />
                    <div className="absolute top-1/2 left-0 right-0 h-px" style={{ backgroundColor: `${c.color}26` }} />
                    <div className="absolute left-1/4 top-1/4 w-[2px] h-[2px] rounded-full" style={{ backgroundColor: `${c.color}50` }} />
                    <div className="absolute right-1/4 top-1/4 w-[2px] h-[2px] rounded-full" style={{ backgroundColor: `${c.color}50` }} />
                    <div className="absolute left-1/4 bottom-1/4 w-[2px] h-[2px] rounded-full" style={{ backgroundColor: `${c.color}50` }} />
                    <div className="absolute right-1/4 bottom-1/4 w-[2px] h-[2px] rounded-full" style={{ backgroundColor: `${c.color}50` }} />
                </div>

                {/* 中心アイコン */}
                <div
                    className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full text-white ${
                        detecting ? 'animate-soft-bounce' : !isDisabled && sensor.status === 'UNCONFIRMED' ? 'animate-pulse-soft' : ''
                    }`}
                    style={{ backgroundColor: c.color, boxShadow: `0 0 0 6px ${c.color}1F` }}
                >
                    <i className={`${c.icon} text-4xl md:text-5xl`} />
                </div>
            </div>
        </div>
    );
}
