FROM node:16.13.0 AS builder
WORKDIR /usr/src/app
COPY . ./
RUN npm install --legacy-peer-deps
RUN npm install
RUN npm run ng build



FROM nginx:1.15.2-alpine
COPY --from=builder /usr/src/app/dist/angular-ecommerce /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
ENTRYPOINT ["nginx","-g","daemon off;"]