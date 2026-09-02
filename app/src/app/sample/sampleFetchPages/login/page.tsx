// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useLogin } from '@/app/hooks/auth/useLogin';

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginInfo, setLoginInfo] = useState<{ userId: number; userName: string } | null>(null);

    const { login, isLoading, error } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await login({ userName, password });
        console.log(result.user);

        if (result.user) {
            // 成功時: userId, userName を利用
            setLoginInfo({ userId: result.user.userId, userName: result.user.userName });
            alert('成功');
        } else {
            setLoginInfo(null);
            alert('失敗');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userName">ユーザ名</label>
                    <input id="userName" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">パスワード</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'ログイン中...' : 'ログイン'}
                </button>
            </form>

            {error && <p>{error}</p>}

            {loginInfo && (
                <p>
                    ようこそ、{loginInfo.userName} さん（userId: {loginInfo.userId}）
                </p>
            )}
        </div>
    );
}
