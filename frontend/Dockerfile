FROM node:21-alpine

WORKDIR /app

COPY . .

EXPOSE 8080

RUN npm install

CMD ["npm", "run", "dev"]