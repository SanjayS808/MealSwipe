# Step 1: Use an official Node.js image
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

RUN npm install react@18 react-dom@18
RUN npm install react-scripts@5.0.1

COPY . .

RUN npm run build --verbose

# Production image
FROM node:18-slim AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=build /app/build /app/build

EXPOSE 3000 80

# Set environment variables for production or development
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

CMD if [ "$NODE_ENV" = "production" ]; then \
        npm run start:prod; \
    else \
        npm start; \
    fi

