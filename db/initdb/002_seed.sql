-- ユーザー サンプルデータ(1件)
INSERT INTO users (user_name, password_hash, notification_sound_id, is_sound_enabled)
VALUES (
    '山田太郎',
    '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV', -- ハッシュ化済みパスワードのダミー値
    NULL,
    TRUE
);

-- タグ サンプルデータ(4件)
INSERT INTO tags (user_id, tag_name, color_code)
VALUES
    (1,  '重要', '#FF0000'),
    (1,  '後で確認', '#FFA500'),
    (1,  '完了', '#00FF00'),
    (1,  '保留', '#808080');
