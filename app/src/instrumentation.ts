// Next.jsがサーバー起動時に自動で1回だけ呼び出す特別な関数
export async function register() {
    // Node.js環境の時だけ実行
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { startBatchJob } = await import('./backend/jobs/batchJobs');
        // バッチ処理のタイマーを起動
        startBatchJob();
    }
}
