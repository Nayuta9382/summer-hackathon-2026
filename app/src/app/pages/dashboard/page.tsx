'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/feature/Sidebar';
import MobileTopBar from '@/components/feature/MobileTopBar';
import { ToastProvider, useToast } from '@/components/base/Toast';
import Button from '@/components/base/Button';
import type { Sensor, Tag } from '@/app/mocks/sensors';
import { sensors as initialSensors, tags as initialTags } from '@/app/mocks/sensors';
import SummaryCards from './components/SummaryCards';
import NotificationSection from './components/NotificationSection';
import SensorList from './components/SensorList';
import DisabledSection from './components/DisabledSection';
import AddSensorModal from './components/AddSensorModal';
import TagManagerModal from './components/TagManagerModal';

function DashboardInner() {
    const toast = useToast();
    const router = useRouter();
    const [sensors, setSensors] = useState<Sensor[]>(initialSensors);
    const [tags, setTags] = useState<Tag[]>(initialTags);
    const [showAdd, setShowAdd] = useState(false);
    const [showTag, setShowTag] = useState(false);

    const tagMap = useMemo(() => Object.fromEntries(tags.map((t) => [t.id, t])), [tags]);

    const enabled = useMemo(() => sensors.filter((s) => s.status !== 'disabled'), [sensors]);
    const disabled = useMemo(() => sensors.filter((s) => s.status === 'disabled'), [sensors]);
    const notifications = useMemo(() => enabled.filter((s) => s.status === 'detecting' || s.status === 'unconfirmed'), [enabled]);

    const summary = useMemo(
        () => ({
            total: sensors.length,
            active: enabled.filter((s) => s.status !== 'offline').length,
            detecting: enabled.filter((s) => s.status === 'detecting').length,
            unconfirmed: enabled.filter((s) => s.status === 'unconfirmed').length,
        }),
        [sensors, enabled],
    );

    const handleAdd = (data: { name: string; ip: string; tagIds: string[] }) => {
        const newSensor: Sensor = {
            id: `sensor-${Date.now()}`,
            name: data.name,
            ip: data.ip,
            tagIds: data.tagIds,
            status: 'normal',
            lastDetectedAt: '—',
            history: [],
            addedAt: '2026-08-25',
        };
        setSensors((cur) => [newSensor, ...cur]);
        setShowAdd(false);
        toast.show('success', `${data.name} を登録しました`);
    };

    const handleToggle = (sensor: Sensor) => {
        if (sensor.status === 'disabled') {
            setSensors((cur) => cur.map((s) => (s.id === sensor.id ? { ...s, status: 'normal' } : s)));
            toast.show('success', `${sensor.name} を有効化しました`);
        } else {
            setSensors((cur) => cur.map((s) => (s.id === sensor.id ? { ...s, status: 'disabled' } : s)));
            toast.show('info', `${sensor.name} を無効化しました`);
        }
    };

    const handleConfirm = (sensor: Sensor) => {
        setSensors((cur) =>
            cur.map((s) =>
                s.id === sensor.id
                    ? {
                          ...s,
                          status: 'normal',
                          history: s.history.map((h) => ({ ...h, confirmed: true })),
                      }
                    : s,
            ),
        );
        toast.show('success', `${sensor.name} の通知を既読にしました`);
    };

    const handleAddTag = (data: { name: string; color: string }) => {
        setTags((cur) => [...cur, { id: `tag-${Date.now()}`, ...data }]);
        toast.show('success', `タグ「${data.name}」を作成しました`);
    };

    const handleUpdateTag = (id: string, data: { name: string; color: string }) => {
        setTags((cur) => cur.map((t) => (t.id === id ? { ...t, ...data } : t)));
        toast.show('success', 'タグを更新しました');
    };

    const handleDeleteTag = (id: string) => {
        const target = tags.find((t) => t.id === id);
        setTags((cur) => cur.filter((t) => t.id !== id));
        setSensors((cur) => cur.map((s) => ({ ...s, tagIds: s.tagIds.filter((tid) => tid !== id) })));
        toast.show('info', `タグ「${target?.name}」を削除しました`);
    };

    return (
        <div className="min-h-[100dvh] flex bg-background-50">
            <Sidebar unreadCount={notifications.length} activeNav="dashboard" />

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile top bar */}
                <MobileTopBar
                    brand
                    title="SensorHub"
                    activeNav="dashboard"
                    unreadCount={notifications.length}
                    action={
                        <button
                            type="button"
                            onClick={() => setShowAdd(true)}
                            aria-label="センサーを追加"
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-white cursor-pointer"
                        >
                            <i className="ri-add-line text-lg" />
                        </button>
                    }
                />

                <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-5 md:space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                        <div>
                            <h1 className="font-heading font-black text-2xl md:text-[28px] text-foreground-950">センサー管理</h1>
                            <p className="mt-1 text-sm text-foreground-600">センサーの状態を確認・管理できます</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
                            <Button variant="outline" onClick={() => setShowTag(true)}>
                                <i className="ri-price-tag-3-line" />
                                タグ管理
                            </Button>
                            <Button onClick={() => setShowAdd(true)}>
                                <i className="ri-add-line" />
                                センサーを追加
                            </Button>
                        </div>
                    </div>

                    <SummaryCards summary={summary} />

                    <NotificationSection sensors={notifications} tagMap={tagMap} onConfirm={handleConfirm} onOpen={(s) => router.push(`/sensor/${s.id}`)} />

                    <SensorList sensors={enabled} tagMap={tagMap} onToggle={handleToggle} onOpen={(s) => router.push(`/sensor/${s.id}`)} />

                    <DisabledSection sensors={disabled} tagMap={tagMap} onEnable={handleToggle} />
                </main>
            </div>

            <AddSensorModal open={showAdd} onClose={() => setShowAdd(false)} tagMap={tagMap} onAdd={handleAdd} />
            <TagManagerModal open={showTag} onClose={() => setShowTag(false)} tags={tags} onAdd={handleAddTag} onUpdate={handleUpdateTag} onDelete={handleDeleteTag} />
        </div>
    );
}

export default function Dashboard() {
    return (
        <ToastProvider>
            <DashboardInner />
        </ToastProvider>
    );
}
