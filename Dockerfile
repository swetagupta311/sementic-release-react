FROM node:20.14.0-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist ./

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
