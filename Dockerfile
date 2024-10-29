# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Copy .env file
COPY .env ./

# Install all dependencies, including dev dependencies.
RUN npm install --build-from-source

# Copy local code to the container image.
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Keep dev dependencies for running scripts
# RUN npm prune --production  # Commented out to keep dev dependencies

# Run the web service on container startup.
CMD [ "node", "dist/server.js" ] 