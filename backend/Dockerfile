FROM node:20 AS build

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++

COPY package.json package-lock.json ./

RUN npm install

COPY . .

FROM node:20-slim AS final

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app .

RUN mkdir -p /app/data

RUN chmod 777 /app/data

USER node

ENV DB_FILE_PATH="/app/data/blog.sqlite"

EXPOSE 3003

ENV NODE_ENV=production

CMD [ "node", "server.js" ]