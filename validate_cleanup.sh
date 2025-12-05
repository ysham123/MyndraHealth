#!/bin/bash
# Comprehensive validation script for MyndraHealth cleanup

echo "🧪 MyndraHealth Cleanup Validation"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED=0
FAILED=0

# Helper function
check_test() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $1"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $1"
        ((FAILED++))
    fi
}

# Test 1: Check Python environment
echo "📦 Testing Python Environment..."
cd Myndra
./venv/bin/python --version > /dev/null 2>&1
check_test "Python venv exists and is accessible"

# Test 2: Import radiology modules
echo ""
echo "🫁 Testing Radiology Module Imports..."
./venv/bin/python -c "from domains.radiology_pneumonia.pipeline import predict" 2>/dev/null
check_test "Pneumonia pipeline import"

./venv/bin/python -c "from domains.radiology_cardiomegaly.pipeline import predict" 2>/dev/null
check_test "Cardiomegaly pipeline import"

./venv/bin/python -c "from domains.radiology_common.preprocessing import load_cxr" 2>/dev/null
check_test "Preprocessing utilities import"

./venv/bin/python -c "from domains.radiology_common.heatmap import simple_saliency" 2>/dev/null
check_test "Heatmap generation import"

./venv/bin/python -c "from domains.radiology_common.model_loader import load_radiology_model" 2>/dev/null
check_test "Unified model loader import"

# Test 3: Test agent registry
echo ""
echo "🤖 Testing Agent Registry..."
./venv/bin/python -c "from agents.agent_registry import get_agent; from memory.memory_module import SharedMemory; mem = SharedMemory(); get_agent('analyst', mem)" 2>/dev/null
check_test "Agent creation (analyst)"

./venv/bin/python -c "from agents.agent_registry import get_agent; from memory.memory_module import SharedMemory; mem = SharedMemory(); get_agent('DataAgent', mem)" 2>/dev/null
check_test "Agent creation (DataAgent)"

./venv/bin/python -c "from agents.agent_registry import get_agent; from memory.memory_module import SharedMemory; mem = SharedMemory(); get_agent('general', mem)" 2>/dev/null
check_test "Agent creation with alias (general)"

# Test 4: Test backend API imports
echo ""
echo "🌐 Testing Backend API..."
./venv/bin/python -c "from backend.main import app; assert app.title == 'Myndra Radiology API'" 2>/dev/null
check_test "FastAPI app initialization"

./venv/bin/python -c "from backend.schemas.responses import RadiologyReport" 2>/dev/null
check_test "Response schema import"

./venv/bin/python -c "from backend.services.myndra_runner import run_pneumonia, run_cardiomegaly, run_dual" 2>/dev/null
check_test "Service layer import"

# Test 5: Check test files exist and are not empty
echo ""
echo "🧪 Testing Test Files..."
if [ -s "test_pipeline.py" ]; then
    echo -e "${GREEN}✅ PASS${NC}: test_pipeline.py exists and is not empty"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: test_pipeline.py is missing or empty"
    ((FAILED++))
fi

if [ -s "tests/test_radiology_pipeline.py" ]; then
    echo -e "${GREEN}✅ PASS${NC}: tests/test_radiology_pipeline.py exists"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: tests/test_radiology_pipeline.py is missing"
    ((FAILED++))
fi

# Test 6: Check test image exists
echo ""
echo "🖼️  Testing Assets..."
if [ -f "tests/assets/sample_cxr.jpg" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Sample X-ray image exists"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Sample X-ray image missing"
    ((FAILED++))
fi

# Test 7: Check documentation consolidation
echo ""
echo "📚 Testing Documentation..."
cd ..
if [ ! -f "CLINICAL_FRONTEND_COMPLETE.md" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Redundant docs removed (CLINICAL_FRONTEND_COMPLETE.md)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Redundant doc still exists"
    ((FAILED++))
fi

if [ -f "CLEANUP_SUMMARY.md" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Cleanup summary document created"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARN${NC}: Cleanup summary not found"
fi

if [ -f "README.md" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Main README exists"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Main README missing"
    ((FAILED++))
fi

# Test 8: Frontend structure
echo ""
echo "⚛️  Testing Frontend..."
cd frontend
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Frontend package.json exists"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Frontend package.json missing"
    ((FAILED++))
fi

if [ -f "app/page.tsx" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Frontend main page exists"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Frontend main page missing"
    ((FAILED++))
fi

if [ -f "lib/api.ts" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Frontend API layer exists"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC}: Frontend API layer missing"
    ((FAILED++))
fi

# Summary
echo ""
echo "===================================="
echo "📊 Validation Summary"
echo "===================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! System is clean and ready.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review.${NC}"
    exit 1
fi
