'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type UserData = {
    slackId: string | null;
};

export default function EditUserPage() {
    const searchParams = useSearchParams();
    const slackStatus = searchParams.get('slack');

    // URLパラメータからそのまま算出するだけなので、effectやstateは不要
    const statusMessage =
        slackStatus === 'connected'
            ? 'Slackと連携しました。'
            : slackStatus === 'error'
              ? 'Slack連携に失敗しました。もう一度お試しください。'
              : slackStatus === 'wrong_workspace'
                ? '指定のワークスペース以外での認証は許可されていません。'
                : null;
    const statusType = slackStatus === 'connected' ? 'success' : statusMessage ? 'error' : null;

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    // 外部(自前API)からユーザー情報を取得する処理。これはeffectで正しい使い方。
    useEffect(() => {
        let cancelled = false;

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Cookieを受け取る
            body: JSON.stringify({
                userName: 'sampleUser',
                password: 'morijyobi',
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (cancelled) return;
                console.log('login:', data);

                // ログインが終わってからユーザー情報を取得する
                return fetch('/api/users/me', {
                    credentials: 'include', // Cookieを送る
                });
            })
            .then((res) => {
                if (!res || cancelled) return;
                return res.json();
            })
            .then((data) => {
                if (cancelled || !data) return;
                // setStateをマイクロタスクにずらし、effect本体からの
                // 同期的なcascading renderを避ける
                queueMicrotask(() => {
                    if (!cancelled) setUser({ slackId: data.slackId ?? null });
                });
            })
            .catch((e) => console.error(e));

        return () => {
            cancelled = true;
        };
    }, []);

    // 「Slackと連携する」ボタン押下時の処理
    const handleConnect = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/slack/connect', { method: 'POST' });
            if (!res.ok) throw new Error('failed to start slack connect');
            const data = await res.json();
            window.location.href = data.url;
        } catch (e) {
            console.error(e);
            setLoading(false);
            alert('Slack連携の開始に失敗しました');
        }
    };

    return (
        <div className="mx-auto max-w-xl space-y-6 p-6">
            <h1 className="text-xl font-semibold">ユーザー編集</h1>

            {statusMessage && (
                <p className={statusType === 'success' ? 'rounded-md bg-green-50 px-4 py-2 text-sm text-green-700' : 'rounded-md bg-red-50 px-4 py-2 text-sm text-red-700'}>{statusMessage}</p>
            )}

            <section className="space-y-2">
                <h2 className="text-sm font-medium text-gray-900">Slack連携</h2>

                {user?.slackId ? (
                    <span className="text-sm text-gray-600">Slack連携済み: {user.slackId}</span>
                ) : (
                    <button
                        type="button"
                        onClick={handleConnect}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-md bg-[#4A154B] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d1140] disabled:opacity-50"
                    >
                        {loading ? '接続中...' : 'Slackと連携する'}
                    </button>
                )}
            </section>
        </div>
    );
}
