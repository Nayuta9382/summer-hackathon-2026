'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/feature/Sidebar';
import MobileTopBar from '@/components/feature/MobileTopBar';
import { ToastProvider } from '@/components/base/Toast';
import { Input, Select } from '@/components/base/Form';
import type { Tag as SensorTag } from '@/app/mocks/sensors';
import { useSensors } from '@/app/hooks/sensors/useSensors';
import { useTags } from '@/app/hooks/tags/useTags';
import NotificationTimeline from './components/NotificationTimeline';
import { buildNotifications, buildTagMap } from './notificationsData';

type StatusFilter = 'all' | 'unconfirmed' | 'confirmed';

function NotificationsInner() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusFilter>('all');

    const { sensors, isLoading, error, refetch } = useSensors();
    const { tags, isLoading: isTagsLoading, error: tagsError, refetch: refetchTags } = useTags();

    const allItems = useMemo(() => buildNotifications(sensors), [sensors]);
    const tagMap = useMemo<Record<string, SensorTag>>(() => buildTagMap(tags), [tags]);

    // 有効かつ未読データがあるセンサーのみサイドバーの通知件数に含める
    const unreadCount = useMemo(() => sensors.filter((s) => s.isEnabled && s.unreadDetectedAts.length > 0).length, [sensors]);

    const filtered = useMemo(() => {
        let list = allItems;
        if (activeTag) list = list.filter((n) => n.tagIds.some((id) => String(id) === activeTag));
        if (status !== 'all') {
            list = list.filter((n) => (status === 'unconfirmed' ? !n.confirmed : n.confirmed));
        }
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            list = list.filter((n) => n.sensorName.toLowerCase().includes(q) || (n.sensorUrl ?? '').toLowerCase().includes(q));
        }
        return list;
    }, [allItems, activeTag, status, query]);

    const totalCount = allItems.length;
    const unconfirmedCount = allItems.filter((n) => !n.confirmed).length;
    const confirmedCount = totalCount - unconfirmedCount;

    if (isLoading || isTagsLoading) return <p>読み込み中...</p>;

    if (error || tagsError) {
        return (
            <div>
                <p>{error ?? tagsError}</p>
                <button
                    onClick={() => {
                        refetch();
                        refetchTags();
                    }}
                >
                    再試行
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] flex bg-background-50">
            <Sidebar unreadCount={unreadCount} activeNav="notifications" />

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile top bar */}
                <MobileTopBar title="通知" icon="ri-notification-3-line" activeNav="notifications" unreadCount={unreadCount} />

                <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-5 md:space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="font-heading font-black text-2xl md:text-[28px] text-foreground-950">通知一覧</h1>
                        <p className="mt-1 text-sm text-foreground-600">過去の検知・通知を時系列で確認できます</p>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        <div className="rounded-2xl border border-background-200 bg-background-50 p-4 flex items-center gap-3.5">
                            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-secondary-100 text-secondary-700 shrink-0">
                                <i className="ri-file-list-3-line text-xl" />
                            </span>
                            <div>
                                <p className="text-xs font-label font-bold text-foreground-500">通知の総数</p>
                                <p className="font-heading font-black text-2xl text-foreground-950">
                                    {totalCount}
                                    <span className="ml-1 text-sm font-bold text-foreground-400">件</span>
                                </p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 flex items-center gap-3.5">
                            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-secondary-500 text-white shrink-0">
                                <i className="ri-notification-badge-fill text-xl" />
                            </span>
                            <div>
                                <p className="text-xs font-label font-bold text-secondary-700">未確認の通知</p>
                                <p className="font-heading font-black text-2xl text-secondary-700">
                                    {unconfirmedCount}
                                    <span className="ml-1 text-sm font-bold text-secondary-600">件</span>
                                </p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-center gap-3.5">
                            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500 text-white shrink-0">
                                <i className="ri-check-double-line text-xl" />
                            </span>
                            <div>
                                <p className="text-xs font-label font-bold text-emerald-700">確認済みの通知</p>
                                <p className="font-heading font-black text-2xl text-emerald-700">
                                    {confirmedCount}
                                    <span className="ml-1 text-sm font-bold text-emerald-600">件</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filter card */}
                    <section className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
                        <div className="flex flex-col gap-3 px-4 md:px-5 py-4 border-b border-background-200">
                            <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
                                <div className="relative sm:w-72">
                                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 flex items-center justify-center w-4 h-4" />
                                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="センサー名・URLで検索" className="pl-9 text-sm" />
                                </div>
                                <div className="sm:w-44">
                                    <Select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
                                        <option value="all">すべての状態</option>
                                        <option value="unconfirmed">未確認のみ</option>
                                        <option value="confirmed">確認済みのみ</option>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2 sm:ml-auto">
                                    <span className="text-xs font-label font-bold text-foreground-400">{filtered.length}件表示中</span>
                                </div>
                            </div>

                            {/* Tag filter */}
                            <div className="flex items-center gap-2 flex-wrap">
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
                        </div>

                        <div className="p-4 md:p-6">
                            <NotificationTimeline items={filtered} tagMap={tagMap} onOpen={(sensorId) => router.push(`/app-pages/sensor/${sensorId}`)} />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default function Notifications() {
    return (
        <ToastProvider>
            <NotificationsInner />
        </ToastProvider>
    );
}
