'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/feature/Sidebar';
import MobileTopBar from '@/components/feature/MobileTopBar';
import { ToastProvider, useToast } from '@/components/base/Toast';
import Button from '@/components/base/Button';
import { useSensors } from '@/app/hooks/sensors/useSensors';
import { useTags } from '@/app/hooks/tags/useTags';
import { useToggleSensorEnabled } from '@/app/hooks/sensors/useToggleSensorEnabled';
import { useReadSensorDetectionHistories } from '@/app/hooks/useReadSensorDetectionHistories';
import type { GetSensorResponse } from '@/backend/types/response/sensor/getSensorResponse';
import SensorList from './components/SensorList';
import NotificationSection from './components/NotificationSection';
import SummaryCards from './components/SummaryCards';
import DisabledSection from './components/DisabledSection';
import AddSensorModal from './components/AddSensorModal';
import TagManagerModal from './components/TagManagerModal';
import LoadingDots from '@/components/base/LoadingDots';

function DashboardInner() {
    const toast = useToast();
    const router = useRouter();
    const [showAdd, setShowAdd] = useState(false);
    const [showTag, setShowTag] = useState(false);

    // ============= 新たに実装したコード ==============================

    const { sensors: Nsensors, isLoading, error, refetch } = useSensors();
    const { tags: Ntags, isLoading: isTagsLoading, error: tagsError, refetch: refetchTags } = useTags();
    const { toggleSensorEnabled } = useToggleSensorEnabled();
    const { readSensorDetectionHistories } = useReadSensorDetectionHistories();

    // 有効なセンサだけに絞り込み
    const NenabledSensors = useMemo(() => Nsensors.filter((s) => s.isEnabled), [Nsensors]);

    // 無効なセンサだけに絞り込み
    const disabledSensors = useMemo(() => Nsensors.filter((s) => !s.isEnabled), [Nsensors]);

    // 未読データがあるセンサーのみ通知対象
    const unreadSensors = useMemo(() => NenabledSensors.filter((s) => s.unreadDetectedAts.length > 0), [NenabledSensors]);

    // サイドバー・トップバーの通知件数は「未読の検知件数」の合計で統一する
    const unreadDetectionCount = useMemo(() => NenabledSensors.reduce((sum, s) => sum + s.unreadDetectedAts.length, 0), [NenabledSensors]);

    // TagResponse[] を Record<string, SensorTag> 形式に変換
    const Ntagmap = useMemo(() => Object.fromEntries(Ntags.map((t) => [String(t.tagId), { id: String(t.tagId), name: t.tagName, color: t.colorCode }])), [Ntags]);

    const summary = useMemo(
        () => ({
            total: Nsensors.length,
            active: NenabledSensors.length,
            detecting: NenabledSensors.filter((s) => s.status === 'DETECTING' && s.unreadDetectedAts.length > 0).length,
            unconfirmed: unreadSensors.length,
        }),
        [Nsensors, NenabledSensors, unreadSensors],
    );

    // GetSensorResponse用のtoggleハンドラ(実際にAPIを叩く)
    const handleNToggle = async (sensor: GetSensorResponse) => {
        const { sensor: updated, status } = await toggleSensorEnabled(sensor.sensorId);

        if (status !== 200 || !updated) {
            toast.show('info', `${sensor.sensorName} の切り替えに失敗しました`);
            return;
        }

        if (sensor.isEnabled) {
            toast.show('info', `${sensor.sensorName} を無効化しました`);
        } else {
            toast.show('success', `${sensor.sensorName} を有効化しました`);
        }

        refetch();
    };

    // GetSensorResponse用の既読化ハンドラ(センサー単位で一括既読)
    const handleNConfirm = async (sensor: GetSensorResponse) => {
        const { status } = await readSensorDetectionHistories(sensor.sensorId);

        if (status !== 200) {
            toast.show('info', `${sensor.sensorName} の既読処理に失敗しました`);
            return;
        }

        toast.show('success', `${sensor.sensorName} の通知を既読にしました`);
        refetch();
    };

    // タグ更新ハンドラ(TODO: useUpdateTagができ次第、実APIに差し替え)
    const handleTagUpdate = (tagId: number, data: { name: string; color: string }) => {
        // TODO: 更新APIを呼び出し、成功後にrefetchTags()する
        toast.show('success', `タグ「${data.name}」を更新しました`);
        refetchTags();
    };

    // タグ削除ハンドラ(TODO: useDeleteTagができ次第、実APIに差し替え)
    const handleTagDelete = (tagId: number) => {
        const target = Ntags.find((t) => t.tagId === tagId);
        // TODO: 削除APIを呼び出し、成功後にrefetchTags()する
        toast.show('info', `タグ「${target?.tagName}」を削除しました`);
        refetchTags();
    };

    if (isLoading || isTagsLoading) return <LoadingDots fullScreen label="読み込み中..." />;
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
    // ===============================================================

    return (
        <div className="min-h-[100dvh] flex bg-background-50">
            <Sidebar unreadCount={unreadDetectionCount} activeNav="dashboard" />

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile top bar */}
                <MobileTopBar
                    brand
                    title="SensorHub"
                    activeNav="dashboard"
                    unreadCount={unreadDetectionCount}
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

                    <NotificationSection sensors={unreadSensors} tagMap={Ntagmap} onConfirm={handleNConfirm} onOpen={(s) => router.push(`/app-pages/sensor/${s.sensorId}`)} />

                    <SensorList sensors={NenabledSensors} tagMap={Ntagmap} onToggle={handleNToggle} onOpen={(s) => router.push(`/app-pages/sensor/${s.sensorId}`)} />

                    <DisabledSection sensors={disabledSensors} tagMap={Ntagmap} onEnable={handleNToggle} />
                </main>
            </div>

            <AddSensorModal
                open={showAdd}
                onClose={() => setShowAdd(false)}
                tagMap={Ntagmap}
                onCreated={() => {
                    refetch();
                }}
            />
            <TagManagerModal open={showTag} onClose={() => setShowTag(false)} tags={Ntags} onCreated={() => refetchTags()} onUpdate={handleTagUpdate} onDelete={handleTagDelete} />
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
