import { z } from 'zod';

// センサーを新規登録APIのリクエストボディ用スキーマ
export const SensorRequestSchema = z.object({
    // センサー本体の登録情報
    sensor: z.object({
        sensorName: z.string().min(1, 'センサー名は必須です').max(100, 'センサー名は100文字以内で入力してください'),

        url: z.string(),
    }),

    // センサーに紐付けるタグIDの一覧
    tag: z.object({
        tagId: z.array(z.number().int().positive()),
    }),
});

export type SensorRequest = z.infer<typeof SensorRequestSchema>;
