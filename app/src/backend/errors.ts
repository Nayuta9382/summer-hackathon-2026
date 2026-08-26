import { HttpError } from 'http-errors';
import { ZodError } from 'zod';

export function handleApiError(err: unknown) {
    if (err instanceof ZodError) {
        return Response.json({ error: 'リクエストが不正です', details: err.flatten() }, { status: 400 });
    }
    if (err instanceof HttpError) {
        return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
}
