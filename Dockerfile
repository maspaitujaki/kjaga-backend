# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:21-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json


RUN npm run build
# Run the web service on container startup.
CMD [ "node", "dist/index.js" ]