# Use Node.js LTS as base image
FROM node:18 AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose frontend port
EXPOSE 3000
# ---------- Development Stage ----------
FROM base AS dev

CMD ["npm", "run", "dev" ]

FROM base AS test

CMD ["sh", "-c", "npm run lint && npm run test"]

FROM base AS build

RUN npm run build
