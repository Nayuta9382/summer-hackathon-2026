'use client';

import { useState } from 'react';
import Sidebar from '@/components/feature/Sidebar';
import MobileTopBar from '@/components/feature/MobileTopBar';
import Button from '@/components/base/Button';
import { sensors } from '@/app/mocks/sensors';
import { tutorialSteps } from './tutorialSteps';

function TutorialInner() {
    const [current, setCurrent] = useState(0);
    const unreadCount = sensors.filter((s) => s.status === 'detecting' || s.status === 'unconfirmed').length;

    const total = tutorialSteps.length;
    const step = tutorialSteps[current];
    const progress = ((current + 1) / total) * 100;
    const isLast = current === total - 1;

    const goNext = () => {
        if (isLast) {
            setCurrent(0);
        } else {
            setCurrent((c) => c + 1);
        }
    };

    return (
        <div className="min-h-[100dvh] flex bg-background-50">
            <Sidebar unreadCount={unreadCount} activeNav="tutorial" />

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile top bar */}
                <MobileTopBar title="チュートリアル" icon="ri-graduation-cap-line" activeNav="tutorial" unreadCount={unreadCount} />

                <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-5 md:space-y-6">
                    {/* Header + progress */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                        <div>
                            <h1 className="font-heading font-black text-2xl md:text-[28px] text-foreground-950">チュートリアル</h1>
                            <p className="mt-1 text-sm text-foreground-600">ステップに沿って SensorHub の使い方を学べます</p>
                        </div>
                        <div className="sm:ml-auto text-right">
                            <p className="text-sm font-label font-bold text-foreground-600">
                                {current + 1} / {total}
                            </p>
                            <div className="mt-1.5 w-40 h-2 rounded-full bg-background-200 overflow-hidden">
                                <div className="h-full rounded-full bg-primary-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 md:gap-6">
                        {/* Step list */}
                        <aside className="rounded-2xl border border-background-200 bg-background-50 p-3 h-fit lg:sticky lg:top-6">
                            <ol className="space-y-1">
                                {tutorialSteps.map((s, i) => {
                                    const active = i === current;
                                    const done = i < current;
                                    return (
                                        <li key={s.id}>
                                            <button
                                                type="button"
                                                onClick={() => setCurrent(i)}
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 cursor-pointer ${
                                                    active ? 'bg-primary-500 text-white' : 'text-foreground-600 hover:bg-background-100'
                                                }`}
                                            >
                                                <span
                                                    className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 font-label font-extrabold text-xs ${
                                                        active ? 'bg-white text-primary-700' : done ? 'bg-emerald-100 text-emerald-600' : 'bg-background-100 text-foreground-400'
                                                    }`}
                                                >
                                                    {done ? <i className="ri-check-line" /> : <i className={`${s.icon} text-sm`} />}
                                                </span>
                                                <span className="text-sm font-bold leading-tight">{s.title}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>
                        </aside>

                        {/* Step content */}
                        <section key={step.id} className="rounded-2xl border border-background-200 bg-background-50 overflow-hidden animate-fade-in">
                            <div className="flex items-center gap-3 px-5 md:px-6 pt-5">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-700">
                                    <i className={`${step.icon} text-xl`} />
                                </span>
                                <div>
                                    <p className="text-xs font-label font-bold text-foreground-400">ステップ {current + 1}</p>
                                    <h2 className="font-heading font-black text-lg md:text-xl text-foreground-950">{step.title}</h2>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-6 p-5 md:p-6">
                                {/* Illustration */}
                                <div className="lg:w-[46%] flex items-start justify-center bg-background-100/70 border border-background-200 rounded-2xl p-5 md:p-6">{step.illustration}</div>

                                {/* Explanation */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm md:text-[15px] leading-relaxed text-foreground-700">{step.description}</p>

                                    <ul className="mt-4 space-y-2.5">
                                        {step.points.map((p, i) => (
                                            <li key={i} className="flex items-start gap-3 rounded-xl bg-background-100/80 border border-background-200 px-3.5 py-3">
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-label font-extrabold text-xs shrink-0">
                                                    {i + 1}
                                                </span>
                                                <span className="text-sm text-foreground-800 font-medium">{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Footer nav */}
                            <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-4 border-t border-background-200 bg-background-100/50">
                                <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
                                    <i className="ri-arrow-left-line" />
                                    前へ
                                </Button>
                                <div className="flex items-center gap-1.5">
                                    {tutorialSteps.map((s, i) => (
                                        <span
                                            key={s.id}
                                            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-primary-500' : i < current ? 'bg-emerald-400' : 'bg-background-200'}`}
                                        />
                                    ))}
                                </div>
                                {isLast ? (
                                    <Button variant="accent" onClick={goNext}>
                                        <i className="ri-check-double-line" />
                                        チュートリアル完了
                                    </Button>
                                ) : (
                                    <Button onClick={goNext}>
                                        次へ
                                        <i className="ri-arrow-right-line" />
                                    </Button>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function Tutorial() {
    return <TutorialInner />;
}
