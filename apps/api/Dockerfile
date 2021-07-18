FROM node:16-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3000

WORKDIR /workspace

COPY yarn.lock package.json ./
COPY apps/api/package.json apps/api/
COPY libs/ libs/

RUN yarn workspace @nvd.codes/api install --frozen-lock-file

COPY apps/api apps/api

EXPOSE ${PORT}

CMD [ "node", "/workspace/apps/api/.dist/index.js" ]
