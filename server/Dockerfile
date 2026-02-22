FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx tsc
ENV PORT=4020
EXPOSE 4020
CMD ["node", "dist/index.js"]
