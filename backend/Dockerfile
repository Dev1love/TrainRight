# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:16

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Set development environment variables
ENV NODE_ENV=development

# Expose the port
EXPOSE 3000

# Use nodemon for auto-reloading
CMD ["npx", "ts-node", "src/scripts/start.ts"] 