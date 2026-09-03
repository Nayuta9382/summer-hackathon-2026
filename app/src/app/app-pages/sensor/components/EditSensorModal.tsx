'use client';

import { useState } from 'react';
import type { Tag as SensorTag } from '@/app/mocks/sensors';
import Modal from '@/components/base/Modal';
import Button from '@/components/base/Button';
import { Field, Input } from '@/components/base/Form';
import Tag from '@/components/base/Tag';

interface Props {
    open: boolean;
    onClose: () => void;
    initialName: string;
    initialUrl: string;
    initialTagIds: number[];
    tagMap: Record<string, SensorTag>;
    isSaving?: boolean;
    onSave: (data: { name: string; url: string; tagIds: number[] }) => void;
}

export default function EditSensorModal({ open, onClose, initialName, initialUrl, initialTagIds, tagMap, isSaving = false, onSave }: Props) {
    const [name, setName] = useState(initialName);
    const [url, setUrl] = useState(initialUrl);
    const [selected, setSelected] = useState<number[]>(initialTagIds);

    const valid = name.trim().length > 0 && url.trim().length > 0;

    const toggleTag = (id: number) => {
        setSelected((cur) => (cur.includes(id) ? cur.filter((t) => t !== id) : [...cur, id]));
    };

    const submit = () => {
        if (!valid || isSaving) return;
        onSave({ name: name.trim(), url: url.trim(), tagIds: selected });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="センサーを編集"
            subtitle="名前・URL・タグを変更します"
            icon={<i className="ri-settings-3-line text-xl" />}
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button onClick={submit} disabled={!valid || isSaving}>
                        <i className="ri-check-line" />
                        {isSaving ? '保存中...' : '変更を保存'}
                    </Button>
                </>
            }
        >
            <div className="space-y-5">
                <Field label="センサー名" required htmlFor="edit-sensor-name">
                    <Input id="edit-sensor-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="例:玄関・置き配センサー" />
                </Field>

                <Field label="センサーURL" required hint="例:https://192.168.1.10" htmlFor="edit-sensor-url">
                    <Input id="edit-sensor-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://192.168.1.10" className="font-mono" />
                </Field>

                <Field label="タグ" hint="タグは未選択でも保存できます">
                    {Object.values(tagMap).length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            {Object.values(tagMap).map((t) => {
                                const tagId = Number(t.id);
                                return <Tag key={t.id} name={t.name} color={t.color} size="md" active={selected.includes(tagId)} onClick={() => toggleTag(tagId)} />;
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-foreground-500">タグがありません。「タグ管理」から作成できます</p>
                    )}
                </Field>
            </div>
        </Modal>
    );
}
