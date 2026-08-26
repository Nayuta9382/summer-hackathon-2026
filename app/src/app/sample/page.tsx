'use client';

import { useEffect, useState } from 'react';
import type { SearchSampleRequest } from '@/types/sample/searchSampleRequest';
import type { SearchSampleResponse } from '@/types/sample/searchSampleResponse';

// データ取得処理そのものはsetStateを含まない純粋な関数として切り出す
async function fetchSamples(keyword: string): Promise<SearchSampleResponse> {
    const request: SearchSampleRequest = { keyword: keyword || undefined };
    const query = new URLSearchParams(Object.entries(request).filter(([, v]) => v !== undefined) as [string, string][]);

    const res = await fetch(`/api/sample?${query.toString()}`);
    return res.json();
}

export default function SamplePage() {
    const [result, setResult] = useState<SearchSampleResponse | null>(null);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);

    // キーワード入力の変更ハンドラー
    const handleChangeKeyword = (value: string) => {
        setKeyword(value);
    };

    // 検索ボタン押下時のハンドラー
    const handleSearchButton = async () => {
        setLoading(true);
        const data = await fetchSamples(keyword);
        setResult(data);
        setLoading(false);
    };

    // マウント時の初回取得
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            setLoading(true);
            const data = await fetchSamples('');
            if (!cancelled) {
                setResult(data);
                setLoading(false);
            }
        };

        init();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div>
            <h1>Sample一覧</h1>

            <input value={keyword} onChange={(e) => handleChangeKeyword(e.target.value)} placeholder="キーワード検索" />
            <button onClick={handleSearchButton} disabled={loading}>
                検索
            </button>

            {result && (
                <>
                    <p>件数: {result.count}</p>
                    <ul>
                        {result.items.map((item) => (
                            <li key={item.id}>
                                {item.name}({item.category})
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
