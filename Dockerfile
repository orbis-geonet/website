# Use a specific version of Node.js for consistency
FROM node:18.16.1-alpine

# Set the working directory inside the container
WORKDIR /usr/app

# Copy only package.json and package-lock.json first
# This allows Docker to cache npm install step unless these files change
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"]
