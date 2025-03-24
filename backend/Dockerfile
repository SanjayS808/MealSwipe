# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=18.19.1

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

ARG NODE_ENV=development
ARG DB_PASSWORD_DEV
ARG DB_PASSWORD_PROD
ARG DB_USER_DEV
ARG DB_USER_PROD
ARG DB_URL_PATH

ENV NODE_ENV=${NODE_ENV}
ENV DB_PASSWORD_DEV=${DB_PASSWORD_DEV}
ENV DB_PASSWORD_PROD=${DB_PASSWORD_PROD}
ENV DB_USER_DEV=${DB_USER_DEV}
ENV DB_USER_PROD=${DB_USER_PROD}
ENV DB_URL_PATH=${DB_URL_PATH}

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY ./package*.json .

RUN npm install --production

RUN npm install -g nodemon@dev

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 5001

# Run the application.
CMD npm start
