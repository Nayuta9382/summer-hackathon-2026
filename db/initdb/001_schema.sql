CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. 通知音マスタ
CREATE TABLE notification_sounds (
    sound_id VARCHAR(50) PRIMARY KEY, -- 通知音ID
    sound_name VARCHAR(100) NOT NULL, -- 通知音名
    file_url VARCHAR(255) NOT NULL -- ファイルのURL
);

-- 2. ユーザー
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- ユーザID
    user_name VARCHAR(100) NOT NULL, -- ユーザ名
    password_hash VARCHAR(255) NOT NULL, -- パスワード
    notification_sound_id VARCHAR(50), -- 通知音ID
    is_sound_enabled BOOLEAN NOT NULL DEFAULT TRUE, -- 通知音のON/OFF
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 登録日時
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 更新日時
    CONSTRAINT fk_users_notification_sound FOREIGN KEY (notification_sound_id) 
        REFERENCES notification_sounds(sound_id) ON DELETE SET NULL
);

-- 3. センサー
CREATE TABLE sensors (
    sensor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- センサーID
    user_id UUID NOT NULL, -- ユーザID
    sensor_name VARCHAR(100) NOT NULL, -- センサー名
    ip_address INET, -- IPアドレス（PostgreSQL専用のINET型を利用）
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE, -- 有効/無効
    del_flag BOOLEAN NOT NULL DEFAULT FALSE, -- 削除フラグ（論理削除）
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 登録日時
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 更新日時
    CONSTRAINT fk_sensors_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. タグ
CREATE TABLE tags (
    tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- タグID
    user_id UUID NOT NULL, -- 作成したユーザID
    tag_name VARCHAR(100) NOT NULL, -- タグ名
    color_code VARCHAR(7), -- カラーコード (例: #FF0000)
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 登録日時
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 更新日時
    CONSTRAINT fk_tags_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE
);

-- 5. sensor_tags (中間テーブル)
CREATE TABLE sensor_tags (
    sensor_id UUID NOT NULL, -- センサーID
    tag_id UUID NOT NULL, -- タグID
    PRIMARY KEY (sensor_id, tag_id),
    CONSTRAINT fk_sensor_tags_sensor FOREIGN KEY (sensor_id) 
        REFERENCES sensors(sensor_id) ON DELETE CASCADE,
    CONSTRAINT fk_sensor_tags_tag FOREIGN KEY (tag_id) 
        REFERENCES tags(tag_id) ON DELETE CASCADE
);

-- 6. センサー検知履歴
CREATE TABLE sensor_detection_histories (
    detection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- 検知ログID
    sensor_id UUID NOT NULL, -- 対象センサーID
    detected_at TIMESTAMPTZ NOT NULL, -- センサが検知した日時
    read_at TIMESTAMPTZ, -- 既読を付けた日時
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード挿入日時
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- レコード更新日時
    CONSTRAINT fk_sensor_detections_sensor FOREIGN KEY (sensor_id) 
        REFERENCES sensors(sensor_id) ON DELETE CASCADE
);

-- 7. 通知プロバイダーマスタ
CREATE TABLE notification_provider_masters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- ID
    provider_type VARCHAR(50) NOT NULL, -- サービス種別 (例: LINE, SLACK)
    user_id UUID NOT NULL, -- ユーザID
    active_flg BOOLEAN NOT NULL DEFAULT TRUE, -- 有効化フラグ
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 登録日時
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 更新日時
    CONSTRAINT fk_notification_providers_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE
);

-- 8. LINEプロバイダー
CREATE TABLE line_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- ID
    provider_type VARCHAR(50) NOT NULL, -- サービス種別
    provider_id VARCHAR(100) NOT NULL, -- LINEのユーザID
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 登録日時
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新日時
);

-- 9. スラックプロバイダー
CREATE TABLE slack_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- ID
    provider_type VARCHAR(50) NOT NULL, -- サービス種別
    provider_id VARCHAR(255) NOT NULL, -- スラックのメールアドレス/識別子
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 登録日時
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP -- 更新日時
);