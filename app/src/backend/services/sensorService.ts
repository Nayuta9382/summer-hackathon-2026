import { selectDetectionHistoriesBySensorIds } from '../repositories/SensorDetectionHistoryRepository';
import { insertSensor, selectSensorsWithTagsByUserId, selectSensorWithTagsBySensorId, selectUsersWithSensors, toggleSensorEnabled, updateSensor } from '../repositories/sensorRepository';
import { UsersWithSensorsParams } from '../types/dbparams/users/usersParams';
import { SensorWithTagsParams } from '../types/dbparams/sensor/sensorWithTagsParams';
import { SensorDetectionHistoryParams } from '../types/dbparams/history/sensorDetectionHistoryParams';
import { SensorRequest, SensorRequestSchema } from '../types/request/sensor/SensorRequest';
import { GetSensorResponse } from '../types/response/sensor/getSensorsResponse';
import { SensorResponse } from '../types/response/sensor/sensorResponse';
import { addTag, getTagByUserId } from './tagService';
import createError from 'http-errors';
import { UpdateSensorRequest } from '../types/request/sensor/updateSensorRequest';
import { UpdateSensorResponse } from '../types/response/sensor/updateSensorResponse';
import { getPool } from '../db/pool';
import { deleteSensorTagsBySensorId } from '../repositories/sensorTagRepository';
import { insertSensorTags } from '../repositories/sensorTagTepositry';
import { ToggleSensorResponse } from '../types/response/sensor/toggleSensorResponse';
import { SENSOR_DETECTION_ACTIVE_THRESHOLD_MS } from '../config/sensorConfig';
import { SensorStatus } from '../types/sensorStatus';

// センサーを登録する処理
export async function addSensor(userId: number, rawBody: SensorRequest): Promise<SensorResponse> {
    // リクエスト全体を検証し、センサー情報とタグ情報を取り出す
    const { sensor, tag } = SensorRequestSchema.parse(rawBody);

    const tags = await getTagByUserId(tag.tagId, userId);

    // センサー本体を登録して、生成されたsensorIdを取得する
    const newSensor = await insertSensor({ userId, sensorName: sensor.sensorName, url: sensor.url });

    // センサに紐づくタグを登録する
    await insertSensorTags(newSensor.sensorId, tag.tagId);

    // タグ情報を取得する(本来はセンサIDから取得する処理書くべきだが今回は省略)
    const sensorData = await selectSensorWithTagsBySensorId(newSensor.sensorId);

    const newTags: { tagId: number; tagName: string }[] = sensorData
        .filter((row): row is typeof row & { tagId: number; tagName: string } => row.tagId !== null && row.tagName !== null)
        .map((row) => ({
            tagId: row.tagId,
            tagName: row.tagName,
        }));

    const sensorResponse: SensorResponse = {
        sensorId: newSensor.sensorId,
        sensorName: newSensor.sensorName,
        url: newSensor.url,
        isEnabled: newSensor.isEnabled,
        delFlag: newSensor.delFlag,
        createdAt: newSensor.createdAt,
        updatedAt: newSensor.updatedAt,
        tags: newTags,
    };

    console.log(sensorResponse);
    return sensorResponse;
}

// ユーザー情報とそれに紐づくセンサー情報を取得する
export async function getUsersWithSensors(): Promise<UsersWithSensorsParams[]> {
    const usersWithSensors = await selectUsersWithSensors();

    return usersWithSensors;
}

// センサー×タグのJOIN結果（複数行）を、sensorId単位のMapにグルーピングする
function groupSensorsWithTags(rows: SensorWithTagsParams[]): Map<number, GetSensorResponse> {
    const sensorMap = new Map<number, GetSensorResponse>();

    for (const row of rows) {
        let sensor = sensorMap.get(row.sensorId);

        if (sensor == null) {
            sensor = {
                sensorId: row.sensorId,
                sensorName: row.sensorName,
                url: row.url,
                isEnabled: row.isEnabled,
                createdAt: row.createdAt,
                tags: [],
                readDetectedAts: [],
                unreadDetectedAts: [],
                status: 'NONE',
            };
            sensorMap.set(row.sensorId, sensor);
        }

        if (row.tagId != null && row.tagName != null) {
            sensor.tags.push({
                tagId: row.tagId,
                tagName: row.tagName,
            });
        }
    }

    return sensorMap;
}

