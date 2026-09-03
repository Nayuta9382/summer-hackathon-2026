'use client';

import { useMemo, useState } from 'react';
import { Input, Select } from '@/components/base/Form';
import type { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import type { Tag as SensorTag } from '@/app/mocks/sensors';
import SensorCard from './SensorCard';

interface Props {
    sensors: GetSensorResponse[];
    tagMap: Record<string, SensorTag>;
    onToggle: (sensor: GetSensorResponse) => void;
    onOpen: (sensor: GetSensorResponse) => void;
}

type SortKey = 'name' | 'recent' | 'ip';

function getLatestDetectedAt(sensor: GetSensorResponse): string {
    const all = [...sensor.readDetectedAts, ...sensor.unreadDetectedAts];
    if (all.length === 0) return '';
    return all.reduce((latest, d) => (d > latest ? d : latest)).toString();
}

export default function SensorList({ sensors, tagMap, onToggle, onOpen }: Props) {
    const [query, setQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [sort, setSort] = useState<SortKey>('recent');

    const filtered = useMemo(() => {
        let list = sensors;

        if (activeTag) {
            list = list.filter((s) => s.tags.some((t) => String(t.tagId) === activeTag));
        }
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            list = list.filter((s) => s.sensorName.toLowerCase().includes(q) || (s.url ?? '').toLowerCase().includes(q));
        }

        const arr = [...list];
        switch (sort) {
            case 'name':
                arr.sort((a, b) => a.sensorName.localeCompare(b.sensorName, 'ja'));
                break;
            case 'ip':
                arr.sort((a, b) => (a.url ?? '').localeCompare(b.url ?? ''));
                break;
            case 'recent':
            default:
                arr.sort((a, b) => getLatestDetectedAt(b).localeCompare(getLatestDetectedAt(a)));
        }
        return arr;
    }, [sensors, activeTag, query, sort]);

    return (
        <section className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center gap-3 px-4 md:px-5 py-4 border-b border-background-200">
                <h2 className="font-heading font-extrabold text-base md:text-lg text-foreground-950">
                    センサー一覧
                    <span className="ml-2 text-sm font-bold text-foreground-400">{filtered.length}台</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-2 md:ml-auto md:items-center">
                    <div className="relative sm:w-60">
                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 flex items-center justify-center w-4 h-4" />
                        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="センサー名・URLで検索" className="pl-9 text-sm" />
                    </div>
                    <div className="sm:w-40">
                        <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                            <option value="recent">直近の検知順</option>
                            <option value="name">名前順</option>
                            <option value="ip">URL順</option>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap px-4 md:px-5 py-3 border-b border-background-200">
                <span className="text-xs font-label font-bold text-foreground-400 mr-1">タグ:</span>
                <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    className={`px-2.5 py-1 rounded-full text-xs font-label font-bold whitespace-nowrap cursor-pointer transition-colors ${
                        activeTag === null ? 'bg-primary-500 text-white' : 'bg-background-100 text-foreground-600 hover:bg-background-200'
                    }`}
                >
                    すべて
                </button>
                {Object.values(tagMap).map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTag((cur) => (cur === t.id ? null : t.id))}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label font-bold whitespace-nowrap cursor-pointer transition-all ${
                            activeTag === t.id ? 'ring-2' : ''
                        }`}
                        style={{
                            backgroundColor: `${t.color}1A`,
                            color: t.color,
                            boxShadow: activeTag === t.id ? `0 0 0 2px ${t.color}60` : undefined,
                        }}
                    >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                        {t.name}
                    </button>
                ))}
            </div>

            <div className="p-3 md:p-4 space-y-2.5">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center px-4">
                        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-background-100 text-foreground-300">
                            <i className="ri-search-eye-line text-2xl" />
                        </span>
                        <p className="mt-3 font-heading font-bold text-foreground-700">該当するセンサーがありません</p>
                        <p className="mt-1 text-sm text-foreground-500">検索条件やタグを変更してみてください</p>
                    </div>
                ) : (
                    filtered.map((s) => <SensorCard key={s.sensorId} sensor={s} tagMap={tagMap} onToggle={onToggle} onOpen={onOpen} />)
                )}
            </div>
        </section>
    );
}
