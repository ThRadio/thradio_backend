#Build
FROM node:alpine as builder
WORKDIR /backend
COPY ./package.json ./yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

#Run    
FROM node:alpine
WORKDIR /backend
COPY --from=builder /backend ./
EXPOSE 3010
CMD ["yarn", "start:prod"]