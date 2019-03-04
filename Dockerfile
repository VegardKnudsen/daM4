FROM node:8.6-alpine
 
RUN mkdir -p /restAPI
WORKDIR /restAPI
 
COPY package.json ./
RUN npm install
RUN npm install sqlite3 express js2xmlparser body-parser

COPY app.js books.db ./

EXPOSE 3000
CMD ["npm", "start"]

