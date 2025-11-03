# 🚀 Getting Started with Myndra Health

**Quick guide to get the system running in under 2 minutes.**

---

## ⚡ Fastest Way (One Command)

```bash
cd /Users/yosefshammout/Desktop/MyndraHealth
./START_SYSTEM.sh
```

**Done!** System will start automatically. Visit http://localhost:3000

---

## 📋 Prerequisites

### Required Software

- ✅ **Python 3.13** — Backend runtime
- ✅ **Node.js 18+** — Frontend runtime  
- ✅ **npm** — Package manager

### Check Your Setup

```bash
python3 --version  # Should show 3.13.x
node --version     # Should show v18.x or higher
npm --version      # Should show 8.x or higher
```

---

## 🛠️ First-Time Setup

### 1. Backend Setup

```bash
cd Myndra

# Create virtual environment (if not exists)
python3 -m venv venv

# Activate environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Test installation
pytest tests/test_radiology_pipeline.py -v
```

**Expected:** Tests should pass in ~3 seconds

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Test build
npm run build
```

**Expected:** Build should complete without errors

---

## ▶️ Starting the System

### Method 1: One-Command Startup (Recommended)

```bash
./START_SYSTEM.sh
```

This script automatically:
- Starts backend on port 8000
- Starts frontend on port 3000
- Shows all access URLs
- Handles shutdown gracefully

**To stop:** Press `Ctrl+C`

---

### Method 2: Manual Startup (Two Terminals)

**Terminal 1 — Backend:**
```bash
cd Myndra
source venv/bin/activate
./venv/bin/uvicorn backend.main:app --reload
```

Wait for:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Wait for:
```
✓ Ready in 1145ms
- Local: http://localhost:3000
```

---

## 🌐 Access the Application

Once both servers are running:

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | http://localhost:3000 | View case history |
| **Analyze** | http://localhost:3000/analyze | Upload & analyze images |
| **Report** | http://localhost:3000/report/[id] | Detailed case reports |
| **System** | http://localhost:3000/system | Performance monitoring |
| **API Docs** | http://localhost:8000/docs | Backend API documentation |

---

## 🧪 Your First Analysis

### Step-by-Step Tutorial

**1. Open the Analyze page**
```
http://localhost:3000/analyze
```

**2. Select Analysis Type**
- Click "Pneumonia" (or Cardiomegaly, or Heart Disease)

**3. Upload an Image**
- **Option A:** Drag and drop `Myndra/tests/assets/sample_cxr.jpg`
- **Option B:** Click to browse and select the file

**4. Run Analysis**
- Click the blue "Run Analysis" button
- Wait ~2 seconds for results

**5. View Results**
- Diagnosis appears with confidence percentage
- Click "Show Heatmap" to see saliency map
- Click "Show Trace" to see orchestrator steps
- Click "View Full Report" for detailed analysis

**6. Review on Dashboard**
- Navigate to Dashboard
- Your case appears in the table
- Click "View Report →" to see full details

---

## 🎯 Common Tasks

### View All Cases

```
http://localhost:3000
```

The dashboard shows:
- Total cases analyzed
- Positive vs. normal findings
- Average confidence scores
- Searchable case table

### Analyze New Image

```
http://localhost:3000/analyze
```

Supported formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- Max size: 10MB

### Check System Health

```
http://localhost:3000/system
```

Monitors:
- System uptime
- Analysis throughput
- GPU utilization
- Inference latency
- Memory usage

### Access API Documentation

```
http://localhost:8000/docs
```

Interactive API docs with:
- All available endpoints
- Request/response schemas
- Try-it-out functionality

---

## 🔍 Troubleshooting

### Backend Won't Start

**Problem:** `Port 8000 already in use`
```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9

# Try again
cd Myndra && ./venv/bin/uvicorn backend.main:app --reload
```

**Problem:** `Module not found`
```bash
cd Myndra
source venv/bin/activate
pip install -r requirements.txt
```

---

### Frontend Won't Start

**Problem:** `Port 3000 already in use`
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Try again
cd frontend && npm run dev
```

**Problem:** `Module not found`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### Can't Connect to Backend

**Problem:** Frontend shows "Backend not available"

**Solution 1:** Check backend is running
```bash
curl http://localhost:8000/health
```

**Solution 2:** Verify environment variable
```bash
cat frontend/.env.local
# Should show: NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Solution 3:** Restart both servers
```bash
# Stop everything
pkill -f uvicorn
pkill -f "next dev"

