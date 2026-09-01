-- ローカル専用：実IP/実メールアドレスを含むためgit管理外
-- ※ seed_public.sql の後に実行し、user_id=1,2 を確定させる

-- ユーザー1（センサー2件・Slack通知）
INSERT INTO users (user_id, user_name, password_hash, is_sound_enabled) VALUES
(1, 'test_user1', 'dummy_hash', TRUE);

-- ユーザー2（センサー1件・LINE通知）
INSERT INTO users (user_id, user_name, password_hash, is_sound_enabled) VALUES
(2, 'test_user2', 'dummy_hash', TRUE);

-- シーケンスを実際のMAXに合わせ直す（public側で3〜7まで進んでいるのでズレ防止）
SELECT setval(pg_get_serial_sequence('users', 'user_id'),
              (SELECT MAX(user_id) FROM users), true);

-- センサー（user_id=1に2件、user_id=2に1件）
INSERT INTO sensors (user_id, sensor_name, url, is_enabled, del_flag) VALUES
(1, 'テストセンサー1-1', 'http://192.168.120.173:3000/status', TRUE, FALSE),
(1, 'テストセンサー1-2', 'http://192.168.120.174:3000/status', TRUE, FALSE),
(2, 'テストセンサー2-1', 'http://192.168.120.130:3000/status', TRUE, FALSE);

-- 通知プロバイダー（user_id=1: SLACK, user_id=2: LINE）
INSERT INTO notification_provider_masters (id, provider_type, user_id, active_flg) VALUES
(1, 'SLACK', 1, TRUE),
(2, 'LINE', 2, TRUE);

SELECT setval(pg_get_serial_sequence('notification_provider_masters', 'id'),
              (SELECT MAX(id) FROM notification_provider_masters), true);

INSERT INTO slack_providers (id, provider_type, provider_id) VALUES
(1, 'SLACK', 'test-user1-slack@example.com');

INSERT INTO line_providers (id, provider_type, provider_id) VALUES
(2, 'LINE', 'test-user2-line-id');
