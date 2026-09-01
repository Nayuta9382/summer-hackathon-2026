'use client';

import { useRouter } from 'next/navigation';
import Sidebar from '@/components/feature/Sidebar';
import MobileTopBar from '@/components/feature/MobileTopBar';
import Button from '@/components/base/Button';
import { sensors } from '@/app/mocks/sensors';
import { conceptItems, featureItems, scenarioItems, audienceItems, stepsData, type AboutItem } from './aboutData';

const accentMap: Record<AboutItem['accent'], { bubble: string; badge: string }> = {
    primary: {
        bubble: 'bg-primary-100 text-primary-700',
        badge: 'bg-primary-500 text-white',
    },
    accent: {
        bubble: 'bg-accent-100 text-accent-700',
        badge: 'bg-accent-500 text-white',
    },
    secondary: {
        bubble: 'bg-secondary-100 text-secondary-800',
        badge: 'bg-secondary-500 text-white',
    },
};

function SectionHeading({ kicker, title, description }: { kicker: string; title: string; description: string }) {
    return (
        <div className="mx-auto max-w-2xl text-center mb-8 md:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-label font-bold">{kicker}</span>
            <h2 className="mt-3 font-heading font-black text-2xl md:text-[30px] text-foreground-950">{title}</h2>
            <p className="mt-2.5 text-sm md:text-[15px] leading-relaxed text-foreground-600">{description}</p>
        </div>
    );
}

function FeatureCard({ item }: { item: AboutItem }) {
    const a = accentMap[item.accent];
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-background-200 bg-background-50 p-5 md:p-6 hover:border-background-300 transition-colors duration-150">
            <span className={`flex items-center justify-center w-11 h-11 rounded-xl ${a.bubble} shrink-0`}>
                <i className={`${item.icon} text-xl`} />
            </span>
            <div>
                <h3 className="font-heading font-extrabold text-[15px] text-foreground-950">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-foreground-600">{item.description}</p>
            </div>
        </div>
    );
}

function ScenarioCard({ item }: { item: AboutItem }) {
    const a = accentMap[item.accent];
    return (
        <div className="flex gap-4 rounded-2xl border border-background-200 bg-background-50 p-5 md:p-6">
            <span className={`flex items-center justify-center w-12 h-12 rounded-xl ${a.bubble} shrink-0`}>
                <i className={`${item.icon} text-2xl`} />
            </span>
            <div className="min-w-0">
                <h3 className="font-heading font-extrabold text-[15px] text-foreground-950">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-foreground-600">{item.description}</p>
            </div>
        </div>
    );
}

