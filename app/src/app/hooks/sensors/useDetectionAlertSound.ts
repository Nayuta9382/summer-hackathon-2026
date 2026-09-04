// hooks/useDetectionAlertSound.ts
import { useEffect, useRef } from 'react';
import type { SensorStatus } from '@/backend/types/sensorStatus';

// センサーが「検知中」状態に遷移した瞬間に Web Audio API で通知音を鳴らすフック
export function useDetectionAlertSound(status: SensorStatus, isDisabled: boolean, enabled = true) {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const prevStatusRef = useRef<SensorStatus | null>(null);

    const getAudioContext = (): AudioContext | null => {
        if (typeof window === 'undefined') return null;

        const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return null;

        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContextClass();
        }
        return audioCtxRef.current;
    };

    // ブラウザの自動再生制限を避けるため、ページ内の最初のクリック/キー操作で AudioContext を起動しておく
    useEffect(() => {
        if (!enabled) return;

        const unlock = () => {
            const ctx = getAudioContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
        };

        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
        return () => {
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };
    }, [enabled]);

    useEffect(() => {
        return () => {
            audioCtxRef.current?.close();
        };
    }, []);

    useEffect(() => {
        if (!enabled || isDisabled) {
            prevStatusRef.current = status;
            return;
        }

        const prevStatus = prevStatusRef.current;
        prevStatusRef.current = status;

        // NONE/UNCONFIRMED -> DETECTING の遷移時のみ鳴らす(ポーリングのたびに鳴らないようにする)
        if (prevStatus === status || status !== 'DETECTING') return;

        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const playTone = (frequency: number, startTime: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = frequency;

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        playTone(880, now, 0.18); // A5
        playTone(1318.5, now + 0.15, 0.22); // E6
    }, [status, isDisabled, enabled]);
}
