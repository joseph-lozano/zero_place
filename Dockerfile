ARG BUN_IMAGE="oven/bun:1.1.40-slim"

FROM ${BUN_IMAGE} as bun
WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

ARG VITE_ZERO_URL
ENV VITE_ZERO_URL=${VITE_ZERO_URL}

RUN bun run build -- --outDir dist


FROM nginx:bullseye
COPY --from=bun /app/dist /usr/share/nginx/html

