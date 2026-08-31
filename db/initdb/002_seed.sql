-- 1. 通知音マスタ（notification_sounds）のテストデータ
INSERT INTO notification_sounds (sound_name, file_url) VALUES
('チャイム', 'https://example.com/sounds/chime.mp3'),
('ベル', 'https://example.com/sounds/bell.mp3'),
('アラート', 'https://example.com/sounds/alert.mp3');

-- 2. ユーザー（users）のテストデータ
INSERT INTO users (user_name, password_hash, notification_sound_id, is_sound_enabled) VALUES
-- サンプルユーザー
('sampleUser', '$2a$12$sogWGp90jT4tmOcARZ.cUeXhomP4gSgWn/bZve/jS75yQ0nJCYfw2', 1, TRUE),
-- チャイムを設定しているユーザー
('Taro Tanaka', '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', 1, true),
-- ベルを設定しているユーザー
('Hanako Sato', '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', 2, true),
-- 通知音をオフにしているユーザー
('Ichiro Suzuki', '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', 1, false),
-- 通知音を未設定（NULL）にしているユーザー
('Jiro Takahashi', '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', NULL, true);

-- 3. タグ（tags）のテストデータ
INSERT INTO tags (user_id, tag_name, color_code) VALUES
(1, '重要', '#FF0000'),
(1, '後で確認', '#FFA500'),
(1, '完了', '#00FF00'),
(1, '保留', '#808080');
