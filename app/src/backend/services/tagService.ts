import { deleteTag, insertTag, selectTagsByIds, selectTagsByUserId, updateTag } from '../repositories/tagRepository';
import { Tag } from '../types/db/tag';
import { SensorTag } from '../types/dbparams/sensor/sensorParams';
import { AddTagRequest, AddTagRequestSchema } from '../types/request/tag/TagRequest';
import { UpdateTagRequest } from '../types/request/tag/updateTagRequest';
import createError from 'http-errors';
import { CreateTagResponse, TagListItemResponse } from '../types/response/tag/tagResponse';
import { UpdateTagResponse } from '../types/response/tag/updateTagResponse';
import { DeleteTagResponse } from '../types/response/tag/deleteTagResponse';

// タグの一覧をユーザIDから取得する
export async function getTagsByUserId(userId: number): Promise<TagListItemResponse[]> {
    // repositoryからタグの一覧を受け取る
    const tags: Tag[] = await selectTagsByUserId(userId);

    // レスポンスオブジェクトに詰めなおす(for分とかで詰めなおすのの省略版的なやつ)
    const tagResponses: TagListItemResponse[] = tags.map((tag) => {
        const { userId: tagUserId, ...rest } = tag;
        void tagUserId;
        return rest;
    });

    return tagResponses;
}

// タグを登録する処理
export async function addTag(userId: number, rawBody: AddTagRequest): Promise<CreateTagResponse> {
    // バリデーション(失敗時はZodErrorが自動でthrowされ、handleApiErrorのzod部分がレスポンスする)
    const { tagName, colorCode } = AddTagRequestSchema.parse(rawBody);

    // DBへ登録
    const newTag = await insertTag({ userId, tagName, colorCode });

    // newTagからuserIdを除いてTagResponse形式にする
    const { userId: newTagUserId, ...tagResponse } = newTag;
    void newTagUserId;

    return tagResponse as CreateTagResponse;
}

export async function getTagByUserId(tagIds: number[], userId: number): Promise<SensorTag[]> {
    const tags: SensorTag[] = await selectTagsByIds(tagIds, userId);
    return tags;
}

// タグ情報（タグ名・カラーコード）を更新する
export async function editTag(tagId: number, request: UpdateTagRequest): Promise<UpdateTagResponse> {
    const tag = await updateTag(tagId, request.tagName, request.colorCode);

    if (tag == null) {
        throw createError(404, 'タグが見つかりません');
    }

    // DBの型からレスポンス用の型に詰め替える
    return {
        tagId: tag.tagId,
        tagName: tag.tagName,
        colorCode: tag.colorCode,
    };
}

// タグを削除する
export async function removeTag(tagId: number): Promise<DeleteTagResponse> {
    const deleted = await deleteTag(tagId);

    if (deleted == null) {
        throw createError(404, 'タグが見つかりません');
    }

    return { tagId: deleted.tagId };
}
