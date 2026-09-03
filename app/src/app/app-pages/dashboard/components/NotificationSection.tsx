import type { Tag as SensorTag } from '@/app/mocks/sensors';
import type { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import Button from '@/components/base/Button';
import Tag from '@/components/base/Tag';
import { StatusIcon } from './SensorCardParts';

interface Props {
    sensors: GetSensorResponse[];
    tagMap: Record<string, SensorTag>;
    onConfirm: (sensor: GetSensorResponse) => void;
    onOpen: (sensor: GetSensorResponse) => void;
}

const FALLBACK_COLORS = ['#10B981', '#F97316', '#F59E0B', '#14B8A6', '#F43F5E', '#6366F1', '#0EA5E9'];

function getTagColor(tagId: number, tagMap: Record<string, SensorTag>): string {
    const id = String(tagId);
    if (tagMap[id]) return tagMap[id].color;
    return FALLBACK_COLORS[tagId % FALLBACK_COLORS.length];
}

function getLatestUnread(sensor: GetSensorResponse): Date | null {
    if (sensor.unreadDetectedAts.length === 0) return null;
    return sensor.unreadDetectedAts.map((d) => new Date(d)).reduce((latest, d) => (d > latest ? d : latest));
}

function formatDetectedAt(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
}

export default function NotificationSection({ sensors, tagMap, onConfirm, onOpen }: Props) {
    // 未読データがあるセンサーだけを通知対象にする
    const unreadSensors = sensors.filter((s) => s.unreadDetectedAts.length > 0);

    if (unreadSensors.length === 0) return null;

    return (
        <section className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 md:px-5 py-4 border-b border-background-200 bg-gradient-to-r from-accent-50 to-background-50">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-500 text-white">
                    <i className="ri-alarm-warning-line text-lg" />
                </span>
                <h2 className="font-heading font-extrabold text-base md:text-lg text-foreground-950">通知ありセンサー</h2>
                <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-accent-500 text-white text-xs font-extrabold font-label">{unreadSensors.length}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 md:p-4">
                {unreadSensors.map((s) => {
                    const latest = getLatestUnread(s);
                    const isDetecting = s.status === 'DETECTING';
                    const tone = isDetecting ? 'border-orange-200 bg-orange-50/60' : 'border-amber-200 bg-amber-50/60';
                    const label = isDetecting ? '検知中' : '未確認';
                    const labelCls = isDetecting ? 'bg-orange-500 text-white' : 'bg-amber-500 text-white';

                    return (
                        <div
                            key={s.sensorId}
                            onClick={() => onOpen(s)}
                            className={`flex flex-col gap-3 border rounded-xl p-4 ${tone} animate-slide-in cursor-pointer hover:brightness-[0.99] transition-all`}
                        >
                            <div className="flex items-center gap-3">
                                <StatusIcon sensor={s} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-heading font-extrabold text-foreground-950 truncate">{s.sensorName}</p>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold font-label ${labelCls}`}>
                                            <i className={`${isDetecting ? 'ri-radar-fill animate-pulse-soft' : 'ri-notification-badge-fill'}`} />
                                            {label}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-foreground-700">未読の検知が{s.unreadDetectedAts.length}件あります</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 flex-wrap min-w-0">
                                    <span className="inline-flex items-center gap-1 text-xs text-foreground-600 font-medium whitespace-nowrap">
                                        <i className="ri-time-line" />
                                        {latest ? formatDetectedAt(latest) : '—'}
                                    </span>
                                    {s.tags.map((tag) => (
                                        <Tag key={tag.tagId} name={tag.tagName} color={getTagColor(tag.tagId, tagMap)} size="sm" />
                                    ))}
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
