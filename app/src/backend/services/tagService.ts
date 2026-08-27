import { selectTagsByUserId } from '../repositories/tagRepository';
import { Tag } from '../types/db/tag';
import { TagResponse } from '../types/response/tag/tagResponse';

// タグの一覧をユーザIDから取得する
export async function getTagsByUserId(userId: string) {
    // repositoryからタグの一覧を受け取る
    const tags: Tag[] = await selectTagsByUserId(userId);

    // レスポンスオブジェクトに詰めなおす(for分とかで詰めなおすのの省略版的なやつ)
    const tagResponses: TagResponse[] = tags.map((item) => ({ ...item }));

    return tagResponses;
}
