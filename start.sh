#!/bin/bash

# Quick-launch script for Super Extractor
# This script starts both the frontend (Next.js) and backend (FastAPI) services

echo "Starting Super Extractor..."

# Start backend in background
echo "Starting backend on port 8111..."
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8111 &
BACKEND_PID=$!

# Start frontend in background
echo "Starting frontend on port 1234..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Services started!"
echo "Frontend: http://localhost:1234"
echo "Backend API: http://localhost:8111"
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait