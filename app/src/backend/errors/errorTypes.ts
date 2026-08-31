// APIエラーレスポンスの共通の型
export type ApiErrorBody = {
    code: string;
    message: string;
    fields?: Record<string, string[] | undefined>;
};
