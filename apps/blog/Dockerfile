FROM node:16-alpine AS builder

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /build

RUN apk add python2 build-base curl

ADD apps/blog/scripts /scripts

RUN /scripts/setup-instant-client.sh

COPY yarn.lock package.json ./
COPY apps/blog/package.json apps/blog/
COPY libs/ libs/

RUN yarn workspace @nvd.codes/blog install --frozen-lock-file

FROM node:16.5.0-alpine as base

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3000

RUN addgroup --gid 10001 --system nonroot \
    && adduser  --uid 10000 --system --ingroup nonroot --home /home/nonroot nonroot

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--", "node", "--experimental-specifier-resolution=node"]

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_19_10:/opt/oracle/instantclient_19_11

RUN apk add --no-cache libaio libnsl libc6-compat musl-dev git && \
    # Patching some stuff up like a true hacker
    ln -s /lib64/* /lib && \
    ln -s libnsl.so.2 /usr/lib/libnsl.so.1 && \
    ln -s libc.so /usr/lib/libresolv.so.2

WORKDIR /workspace

COPY --from=builder /opt/oracle /opt/oracle
COPY --from=builder /build .

COPY apps/blog apps/blog

EXPOSE ${PORT}

USER nonroot

CMD [ "/workspace/apps/blog/.dist/index.js" ]
