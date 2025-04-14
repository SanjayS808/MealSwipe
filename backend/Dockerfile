# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.19.1
FROM node:${NODE_VERSION}-alpine

# Set working directory
WORKDIR /usr/src/app

# Declare build args for environment variables
ARG NODE_ENV=development
ARG DB_PASSWORD_DEV
ARG DB_PASSWORD_PROD
ARG DB_USER_DEV
ARG DB_USER_PROD
ARG DB_URL_PATH

# Set environment variables for runtime
ENV NODE_ENV=${NODE_ENV}
ENV DB_PASSWORD_DEV=${DB_PASSWORD_DEV}
ENV DB_PASSWORD_PROD=${DB_PASSWORD_PROD}
ENV DB_USER_DEV=${DB_USER_DEV}
ENV DB_USER_PROD=${DB_USER_PROD}
ENV DB_URL_PATH=${DB_URL_PATH}

# Copy package files
COPY package*.json ./

# Install dependencies (choose ONE approach)
RUN npm ci --only=production

# For development environments, install nodemon
RUN if [ "$NODE_ENV" = "development" ]; then npm install -g nodemon; fi

# Copy application code
COPY . .

# Expose the port
EXPOSE 5001

# Run the application
CMD if [ "$NODE_ENV" = "development" ]; then nodemon index.js; else npm start; fi