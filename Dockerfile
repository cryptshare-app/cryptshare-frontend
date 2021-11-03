# Node.js Image
FROM node:12.3.1-stretch as build-stage

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y git 
# install simple http server for serving static content
RUN npm install -g http-server

# Set the working directory to app path
WORKDIR /app

RUN apt-get autoremove -y \
    && apt-get autoclean -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*


# copy package json and install all dependencies
COPY package*.json ./
RUN npm install

# copy app into app path
COPY . .
# Run npm run serve -> calls vue-cli-service build and starts server.
RUN npm rebuild node-sass && npm run build

EXPOSE 8080
CMD [ "http-server", "dist"]