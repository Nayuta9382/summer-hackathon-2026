interface Summary {
    total: number;
    active: number;
    detecting: number;
    unconfirmed: number;
}

const cards = [
    { key: 'total', label: '登録センサー', icon: 'ri-radar-line', tone: 'bg-primary-100 text-primary-600' },
    { key: 'active', label: '稼働中', icon: 'ri-checkbox-circle-line', tone: 'bg-emerald-100 text-emerald-600' },
    { key: 'detecting', label: '検知中', icon: 'ri-alarm-warning-line', tone: 'bg-accent-100 text-accent-600' },
    { key: 'unconfirmed', label: '未確認通知', icon: 'ri-notification-badge-line', tone: 'bg-secondary-100 text-secondary-600' },
] as const;

export default function SummaryCards({ summary }: { summary: Summary }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
            {cards.map((c) => (
                <div key={c.key} className="flex items-center gap-3.5 bg-background-50 border border-background-200 rounded-xl p-4 md:p-5">
                    <span className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${c.tone}`}>
                        <i className={`${c.icon} text-[22px]`} />
                    </span>
                    <div className="min-w-0">
                        <p className="font-heading font-extrabold text-2xl md:text-3xl text-foreground-950 leading-none">
                            {summary[c.key]}
                            <span className="ml-1 text-sm font-bold text-foreground-400">台</span>
                        </p>
                        <p className="mt-1 text-xs md:text-sm text-foreground-600 truncate">{c.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
