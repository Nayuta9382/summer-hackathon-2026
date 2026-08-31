import { insertSensor } from '../repositories/sensorRepository';
import { SensorRequest, SensorRequestSchema } from '../types/request/sensor/SensorRequest';
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
