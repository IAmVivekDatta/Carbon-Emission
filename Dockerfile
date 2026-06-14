# Stage 1: Build the React Frontend
FROM node:18-alpine AS client-builder
WORKDIR /app/client

# Copy and install client dependencies
COPY client/package*.json ./
RUN npm ci

# Copy client source code and build
COPY client/ ./
RUN npm run build

# Stage 2: Package the Node/Express Backend
FROM node:18-alpine AS server-runner
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Copy and install server dependencies (production only to keep image light)
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server source code
COPY server/src/ ./server/src/

# Copy compiled React build assets from Stage 1
COPY --from=client-builder /app/client/dist ./client/dist

# Expose the designated Cloud Run port
EXPOSE 8080

# Execute server entry point
CMD ["node", "server/src/index.js"]
