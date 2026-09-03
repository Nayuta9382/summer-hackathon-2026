'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/base/Button';
import { Field, Input } from '@/components/base/Form';
import { ToastProvider, useToast } from '@/components/base/Toast';
import { useLogin } from '@/app/hooks/auth/useLogin';

function LoginInner() {
    const router = useRouter();
    const toast = useToast();
    const { login, isLoading } = useLogin();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userName.trim()) {
            setError('ユーザー名を入力してください');
            return;
        }
        if (!password) {
            setError('パスワードを入力してください');
            return;
        }

        setError('');

        const result = await login({ userName, password });

        if (result.user) {
            toast.show('success', `${result.user.userName} さんとしてログインしました`);
            router.push('/app-pages/dashboard');
        } else {
            setError('ユーザー名またはパスワードが正しくありません');
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-background-50 px-4 py-10">
            <div className="w-full max-w-[400px]">
                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-500 text-white mb-3">
                        <i className="ri-radar-line text-3xl" />
                    </span>
                    <p className="font-heading font-black text-xl text-foreground-950">SensorHub</p>
                    <p className="text-xs text-foreground-500 font-label">センサー管理アプリ</p>
                </div>

                <section className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden shadow-soft">
                    <div className="px-6 pt-6 pb-2">
                        <h1 className="font-heading font-extrabold text-lg text-foreground-950">ログイン</h1>
                        <p className="mt-1 text-sm text-foreground-500">アカウント情報を入力してください</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <Field label="ユーザー名" required htmlFor="login-username">
                            <Input id="login-username" name="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="yamada" autoComplete="username" />
                        </Field>

                        <Field label="パスワード" required htmlFor="login-password">
                            <Input
                                id="login-password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="パスワードを入力"
                                autoComplete="current-password"
                            />
                        </Field>

                        {error && (
                            <p className="flex items-center gap-1.5 text-sm font-medium text-rose-600">
                                <i className="ri-error-warning-line" />
                                {error}
                            </p>
                        )}

                        <Button type="submit" full disabled={isLoading}>
                            <i className="ri-login-box-line" />
                            {isLoading ? 'ログイン中...' : 'ログイン'}
                        </Button>
                    </form>
                </section>

                <p className="mt-5 text-center text-sm text-foreground-600">
                    アカウントをお持ちでない方は{' '}
                    <Link href="/register" className="font-bold text-primary-600 hover:text-primary-700">
                        新規登録
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <ToastProvider>
            <LoginInner />
        </ToastProvider>
    );
}
