FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production --no-audit --no-fund

# Copy application code
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