# Start fresh
./START_SYSTEM.sh
```

---

### Analysis Fails

**Problem:** "Analysis failed" error

**Check 1:** Is image valid?
- Format: JPEG or PNG
- Size: Under 10MB
- Not corrupted

**Check 2:** Is backend running?
```bash
curl -X POST http://localhost:8000/analyze_pneumonia \
  -F "file=@Myndra/tests/assets/sample_cxr.jpg"
```

**Check 3:** Check backend logs
- Look in terminal running backend
- Search for error messages

---

## 📊 System Status Check

### Quick Health Check

Run this to verify everything is working:

```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000

# Test analysis
cd Myndra
./venv/bin/python3 scripts/analyze_image.py \
  --image tests/assets/sample_cxr.jpg \
  --task pneumonia
```

**Expected outputs:**
- Backend: `{"status": "healthy"}`
- Frontend: HTML page loads
- Analysis: JSON with diagnosis

---

## 🎓 Learning Resources

### Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Project overview |
| `GETTING_STARTED.md` | This guide |
| `PROJECT_COMPLETE.md` | Full system documentation |
| `CLINICAL_FRONTEND_COMPLETE.md` | Frontend architecture |
| `TEST_CHECKLIST.md` | Testing procedures |
| `Myndra/RADIOLOGY_STACK_README.md` | Backend API details |

### Video Tutorials

*(Coming soon)*

### Example Workflows

**Workflow 1: Quick Screening**
1. Upload image → 2. Get diagnosis → 3. Review confidence

**Workflow 2: Detailed Review**  
1. Upload image → 2. View heatmap → 3. Check trace → 4. Export report

**Workflow 3: Batch Processing**
1. Use CLI tool → 2. Analyze multiple images → 3. Review dashboard

---

## 💡 Pro Tips

### Speed Up Development

```bash
# Keep both terminals open and running
# Frontend auto-reloads on code changes
# Backend auto-reloads with --reload flag
```

### Use Sample Data

```bash
# Backend provides mock data when endpoints aren't implemented
# Frontend gracefully falls back to mock cases
# Perfect for frontend development without backend
```

### Monitor Performance

```bash
# Watch system metrics in real-time
open http://localhost:3000/system

# Check API performance
open http://localhost:8000/docs
```

### Debug Issues

```bash
# Backend logs
tail -f Myndra/logs/app.log

# Browser DevTools
# Open: http://localhost:3000
# Press F12 → Console tab
```

---

## 🔄 Updating the System

### Pull Latest Changes

```bash
git pull origin main
```

### Update Backend Dependencies

```bash
cd Myndra
source venv/bin/activate
pip install -r requirements.txt --upgrade
```

### Update Frontend Dependencies

```bash
cd frontend
npm install
```

### Rebuild Frontend

```bash
cd frontend
npm run build
```

---

## 🎯 Next Steps

### After Getting Started

1. ✅ **Complete the tutorial** — Analyze your first image
2. ✅ **Review documentation** — Read PROJECT_COMPLETE.md
3. ✅ **Test all features** — Use TEST_CHECKLIST.md
4. ✅ **Customize settings** — Edit .env files
5. ✅ **Explore API** — Visit /docs endpoint

### For Developers

1. 📖 Read architecture documentation
2. 🧪 Run test suite
3. 🔧 Set up development environment
4. 📝 Review code structure
5. 🚀 Start contributing

### For Clinical Users

1. 🩻 Upload test images
2. 📊 Review analysis results
3. 🔍 Examine heatmaps
4. 📈 Monitor system performance
5. 📝 Provide feedback

---

## ✅ Success Checklist

After following this guide, you should have:

- [x] Both servers running (backend + frontend)
- [x] Dashboard loading at http://localhost:3000
- [x] Analyzed at least one image
- [x] Viewed a detailed report
- [x] Checked system metrics
- [x] Accessed API documentation

---

## 🆘 Still Having Issues?

### Get Help

1. **Check documentation** in `/docs` folder
2. **Review troubleshooting** section above
3. **Check logs** for error messages
4. **Verify prerequisites** are installed
5. **Contact support** via GitHub Issues

### Common Solutions

**95% of issues are solved by:**
1. Restarting both servers
2. Reinstalling dependencies
3. Checking environment variables
4. Verifying file paths

---

## 🎉 You're All Set!

Your Myndra Health system is now running. Start analyzing medical images with AI!

**Quick Links:**
- 🌐 Dashboard: http://localhost:3000
- 🩻 Analyze: http://localhost:3000/analyze
- 📊 System: http://localhost:3000/system
- 📚 API Docs: http://localhost:8000/docs

---

**Built with ❤️ at Wayne State University**

*For questions or feedback, see README.md*
