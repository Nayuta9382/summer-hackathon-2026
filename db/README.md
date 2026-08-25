# db/

## initdb/

`docker-entrypoint-initdb.d` にマウントされ、Postgres コンテナの**データボリュームが空の状態で初回起動したときだけ**、ファイル名の昇順で自動実行される。

- 2回目以降の起動では実行されない
- 作り直したい場合は該当ボリュームを削除する
  ```bash
  docker compose -f docker/dev/compose.yaml down -v
  ```

## migrations/

運用が始まった後の差分スキーマ変更をここに置く（マイグレーションツールは未選定・任意）。
`initdb/` は「まっさらな状態からの初期構築専用」と割り切り、以降の変更は基本的にこちらで管理する。
