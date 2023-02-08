# Node version: 16.18.0
# Alpine version: 3.16

# From the official Node image, we will use the Alpine version
# Alpine is a lightweight Linux distribution
FROM node:16.18.0-alpine3.16

# Working directory
WORKDIR /user/src/app
 
# Copy the files from the host to the container
COPY . .
 
# Install the dependencies
RUN npm ci 
 
# Build the application
RUN npm run build
 
# Expose the port
EXPOSE 3000

# Run the application as a non-root user
USER node
 
# Run the application in production mode
CMD ["npm", "run", "start:prod"]