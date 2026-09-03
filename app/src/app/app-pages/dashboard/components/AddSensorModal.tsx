'use client';

import { useState } from 'react';
import type { Tag as SensorTag } from '@/app/mocks/sensors';
import Modal from '@/components/base/Modal';
import Button from '@/components/base/Button';
import { Field, Input } from '@/components/base/Form';
import Tag from '@/components/base/Tag';
import { useCreateSensor } from '@/app/hooks/sensors/useCreateSensor';
import { useToast } from '@/components/base/Toast';

interface Props {
    open: boolean;
    onClose: () => void;
    tagMap: Record<string, SensorTag>;
    onCreated?: () => void;
}

export default function AddSensorModal({ open, onClose, tagMap, onCreated }: Props) {
    const toast = useToast();
    const { createSensor, isCreating } = useCreateSensor();

    const [name, setName] = useState('');
    const [ip, setIp] = useState('');
    const [selected, setSelected] = useState<number[]>([]);

    const valid = name.trim().length > 0 && ip.trim().length > 0;

    const toggleTag = (id: number) => {
        setSelected((cur) => (cur.includes(id) ? cur.filter((t) => t !== id) : [...cur, id]));
    };

    const resetForm = () => {
        setName('');
        setIp('');
        setSelected([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const submit = async () => {
        if (!valid || isCreating) return;

        const { sensor, status } = await createSensor({
            sensor: {
                sensorName: name.trim(),
                url: ip.trim(),
            },
            tag: {
                tagId: selected,
            },
        });

        if (status !== 200 && status !== 201) {
            toast.show('info', 'センサーの登録に失敗しました');
            return;
        }

        toast.show('success', `${sensor?.sensorName ?? name.trim()} を登録しました`);
        resetForm();
        onClose();
        onCreated?.();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="センサーを追加"
            subtitle="新しいセンサーを登録して監視を開始します"
            icon={<i className="ri-radar-line text-xl" />}
            footer={
                <>
                    <Button variant="outline" onClick={handleClose}>
                        キャンセル
                    </Button>
                    <Button onClick={submit} disabled={!valid || isCreating}>
                        <i className="ri-add-line" />
                        {isCreating ? '登録中...' : 'センサーを登録'}
                    </Button>
                </>
            }
        >
            <div className="space-y-5">
                <Field label="センサー名" required htmlFor="sensor-name">
                    <Input id="sensor-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：玄関・置き配センサー" />
                </Field>

                <Field label="センサーURL" required hint="例：https://192.168.1.10" htmlFor="sensor-ip">
                    <Input id="sensor-ip" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="https://192.168.1.10" className="font-mono" />
                </Field>

                <Field label="タグ" hint="タグは未選択でも登録できます">
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
