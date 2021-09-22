ARG NODE_VERSION

FROM node:$NODE_VERSION-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3000

RUN addgroup --gid 10001 --system nonroot \
    && adduser  --uid 10000 --system --ingroup nonroot --home /home/nonroot nonroot

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--", "node", "--experimental-specifier-resolution=node"]

WORKDIR /workspace

COPY yarn.lock package.json ./
COPY apps/api/package.json apps/api/
COPY libs/ libs/

RUN yarn workspace @nvd.codes/api install --frozen-lock-file

COPY apps/api apps/api

EXPOSE ${PORT}

USER nonroot

CMD [ "/workspace/apps/api/.dist/index.js" ]
