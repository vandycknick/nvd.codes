FROM node:16.5.0-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3000

RUN addgroup --gid 10001 --system nonroot \
    && adduser  --uid 10000 --system --ingroup nonroot --home /home/nonroot nonroot

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--", "node"]

WORKDIR /workspace

COPY yarn.lock package.json ./
COPY apps/images/package.json apps/images/
COPY libs/ libs/

RUN yarn workspace @nvd.codes/images install --frozen-lock-file

COPY apps/images apps/images

EXPOSE ${PORT}

USER nonroot

CMD [ "/workspace/apps/images/.dist/index.js" ]
