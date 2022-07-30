FROM node:10 As builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM node:10-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN npm install
COPY ./ ./
RUN npm run build
# RUN npm run start:prod
CMD ["npm", "run", "start:prod"]