'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { navItems } from '@/components/feature/Sidebar';

interface MobileTopBarProps {
    title: string;
    /** アイコン付きの色付きバッジを表示（brand・onBack がない場合） */
    icon?: string;
    /** レーダーロゴ＋SensorHub ブランド表示 */
    brand?: boolean;
    /** 戻るボタンを表示 */
    onBack?: () => void;
    activeNav: string;
    unreadCount: number;
    /** 右側のアクション（例: 追加ボタン） */
    action?: ReactNode;
}

const currentUser = { name: '山田 太郎', email: 'taro@example.com' };

export default function MobileTopBar({ title, icon, brand, onBack, activeNav, unreadCount, action }: MobileTopBarProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const go = (to: string) => {
        setOpen(false);
        router.push(to);
    };

    return (
        <>
            <header className="lg:hidden sticky top-0 z-30 flex items-center gap-2 bg-background-50/95 backdrop-blur border-b border-background-200 px-3 h-14">
                {onBack ? (
                    <button type="button" onClick={onBack} aria-label="戻る" className="flex items-center justify-center w-8 h-8 rounded-lg text-foreground-600 hover:bg-background-100 cursor-pointer">
                        <i className="ri-arrow-left-line text-lg" />
                    </button>
                ) : (
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${brand ? 'bg-primary-500 text-white' : 'bg-background-100 text-primary-600'}`}>
                        <i className={`${brand ? 'ri-radar-line' : icon} text-lg`} />
                    </span>
                )}

                <span className="font-heading font-extrabold text-[15px] text-foreground-950 truncate min-w-0">{brand ? 'SensorHub' : title}</span>

                {action && <div className="ml-auto flex items-center gap-1.5 shrink-0">{action}</div>}

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="メニューを開く"
                    className={`flex items-center justify-center w-8 h-8 rounded-lg text-foreground-600 hover:bg-background-100 cursor-pointer shrink-0 ${action ? '' : 'ml-auto'}`}
                >
                    <i className="ri-menu-line text-lg" />
                </button>
            </header>

            {/* ドロワー */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-foreground-950/40 backdrop-blur-[2px] animate-fade-in" onClick={() => setOpen(false)} />
                    <div className="absolute inset-y-0 left-0 w-[284px] max-w-[85vw] bg-background-50 border-r border-background-200 flex flex-col shadow-soft animate-slide-in">
                        {/* header */}
                        <div className="flex items-center gap-2.5 px-5 h-14 border-b border-background-200">
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-500 text-white shrink-0">
                                <i className="ri-radar-line text-xl" />
                            </span>
                            <div className="leading-tight min-w-0">
                                <p className="font-heading font-extrabold text-[15px] text-foreground-950">SensorHub</p>
                                <p className="text-[11px] text-foreground-500 font-label">センサー管理アプリ</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="閉じる"
                                className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-foreground-500 hover:bg-background-100 cursor-pointer shrink-0"
                            >
                                <i className="ri-close-line text-lg" />
                            </button>
                        </div>

                        {/* nav */}
                        <nav className="flex-1 px-3 py-4 overflow-y-auto">
                            <p className="px-2 mb-2 text-[11px] font-label font-bold text-foreground-400 tracking-wide">メニュー</p>
                            <ul className="space-y-1">
                                {navItems.map((item) => {
                                    const isActive = activeNav === item.key;
                                    return (
                                        <li key={item.key}>
                                            <button
                                                type="button"
                                                onClick={() => go(item.to)}
                                                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-left transition-colors duration-150 cursor-pointer ${
                                                    isActive ? 'bg-primary-500 text-white' : 'text-foreground-600 hover:bg-background-200 hover:text-foreground-900'
                                                }`}
                                            >
                                                <span className="flex items-center justify-center w-5 h-5 shrink-0">
                                                    <i className={`${item.icon} text-lg`} />
                                                </span>
                                                <span className="flex-1">{item.label}</span>
                                                {item.key === 'notifications' && unreadCount > 0 && (
                                                    <span
                                                        className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-extrabold ${
                                                            isActive ? 'bg-white text-primary-700' : 'bg-accent-500 text-white'
                                                        }`}
                                                    >
                                                        {unreadCount > 99 ? '99+' : unreadCount}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="my-4 border-t border-background-200" />

                            <p className="px-2 mb-2 text-[11px] font-label font-bold text-foreground-400 tracking-wide">その他</p>
                            <button
                                type="button"
                                onClick={() => go('/about')}
                                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-left text-foreground-600 hover:bg-background-200 hover:text-foreground-900 transition-colors duration-150 cursor-pointer"
                            >
                                <span className="flex items-center justify-center w-5 h-5 shrink-0">
                                    <i className="ri-lightbulb-flash-line text-lg" />
                                </span>
                                用途・アプリ説明
                            </button>
                        </nav>

                        {/* user */}
                        <div className="p-3 border-t border-background-200">
                            <div className="flex items-center gap-3 px-2 py-2">
                                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary-400 text-white font-label font-extrabold text-sm shrink-0">山田</span>
                                <div className="min-w-0 leading-tight">
                                    <p className="text-sm font-bold text-foreground-900 truncate">{currentUser.name}</p>
                                    <p className="text-[11px] text-foreground-500 truncate">{currentUser.email}</p>
                                </div>
                                <button
                                    type="button"
                                    aria-label="設定"
                                    onClick={() => go('/settings')}
                                    className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-foreground-500 hover:bg-background-200 cursor-pointer transition-colors shrink-0"
                                >
                                    <i className="ri-settings-3-line" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
