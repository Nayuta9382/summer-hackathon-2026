import type { Sensor, Tag as SensorTag } from '@/app/mocks/sensors';
import Button from '@/components/base/Button';
import Tag from '@/components/base/Tag';
import { StatusIcon } from '../SensorCardParts';

interface Props {
    sensors: Sensor[];
    tagMap: Record<string, SensorTag>;
    onConfirm: (sensor: Sensor) => void;
    onOpen: (sensor: Sensor) => void;
}

export default function NotificationSection({ sensors, tagMap, onConfirm, onOpen }: Props) {
    if (sensors.length === 0) return null;

    return (
        <section className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 md:px-5 py-4 border-b border-background-200 bg-gradient-to-r from-accent-50 to-background-50">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500 text-white">
                    <i className="ri-alarm-warning-line text-lg" />
                </span>
                <h2 className="font-heading font-extrabold text-base md:text-lg text-foreground-950">通知ありセンサー</h2>
                <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-accent-500 text-white text-xs font-extrabold font-label">{sensors.length}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 md:p-4">
                {sensors.map((s) => {
                    const latest = s.history[0];
                    const isDetecting = s.status === 'detecting';
                    const tone = isDetecting ? 'border-orange-200 bg-orange-50/60' : 'border-amber-200 bg-amber-50/60';
                    const label = isDetecting ? '検知中' : '未確認';
                    const labelCls = isDetecting ? 'bg-orange-500 text-white' : 'bg-amber-500 text-white';

                    return (
                        <div
                            key={s.id}
                            onClick={() => onOpen(s)}
                            className={`flex flex-col gap-3 border rounded-xl p-4 ${tone} animate-slide-in cursor-pointer hover:brightness-[0.99] transition-all`}
                        >
                            <div className="flex items-center gap-3">
                                <StatusIcon sensor={s} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-heading font-extrabold text-foreground-950 truncate">{s.name}</p>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold font-label ${labelCls}`}>
                                            <i className={`${isDetecting ? 'ri-radar-fill animate-pulse-soft' : 'ri-notification-badge-fill'}`} />
                                            {label}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-foreground-700">{latest?.detail}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                    <span className="inline-flex items-center gap-1 text-xs text-foreground-600 font-medium whitespace-nowrap">
                                        <i className="ri-time-line" />
                                        {s.lastDetectedAt}
                                    </span>
                                    {s.tagIds.map((id) => {
                                        const t = tagMap[id];
                                        return t ? <Tag key={id} name={t.name} color={t.color} size="sm" /> : null;
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onConfirm(s);
                                    }}
                                >
                                    <i className="ri-check-line" />
                                    既読にする
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
