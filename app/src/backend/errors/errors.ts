// lib/errors/handleApiError.ts
import { HttpError } from 'http-errors';
import { ZodError } from 'zod';

// ハンドラー関数
export function handleApiError(err: unknown) {
    // zodエラー
    if (err instanceof ZodError) {
        const { fieldErrors } = err.flatten();

        return Response.json(
            {
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'リクエストが不正です',
                    fields: fieldErrors, // どのカラムでエラーが起きたか
                },
            },
            { status: 400 },
        );
    }
    if (err instanceof HttpError) {
        return Response.json({ success: false, error: { code: 'HTTP_ERROR', message: err.message } }, { status: err.status });
    }
    console.error(err);
    return Response.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } }, { status: 500 });
}
