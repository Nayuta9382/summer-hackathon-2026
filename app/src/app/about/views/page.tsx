'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Sidebar from '@/components/feature/Sidebar';
import MobileTopBar from '@/components/feature/MobileTopBar';
import Button from '@/components/base/Button';
import { sensors } from '@/app/mocks/sensors';

/* ============================================================
   型定義とデータ
   ============================================================ */

type Accent = 'primary' | 'accent' | 'secondary';

interface AboutItem {
    icon: string;
    title: string;
    description: string;
    accent: Accent;
}

interface StepItem {
    icon: string;
    title: string;
    description: string;
}

const conceptItems: AboutItem[] = [
    {
        icon: 'ri-focus-3-line',
        title: '「どこで何が起きたか」が分かる',
        description: '人感・開閉・振動センサーを場所ごとにタグで整理。検知内容と時刻を一元管理し、どこで何が起きたかをひと目で把握できます。',
        accent: 'primary',
    },
    {
        icon: 'ri-stack-line',
        title: '重要な通知を見逃さない',
        description: '未確認の通知はアンバーで強調し、時系列の通知一覧で確認。タグやセンサー名で絞り込めるので、埋もれがちな記録もすぐ見つけられます。',
        accent: 'accent',
    },
    {
        icon: 'ri-magic-line',
        title: '難しい設定はいらない',
        description: 'センサーの追加は名前とIPアドレスを入力するだけ。タグや通知先も直感的に設定でき、チュートリアルで迷わず使い始められます。',
        accent: 'secondary',
    },
];

const featureItems: AboutItem[] = [
    {
        icon: 'ri-radar-line',
        title: 'リアルタイム検知',
        description: 'センサーの状態を色・アイコン・ラベルで即時に表示。検知中は波紋アニメで直感的に知らせます。',
        accent: 'primary',
    },
    {
        icon: 'ri-notification-3-line',
        title: '通知一覧と絞り込み',
        description: '過去の検知を日付ごとに時系列表示。タグ・センサー名・確認状態で絞り込めます。',
        accent: 'accent',
    },
    {
        icon: 'ri-price-tag-3-line',
        title: 'タグによる整理',
        description: '場所や用途で色付きタグを作成し、センサーを分類・検索。一覧をスッキリ整理します。',
        accent: 'secondary',
    },
    {
        icon: 'ri-message-3-line',
        title: 'Slack / LINE 通知',
        description: '通知先を Slack や LINE に設定でき、検知を外部サービスでも受け取れます。通知音も選べます。',
        accent: 'primary',
    },
    {
        icon: 'ri-pause-circle-line',
        title: '無効化・有効化',
        description: '一時的に使わないセンサーはワンクリックで無効化。別の一覧にまとまり、いつでも復帰できます。',
        accent: 'accent',
    },
    {
        icon: 'ri-slideshow-4-line',
        title: '直感的なダッシュボード',
        description: 'サマリーや通知あり・全センサーの一覧をひとつの画面で確認。日々の見守りが楽になります。',
        accent: 'secondary',
    },
];

const scenarioItems: AboutItem[] = [
    {
        icon: 'ri-shopping-bag-3-line',
        title: '置き配・宅配便の見守り',
        description: '玄関に置いた荷物を検知して、届いたことをいち早くお知らせ。再配達を減らしたい方に。',
        accent: 'primary',
    },
    {
        icon: 'ri-door-lock-line',
        title: '玄関・防犯',
        description: 'ドアの開閉や人感を検知し、不審な動きを記録。在宅中・外出中を問わず安心を見守ります。',
        accent: 'accent',
    },
    {
        icon: 'ri-archive-drawer-line',
        title: '店舗・倉庫の監視',
        description: '在庫エリアへの人の通過や物体の移動を検知。営業外の動きも見逃さず、管理を効率化します。',
        accent: 'secondary',
    },
    {
        icon: 'ri-home-smile-line',
        title: '自宅のおうち安全',
        description: '廊下や階段、ベランダの動きを検知して家族の安心をサポート。離れて暮らす家の見守りにも。',
        accent: 'primary',
    },
    {
        icon: 'ri-building-2-line',
        title: 'オフィスの入退室',
        description: '会議室や書斎の出入りを記録。共有スペースの利用状況をデータで把握できます。',
        accent: 'accent',
    },
    {
        icon: 'ri-service-line',
        title: '見守り・介護のサポート',
        description: '生活の動きを記録して、異変の早期発見につなげる。離れて暮らすご家族の見守りにも。',
        accent: 'secondary',
    },
];

