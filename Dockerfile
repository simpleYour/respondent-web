FROM node:lts-alpine3.13
MAINTAINER xiaoguan<1617011098@qq.com>
ENV NODE_ENV=production
ENV HOST 0.0.0.0
RUN mkdir -p /app
COPY . /app
WORKDIR /app
EXPOSE 3000
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
RUN npm run build
CMD ["npm", "start"]


