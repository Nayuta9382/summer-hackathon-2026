

-- 1. 通知音マスタ
INSERT INTO notification_sounds (sound_name, file_url) VALUES
('チャイム', 'https://example.com/sounds/chime.mp3'),
('ベル', 'https://example.com/sounds/bell.mp3'),
('アラート', 'https://example.com/sounds/alert.mp3');

-- 2. ユーザー（user_id = 3〜7 固定）
INSERT INTO users (user_id, user_name, password_hash, notification_sound_id, is_sound_enabled) VALUES
(3, 'sampleUser',     '$2a$12$sogWGp90jT4tmOcARZ.cUeXhomP4gSgWn/bZve/jS75yQ0nJCYfw2', 1, TRUE),
(4, 'Taro Tanaka',    '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', 1, true),
(5, 'Hanako Sato',    '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', 2, true),
(6, 'Ichiro Suzuki',  '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', 1, false),
(7, 'Jiro Takahashi', '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', NULL, true);

SELECT setval(pg_get_serial_sequence('users', 'user_id'),
              (SELECT MAX(user_id) FROM users), true);

-- 3. タグ（sampleUserにuser_nameで紐付け）
INSERT INTO tags (user_id, tag_name, color_code)
SELECT user_id, tag_name, color_code
FROM users, (VALUES
    ('重要', '#FF0000'),
    ('後で確認', '#FFA500'),
    ('完了', '#00FF00'),
    ('保留', '#808080')
) AS t(tag_name, color_code)
WHERE users.user_name = 'sampleUser';
