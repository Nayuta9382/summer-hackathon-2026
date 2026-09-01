import { z } from 'zod';

// センサー編集APIのリクエストボディ
export const UpdateSensorRequestSchema = z.object({
    sensorName: z.string().min(1, 'センサー名は必須です').max(100, 'センサー名は100文字以内で入力してください'),
    url: z.string().min(1, 'URLは必須です'),
    tagIds: z.array(z.number().int()),
});

export type UpdateSensorRequest = z.infer<typeof UpdateSensorRequestSchema>;
