FROM node:20-slim AS backend

WORKDIR /usr/src/app

COPY ./backend/package.json ./backend/package-lock.json ./

RUN npm install --only=production

COPY ./backend/ .

ENV DB_FILE_PATH="/usr/src/app/blog.sqlite"

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "server.js" ]