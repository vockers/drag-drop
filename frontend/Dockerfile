FROM node:21-alpine

WORKDIR /app

COPY . .

EXPOSE 8080

RUN npm install
RUN npm run build

CMD ["npm", "run", "preview"]