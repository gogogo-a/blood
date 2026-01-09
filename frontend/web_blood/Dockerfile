# 构建阶段
FROM node:18.20.8-slim AS builder

WORKDIR /app

# 复制项目文件
COPY . .

# 清理现有的依赖文件
RUN rm -rf node_modules package-lock.json yarn.lock

# 安装依赖
RUN yarn install

# 构建项目
RUN yarn build

# 生产阶段
FROM nginx:alpine

# 将构建阶段生成的 dist 文件夹复制到 Nginx 的静态文件目录
COPY --from=builder /app/../backend/static /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80