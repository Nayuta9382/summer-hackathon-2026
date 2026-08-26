// データベースの接続設定
import { createPool, type DatabasePool } from 'slonik';
import { createPgDriverFactory } from '@slonik/pg-driver';
import { createFieldNameTransformationInterceptor } from 'slonik-interceptor-field-name-transformation';

let pool: DatabasePool | null = null;
// データベースの接続情報の設定
export async function getPool(): Promise<DatabasePool> {
    if (!pool) {
        pool = await createPool(process.env.DATABASE_URL!, {
            driverFactory: createPgDriverFactory(),
            interceptors: [
                createFieldNameTransformationInterceptor({
                    test: (field) => /^[\d_a-z]+$/u.test(field.name),
                }),
            ],
        });
    }
    return pool;
}
