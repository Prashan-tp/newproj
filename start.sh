#!/bin/bash

echo "🚀 Mini Support Desk - Quick Start"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend
npm install
echo ""

echo "🌱 Seeding database with sample data..."
npm run seed
echo ""

echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend
npm install
echo ""

echo "🚀 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=================================="
echo "✨ Application is starting!"
echo "=================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo "API Docs: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
