// ../types/request/auth/LoginRequest.ts
import { ApiErrorBody } from '@/backend/errors/errorTypes';
import { z } from 'zod';

// ログインAPIのリクエストボディ用スキーマ
export const LoginRequestSchema = z.object({
    userName: z.string().min(1, 'ユーザ名は必須です'),
    password: z.string(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// Login処理で使用する結果の型
export type LoginResult = { ok: true; userId: number; userName: string } | { ok: false; status: 400 | 401; error: ApiErrorBody };
