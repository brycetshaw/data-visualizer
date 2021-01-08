FROM node:12-alpine

# Create app directory
WORKDIR /server

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Bundle app source
COPY . /server
RUN npm run build

# Exports
EXPOSE 4000

ENV NODE_ENV=production

CMD [ "npm", "run", "prod"]