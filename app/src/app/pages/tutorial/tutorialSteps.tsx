import type { ReactNode } from 'react';
import Tag from '@/components/base/Tag';
import { tags } from '@/app/mocks/sensors';

export interface TutorialStep {
    id: string;
    title: string;
    short: string;
    icon: string;
    description: string;
    points: string[];
    /** 解説用のミニモックアップ */
    illustration: ReactNode;
}

/** サンプルのミニモーダル枠 */
function MiniModal({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="w-full max-w-[360px] rounded-2xl bg-background-50 border border-background-200 p-4 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-background-200">
                <p className="font-heading font-extrabold text-sm text-foreground-950">{title}</p>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-background-100 text-foreground-400">
                    <i className="ri-close-line" />
                </span>
            </div>
            <div className="mt-3 space-y-2.5">{children}</div>
        </div>
    );
}

/** 入力欄のミニ表現 */
function MiniInput({ label }: { label: string }) {
    return (
        <div>
            <p className="text-xs font-bold text-foreground-700 mb-1">{label}</p>
            <div className="h-9 rounded-md border border-background-300 bg-background-100/60 flex items-center px-3 text-xs text-foreground-400">
                <i className="ri-more-2-fill mr-2" />
            </div>
        </div>
    );
}

export const tutorialSteps: TutorialStep[] = [
    {
        id: 'add',
        title: 'センサーを追加する',
        short: '追加',
        icon: 'ri-add-circle-line',
        description: '管理画面の「センサーを追加」ボタンから、新しいセンサーを登録できます。名前とIPアドレスを入力するだけで、すぐに使い始められます。',
        points: ['「センサーを追加」ボタンをクリック', 'センサー名を入力（例: 玄関センサー）', 'IPアドレスを入力', 'タグは任意。後からでも設定できます'],
        illustration: (
            <MiniModal title="センサーを追加">
                <MiniInput label="センサー名" />
                <MiniInput label="IPアドレス" />
                <div>
                    <p className="text-xs font-bold text-foreground-700 mb-1">タグ（任意）</p>
                    <div className="h-9 rounded-md border border-dashed border-background-300 flex items-center px-3 text-xs text-foreground-400">
                        <i className="ri-price-tag-3-line mr-2" /> タグを選択
                    </div>
                </div>
                <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs text-foreground-400 font-label">キャンセル</span>
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary-500 text-white text-xs font-label font-bold">登録する</span>
                </div>
            </MiniModal>
        ),
    },
    {
        id: 'tags',
        title: 'タグを設定する',
        short: 'タグ',
        icon: 'ri-price-tag-3-line',
        description: 'タグはセンサーを分類・検索するためのラベルです。「タグ管理」から色付きのタグを作成でき、センサーに設定して整理できます。',
        points: ['「タグ管理」を開く', 'タグ名と色を設定（ランダムカラーもOK）', 'センサーの追加・編集画面でタグを選択', '一覧をタグで絞り込めるようになる'],
        illustration: (
            <div className="w-full max-w-[360px] space-y-2.5">
                <div className="rounded-2xl bg-background-50 border border-background-200 p-4 shadow-soft">
                    <p className="font-heading font-extrabold text-sm text-foreground-950 mb-3">タグ管理</p>
                    <div className="flex items-center flex-wrap gap-2">
                        {tags.map((t) => (
                            <Tag key={t.id} name={t.name} color={t.color} size="sm" />
                        ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-9 rounded-md border border-dashed border-background-300 flex items-center px-3 text-xs text-foreground-400">
                            <i className="ri-add-line mr-1" /> 新しいタグ
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-500 text-white text-xs font-label font-bold">
                            <i className="ri-shuffle-line" /> ランダムカラー
                        </span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'status',
        title: 'センサーの状態を確認する',
        short: '状態',
        icon: 'ri-radar-line',
        description: '各センサーは色・アイコン・ラベルの組み合わせで状態がひと目で分かります。検知中や未確認、オフライン、無効などを区別できます。',
        points: ['待機中＝緑：正常に動作中', '検知中＝オレンジ：いま何かを検知', '未確認＝アンバー：確認していない通知あり', '無効＝グレー／オフライン＝赤'],
        illustration: (
            <div className="w-full max-w-[360px] rounded-2xl bg-background-50 border border-background-200 p-4 shadow-soft space-y-2">
                <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-500">
                        <i className="ri-radar-line" />
                    </span>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-foreground-800">待機中</p>
                        <p className="text-[11px] text-foreground-500">正常に動作しています</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold font-label bg-emerald-100 text-emerald-700">待機中</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg bg-orange-50/70 border border-orange-200 p-2.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-100 text-orange-500">
                        <i className="ri-radar-fill animate-soft-bounce" />
                    </span>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-foreground-800">検知中</p>
                        <p className="text-[11px] text-foreground-500">いま何かを検知しています</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold font-label bg-orange-500 text-white">検知中</span>
                </div>
            </div>
        ),
    },
    {
        id: 'detect',
        title: '検知を確認する',
        short: '検知',
        icon: 'ri-alarm-warning-line',
        description: 'センサーが何かを検知すると、通知ありセンサーに表示され、センサー単体画面では波紋アニメで検知中であることが直感的に分かります。',
        points: ['検知した時間と内容が表示される', '「既読にする」で確認済みにできる', '未確認はアンバーで強調表示', 'センサー画面では波紋が広がる演出'],
        illustration: (
            <div className="w-full max-w-[360px] rounded-2xl border border-orange-200 bg-orange-50/60 p-4 shadow-soft">
                <div className="flex items-center gap-3">
                    <span className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-500 shrink-0">
                        <span className="absolute inline-flex w-full h-full rounded-xl animate-ripple-expand bg-orange-400/30" />
                        <i className="ri-radar-fill animate-soft-bounce text-xl relative" />
                    </span>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-extrabold text-foreground-900 truncate">リビング通過センサー</p>
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-label bg-orange-500 text-white">検知中</span>
                        </div>
                        <p className="text-xs text-foreground-700 mt-0.5">人が通過しました</p>
                        <p className="text-[11px] text-foreground-500 mt-0.5 flex items-center gap-1">
                            <i className="ri-time-line" /> 2026-08-25 15:04
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'notifications',
        title: '通知一覧の見方',
        short: '通知一覧',
        icon: 'ri-notification-3-line',
        description: '「通知」画面では過去の検知を時系列で一覧できます。タグやセンサー名、確認状態で絞り込んで目的の記録をすぐ見つけられます。',
        points: ['日付ごとに時系列で表示', 'タグ・センサー名で絞り込み', '未確認／確認済みを色分け', 'クリックでセンサー詳細へ'],
        illustration: (
            <div className="w-full max-w-[360px] rounded-2xl bg-background-50 border border-background-200 p-4 shadow-soft">
                <p className="text-xs font-label font-bold text-foreground-400 mb-2">今日</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 p-2.5">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-500 shrink-0">
                            <i className="ri-radar-fill text-sm" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-foreground-900 truncate">リビング通過センサー</p>
                            <p className="text-[11px] text-foreground-500">15:04 人が通過しました</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-label bg-secondary-100 text-secondary-800">未確認</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-lg border border-background-200 bg-background-50 p-2.5">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 shrink-0">
                            <i className="ri-radar-line text-sm" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-foreground-900 truncate">玄関・置き配センサー</p>
                            <p className="text-[11px] text-foreground-500">14:32 荷物を検知しました</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-label bg-emerald-100 text-emerald-700">確認済み</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'slack',
        title: 'Slack / LINE 通知の設定',
        short: '通知設定',
        icon: 'ri-message-3-line',
        description: '「設定」画面で通知先を選べます。Slack（メールアドレス）か LINE（LINE ID）を設定すると、検知時に外部サービスへも通知できます。',
        points: ['通知音のON/OFF（Web版のみ）', '通知先に Slack か LINE を選択', 'Slack＝メールアドレス、LINE＝LINE ID', '通知先ごとに入力欄が切り替わる'],
        illustration: (
            <MiniModal title="通知設定">
                <div className="flex items-center justify-between rounded-lg bg-background-100 border border-background-200 px-3 py-2">
                    <div className="flex items-center gap-2 text-xs text-foreground-700 font-bold">
                        <i className="ri-volume-up-line" /> 通知音（Web版のみ）
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-500 text-white text-[10px] font-bold font-label">ON</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-background-100 border border-background-200 px-3 py-2.5 flex items-center gap-2 text-xs font-bold text-foreground-700">
                        <i className="ri-slack-line text-base text-primary-600" /> Slack
                    </div>
                    <div className="rounded-lg bg-accent-500 px-3 py-2.5 flex items-center gap-2 text-xs font-bold text-white">
                        <i className="ri-line-line text-base" /> LINE
                    </div>
                </div>
                <MiniInput label="LINE ID" />
            </MiniModal>
        ),
    },
    {
        id: 'toggle',
        title: 'センサーを無効化・有効化する',
        short: '無効化',
        icon: 'ri-pause-circle-line',
        description: '一時的に使わないセンサーは無効化できます。無効化したセンサーは別の一覧にまとめられ、いつでもワンクリックで有効化できます。',
        points: ['センサーカードの「無効化」をクリック', '無効化されたセンサーは分離して表示', '右側に検知履歴も確認できる', '「有効化」でいつでも復帰'],
        illustration: (
            <div className="w-full max-w-[360px] rounded-2xl bg-background-50 border border-background-200 p-4 shadow-soft">
                <p className="text-xs font-label font-bold text-foreground-400 mb-2">無効化されたセンサー</p>
                <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-background-300 bg-background-100/50 p-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-400 shrink-0">
                        <i className="ri-pause-circle-line" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground-700 truncate">ベランダセンサー</p>
                        <p className="text-[11px] text-foreground-400">現在無効になっています</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary-500 text-white text-[11px] font-label font-bold">
                        <i className="ri-play-circle-line" /> 有効化
                    </span>
                </div>
            </div>
        ),
    },
];
