ARG NODE_VERSION

FROM node:$NODE_VERSION-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3000

RUN addgroup --gid 10001 --system nonroot \
    && adduser  --uid 10000 --system --ingroup nonroot --home /home/nonroot nonroot

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /workspace

COPY yarn.lock package.json ./
COPY apps/web/package.json apps/web/
COPY libs/ libs/

RUN yarn workspace @nvd.codes/web install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

COPY apps/web apps/web

EXPOSE ${PORT}

USER nonroot

WORKDIR /workspace/apps/web

CMD [ "yarn", "start" ]
