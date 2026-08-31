'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/feature/Sidebar';
import MobileTopBar from '@/components/feature/MobileTopBar';
import { ToastProvider, useToast } from '@/components/base/Toast';
import Button from '@/components/base/Button';
import StatusBadge from '@/components/base/StatusBadge';
import Tag from '@/components/base/Tag';
import type { Sensor } from '@/app/mocks/sensors';
import { sensors as initialSensors, tags as initialTags, sensorStatusMeta } from '@/app/mocks/sensors';
import RadarVisual from './components/RadarVisual';
import DetectionHistory from './components/DetectionHistory';
import EditSensorModal from './components/EditSensorModal';

const statusHex: Record<Sensor['status'], string> = {
    normal: '#10B981',
    detecting: '#F97316',
    unconfirmed: '#F59E0B',
    disabled: '#94A3B8',
    offline: '#FB7185',
};

function SensorDetailInner() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const toast = useToast();

    const [sensor, setSensor] = useState<Sensor | undefined>(() => initialSensors.find((s) => s.id === id));

    const tagMap = useMemo(() => Object.fromEntries(initialTags.map((t) => [t.id, t])), []);
    const unreadCount = useMemo(() => initialSensors.filter((s) => s.status === 'detecting' || s.status === 'unconfirmed').length, []);
    const [showEdit, setShowEdit] = useState(false);

    if (!sensor) {
        return (
            <div className="min-h-[100dvh] flex bg-background-50">
                <Sidebar unreadCount={unreadCount} activeNav="dashboard" />
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Mobile top bar */}
                    <MobileTopBar title="センサー詳細" activeNav="dashboard" unreadCount={unreadCount} onBack={() => router.push('/sensors')} />

                    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
                        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-background-100 text-foreground-300">
                            <i className="ri-radar-line text-3xl" />
                        </span>
                        <h1 className="mt-4 font-heading font-black text-xl text-foreground-950">センサーが見つかりません</h1>
                        <p className="mt-1 text-sm text-foreground-600">選択したセンサーは削除されたか、存在しません</p>
                        <Button className="mt-6" onClick={() => router.push('/sensors')}>
                            <i className="ri-arrow-left-line" />
                            一覧へ戻る
                        </Button>
                    </main>
                </div>
            </div>
        );
    }

    const color = statusHex[sensor.status];
    const meta = sensorStatusMeta[sensor.status];
    const latest = sensor.history[0];
    const hasPending = sensor.status === 'detecting' || sensor.status === 'unconfirmed';
    const isDisabled = sensor.status === 'disabled';

    const handleConfirm = () => {
        setSensor((cur) =>
            cur
                ? {
                      ...cur,
                      status: 'normal',
                      history: cur.history.map((h) => ({ ...h, confirmed: true })),
                  }
                : cur,
        );
        toast.show('success', `${sensor.name} の通知を既読にしました`);
    };

    const handleToggle = () => {
        setSensor((cur) => (cur ? { ...cur, status: isDisabled ? 'normal' : 'disabled' } : cur));
        toast.show(isDisabled ? 'success' : 'info', `${sensor.name} を${isDisabled ? '有効化' : '無効化'}しました`);
    };

    const handleEditSave = (data: { name: string; ip: string; tagIds: string[] }) => {
        setSensor((cur) => (cur ? { ...cur, ...data } : cur));
        setShowEdit(false);
        toast.show('success', `${data.name} の情報を更新しました`);
    };

    return (
        <div className="min-h-[100dvh] flex bg-background-50">
            <Sidebar unreadCount={unreadCount} activeNav="dashboard" />

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile top bar */}
                <MobileTopBar title={sensor.name} activeNav="dashboard" unreadCount={unreadCount} onBack={() => router.push('/sensors')} />

                <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-5 md:space-y-6">
                    {/* 戻る + タイトル */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/sensors')}>
                            <i className="ri-arrow-left-line" />
                            一覧へ戻る
                        </Button>
                        <div className="flex items-center gap-3 sm:ml-auto flex-wrap">
                            <Button variant="outline" onClick={() => setShowEdit(true)}>
                                <i className="ri-pencil-line" />
                                編集
                            </Button>
                            <Button variant="outline" onClick={handleToggle}>
                                <i className={`${isDisabled ? 'ri-play-circle-line' : 'ri-pause-circle-line'}`} />
                                {isDisabled ? '有効化' : '無効化'}
                            </Button>
                            {hasPending && (
                                <Button variant="accent" onClick={handleConfirm}>
                                    <i className="ri-check-double-line" />
                                    既読にする
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
                                <h1 className="font-heading font-black text-xl md:text-2xl text-foreground-950 truncate">{sensor.name}</h1>
                                <p className="text-xs text-foreground-500 font-mono">IP: {sensor.ip}</p>
                            </div>
                            <StatusBadge status={sensor.status} pulse={hasPending} />
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-10 px-4 md:px-8 py-6 md:py-8">
                            {/* レーダー */}
                            <RadarVisual sensor={sensor} />

                            {/* 状態ヒーロー */}
                            <div className="flex-1 w-full text-center lg:text-left">
                                <p className="font-label text-sm font-bold text-foreground-500 tracking-wide">現在の状態</p>
                                <div className="mt-1 flex items-center justify-center lg:justify-start gap-3">
                                    <span className={`font-heading font-black text-4xl md:text-5xl ${sensor.status === 'unconfirmed' ? 'animate-pulse-soft' : ''}`} style={{ color }}>
                                        {meta.label}
                                    </span>
                                    {sensor.status === 'detecting' && (
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
                                        <p className="mt-1 text-sm font-bold text-foreground-900">{sensor.history.length}回</p>
                                    </div>
                                    <div className="rounded-xl bg-background-100 border border-background-200 p-3.5 col-span-2 sm:col-span-1">
                                        <p className="text-[11px] font-label font-bold text-foreground-500">タグ</p>
                                        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                                            {sensor.tagIds.length === 0 ? (
                                                <span className="text-xs text-foreground-400">タグなし</span>
                                            ) : (
                                                sensor.tagIds.map((tid) => {
                                                    const t = tagMap[tid];
                                                    return t ? <Tag key={tid} name={t.name} color={t.color} size="sm" /> : null;
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
                                {sensor.history.length}件
                            </span>
                        </div>
                        <div className="px-4 md:px-6 py-5">
                            <DetectionHistory history={sensor.history} color={color} />
                        </div>
                    </section>
                </main>
            </div>

            <EditSensorModal
                key={`---`}
                open={showEdit}
                onClose={() => setShowEdit(false)}
                initialName={sensor.name}
                initialIp={sensor.ip}
                initialTagIds={sensor.tagIds}
                tagMap={tagMap}
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
