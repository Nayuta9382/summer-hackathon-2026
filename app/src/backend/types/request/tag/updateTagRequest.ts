import { z } from 'zod';

// タグ編集APIのリクエストボディ
export const UpdateTagRequestSchema = z.object({
    tagName: z.string().min(1, 'タグ名は必須です').max(100, 'タグ名は100文字以内で入力してください'),
    colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'カラーコードの形式が正しくありません(例: #FF0000)'),
});

export type UpdateTagRequest = z.infer<typeof UpdateTagRequestSchema>;
