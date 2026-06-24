# ---- Build stage ----
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# build Vite app
RUN npm run build


# ---- Production stage ----
FROM nginx:alpine

# remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# optional: custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]