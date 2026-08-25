# =========================================================
# docker/dev/Dockerfile
#
# 開発用。docker/common/Dockerfile.base を先にビルドしてタグ付けしておき、
# それを BASE_IMAGE として受け取る想定（Makefile の `make dev` が面倒を見る）。
#
# ソース自体は compose.yaml のバインドマウントで上書きされるので、
# ここでの COPY は「単体で `docker build` した場合にも動く」ための保険。
# =========================================================

ARG BASE_IMAGE=myapp-base:local
FROM ${BASE_IMAGE}

ENV NODE_ENV=development

WORKDIR /app

# 依存解決だけ先に行いレイヤーキャッシュを効かせる
# (app/ が空の初期状態では package-lock.json が無いため * で任意化)
COPY package.json package-lock.json* ./
RUN if [ -f package.json ]; then npm install; fi

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
