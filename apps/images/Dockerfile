FROM node:16-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENV PORT=3000

WORKDIR /workspace

COPY yarn.lock package.json ./
COPY apps/images/package.json apps/images/
COPY libs/ libs/

RUN yarn workspace @nvd.codes/images install --frozen-lock-file

COPY apps/images apps/images

EXPOSE ${PORT}

CMD [ "node", "/workspace/apps/images/.dist/index.js" ]
