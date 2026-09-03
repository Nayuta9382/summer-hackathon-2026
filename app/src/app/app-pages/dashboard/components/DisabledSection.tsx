import type { Tag as SensorTag } from '@/app/mocks/sensors';
import type { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import Button from '@/components/base/Button';
import Tag from '@/components/base/Tag';

interface Props {
    sensors: GetSensorResponse[];
    tagMap: Record<string, SensorTag>;
    onEnable: (sensor: GetSensorResponse) => void;
}

const FALLBACK_COLORS = ['#10B981', '#F97316', '#F59E0B', '#14B8A6', '#F43F5E', '#6366F1', '#0EA5E9'];

function getTagColor(tagId: number, tagMap: Record<string, SensorTag>): string {
    const id = String(tagId);
    if (tagMap[id]) return tagMap[id].color;
    return FALLBACK_COLORS[tagId % FALLBACK_COLORS.length];
}

function formatDetectedAt(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
}

// 直近の検知履歴を新しい順に最大n件取得(read/unread問わず)
function getRecentHistory(sensor: GetSensorResponse, limit: number): Date[] {
    const all = [...sensor.readDetectedAts, ...sensor.unreadDetectedAts].map((d) => new Date(d));
    return all.sort((a, b) => b.getTime() - a.getTime()).slice(0, limit);
}

export default function DisabledSection({ sensors, tagMap, onEnable }: Props) {
    if (sensors.length === 0) return null;

    return (
        <section className="rounded-2xl border border-dashed border-background-300 bg-background-100/50 overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 md:px-5 py-4 border-b border-background-200">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-400 text-white">
                    <i className="ri-pause-circle-line text-lg" />
                </span>
                <h2 className="font-heading font-extrabold text-base md:text-lg text-foreground-700">無効化されたセンサー</h2>
                <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-slate-400 text-white text-xs font-extrabold font-label">{sensors.length}</span>
                <span className="ml-auto hidden sm:inline-flex items-center gap-1 text-xs text-foreground-500">
                    <i className="ri-information-line" />
                    右側に直近の検知履歴を表示
                </span>
            </div>

            <div className="space-y-2.5 p-3 md:p-4">
                {sensors.map((s) => {
                    const recentHistory = getRecentHistory(s, 2);

                    return (
                        <div key={s.sensorId} className="flex flex-col lg:flex-row lg:items-center gap-4 bg-background-50 border border-background-200 rounded-xl p-4 md:p-5">
                            <div className="flex items-center gap-3 lg:w-[280px] shrink-0">
                                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-400 shrink-0">
                                    <i className="ri-pause-circle-line text-2xl" />
                                </span>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-heading font-extrabold text-[15px] text-foreground-800 truncate">{s.sensorName}</p>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 text-slate-600 px-2 py-0.5 text-xs font-extrabold font-label">
                                            <i className="ri-lock-line" />
                                            現在無効
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-foreground-500 font-mono">{s.url ?? '—'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                                {s.tags.length === 0 ? (
                                    <span className="text-xs text-foreground-400">タグなし</span>
                                ) : (
                                    s.tags.map((tag) => <Tag key={tag.tagId} name={tag.tagName} color={getTagColor(tag.tagId, tagMap)} size="sm" />)
                                )}
                            </div>

                            <div className="lg:w-[220px] shrink-0">
                                <p className="text-[11px] font-label font-bold text-foreground-400 mb-1">直近の検知履歴</p>
                                {recentHistory.length > 0 ? (
                                    <div className="space-y-0.5">
                                        {recentHistory.map((d) => (
                                            <p key={d.getTime()} className="text-xs text-foreground-600 truncate">
                                                <span className="font-mono">{formatDetectedAt(d)}</span>
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-foreground-400">履歴なし</p>
                                )}
                            </div>

                            <div className="lg:w-[110px] shrink-0 flex justify-end">
                                <Button variant="primary" size="sm" onClick={() => onEnable(s)}>
                                    <i className="ri-play-circle-line" />
                                    有効化
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
