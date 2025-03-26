FROM node:lts-alpine

# Create app directory
WORKDIR /var/app

# Install app dependencies
COPY ./package*.json ./

RUN npm install

# Bundle app source
COPY . .

CMD ["npm", "run", "dev"]