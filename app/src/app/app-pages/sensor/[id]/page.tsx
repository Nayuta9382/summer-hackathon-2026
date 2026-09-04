'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/feature/Sidebar';
import MobileTopBar from '@/components/feature/MobileTopBar';
import { ToastProvider, useToast } from '@/components/base/Toast';
import Button from '@/components/base/Button';
import Tag from '@/components/base/Tag';
import type { Tag as SensorTag } from '@/app/mocks/sensors';
import type { SensorStatus } from '@/backend/types/sensorStatus';
import { useSensor } from '@/app/hooks/sensors/useSensor';
import { useSensors } from '@/app/hooks/sensors/useSensors';
import { useTags } from '@/app/hooks/tags/useTags';
import { useToggleSensorEnabled } from '@/app/hooks/sensors/useToggleSensorEnabled';
import { useUpdateSensor } from '@/app/hooks/sensors/useUpdateSensor';
import { useReadSensorDetectionHistories } from '@/app/hooks/useReadSensorDetectionHistories';
import RadarVisual from '../components/RadarVisual';
import DetectionHistory from '../components/DetectionHistory';
import type { DetectionItem } from '../components/DetectionHistory';
import EditSensorModal from '../components/EditSensorModal';
import StatusBadge from '../components/StatusBadge';
import LoadingDots from '@/components/base/LoadingDots';

const statusHex: Record<SensorStatus, string> = {
    NONE: '#10B981',
    DETECTING: '#F97316',
    UNCONFIRMED: '#F59E0B',
};

const statusLabel: Record<SensorStatus, string> = {
    NONE: '待機中',
    DETECTING: '検知中',
    UNCONFIRMED: '未確認',
};

const disabledColor = '#94A3B8';

function formatDetectedAt(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
}

