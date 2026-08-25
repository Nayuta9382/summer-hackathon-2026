-- 開発用の初期データ例。不要であればこのファイルごと削除してよい。

INSERT INTO users (name, email)
VALUES
  ('Taro Yamada', 'taro@example.com'),
  ('Hanako Sato', 'hanako@example.com')
ON CONFLICT (email) DO NOTHING;
