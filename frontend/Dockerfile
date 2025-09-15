FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Servir la aplicación
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos configuraciones de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
