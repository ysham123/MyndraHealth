#!/bin/bash

# Myndra Health - System Startup Script
# This script starts both backend and frontend servers

echo "🏥 Starting Myndra Health System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend directory exists
if [ ! -d "Myndra" ]; then
    echo -e "${RED}❌ Error: Myndra directory not found${NC}"
    echo "Please run this script from the MyndraHealth root directory"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: frontend directory not found${NC}"
    echo "Please run this script from the MyndraHealth root directory"
    exit 1
fi

# Function to start backend
start_backend() {
    echo -e "${BLUE}🔧 Starting Backend (FastAPI)...${NC}"
    cd Myndra
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo -e "${RED}❌ Virtual environment not found${NC}"
        echo "Run: cd Myndra && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
        exit 1
    fi
    
    # Activate virtual environment and start server
    source venv/bin/activate
    ./venv/bin/uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
    echo -e "${GREEN}📡 API running at: http://localhost:8000${NC}"
    echo -e "${GREEN}📚 API docs at: http://localhost:8000/docs${NC}"
    echo ""
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}🎨 Starting Frontend (Next.js)...${NC}"
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠️  node_modules not found. Running npm install...${NC}"
        npm install
    fi
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}⚠️  Creating .env.local...${NC}"
        echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    fi
    
    # Start Next.js dev server
    npm run dev &
    FRONTEND_PID=$!
    
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo -e "${GREEN}🌐 Dashboard at: http://localhost:3000${NC}"
    echo ""
    
    cd ..
}

# Trap Ctrl+C to kill both processes
trap 'echo ""; echo -e "${YELLOW}🛑 Shutting down...${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT

# Start both servers
start_backend
sleep 3  # Give backend time to start
start_frontend

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}   🏥 Myndra Health System Running 🏥     ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📍 Access Points:${NC}"
echo -e "   🌐 Dashboard:    http://localhost:3000"
echo -e "   🩻 Analyze:      http://localhost:3000/analyze"
echo -e "   📊 System:       http://localhost:3000/system"
echo -e "   📡 Backend API:  http://localhost:8000"
echo -e "   📚 API Docs:     http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for background processes
wait
