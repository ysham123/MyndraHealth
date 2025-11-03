# 🚀 Myndra Health — Quick Start

**Complete system up and running in 60 seconds!**

---

## ⚡ Fast Track (2 Terminals)

### **Terminal 1: Start Backend**
```bash
cd /Users/yosefshammout/Desktop/MyndraHealth/Myndra
source venv/bin/activate
./venv/bin/uvicorn backend.main:app --reload
```
✅ Backend running on **http://localhost:8000**

### **Terminal 2: Start Frontend**
```bash
cd /Users/yosefshammout/Desktop/MyndraHealth/frontend
npm run dev
```
✅ Frontend running on **http://localhost:3000**

---

## 🧪 Test It Now

### **Option 1: Radiology Analysis**
1. Open http://localhost:3000
2. Upload: `Myndra/tests/assets/sample_cxr.jpg`
3. Click "Run Analysis"
4. View results + heatmaps

### **Option 2: MARL Experiment**
1. Click "MARL Experiments" tab
2. Keep default settings
3. Click "Run MARL Experiment"
4. Wait ~30 seconds for results

---

## 📍 Key URLs

- **Frontend Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **GitHub:** https://github.com/ysham123/MyndraHealth

---

## 📚 Full Documentation

- **Backend:** `Myndra/RADIOLOGY_STACK_README.md`
- **Frontend:** `frontend/README.md`
- **Complete System:** `PROJECT_COMPLETE.md`
- **Setup Details:** `SETUP_COMPLETE.md`

---

## 🔧 One-Line Commands

### CLI Radiology Analysis
```bash
cd Myndra && ./venv/bin/python3 scripts/analyze_image.py --image tests/assets/sample_cxr.jpg --task dual
```

### Run Backend Tests
```bash
cd Myndra && ./venv/bin/pytest tests/test_radiology_pipeline.py -v
```

### Build Frontend for Production
```bash
cd frontend && npm run build && npm start
```

---

## 🎯 What Works Right Now

✅ **Radiology:** Pneumonia + Cardiomegaly detection with heatmaps  
✅ **MARL:** Multi-agent RL experiments with live results  
✅ **API:** FastAPI with auto-generated docs  
✅ **UI:** Modern responsive dashboard  
✅ **Type Safety:** Full TypeScript + Pydantic validation  

---

## ⚠️ Prerequisites

- Python 3.13 with venv activated
- Node.js 18+ installed
- Both terminals running simultaneously

---

**That's it! System is ready. Start building!** 🎉
