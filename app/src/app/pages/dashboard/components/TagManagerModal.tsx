'use client';

import { useState } from 'react';
import type { Tag } from '@/app/mocks/sensors';
import Modal from '@/components/base/Modal';
import Button from '@/components/base/Button';
import { Field, Input } from '@/components/base/Form';

interface Props {
    open: boolean;
    onClose: () => void;
    tags: Tag[];
    onAdd: (data: { name: string; color: string }) => void;
    onUpdate: (id: string, data: { name: string; color: string }) => void;
    onDelete: (id: string) => void;
}

const presetColors = ['#10B981', '#F97316', '#F59E0B', '#14B8A6', '#F43F5E', '#84CC16', '#0EA5E9', '#EAB308', '#8B5CF6', '#22C55E', '#EF4444', '#64748B'];

const randomColor = () => presetColors[Math.floor(Math.random() * presetColors.length)];

export default function TagManagerModal({ open, onClose, tags, onAdd, onUpdate, onDelete }: Props) {
    const [draftName, setDraftName] = useState('');
    const [draftColor, setDraftColor] = useState(presetColors[0]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingColor, setEditingColor] = useState(presetColors[0]);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const reset = () => {
        setDraftName('');
        setDraftColor(presetColors[0]);
        setEditingId(null);
        setConfirmDelete(null);
    };

    const addTag = () => {
        if (!draftName.trim()) return;
        onAdd({ name: draftName.trim(), color: draftColor });
        setDraftName('');
    };

    const startEdit = (t: Tag) => {
        setEditingId(t.id);
        setEditingName(t.name);
        setEditingColor(t.color);
    };

    const saveEdit = () => {
        if (!editingId || !editingName.trim()) return;
        onUpdate(editingId, { name: editingName.trim(), color: editingColor });
        setEditingId(null);
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                reset();
                onClose();
            }}
            title="タグ管理"
            subtitle="タグでセンサーを分類・検索できます"
            icon={<i className="ri-price-tag-3-line text-xl" />}
            width="max-w-2xl"
            footer={
                <Button
                    variant="outline"
                    onClick={() => {
                        reset();
                        onClose();
                    }}
                >
                    閉じる
                </Button>
            }
        >
            {/* Add new tag */}
            <div className="bg-background-100 rounded-xl p-4">
                <p className="font-heading font-extrabold text-sm text-foreground-900 mb-3">新しいタグを作成</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Field label="タグ名" htmlFor="tag-name">
                            <Input id="tag-name" value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="例：置き配" onKeyDown={(e) => e.key === 'Enter' && addTag()} />
                        </Field>
                    </div>
                    <div className="flex-1">
                        <Field label="タグカラー">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 flex-wrap flex-1">
                                    {presetColors.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setDraftColor(c)}
                                            aria-label={`色 ${c}`}
                                            className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                                                draftColor === c ? 'scale-110 ring-2 ring-offset-1 ring-foreground-400' : 'hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDraftColor(randomColor())}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-background-50 border border-background-300 text-xs font-label font-bold text-foreground-600 hover:bg-background-200 cursor-pointer whitespace-nowrap"
                                >
                                    <i className="ri-shuffle-line" />
                                    ランダム
                                </button>
                            </div>
                        </Field>
                    </div>
                    <div className="sm:mt-6">
                        <Button onClick={addTag} disabled={!draftName.trim()}>
                            <i className="ri-add-line" />
                            追加
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tag list */}
            <div className="mt-5">
                <p className="font-heading font-extrabold text-sm text-foreground-900 mb-3">
                    登録済みタグ <span className="text-foreground-400 text-xs font-bold">{tags.length}件</span>
                </p>
                {tags.length === 0 ? (
                    <p className="text-sm text-foreground-500 bg-background-100 rounded-xl p-4 text-center">まだタグがありません</p>
                ) : (
                    <ul className="space-y-2">
                        {tags.map((t) => (
                            <li key={t.id} className="flex items-center gap-3 bg-background-100 rounded-xl px-4 py-3">
                                {editingId === t.id ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                                        <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="flex-1" autoFocus />
                                        <div className="flex items-center gap-1.5">
                                            {presetColors.map((c) => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setEditingColor(c)}
                                                    className={`w-5 h-5 rounded-full cursor-pointer ${editingColor === c ? 'ring-2 ring-offset-1 ring-foreground-400' : ''}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setEditingColor(randomColor())}
                                                className="flex items-center justify-center w-5 h-5 rounded-md border border-background-300 bg-background-50 text-foreground-500 cursor-pointer"
                                            >
                                                <i className="ri-shuffle-line text-xs" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Button size="sm" onClick={saveEdit}>
                                                保存
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                戻る
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                                        <span className="font-bold text-sm text-foreground-800 flex-1 truncate">{t.name}</span>
                                        {confirmDelete === t.id ? (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-foreground-600 mr-1">削除しますか？</span>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => {
                                                        onDelete(t.id);
                                                        setConfirmDelete(null);
                                                    }}
                                                >
                                                    削除
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)}>
                                                    取消
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(t)}
                                                    className="flex items-center justify-center w-7 h-7 rounded-md text-foreground-500 hover:bg-background-200 cursor-pointer transition-colors"
                                                    aria-label="編集"
                                                >
                                                    <i className="ri-pencil-line" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDelete(t.id)}
                                                    className="flex items-center justify-center w-7 h-7 rounded-md text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors"
                                                    aria-label="削除"
                                                >
                                                    <i className="ri-delete-bin-line" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Modal>
    );
}