export default function About() {
    const unreadCount = sensors.filter((s) => s.status === 'detecting' || s.status === 'unconfirmed').length;
    const router = useRouter();

    return (
        <div className="min-h-[100dvh] flex bg-background-50">
            <Sidebar unreadCount={unreadCount} activeNav="about" />

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile top bar */}
                <MobileTopBar title="用途・アプリ説明" icon="ri-lightbulb-flash-line" activeNav="about" unreadCount={unreadCount} />

                <main className="flex-1 w-full max-w-[1080px] mx-auto px-4 md:px-6 py-6 md:py-10 space-y-10 md:space-y-16">
                    {/* Hero */}
                    <section className="relative overflow-hidden rounded-3xl border border-background-200 bg-background-100/70 px-6 md:px-10 py-10 md:py-14">
                        <span className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-primary-100/60 blur-2xl" />
                        <span className="pointer-events-none absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-accent-100/50 blur-2xl" />

                        <div className="relative flex flex-col items-center text-center">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-background-50 border border-background-200 text-xs font-label font-bold text-foreground-700">
                                <i className="ri-radar-line text-primary-600" />
                                センサー管理アプリ SensorHub
                            </span>

                            <h1 className="mt-5 font-heading font-black text-3xl md:text-[42px] leading-tight text-foreground-950">
                                見守りたい場所を、
                                <br className="hidden sm:block" />
                                <span className="text-primary-600">SensorHub</span> で。
                            </h1>

                            <p className="mt-4 max-w-xl text-sm md:text-[15px] leading-relaxed text-foreground-600">
                                人感・開閉・振動センサーを一元管理し、検知をリアルタイムで通知。 家・店舗・倉庫の「気になる」を見える化して、大切な場所をやさしく見守ります。
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
                                <Button size="lg" onClick={() => router.push('/sensors')}>
                                    <i className="ri-dashboard-3-line" />
                                    ダッシュボードへ
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => router.push('/tutorial')}>
                                    <i className="ri-graduation-cap-line" />
                                    使い方を学ぶ
                                </Button>
                            </div>

                            {/* Radar visual */}
                            <div className="mt-8 flex items-center justify-center">
                                <div className="relative flex items-center justify-center w-24 h-24 rounded-full border border-primary-200 bg-background-50">
                                    <span className="absolute inline-flex w-full h-full rounded-full animate-ripple-expand bg-primary-400/30" />
                                    <span className="absolute inline-flex w-full h-full rounded-full animate-ripple-expand bg-accent-400/30 [animation-delay:0.6s]" />
                                    <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white">
                                        <i className="ri-radar-fill text-2xl animate-soft-bounce" />
                                    </span>
                                </div>
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
                    </section>

                    {/* Concept */}
                    <section>
                        <SectionHeading kicker="コンセプト" title="なぜ SensorHub なのか" description="見守りの「気になる」を、整理・確認・通知の3つの柱で解決します。" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                            {conceptItems.map((item) => (
                                <FeatureCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Features */}
                    <section className="rounded-3xl border border-background-200 bg-background-100/50 px-6 md:px-10 py-10 md:py-14">
                        <SectionHeading kicker="主な機能" title="使いやすい機能を、この1つに" description="ダッシュボード・通知・設定・チュートリアルまで、SensorHub にひととおりそろっています。" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            {featureItems.map((item) => (
                                <FeatureCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Scenarios */}
                    <section>
                        <SectionHeading kicker="活用シーン" title="こんな場所・シーンで活躍" description="タグを組み合わせれば、さらに細かい用途にも柔軟に対応できます。" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            {scenarioItems.map((item) => (
                                <ScenarioCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Audience */}
                    <section className="rounded-3xl border border-background-200 bg-background-100/50 px-6 md:px-10 py-10 md:py-14">
                        <SectionHeading kicker="こんな方におすすめ" title="毎日の安心に、そっと寄り添います" description="面倒な設定は不要。誰でもすぐに、大切な場所の見守りを始められます。" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            {audienceItems.map((item) => (
                                <FeatureCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Getting started */}
                    <section>
                        <SectionHeading kicker="はじめかた" title="4ステップで始められます" description="シンプルな操作で、初めての方でも迷わずセットアップできます。" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                            {stepsData.map((s, i) => (
                                <div key={s.title} className="relative flex flex-col items-center text-center rounded-2xl border border-background-200 bg-background-50 p-5 md:p-6">
                                    <span className="absolute top-4 right-4 font-label font-extrabold text-2xl text-background-200">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 shrink-0">
                                        <i className={`${s.icon} text-2xl`} />
                                    </span>
                                    <h3 className="mt-3 font-heading font-extrabold text-[15px] text-foreground-950">{s.title}</h3>
                                    <p className="mt-1.5 text-[13px] leading-relaxed text-foreground-600">{s.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="relative overflow-hidden rounded-3xl bg-primary-600 px-6 md:px-10 py-12 md:py-16 text-center">
                        <span className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
                        <div className="relative">
                            <h2 className="font-heading font-black text-2xl md:text-[32px] text-white">大切な場所の見守りを、今日から</h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm md:text-[15px] text-white/90">
                                まずはダッシュボードでセンサーの状態を確認してみましょう。チュートリアルで手順も丁寧に解説しています。
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                                <Button size="lg" className="bg-white text-primary-700 hover:bg-white" onClick={() => router.push('/sensors')}>
                                    <i className="ri-dashboard-3-line" />
                                    ダッシュボードを見る
                                </Button>
                                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10" onClick={() => router.push('/tutorial')}>
                                    <i className="ri-graduation-cap-line" />
                                    チュートリアルへ
                                </Button>
                            </div>
                        </div>
                    </section>

                    <footer className="pt-2 pb-6 text-center text-xs text-foreground-500">© 2026 SensorHub. 大切な場所を見守ります。</footer>
                </main>
            </div>
        </div>
    );
}
