#!/bin/bash

# Build Docker images for language environments
docker build -f backend/Dockerfile.python -t coding-playground-python .
docker build -f backend/Dockerfile.javascript -t coding-playground-javascript .
docker build -f backend/Dockerfile.cpp -t coding-playground-cpp .
docker build -f backend/Dockerfile.java -t coding-playground-java .

# Build and start services
docker-compose up --build -d

echo "Coding Playground is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"