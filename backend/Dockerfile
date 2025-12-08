# --- Stage 1: Build Stage (Includes build tools for native modules like sqlite3) ---
FROM node:20 AS build

WORKDIR /usr/src/app

# Install build dependencies for sqlite3 (commonly required for node-gyp)
# This includes Python, make, and g++
RUN apt-get update && apt-get install -y python3 make g++

COPY ./backend/package.json ./backend/package-lock.json ./
# Install ALL dependencies inside the container, compiling native modules correctly.
# The `node:20` base image has the necessary build tools installed above.
RUN npm install

# Copy application source code
COPY ./backend/ .
# Also copy the database file path logic from db.js
# This part is crucial as the blog.sqlite file is mounted to /usr/src/app/blog.sqlite
# from the volume as defined in docker-compose.yaml.

# --- Stage 2: Production Stage (Minimal image for deployment) ---
FROM node:20-slim AS final

WORKDIR /usr/src/app

# Copy only production dependencies and runtime files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app .

# Set the environment variable for the database file path
ENV DB_FILE_PATH="/usr/src/app/blog.sqlite"

# Expose the application port
EXPOSE 3003

ENV NODE_ENV=production

CMD [ "node", "server.js" ]