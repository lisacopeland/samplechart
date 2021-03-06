### STAGE 1: Build ###

# We label our stage as 'builder'
## FROM node:8-alpine as builder

## COPY package.json .

## RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
## RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

## WORKDIR /ng-app

## COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
## RUN $(npm bin)/ng build --prod --build-optimizer


### STAGE 2: Setup ###

## FROM nginx:1.13.3-alpine

# RUN mkdir /etc && mkdir /etc/nginx

## Copy our default nginx config
## COPY nginx/default.conf /etc/nginx/conf

## Remove default nginx website
## RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
## COPY --from=builder /ng-app/dist /usr/share/nginx/html

## CMD ["nginx", "-g", "daemon off;"]

FROM node:10 AS builder

WORKDIR /app
COPY . .

RUN ls -la
RUN npm install
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
