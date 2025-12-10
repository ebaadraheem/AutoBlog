FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
ARG VITE_BACKEND_URL

RUN VITE_BACKEND_URL=${VITE_BACKEND_URL} npm run build

FROM nginx:alpine AS final

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]