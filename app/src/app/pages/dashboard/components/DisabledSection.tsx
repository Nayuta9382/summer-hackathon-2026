import type { Sensor, Tag as SensorTag } from '@/app/mocks/sensors';
import Button from '@/components/base/Button';
import Tag from '@/components/base/Tag';

interface Props {
    sensors: Sensor[];
    tagMap: Record<string, SensorTag>;
    onEnable: (sensor: Sensor) => void;
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
                {sensors.map((s) => (
                    <div key={s.id} className="flex flex-col lg:flex-row lg:items-center gap-4 bg-background-50 border border-background-200 rounded-xl p-4 md:p-5">
                        <div className="flex items-center gap-3 lg:w-[280px] shrink-0">
                            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-400 shrink-0">
                                <i className="ri-pause-circle-line text-2xl" />
                            </span>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-heading font-extrabold text-[15px] text-foreground-800 truncate">{s.name}</p>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 text-slate-600 px-2 py-0.5 text-xs font-extrabold font-label">
                                        <i className="ri-lock-line" />
                                        現在無効
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-foreground-500 font-mono">{s.ip}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                            {s.tagIds.length === 0 ? (
                                <span className="text-xs text-foreground-400">タグなし</span>
                            ) : (
                                s.tagIds.map((id) => {
                                    const t = tagMap[id];
                                    return t ? <Tag key={id} name={t.name} color={t.color} size="sm" /> : null;
                                })
                            )}
                        </div>

                        <div className="lg:w-[220px] shrink-0">
                            <p className="text-[11px] font-label font-bold text-foreground-400 mb-1">直近の検知履歴</p>
                            {s.history.length > 0 ? (
                                <div className="space-y-0.5">
                                    {s.history.slice(0, 2).map((h) => (
                                        <p key={h.id} className="text-xs text-foreground-600 truncate">
                                            <span className="font-mono">{h.time}</span> / {h.detail}
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
                ))}
            </div>
        </section>
    );
}
