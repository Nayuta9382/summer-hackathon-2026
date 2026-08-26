CREATE TABLE samples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- samples テーブル 初期データ(シードデータ)

INSERT INTO samples (name, category) VALUES
  ('コシヒカリ 5kg', '食品'),
  ('北海道産じゃがいも', '食品'),
  ('ドリップコーヒー 10袋セット', '食品'),
  ('ワイヤレスイヤホン', '家電'),
  ('スティック掃除機', '家電'),
  ('電気ケトル 1.2L', '家電'),
  ('プログラミング入門', '書籍'),
  ('世界史大図鑑', '書籍'),
  ('コットン バスタオル', '生活用品'),
  ('折りたたみ傘', '生活用品');
