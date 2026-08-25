-- コンテナ初回起動時（ボリュームが空の場合のみ）に自動実行される。
-- 2回目以降の変更は db/migrations/ 側で管理する想定。

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
