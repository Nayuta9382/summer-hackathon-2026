// app/sample/sampleFetchPages/users/me/page.tsx
'use client';

import { useUser } from '@/app/hooks/users/useUser';

export default function MePage() {
    const { user, isLoading, error } = useUser();

    if (isLoading) return <p>読み込み中...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>ユーザー情報が見つかりません</p>;

    return (
        <div>
            <h1>ユーザー情報</h1>

            <p>ユーザー名: {user.userName}</p>
            <p>音声通知: {user.isSoundEnabled ? '有効' : '無効'}</p>
            <p>通知音: {user.soundName}</p>
            <p>ファイルURL: {user.fileUrl}</p>
            <p>作成日: {new Date(user.createdAt).toLocaleString()}</p>
            <p>更新日: {new Date(user.updatedAt).toLocaleString()}</p>
        </div>
    );
}
