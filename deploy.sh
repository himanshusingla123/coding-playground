#!/bin/bash
set -e  # Exit on error

echo "🚀 Deploying Coding Playground..."

# Function to build image with retry
build_image() {
    local dockerfile=$1
    local tag=$2
    local context=$3
    
    echo "Building $tag..."
    if ! docker build -f "$dockerfile" -t "$tag" "$context"; then
        echo "❌ Failed to build $tag"
        return 1
    fi
    echo "✅ Successfully built $tag"
    return 0
}

# Build language images
build_image "backend/Dockerfile.python" "coding-playground-python" "backend/" || exit 1
build_image "backend/Dockerfile.javascript" "coding-playground-javascript" "backend/" || exit 1
build_image "backend/Dockerfile.cpp" "coding-playground-cpp" "backend/" || exit 1
build_image "backend/Dockerfile.java" "coding-playground-java" "backend/" || exit 1

# Stop existing containers
docker-compose down

# Start services
docker-compose up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment complete!"
    echo "🌐 Access your app at: http://$(curl -s ifconfig.me)"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
