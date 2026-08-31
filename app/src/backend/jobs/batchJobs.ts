import { SENSOR_BATCH_TIME } from '../config/batchConfig';

// 今バッチ処理が実行中かどうかのフラグ(多重実行防止用)
let isRunning = false;

// setIntervalのIDを保持(停止や二重起動防止に使う)
let intervalId: NodeJS.Timeout | null = null;

// 実際の処理を呼び出す関数
async function doBatchJob() {
    if (isRunning) {
        console.warn('前回のバッチがまだ実行中のためスキップ');
        return;
    }

    // 処理開始フラグ
    isRunning = true;

    try {
        // バッチの呼び出し処理
    } catch (e) {
        console.error('[batch] エラー:', e);
    } finally {
        isRunning = false;
    }
}

// バッチ処理を開始する関数
export function startBatchJob() {
    // すでにタイマーが動いていれば何もしない
    if (intervalId) return;

    // バッチのタイマーをセット
    intervalId = setInterval(doBatchJob, SENSOR_BATCH_TIME);

    console.log(`バッチ処理を${SENSOR_BATCH_TIME / 1000}秒間隔で開始しました`);
}

// バッチ処理を停止する関数(必要な時に呼ぶ)
export function stopBatchJob() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}
