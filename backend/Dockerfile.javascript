FROM node:16-alpine

WORKDIR /code

RUN npm install -g canvas

CMD ["node", "main.js"]