// 検知履歴を既読/未読に振り分けて、sensorMap内の各センサーに詰める
// 検知履歴を既読/未読に振り分けて、sensorMap内の各センサーに詰める
function applyDetectionHistories(sensorMap: Map<number, GetSensorResponse>, histories: SensorDetectionHistoryParams[]): void {
    for (const history of histories) {
        const sensor = sensorMap.get(history.sensorId);
        if (sensor == null) {
            continue;
        }

        // DBから返るdetectedAtがstringの場合があるため、Dateに変換する
        const detectedAt = new Date(history.detectedAt);

        if (history.readAt != null) {
            sensor.readDetectedAts.push(detectedAt);

            if (history.detectionId != null) {
                (sensor.readDetections ??= []).push({ detectionId: history.detectionId, detectedAt });
            }
        } else {
            sensor.unreadDetectedAts.push(detectedAt);

            if (history.detectionId != null) {
                (sensor.unreadDetections ??= []).push({ detectionId: history.detectionId, detectedAt });
            }
        }
    }
}
// ユーザーに紐づくセンサー一覧を、タグ・検知履歴とともに取得する
export async function getSensors(userId: number): Promise<GetSensorResponse[]> {
    // ① センサー×タグをJOINで取得（タグは複数あるため行が増える）
    const rows = await selectSensorsWithTagsByUserId(userId);

    // ② sensorId単位にグルーピングし、タグを配列にまとめる
    const sensorMap = groupSensorsWithTags(rows);

    // ③ 検知履歴をセンサーID群でまとめて取得（別クエリ）
    const sensorIds = Array.from(sensorMap.keys());
    const histories = await selectDetectionHistoriesBySensorIds(sensorIds);

    // ④ 既読/未読に振り分けてセンサーごとに詰める
    applyDetectionHistories(sensorMap, histories);

    // 検知履歴を反映した後で、各センサーのstatusを算出する
    for (const sensor of sensorMap.values()) {
        sensor.status = resolveSensorStatus(sensor.unreadDetectedAts);
    }

    return Array.from(sensorMap.values());
}

// センサーIDを指定して、センサー情報をタグ・検知履歴とともに取得する
export async function getSensorById(sensorId: number): Promise<GetSensorResponse> {
    // ① センサー×タグをJOINで取得（タグは複数あるため行が増える）
    const rows = await selectSensorWithTagsBySensorId(sensorId);

    if (rows.length === 0) {
        throw createError(404, 'センサーが見つかりません');
    }

    // ② sensorId単位にグルーピングし、タグを配列にまとめる（単体でも共通関数を再利用）
    const sensorMap = groupSensorsWithTags(rows);
    const sensor = sensorMap.get(sensorId)!;

    // ③ 検知履歴を取得
    const histories = await selectDetectionHistoriesBySensorIds([sensorId]);

    // ④ 既読/未読に振り分ける
    applyDetectionHistories(sensorMap, histories);

    sensor.status = resolveSensorStatus(sensor.unreadDetectedAts);

    return sensor;
}

// センサー情報（名前・URL・タグ紐付け）を更新する
export async function editSensor(sensorId: number, request: UpdateSensorRequest): Promise<UpdateSensorResponse> {
    // ① センサー本体（名前・URL）を更新
    const updated = await updateSensor(sensorId, request.sensorName, request.url);

    // ② 存在しない場合は404
    if (updated == null) {
        throw createError(404, 'センサーが見つかりません');
    }

    // ③ 既存のタグ紐付けを全削除
    await deleteSensorTagsBySensorId(sensorId);

    // ④ 渡されたタグID配列で再登録（完全置き換え）
    await insertSensorTags(sensorId, request.tagIds);

    // ⑤ 更新後の最新情報をタグ込みで取得して返す
    const rows = await selectSensorWithTagsBySensorId(sensorId);
    const sensorMap = groupSensorsWithTags(rows);
    return sensorMap.get(sensorId)!;
}

// センサーの有効/無効を切り替える（トグル）
export async function toggleSensor(sensorId: number): Promise<ToggleSensorResponse> {
    const sensor = await toggleSensorEnabled(sensorId);

    if (sensor == null) {
        throw createError(404, 'センサーが見つかりません');
    }

    return {
        sensorId: sensor.sensorId,
        isEnabled: sensor.isEnabled,
    };
}

// 未読の検知履歴から、センサーの状態（DETECTING・UNCONFIRMED・NONE）を判定する
function resolveSensorStatus(unreadDetectedAts: Date[]): SensorStatus {
    if (unreadDetectedAts.length === 0) {
        return 'NONE';
    }

    // 未読の中で最新の検知日時を取得する
    const latestUnreadDetectedAt = unreadDetectedAts.reduce((latest, current) => (current > latest ? current : latest));

    const elapsedMs = Date.now() - latestUnreadDetectedAt.getTime();

    if (elapsedMs <= SENSOR_DETECTION_ACTIVE_THRESHOLD_MS) {
        return 'DETECTING';
    }

    return 'UNCONFIRMED';
}
