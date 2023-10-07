# Build app and run unit tests
FROM node:18.12.0 AS builder

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn run build

# Serve app by Nginx
FROM nginx:1.23.2-alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]