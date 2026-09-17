# Use official Node.js alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

ENV PORT=5001
ENV NODE_ENV=production

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy application source code
COPY . .

# Expose microservice port
EXPOSE 5001

# Start microservice
CMD ["npm", "start"]
