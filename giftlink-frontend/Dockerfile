FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Use a different npm registry (if mirror available)
RUN npm config set registry https://registry.npmmirror.com

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
