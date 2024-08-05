# Use an official Node runtime as a parent image
FROM node:17-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


# Expose port 80
EXPOSE 3000

# Start Nginx server
CMD ["npm", "start"]
