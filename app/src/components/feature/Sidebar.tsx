import Link from 'next/link';

interface SidebarProps {
    unreadCount: number;
    activeNav: string;
}

const navItems = [
    { key: 'dashboard', label: 'センサー管理', icon: 'ri-dashboard-3-line', to: '/sensors' },
    { key: 'notifications', label: '通知', icon: 'ri-notification-3-line', to: '/notifications' },
    { key: 'settings', label: '設定', icon: 'ri-settings-3-line', to: '/settings' },
    { key: 'tutorial', label: 'チュートリアル', icon: 'ri-graduation-cap-line', to: '/tutorial' },
];

export { navItems };

export default function Sidebar({ unreadCount, activeNav }: SidebarProps) {
    const currentUser = { name: '山田 太郎', email: 'taro@example.com' };

    return (
        <aside className="hidden lg:flex flex-col w-[248px] shrink-0 bg-background-100/80 border-r border-background-200 h-[100dvh] sticky top-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 h-16 border-b border-background-200">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-500 text-white">
                    <i className="ri-radar-line text-xl" />
                </span>
                <div className="leading-tight">
                    <p className="font-heading font-extrabold text-[15px] text-foreground-950">SensorHub</p>
                    <p className="text-[11px] text-foreground-500 font-label">センサー管理アプリ</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <p className="px-2 mb-2 text-[11px] font-label font-bold text-foreground-400 tracking-wide">メニュー</p>
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = activeNav === item.key;
                        return (
                            <li key={item.key}>
                                <Link
                                    href={item.to}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors duration-150 cursor-pointer ${
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
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="my-4 border-t border-background-200" />

                <p className="px-2 mb-2 text-[11px] font-label font-bold text-foreground-400 tracking-wide">その他</p>
                <Link
                    href="/about"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-foreground-600 hover:bg-background-200 hover:text-foreground-900 transition-colors duration-150 cursor-pointer"
                >
                    <span className="flex items-center justify-center w-5 h-5 shrink-0">
                        <i className="ri-lightbulb-flash-line text-lg" />
                    </span>
                    用途・アプリ説明
                </Link>
            </nav>

            {/* User */}
            <div className="p-3 border-t border-background-200">
                <div className="flex items-center gap-3 px-2 py-2">
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary-400 text-white font-label font-extrabold text-sm shrink-0">山田</span>
                    <div className="min-w-0 leading-tight">
                        <p className="text-sm font-bold text-foreground-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-foreground-500 truncate">{currentUser.email}</p>
                    </div>
                    <Link
                        href="/settings"
                        aria-label="設定"
                        className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-foreground-500 hover:bg-background-200 cursor-pointer transition-colors"
                    >
                        <i className="ri-settings-3-line" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}
