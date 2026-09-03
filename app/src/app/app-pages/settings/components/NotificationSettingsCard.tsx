'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/base/Button';
import { Field, Input, Select } from '@/components/base/Form';
import { useNotificationProviders } from '@/app/hooks/NotificationProviders/useNotificationProviders';

type DestType = 'slack' | 'line';

interface Props {
    onSave: (data: { sound: boolean; soundType: string; dest: DestType; destValue: string }) => void;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${checked ? 'bg-primary-500' : 'bg-background-300'}`}
        >
            <span className={`inline-block w-5 h-5 rounded-full bg-white shadow-soft transform transition-transform duration-200 ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
        </button>
    );
}

const destTabs: { key: DestType; label: string; icon: string; hint: string }[] = [
    { key: 'slack', label: 'Slack', icon: 'ri-slack-line', hint: 'Slackワークスペースと連携して通知します' },
    { key: 'line', label: 'LINE', icon: 'ri-line-line', hint: 'LINE IDで通知します' },
];

export default function NotificationSettingsCard({ onSave }: Props) {
    const [sound, setSound] = useState(true);
    const [soundType, setSoundType] = useState('standard');
    const [dest, setDest] = useState<DestType>('line');
    const [destValue, setDestValue] = useState('');
    const [connecting, setConnecting] = useState(false);

    const { providers, isLoading: isProvidersLoading } = useNotificationProviders();

    // デバッグ用: 連携状態をログ出力
    useEffect(() => {
        console.log('providers:', providers);
    }, [providers]);

    const slackConnected = providers?.slack ?? false;

    const handleSlackConnect = async () => {
        setConnecting(true);
        try {
            const res = await fetch('/api/slack/connect', { method: 'POST' });
            if (!res.ok) throw new Error('failed to start slack connect');
            const data = await res.json();
            window.location.href = data.url;
        } catch (e) {
            console.error(e);
            setConnecting(false);
            alert('Slack連携の開始に失敗しました');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ sound, soundType, dest, destValue: dest === 'slack' ? (slackConnected ? 'connected' : '') : destValue.trim() });
    };

    return (
        <section className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden">
            <div className="flex items-center gap-3 px-5 md:px-6 py-4 border-b border-background-200">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent-100 text-accent-700">
                    <i className="ri-notification-3-line text-lg" />
                </span>
                <div>
                    <h2 className="font-heading font-extrabold text-base md:text-lg text-foreground-950">通知設定</h2>
                    <p className="text-xs text-foreground-500">検知時の通知方法を設定できます</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
                {/* 通知音 */}
                <div className="rounded-xl border border-background-200 bg-background-50 p-4">
                    <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-700 shrink-0">
                            <i className="ri-volume-up-line text-lg" />
                        </span>
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-bold text-foreground-900">通知音</p>
                                    <p className="text-xs text-foreground-500">Webブラウザで検知時に音を鳴らします</p>
                                </div>
                                <Toggle checked={sound} onChange={setSound} label="通知音" />
                            </div>

                            {sound && (
                                <div className="mt-4 max-w-xs">
                                    <Field label="通知音の種類" htmlFor="sound-type">
                                        <Select id="sound-type" name="soundType" value={soundType} onChange={(e) => setSoundType(e.target.value)}>
                                            <option value="standard">標準ビープ音</option>
                                            <option value="soft">ソフトベル</option>
                                            <option value="alert">アラート</option>
                                        </Select>
                                    </Field>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="mt-3 inline-flex items-center gap-1 text-[11px] font-label font-bold text-secondary-700 bg-secondary-100 rounded-full px-2.5 py-1">
                        <i className="ri-global-line" />
                        Web版のみの機能です
                    </p>
                </div>

                {/* 通知先 */}
                <div className="rounded-xl border border-background-200 bg-background-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-100 text-secondary-700 shrink-0">
                            <i className="ri-send-plane-line text-lg" />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-foreground-900">通知先</p>
                            <p className="text-xs text-foreground-500">検知内容を外部サービスにも通知します</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-w-sm">
                        {destTabs.map((t) => {
                            const active = dest === t.key;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setDest(t.key)}
                                    className={`flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-label font-bold whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                                        active ? 'bg-accent-500 text-white' : 'bg-background-100 text-foreground-700 hover:bg-background-200'
                                    }`}
                                >
                                    <i className={`${t.icon} text-lg`} />
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                    <p className="mt-2 text-xs text-foreground-500">{destTabs.find((t) => t.key === dest)?.hint}</p>

                    <div className="mt-4 max-w-sm">
                        {dest === 'slack' ? (
                            isProvidersLoading ? (
                                <p className="text-sm text-foreground-500">連携状態を確認中...</p>
                            ) : slackConnected ? (
                                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                                    <i className="ri-checkbox-circle-fill text-emerald-600 text-lg" />
                                    <p className="text-sm font-bold text-emerald-800">連携済み</p>
                                </div>
                            ) : (
                                <Button type="button" variant="primary" onClick={handleSlackConnect} disabled={connecting}>
                                    <i className="ri-slack-line" />
                                    {connecting ? '接続中...' : 'Slackと連携する'}
                                </Button>
                            )
                        ) : (
                            <Field label="LINE ID" htmlFor="dest-value">
                                <div className="relative">
                                    <i className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 flex items-center justify-center w-4 h-4" />
                                    <Input
                                        id="dest-value"
                                        name="destValue"
                                        value={destValue}
                                        onChange={(e) => setDestValue(e.target.value)}
                                        placeholder="LINEのIDを入力"
                                        className="pl-9"
                                        type="text"
                                    />
                                </div>
                            </Field>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit">
                        <i className="ri-check-line" />
                        設定を保存
                    </Button>
                </div>
            </form>
        </section>
    );
}
