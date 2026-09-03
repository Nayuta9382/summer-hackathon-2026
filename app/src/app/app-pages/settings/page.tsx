'use client';

import { useMemo } from 'react';
import Sidebar from '@/components/feature/Sidebar';
import MobileTopBar from '@/components/feature/MobileTopBar';
import { ToastProvider, useToast } from '@/components/base/Toast';
import { useSensors } from '@/app/hooks/sensors/useSensors';
import { useUser } from '@/app/hooks/users/useUser';
import UserInfoCard from './components/UserInfoCard';
import NotificationSettingsCard from './components/NotificationSettingsCard';
import LoadingDots from '@/components/base/LoadingDots';

function SettingsInner() {
    const toast = useToast();
    const { sensors } = useSensors();
    const { user, isLoading, error, refetch } = useUser();

    const unreadCount = useMemo(() => sensors.filter((s) => s.isEnabled && s.unreadDetectedAts.length > 0).length, [sensors]);

    if (isLoading) return <LoadingDots fullScreen label="読み込み中..." />;

    if (error || !user) {
        return (
            <div>
                <p>{error ?? 'ユーザー情報が取得できませんでした'}</p>
                <button onClick={() => refetch()}>再試行</button>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] flex bg-background-50">
            <Sidebar unreadCount={unreadCount} activeNav="settings" />

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile top bar */}
                <MobileTopBar title="設定" icon="ri-settings-3-line" activeNav="settings" unreadCount={unreadCount} />

                <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-5 md:space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="font-heading font-black text-2xl md:text-[28px] text-foreground-950">設定</h1>
                        <p className="mt-1 text-sm text-foreground-600">アカウント情報と通知の設定を管理できます</p>
                    </div>

                    <UserInfoCard userName={user.userName} />

                    <NotificationSettingsCard onSave={({ dest }) => toast.show('success', `通知設定を保存しました（通知先: ${dest === 'slack' ? 'Slack' : 'LINE'}）`)} />
                </main>
            </div>
        </div>
    );
}

export default function Settings() {
    return (
        <ToastProvider>
            <SettingsInner />
        </ToastProvider>
    );
}
