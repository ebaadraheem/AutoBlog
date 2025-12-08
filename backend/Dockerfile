FROM node:20 AS build

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++

COPY ./backend/package.json ./backend/package-lock.json ./

RUN npm install

COPY ./backend/ .

FROM node:20-slim AS final

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app .

ENV DB_FILE_PATH="/usr/src/app/blog.sqlite"

EXPOSE 3003

ENV NODE_ENV=production

CMD [ "node", "server.js" ]
