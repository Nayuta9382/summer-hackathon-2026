'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/base/Button';
import { Field, Input } from '@/components/base/Form';
import { ToastProvider, useToast } from '@/components/base/Toast';

function RegisterInner() {
    const router = useRouter();
    const toast = useToast();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userName.trim()) {
            setError('ユーザー名を入力してください');
            return;
        }
        if (password.length < 6) {
            setError('パスワードは6文字以上で入力してください');
            return;
        }
        if (password !== confirm) {
            setError('パスワードが一致しません');
            return;
        }

        setError('');
        setSubmitting(true);
        toast.show('success', `${userName} さんのアカウントを作成しました`);

        setTimeout(() => {
            router.push('/login');
        }, 600);
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
                        <h1 className="font-heading font-extrabold text-lg text-foreground-950">新規アカウント作成</h1>
                        <p className="mt-1 text-sm text-foreground-500">必要な情報を入力してアカウントを作成してください</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <Field label="ユーザー名" required htmlFor="register-username">
                            <Input id="register-username" name="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="山田 太郎" autoComplete="username" />
                        </Field>

                        <Field label="パスワード" required htmlFor="register-password" hint="6文字以上で入力してください">
                            <Input
                                id="register-password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="6文字以上"
                                autoComplete="new-password"
                            />
                        </Field>

                        <Field label="パスワード確認" required htmlFor="register-confirm">
                            <Input
                                id="register-confirm"
                                name="confirm"
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="もう一度入力"
                                autoComplete="new-password"
                            />
                        </Field>

                        {error && (
                            <p className="flex items-center gap-1.5 text-sm font-medium text-rose-600">
                                <i className="ri-error-warning-line" />
                                {error}
                            </p>
                        )}

                        <Button type="submit" full disabled={submitting}>
                            <i className="ri-user-add-line" />
                            アカウントを作成
                        </Button>
                    </form>
                </section>

                <p className="mt-5 text-center text-sm text-foreground-600">
                    すでにアカウントをお持ちの方は{' '}
                    <Link href="/login" className="font-bold text-primary-600 hover:text-primary-700">
                        ログイン
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function Register() {
    return (
        <ToastProvider>
            <RegisterInner />
        </ToastProvider>
    );
}
