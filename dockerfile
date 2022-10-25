from node:16

WORKDIR /usr/src/microservice1

COPY package*.json ./

RUN npm install

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]