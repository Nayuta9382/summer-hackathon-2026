-- 1. 通知音マスタ（notification_sounds）のテストデータ
INSERT INTO notification_sounds (sound_name, file_url) VALUES
('チャイム', 'https://example.com/sounds/chime.mp3'),
('ベル', 'https://example.com/sounds/bell.mp3'),
('アラート', 'https://example.com/sounds/alert.mp3');
-- ユーザー サンプルデータ(1件)
INSERT INTO users (user_name, password_hash, notification_sound_id, is_sound_enabled)
VALUES (
    '山田太郎',
    '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV', -- ハッシュ化済みパスワードのダミー値
    1,
    TRUE
);  

-- タグ サンプルデータ(4件)
INSERT INTO tags (user_id, tag_name, color_code)
VALUES
    (1,  '重要', '#FF0000'),
    (1,  '後で確認', '#FFA500'),
    (1,  '完了', '#00FF00'),
    (1,  '保留', '#808080');



-- 2. ユーザー（users）のテストデータ
-- (notification_sound_id に NULL を指定したパターンも含めています)
INSERT INTO users (
    user_name, 
    password_hash, 
    notification_sound_id, 
    is_sound_enabled
) VALUES
-- チャイムを設定しているユーザー
('田中太郎', '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', 1, true),

-- ベルを設定しているユーザー
('佐藤花子', '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', 1, true),

-- 通知音をオフにしているユーザー
('鈴木一郎', '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4', 1, false),

-- 通知音を未設定（NULL）にしているユーザー
('高橋次郎', '$2b$10$e8N.1S3d4R.aF5g6H7i8uO9v0w1x2y3z4A5B6C7D8E9F0G1H2I3J4',1 , true);