# ---------- Base Stage ----------
FROM node:18 AS base

WORKDIR /app

# Copy only package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# ---------- Development Stage ----------
FROM base AS dev

# Expose the development server port (e.g. Vite)
EXPOSE 5173

CMD ["npm", "run", "dev"]

# ---------- Test Stage (e.g., Lint + Unit Tests) ----------
FROM base AS test

CMD ["sh", "-c", "npm run lint"]

# ---------- Build Stage (for production builds) ----------
FROM base AS build

RUN npm run build
