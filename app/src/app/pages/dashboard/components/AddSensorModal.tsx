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
    tagMap: Record<string, SensorTag>;
    onAdd: (data: { name: string; ip: string; tagIds: string[] }) => void;
}

export default function AddSensorModal({ open, onClose, tagMap, onAdd }: Props) {
    const [name, setName] = useState('');
    const [ip, setIp] = useState('');
    const [selected, setSelected] = useState<string[]>([]);

    const valid = name.trim().length > 0 && ip.trim().length > 0;

    const toggleTag = (id: string) => {
        setSelected((cur) => (cur.includes(id) ? cur.filter((t) => t !== id) : [...cur, id]));
    };

    const submit = () => {
        if (!valid) return;
        onAdd({ name: name.trim(), ip: ip.trim(), tagIds: selected });
        setName('');
        setIp('');
        setSelected([]);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="センサーを追加"
            subtitle="新しいセンサーを登録して監視を開始します"
            icon={<i className="ri-radar-line text-xl" />}
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button onClick={submit} disabled={!valid}>
                        <i className="ri-add-line" />
                        センサーを登録
                    </Button>
                </>
            }
        >
            <div className="space-y-5">
                <Field label="センサー名" required htmlFor="sensor-name">
                    <Input id="sensor-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：玄関・置き配センサー" />
                </Field>

                <Field label="IPアドレス" required hint="例：192.168.1.10" htmlFor="sensor-ip">
                    <Input id="sensor-ip" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" className="font-mono" />
                </Field>

                <Field label="タグ" hint="タグは未選択でも登録できます">
                    {Object.values(tagMap).length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            {Object.values(tagMap).map((t) => (
                                <Tag key={t.id} name={t.name} color={t.color} size="md" active={selected.includes(t.id)} onClick={() => toggleTag(t.id)} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-foreground-500">タグがありません。「タグ管理」から作成できます</p>
                    )}
                </Field>
            </div>
        </Modal>
    );
}
