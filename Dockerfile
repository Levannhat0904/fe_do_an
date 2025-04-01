# Use production-ready Node.js image
FROM node:18.17.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

# Create production image
FROM node:18.17.0-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN yarn install --production

EXPOSE 3000
ENV NODE_ENV=production

CMD ["yarn", "start"]

# Tạo volume ảo trên host để có thể mount dữ liệu từ trong container ra ngoài
# docker volume create --driver local \
#   --opt type=none \
#   --opt device=/mnt/nfs/vinaco/ktx-web/public \
#   --opt o=bind \
#   ktx-web-vol