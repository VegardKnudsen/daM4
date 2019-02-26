FROM node:8.6-alpine
 
RUN mkdir -p /restAPI
WORKDIR /restAPI
 
COPY package.json ./
RUN npm install
RUN npm install sqlite3
RUN npm install express
RUN npm install js2xmlparser
RUN npm install body-parser
 
COPY app.js books.db ./

EXPOSE 3000
CMD ["npm", "start"]

