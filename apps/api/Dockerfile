# Use the official Go base image
FROM golang:1.20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Go application source code into the container
COPY . .

# Build the Go application
RUN go build -o /supernova

# Expose the port that the Go application will listen on
EXPOSE 3001

# Define the command to run your Go application
CMD ["/supernova"]
