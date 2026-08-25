# myapp

Next.js + PostgreSQL を Docker Compose で構築する環境一式（環境部分のみ。`app/` は空）。

## 構成

```
myapp/
├── .mise.toml                    # ホストのnodeバージョン固定
├── app/                          # ここにNext.jsプロジェクトを配置する（現在は空）
├── db/
│   ├── initdb/                   # Postgres初回起動時に自動実行されるSQL
│   └── migrations/                # 運用開始後の差分マイグレーション置き場
└── docker/
    ├── common/Dockerfile.base    # dev/prod共通のベースイメージ定義
    ├── dev/                      # 開発用 Dockerfile / compose.yaml / .env
    └── prod/                     # 本番用 Dockerfile / compose.yaml / .env
```

## 前提

- `mise install`（ルートの `.mise.toml` に従い node 22 を導入）
- Docker / Docker Compose

## 使い方

### 開発

```bash
make dev
```

初回は `docker/common/Dockerfile.base` を `myapp-base:local` としてビルドしてから、
`docker/dev/compose.yaml` で `web`（Next.js, npm run dev）と `db`（Postgres 17）を起動する。

- Next.js: http://localhost:3000
- Postgres: `localhost:5432`（`docker/dev/.env` 参照）

停止:
```bash
make dev-down
```

### 本番相当

```bash
make prod
```

`docker/prod/Dockerfile` のマルチステージビルドで `npm run build` → standalone 出力のみを
軽量イメージにコピーして起動する。事前に `docker/prod/.env` のパスワード類を必ず変更すること。

停止:
```bash
make prod-down
```

## app/ にプロジェクトを追加する際の注意

- `app/` 直下に `package.json` を作成し、`dev` スクリプト（`next dev`）・`build` スクリプト（`next build`）を用意する
- `next.config.ts` で `output: "standalone"` を設定する（prod のマルチステージビルドが前提としている）
- DB接続文字列は `DATABASE_URL` 環境変数（`docker/dev/.env` / `docker/prod/.env`）から読み込む想定