const audienceItems: AboutItem[] = [
    {
        icon: 'ri-shopping-cart-2-line',
        title: '通販をよく利用する方',
        description: '置き配の見逃しや再配達のストレスを解消し、荷物の到着を見逃しません。',
        accent: 'primary',
    },
    {
        icon: 'ri-home-5-line',
        title: '一人暮らしで安心したい方',
        description: '玄関や部屋の動きを見守り、気になる出来事を逃さず確認できます。',
        accent: 'accent',
    },
    {
        icon: 'ri-store-3-line',
        title: '店舗・倉庫を運営する方',
        description: '営業時間外の動きや在庫エリアの変化を記録し、管理を効率化します。',
        accent: 'secondary',
    },
    {
        icon: 'ri-heart-3-line',
        title: 'ご家族の見守りを考えている方',
        description: '離れて暮らす家の生活リズムを、データとしてやさしく見守れます。',
        accent: 'primary',
    },
];

const stepsData: StepItem[] = [
    {
        icon: 'ri-add-circle-line',
        title: 'センサーを追加',
        description: '名前とIPアドレスを入力して登録するだけ。',
    },
    {
        icon: 'ri-price-tag-3-line',
        title: 'タグで整理',
        description: '場所や用途のタグを付けて一覧をわかりやすく。',
    },
    {
        icon: 'ri-message-3-line',
        title: '通知を設定',
        description: '通知音や Slack / LINE の通知先を選びます。',
    },
    {
        icon: 'ri-rocket-line',
        title: 'さあ活用',
        description: '検知の記録を確認し、見守りを始めましょう。',
    },
];

/* ============================================================
   スタイル系ヘルパー
   ============================================================ */

const accentMap: Record<Accent, { bubble: string; badge: string }> = {
    primary: { bubble: 'bg-primary-100 text-primary-700', badge: 'bg-primary-500 text-white' },
    accent: { bubble: 'bg-accent-100 text-accent-700', badge: 'bg-accent-500 text-white' },
    secondary: { bubble: 'bg-secondary-100 text-secondary-800', badge: 'bg-secondary-500 text-white' },
};

function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ============================================================
   場面(シーン)の定義 — この配列が「紹介動画の台本」
   ============================================================ */

type SceneKind = 'hero' | 'cards' | 'steps' | 'cta';

interface Scene {
    kind: SceneKind;
    kicker: string;
    title: string;
    description: string;
    duration: number; // ms
    items?: AboutItem[];
    steps?: StepItem[];
    columns?: string;
    icon?: string;
}

const scenes: Scene[] = [
    {
        kind: 'hero',
        kicker: 'センサー管理アプリ SensorHub',
        title: '見守りたい場所を、SensorHubで。',
        description: '人感・開閉・振動センサーを一元管理し、検知をリアルタイムで通知。家・店舗・倉庫の「気になる」を見える化して、大切な場所をやさしく見守ります。',
        duration: 4500,
        icon: 'ri-radar-fill',
    },
    {
        kind: 'cards',
        kicker: 'コンセプト',
        title: 'なぜ SensorHub なのか',
        description: '見守りの「気になる」を、整理・確認・通知の3つの柱で解決します。',
        duration: 6000,
        items: conceptItems,
        columns: 'sm:grid-cols-2 lg:grid-cols-3',
    },
    {
        kind: 'cards',
        kicker: '主な機能',
        title: '使いやすい機能を、この1つに',
        description: 'ダッシュボード・通知・設定・チュートリアルまで、ひととおりそろっています。',
        duration: 7000,
        items: featureItems,
        columns: 'sm:grid-cols-2 lg:grid-cols-3',
    },
    {
        kind: 'cards',
        kicker: '活用シーン',
        title: 'こんな場所・シーンで活躍',
        description: 'タグを組み合わせれば、さらに細かい用途にも柔軟に対応できます。',
        duration: 7000,
        items: scenarioItems,
        columns: 'sm:grid-cols-2 lg:grid-cols-3',
    },
    {
        kind: 'cards',
        kicker: 'こんな方におすすめ',
        title: '毎日の安心に、そっと寄り添います',
        description: '面倒な設定は不要。誰でもすぐに、大切な場所の見守りを始められます。',
        duration: 6000,
        items: audienceItems,
        columns: 'sm:grid-cols-2 lg:grid-cols-4',
    },
    {
        kind: 'steps',
        kicker: 'はじめかた',
        title: '4ステップで始められます',
        description: 'シンプルな操作で、初めての方でも迷わずセットアップできます。',
        duration: 6000,
        steps: stepsData,
    },
    {
        kind: 'cta',
        kicker: 'さあ、はじめましょう',
        title: '大切な場所の見守りを、今日から',
        description: 'まずはダッシュボードでセンサーの状態を確認してみましょう。チュートリアルで手順も丁寧に解説しています。',
        duration: 6000,
    },
];

