FROM node:8.6-alpine
 
RUN mkdir -p /restAPI
WORKDIR /restAPI
 
COPY package.json ./
RUN npm install
RUN npm install sqlite3
RUN npm install deasync
 
COPY app.js bokbase ./

EXPOSE 7777
CMD ["npm", "start"]

