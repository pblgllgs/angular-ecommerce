FROM node:16.13.0 AS builder
RUN mkdir -p /app
WORKDIR /app
COPY  package.json /app
RUN npm install --legacy-peer-deps
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:latest AS prod-stage
COPY --from=builder /app/dist/angular-ecommerce /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]