/* ============================================================
   自動再生プレイヤー本体
   ============================================================ */

function StoryStage({ scenes }: { scenes: Scene[] }) {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(!prefersReducedMotion());
    const [progress, setProgress] = useState(0);
    const [entered, setEntered] = useState(false);
    const [prevIndex, setPrevIndex] = useState(index);

    const rafRef = useRef<number | null>(null);
    const startRef = useRef<number>(0);
    const pausedElapsedRef = useRef<number>(0);

    const scene = scenes[index];

    // index が変わった瞬間をレンダー中に検知して entered をリセット
    // (useState同士の比較。refをレンダー中に読むのはNGなのでstateで管理する)
    if (index !== prevIndex) {
        setPrevIndex(index);
        setEntered(false);
    }

    // entered が false のときだけ、少し遅れて true にする(フェードイン用)
    useEffect(() => {
        if (entered) return;
        const t = setTimeout(() => setEntered(true), 30);
        return () => clearTimeout(t);
    }, [entered]);

    // 自動進行タイマー(requestAnimationFrameで進捗バーも更新)
    useEffect(() => {
        if (!playing) return;

        pausedElapsedRef.current = 0;
        startRef.current = performance.now();

        const tick = (now: number) => {
            const elapsed = now - startRef.current + pausedElapsedRef.current;
            const pct = Math.min(100, (elapsed / scene.duration) * 100);
            setProgress(pct);

            if (pct >= 100) {
                setIndex((prev) => (prev + 1) % scenes.length);
                return;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, playing, scene.duration]);

    const goTo = (i: number) => setIndex(((i % scenes.length) + scenes.length) % scenes.length);
    const goPrev = () => goTo(index - 1);
    const goNext = () => goTo(index + 1);
    const togglePlay = () => setPlaying((p) => !p);

    return (
        <div className="relative overflow-hidden rounded-3xl border border-background-200 bg-background-100/70">
            <span className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-primary-100/60 blur-2xl" />
            <span className="pointer-events-none absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-accent-100/50 blur-2xl" />

            {/* 進捗バー(ストーリーズ風セグメント) */}
            <div className="relative flex gap-1.5 px-5 md:px-8 pt-5">
                {scenes.map((_, i) => (
                    <button key={i} type="button" onClick={() => goTo(i)} aria-label={`場面${i + 1}へ`} className="h-1.5 flex-1 rounded-full bg-background-200 overflow-hidden">
                        <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{
                                width: i < index ? '100%' : i === index ? `${progress}%` : '0%',
                                transition: i === index ? 'none' : 'width 200ms ease-out',
                            }}
                        />
                    </button>
                ))}
            </div>

            {/* 再生コントロール */}
            <div className="relative flex items-center justify-between px-5 md:px-8 pt-3">
                <span className="text-[11px] font-label font-bold text-foreground-500">
                    {String(index + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}
                </span>
                <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? '一時停止' : '再生'}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-background-50 border border-background-200 text-foreground-600 hover:text-primary-600 hover:border-primary-300 transition-colors"
                >
                    <i className={playing ? 'ri-pause-fill' : 'ri-play-fill'} />
                </button>
            </div>

            {/* シーン本体 */}
            <div
                className="relative px-6 md:px-10 py-8 md:py-12 min-h-[420px] md:min-h-[440px] flex flex-col justify-center"
                onMouseEnter={() => setPlaying(false)}
                onMouseLeave={() => setPlaying(!prefersReducedMotion())}
            >
                {/* 左右送りボタン */}
                <button
                    type="button"
                    onClick={goPrev}
                    aria-label="前の場面"
                    className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center w-9 h-9 rounded-full bg-background-50 border border-background-200 text-foreground-600 hover:text-primary-600 hover:border-primary-300 transition-colors z-10"
                >
                    <i className="ri-arrow-left-s-line text-lg" />
                </button>
                <button
                    type="button"
                    onClick={goNext}
                    aria-label="次の場面"
                    className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center w-9 h-9 rounded-full bg-background-50 border border-background-200 text-foreground-600 hover:text-primary-600 hover:border-primary-300 transition-colors z-10"
                >
                    <i className="ri-arrow-right-s-line text-lg" />
                </button>

                <div className={['transition-all duration-500 ease-out', entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'].join(' ')}>
                    <div className="mx-auto max-w-2xl text-center mb-6 md:mb-8">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-label font-bold">{scene.kicker}</span>
                        <h2 className="mt-3 font-heading font-black text-2xl md:text-[34px] leading-tight text-foreground-950">{scene.title}</h2>
                        <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-foreground-600">{scene.description}</p>
                    </div>

                    {/* hero: ラジオ波アイコン */}
                    {scene.kind === 'hero' && (
                        <div className="flex items-center justify-center">
                            <div className="relative flex items-center justify-center w-24 h-24 rounded-full border border-primary-200 bg-background-50">
                                <span className="absolute inline-flex w-full h-full rounded-full animate-ripple-expand bg-primary-400/30" />
                                <span className="absolute inline-flex w-full h-full rounded-full animate-ripple-expand bg-accent-400/30 [animation-delay:0.6s]" />
                                <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white">
                                    <i className={`${scene.icon ?? 'ri-radar-fill'} text-2xl animate-soft-bounce`} />
                                </span>
                            </div>
                        </div>
                    )}

                    {/* cards: カードが順にせり上がる */}
                    {scene.kind === 'cards' && scene.items && (
                        <div className={`grid grid-cols-1 ${scene.columns ?? 'sm:grid-cols-2 lg:grid-cols-3'} gap-4`}>
                            {scene.items.map((item, i) => {
                                const a = accentMap[item.accent];
                                return (
                                    <div
                                        key={item.title}
                                        style={{ transitionDelay: entered ? `${i * 90}ms` : '0ms' }}
                                        className={[
                                            'flex flex-col gap-2.5 rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5 transition-all duration-500 ease-out',
                                            entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                                        ].join(' ')}
                                    >
                                        <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${a.bubble} shrink-0`}>
                                            <i className={`${item.icon} text-lg`} />
                                        </span>
                                        <div>
                                            <h3 className="font-heading font-extrabold text-[14px] text-foreground-950">{item.title}</h3>
                                            <p className="mt-1 text-[12.5px] leading-relaxed text-foreground-600">{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* steps: 番号付きで順に流れる */}
                    {scene.kind === 'steps' && scene.steps && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {scene.steps.map((s, i) => (
                                <div
                                    key={s.title}
                                    style={{ transitionDelay: entered ? `${i * 120}ms` : '0ms' }}
                                    className={[
                                        'relative flex flex-col items-center text-center rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5 transition-all duration-500 ease-out',
                                        entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                                    ].join(' ')}
                                >
                                    <span className="absolute top-3 right-3 font-label font-extrabold text-xl text-background-200">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 shrink-0">
                                        <i className={`${s.icon} text-xl`} />
                                    </span>
                                    <h3 className="mt-2.5 font-heading font-extrabold text-[14px] text-foreground-950">{s.title}</h3>
                                    <p className="mt-1 text-[12.5px] leading-relaxed text-foreground-600">{s.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* cta: 締めの場面 */}
                    {scene.kind === 'cta' && (
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col sm:flex-row items-center gap-2.5">
                                <Button size="lg" onClick={() => router.push('/sensors')}>
                                    <i className="ri-dashboard-3-line" />
                                    ダッシュボードへ
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => router.push('/tutorial')}>
                                    <i className="ri-graduation-cap-line" />
                                    チュートリアルへ
                                </Button>
                            </div>
                            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                                {[
                                    { icon: 'ri-radar-line', label: '3種センサー' },
                                    { icon: 'ri-message-3-line', label: '2チャネル通知' },
                                    { icon: 'ri-price-tag-3-line', label: 'タグ整理' },
                                    { icon: 'ri-time-line', label: '時系列記録' },
                                ].map((s) => (
                                    <div key={s.label} className="flex items-center gap-2 text-sm font-label font-bold text-foreground-700">
                                        <i className={`${s.icon} text-primary-600 text-lg`} />
                                        {s.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   ページ本体
   ============================================================ */

export default function About() {
    const unreadCount = sensors.filter((s) => s.status === 'detecting' || s.status === 'unconfirmed').length;

    return (
        <div className="min-h-[100dvh] flex bg-background-50">
            <Sidebar unreadCount={unreadCount} activeNav="about" />

            <div className="flex-1 min-w-0 flex flex-col">
                <MobileTopBar title="用途・アプリ説明" icon="ri-lightbulb-flash-line" activeNav="about" unreadCount={unreadCount} />

                <main className="flex-1 w-full max-w-[1080px] mx-auto px-4 md:px-6 py-6 md:py-10">
                    <StoryStage scenes={scenes} />

                    <footer className="pt-8 pb-6 text-center text-xs text-foreground-500">© 2026 SensorHub. 大切な場所を見守ります。</footer>
                </main>
            </div>
        </div>
    );
}
