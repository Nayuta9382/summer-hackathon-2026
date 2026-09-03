'use client';

import { useState } from 'react';
import Button from '@/components/base/Button';
import { Field, Input } from '@/components/base/Form';
import { useChangePassword } from '@/app/hooks/users/useChangePassword';
import { useToast } from '@/components/base/Toast';

interface Props {
    userName: string;
}

export default function UserInfoCard({ userName }: Props) {
    const toast = useToast();
    const { changePassword, isChanging } = useChangePassword();

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword) {
            setError('現在のパスワードを入力してください');
            return;
        }
        if (!password || password.length < 6) {
            setError('新しいパスワードは6文字以上で入力してください');
            return;
        }
        if (password !== confirm) {
            setError('パスワードが一致しません');
            return;
        }

        setError('');

        const { success, status } = await changePassword(currentPassword, password);

        if (!success) {
            if (status === 400) {
                setError('現在のパスワードが正しくありません');
            } else {
                toast.show('info', 'パスワードの変更に失敗しました');
            }
            return;
        }

        setCurrentPassword('');
        setPassword('');
        setConfirm('');
        toast.show('success', 'パスワードを変更しました');
    };

    return (
        <section className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
            <div className="flex items-center gap-3 px-5 md:px-6 py-4 border-b border-background-200">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary-100 text-secondary-700">
                    <i className="ri-user-settings-line text-lg" />
                </span>
                <div>
                    <h2 className="font-heading font-extrabold text-base md:text-lg text-foreground-950">ユーザー情報</h2>
                    <p className="text-xs text-foreground-500">アカウントの基本情報を確認・パスワードを変更できます</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
                <Field label="ユーザー名" htmlFor="profile-name">
                    <p id="profile-name" className="max-w-md px-3.5 py-2 text-sm text-foreground-800 bg-background-100 border border-background-200 rounded-md">
                        {userName}
                    </p>
                </Field>

                <div className="rounded-xl bg-background-100/80 border border-background-200 p-4">
                    <p className="text-sm font-bold text-foreground-800 mb-1">パスワード変更</p>
                    <p className="text-xs text-foreground-500 mb-3">変更しない場合は空のままにしてください</p>

                    <div className="mb-4">
                        <Field label="現在のパスワード" htmlFor="profile-current-password">
                            <Input
                                id="profile-current-password"
                                name="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="現在のパスワード"
                                autoComplete="current-password"
                                className="max-w-md"
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="新しいパスワード" htmlFor="profile-password">
                            <Input
                                id="profile-password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="6文字以上"
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field label="パスワード確認" htmlFor="profile-confirm">
                            <Input
                                id="profile-confirm"
                                name="confirm"
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="もう一度入力"
                                autoComplete="new-password"
                            />
                        </Field>
                    </div>
                </div>

                {error && (
                    <p className="flex items-center gap-1.5 text-sm font-medium text-rose-600">
                        <i className="ri-error-warning-line" />
                        {error}
                    </p>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={isChanging}>
                        <i className="ri-check-line" />
                        {isChanging ? '変更中...' : 'パスワードを変更'}
                    </Button>
                </div>
            </form>
        </section>
    );
}
