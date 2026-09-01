import { selectDetectionHistoriesBySensorIds } from '../repositories/SensorDetectionHistoryRepository';
import { insertSensor, selectSensorsWithTagsByUserId, selectUsersWithSensors } from '../repositories/sensorRepository';
import { UsersWithSensorsParams } from '../types/dbparams/users/usersParams';
import { SensorRequest, SensorRequestSchema } from '../types/request/sensor/SensorRequest';
import { GetSensorResponse } from '../types/response/sensor/getSensorsResponse';
import { SensorResponse } from '../types/response/sensor/sensorResponse';
import { getTagByUserId } from './tagService';

// センサーを登録する処理
export async function addSensor(userId: number, rawBody: SensorRequest): Promise<SensorResponse> {
    // リクエスト全体を検証し、センサー情報とタグ情報を取り出す
    const { sensor, tag } = SensorRequestSchema.parse(rawBody);

    const tags = await getTagByUserId(tag.tagId, userId);

    // const tags = await selectTagsByIds(tag.tagId, userId);

    // センサー本体を登録して、生成されたsensorIdを取得する
    const newSensor = await insertSensor({ userId, sensorName: sensor.sensorName, url: sensor.url });

    // センサー登録後に、取得したsensorIdとタグIDを紐付ける
    // await insertSensorTags(newSensor.sensorId, tag.tagId);

    const sensorResponse: SensorResponse = {
        sensorId: newSensor.sensorId,
        sensorName: newSensor.sensorName,
        url: newSensor.url,
        isEnabled: newSensor.isEnabled,
        delFlag: newSensor.delFlag,
        createdAt: newSensor.createdAt,
        updatedAt: newSensor.updatedAt,
        tags,
    };

    return sensorResponse;
}

// ユーザー情報とそれに紐づくセンサー情報を取得する
export async function getUsersWithSensors(): Promise<UsersWithSensorsParams[]> {
    const usersWithSensors = await selectUsersWithSensors();

    return usersWithSensors;
}

// ユーザーに紐づくセンサー一覧を、タグ・検知履歴とともに取得する
export async function getSensors(userId: number): Promise<GetSensorResponse[]> {
    // ① センサー×タグをJOINで取得（タグは複数あるため行が増える）
    const rows = await selectSensorsWithTagsByUserId(userId);

    // ② sensorId単位にグルーピングし、タグを配列にまとめる
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

    // ③ 検知履歴をセンサーID群でまとめて取得（別クエリ）
    const sensorIds = Array.from(sensorMap.keys());
    const histories = await selectDetectionHistoriesBySensorIds(sensorIds);

    // ④ 既読/未読に振り分けてセンサーごとに詰める
    for (const history of histories) {
        const sensor = sensorMap.get(history.sensorId);
        if (sensor == null) {
            continue;
        }

        if (history.readAt != null) {
            sensor.readDetectedAts.push(history.detectedAt);
        } else {
            sensor.unreadDetectedAts.push(history.detectedAt);
        }
    }

    return Array.from(sensorMap.values());
}
