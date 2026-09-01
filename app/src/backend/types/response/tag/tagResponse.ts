export type TagResponse = {
    tagId: number;
    tagName: string;
    colorCode: string;
    createdAt: Date;
    updateAt: Date;
};

// タグ作成時のレスポンスタイプ
export type CreateTagResponse = TagResponse;

// タグ一覧取得処理のレスポンスタイプ
export type TagListItemResponse = TagResponse;