function SensorDetailInner() {
    const { id } = useParams<{ id: string }>();
    const sensorId = Number(id);
    const router = useRouter();
    const toast = useToast();

    const { sensor, isLoading, error, refetch } = useSensor(sensorId);
    const { sensors: allSensors } = useSensors();
    const { tags, isLoading: isTagsLoading, error: tagsError, refetch: refetchTags } = useTags();
    const { toggleSensorEnabled } = useToggleSensorEnabled();
    const { updateSensor, isUpdating } = useUpdateSensor();
    const { readSensorDetectionHistories, isReading } = useReadSensorDetectionHistories();

    const [showEdit, setShowEdit] = useState(false);

    const tagMap = useMemo<Record<string, SensorTag>>(() => Object.fromEntries(tags.map((t) => [String(t.tagId), { id: String(t.tagId), name: t.tagName, color: t.colorCode }])), [tags]);

    // 有効かつ未読データがあるセンサーのみサイドバーの通知件数に含める
    const unreadCount = useMemo(() => allSensors.filter((s) => s.isEnabled && s.unreadDetectedAts.length > 0).length, [allSensors]);

    const history = useMemo<DetectionItem[]>(() => {
        if (!sensor) return [];
        const read = sensor.readDetectedAts.map((d) => ({ date: new Date(d), confirmed: true }));
        const unread = sensor.unreadDetectedAts.map((d) => ({ date: new Date(d), confirmed: false }));
        return [...read, ...unread]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((h, i) => ({
                id: `${h.date.getTime()}-${i}`,
                time: formatDetectedAt(h.date),
                detail: '検知しました',
                confirmed: h.confirmed,
            }));
    }, [sensor]);

    const handleToggle = async () => {
        if (!sensor) return;
        const { sensor: updated, status } = await toggleSensorEnabled(sensor.sensorId);

        if (status !== 200 || !updated) {
            toast.show('info', `${sensor.sensorName} の切り替えに失敗しました`);
            return;
        }

        toast.show(sensor.isEnabled ? 'info' : 'success', `${sensor.sensorName} を${sensor.isEnabled ? '無効化' : '有効化'}しました`);
        refetch();
    };

    const handleConfirm = async () => {
        if (!sensor) return;

        const { status } = await readSensorDetectionHistories(sensor.sensorId);

        if (status !== 200) {
            toast.show('info', `${sensor.sensorName} の既読処理に失敗しました`);
            return;
        }

        toast.show('success', `${sensor.sensorName} の通知を既読にしました`);
        refetch();
    };

    const handleEditSave = async (data: { name: string; url: string; tagIds: number[] }) => {
        if (!sensor) return;
        const { sensor: updated, status } = await updateSensor(sensor.sensorId, {
            sensorName: data.name,
            url: data.url,
            tagIds: data.tagIds,
        });

        if (status !== 200 || !updated) {
            toast.show('info', 'センサーの更新に失敗しました');
            return;
        }

        setShowEdit(false);
        toast.show('success', `${data.name} の情報を更新しました`);
        refetch();
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

    if (!sensor) {
        return (
            <div className="min-h-[100dvh] flex bg-background-50">
                <Sidebar unreadCount={unreadCount} activeNav="dashboard" />
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Mobile top bar */}
                    <MobileTopBar title="センサー詳細" activeNav="dashboard" unreadCount={unreadCount} onBack={() => router.push('/')} />

                    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
                        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-background-100 text-foreground-300">
                            <i className="ri-radar-line text-3xl" />
                        </span>
                        <h1 className="mt-4 font-heading font-black text-xl text-foreground-950">センサーが見つかりません</h1>
                        <p className="mt-1 text-sm text-foreground-600">選択したセンサーは削除されたか、存在しません</p>
                        <Button className="mt-6" onClick={() => router.push('/app-pages/dashboard')}>
                            <i className="ri-arrow-left-line" />
                            一覧へ戻る
                        </Button>
                    </main>
                </div>
            </div>
        );
    }

    const isDisabled = !sensor.isEnabled;
    const color = isDisabled ? disabledColor : statusHex[sensor.status];
    const label = isDisabled ? '無効' : statusLabel[sensor.status];
    const latest = history[0];
    const hasPending = !isDisabled && (sensor.status === 'DETECTING' || sensor.status === 'UNCONFIRMED');

    return (
        <div className="min-h-[100dvh] flex bg-background-50">
            <Sidebar unreadCount={unreadCount} activeNav="dashboard" />

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile top bar */}
                <MobileTopBar title={sensor.sensorName} activeNav="dashboard" unreadCount={unreadCount} onBack={() => router.push('/')} />

                <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-5 md:space-y-6">
                    {/* 戻る + タイトル */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/app-pages/dashboard')}>
                            <i className="ri-arrow-left-line" />
                            一覧へ戻る
                        </Button>
                        <div className="flex items-center gap-3 sm:ml-auto flex-wrap">
                            <Button onClick={() => setShowEdit(true)}>
                                <i className="ri-add-line" />
                                編集
                            </Button>
                            <Button variant="outline" onClick={handleToggle}>
                                <i className={`${isDisabled ? 'ri-play-circle-line' : 'ri-pause-circle-line'}`} />
                                {isDisabled ? '有効化' : '無効化'}
                            </Button>
                            {hasPending && (
                                <Button variant="accent" onClick={handleConfirm} disabled={isReading}>
                                    <i className="ri-check-double-line" />
                                    {isReading ? '処理中...' : '既読にする'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* センサー情報カード */}
                    <div className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
                        <div className="flex items-center gap-2.5 px-4 md:px-6 pt-5">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: `${color}1A`, color }}>
                                <i className="ri-wifi-line text-lg" />
                            </span>
                            <div className="min-w-0">
                                <h1 className="font-heading font-black text-xl md:text-2xl text-foreground-950 truncate">{sensor.sensorName}</h1>
                                <p className="text-xs text-foreground-500 font-mono">{sensor.url ?? '—'}</p>
                            </div>
                            <StatusBadge status={sensor.status} isDisabled={isDisabled} pulse={hasPending} />
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 px-4 md:px-8 py-6 md:py-8">
                            {/* レーダー */}
                            <RadarVisual sensor={sensor} />

                            {/* 状態ヒーロー */}
                            <div className="flex-1 w-full text-center lg:text-left">
                                <p className="font-label text-sm font-bold text-foreground-500 tracking-wide">現在の状態</p>
                                <div className="mt-1 flex items-center justify-center lg:justify-start gap-3">
                                    <span className={`font-heading font-black text-4xl md:text-5xl ${!isDisabled && sensor.status === 'UNCONFIRMED' ? 'animate-pulse-soft' : ''}`} style={{ color }}>
                                        {label}
                                    </span>
                                    {!isDisabled && sensor.status === 'DETECTING' && (
                                        <span className="relative flex items-center justify-center w-3 h-3">
                                            <span className="absolute inline-flex w-full h-full rounded-full bg-accent-400 animate-ping opacity-60" />
                                            <span className="relative inline-flex w-3 h-3 rounded-full bg-accent-500" />
                                        </span>
                                    )}
                                </div>

                                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-3 text-left">
                                    <div className="rounded-xl bg-background-100 border border-background-200 p-3.5">
                                        <p className="text-[11px] font-label font-bold text-foreground-500">直近の検知</p>
                                        <p className="mt-1 text-sm font-bold text-foreground-900 whitespace-nowrap">{latest ? latest.time : '履歴なし'}</p>
                                    </div>
                                    <div className="rounded-xl bg-background-100 border border-background-200 p-3.5">
                                        <p className="text-[11px] font-label font-bold text-foreground-500">検知回数</p>
                                        <p className="mt-1 text-sm font-bold text-foreground-900">{history.length}回</p>
                                    </div>
                                    <div className="rounded-xl bg-background-100 border border-background-200 p-3.5 col-span-2 sm:col-span-1">
                                        <p className="text-[11px] font-label font-bold text-foreground-500">タグ</p>
                                        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                                            {sensor.tags.length === 0 ? (
                                                <span className="text-xs text-foreground-400">タグなし</span>
                                            ) : (
                                                sensor.tags.map((tag) => {
                                                    const t = tagMap[String(tag.tagId)];
                                                    return <Tag key={tag.tagId} name={tag.tagName} color={t?.color ?? '#94A3B8'} size="sm" />;
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: `${color}12`, border: `1px solid ${color}30` }}>
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: color, color: '#fff' }}>
                                        <i className={latest ? (latest.confirmed ? 'ri-flag-2-line' : 'ri-alert-line') : 'ri-information-line'} />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-foreground-900 truncate">{latest ? latest.detail : 'まだ検知記録がありません'}</p>
                                        <p className="text-xs text-foreground-500">
                                            {latest ? (latest.confirmed ? '確認済みの検知です' : '未確認の検知があります') : 'センサーは正常に待機しています'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 検知履歴 */}
                    <section className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
                        <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-background-200">
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary-100 text-secondary-700">
                                <i className="ri-history-line text-lg" />
                            </span>
                            <div>
                                <h2 className="font-heading font-extrabold text-base md:text-lg text-foreground-950">検知履歴</h2>
                                <p className="text-xs text-foreground-500">このセンサーの検知記録</p>
                            </div>
                            <span
                                className="ml-auto flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full text-xs font-label font-extrabold"
                                style={{ backgroundColor: `${color}1A`, color }}
                            >
                                {history.length}件
                            </span>
                        </div>
                        <div className="px-4 md:px-6 py-5">
                            <DetectionHistory history={history} color={color} />
                        </div>
                    </section>
                </main>
            </div>

            <EditSensorModal
                key={`sensor-edit-${sensor.sensorId}`}
                open={showEdit}
                onClose={() => setShowEdit(false)}
                initialName={sensor.sensorName}
                initialUrl={sensor.url ?? ''}
                initialTagIds={sensor.tags.map((t) => t.tagId)}
                tagMap={tagMap}
                isSaving={isUpdating}
                onSave={handleEditSave}
            />
        </div>
    );
}

export default function SensorDetail() {
    return (
        <ToastProvider>
            <SensorDetailInner />
        </ToastProvider>
    );
}
