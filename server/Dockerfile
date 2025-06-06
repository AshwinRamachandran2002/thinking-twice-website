FROM node:18-alpine

WORKDIR /app

# Install flyctl CLI
RUN apk add --no-cache curl && \
    curl -L https://fly.io/install.sh | sh && \
    mv /root/.fly/bin/flyctl /usr/local/bin/

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]