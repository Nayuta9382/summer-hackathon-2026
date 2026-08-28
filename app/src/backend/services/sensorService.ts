import { insertSensor, insertSensorTags } from '../repositories/sensorRepository';
import { SensorRequest, SensorRequestSchema } from '../types/request/sensor/SensorRequest';
import { SensorResponse } from '../types/response/sensor/sensorResponse';

// センサーを登録する処理
export async function addSensor(userId: number, rawBody: SensorRequest): Promise<SensorResponse> {
    // リクエスト全体を検証し、センサー情報とタグ情報を取り出す
    const { sensor, tag } = SensorRequestSchema.parse(rawBody);

    // センサー本体を登録して、生成されたsensorIdを取得する
    const newSensor = await insertSensor({ userId, sensorName: sensor.sensorName, ipAddress: sensor.ipAddress });

    // センサー登録後に、取得したsensorIdとタグIDを紐付ける
    await insertSensorTags(newSensor.sensorId, tag.tagId);

    // userIdを除いたセンサー情報をAPIレスポンスとして返す
    const { ...sensorResponse } = newSensor;

    return sensorResponse;
}
