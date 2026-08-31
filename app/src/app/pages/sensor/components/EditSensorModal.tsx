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
    initialIp: string;
    initialTagIds: string[];
    tagMap: Record<string, SensorTag>;
    onSave: (data: { name: string; ip: string; tagIds: string[] }) => void;
}

export default function EditSensorModal({ open, onClose, initialName, initialIp, initialTagIds, tagMap, onSave }: Props) {
    const [name, setName] = useState(initialName);
    const [ip, setIp] = useState(initialIp);
    const [selected, setSelected] = useState<string[]>(initialTagIds);

    const valid = name.trim().length > 0 && ip.trim().length > 0;

    const toggleTag = (id: string) => {
        setSelected((cur) => (cur.includes(id) ? cur.filter((t) => t !== id) : [...cur, id]));
    };

    const submit = () => {
        if (!valid) return;
        onSave({ name: name.trim(), ip: ip.trim(), tagIds: selected });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="センサーを編集"
            subtitle="名前・IPアドレス・タグを変更します"
            icon={<i className="ri-settings-3-line text-xl" />}
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button onClick={submit} disabled={!valid}>
                        <i className="ri-check-line" />
                        変更を保存
                    </Button>
                </>
            }
        >
            <div className="space-y-5">
                <Field label="センサー名" required htmlFor="edit-sensor-name">
                    <Input id="edit-sensor-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：玄関・置き配センサー" />
                </Field>

                <Field label="IPアドレス" required hint="例：192.168.1.10" htmlFor="edit-sensor-ip">
                    <Input id="edit-sensor-ip" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" className="font-mono" />
                </Field>

                <Field label="タグ" hint="タグは未選択でも保存できます">
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
