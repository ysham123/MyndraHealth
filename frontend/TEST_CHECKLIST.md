# ✅ Myndra Radiology - Testing Checklist

**Date:** November 3, 2025  
**Version:** Clinical Interface v1.0

---

## 🚀 Pre-Testing Setup

### **1. Start Backend**
```bash
cd /Users/yosefshammout/Desktop/MyndraHealth/Myndra
source venv/bin/activate
./venv/bin/uvicorn backend.main:app --reload
```
✅ Verify: http://localhost:8000/docs shows API documentation

### **2. Start Frontend**
```bash
cd /Users/yosefshammout/Desktop/MyndraHealth/frontend
npm run dev
```
✅ Verify: http://localhost:3000 loads without errors

---

## 📋 Testing Checklist

### **Dashboard Page (`/`)**

- [ ] Page loads successfully
- [ ] Navbar displays correctly with logo
- [ ] "System Online" indicator shows green
- [ ] 4 stat cards display (Total Cases, Positive Findings, Normal Results, Avg Confidence)
- [ ] Mock case data appears in table (3 cases)
- [ ] Table columns: Case ID, Patient ID, Type, Diagnosis, Confidence, Agent, Date, Actions
- [ ] "View Report →" links are clickable
- [ ] "New Analysis" button navigates to /analyze
- [ ] Navigation links work (Dashboard, Analyze, System)
- [ ] Responsive design works on smaller screens

**Expected Mock Data:**
- Case 1: Pneumonia (92%)
- Case 2: Normal (8%)
- Case 3: Cardiomegaly (85%)

---

### **Analyze Page (`/analyze`)**

#### Upload Form
- [ ] Page loads successfully
- [ ] 3 analysis type buttons display (Pneumonia, Cardiomegaly, Heart Disease)
- [ ] Can select analysis type (button highlights)
- [ ] Drag-and-drop zone displays
- [ ] Can click to browse files
- [ ] File preview shows after upload
- [ ] Remove button (X) works
- [ ] "Run Analysis" button disabled when no file
- [ ] "Run Analysis" button enabled after file upload

#### File Upload
- [ ] Upload `Myndra/tests/assets/sample_cxr.jpg`
- [ ] Image preview appears
- [ ] File name and size display below image

#### Analysis Execution
- [ ] Click "Run Analysis"
- [ ] Loading spinner appears
- [ ] "Analyzing Image..." message shows
- [ ] Progress bar animates

#### Results Display (with backend)
- [ ] Result card appears after ~2 seconds
- [ ] Diagnosis badge shows (red for positive, green for normal)
- [ ] Confidence percentage displays
- [ ] Agent name shows
- [ ] Inference time displays
- [ ] Confidence bar animates to correct percentage
- [ ] "Show Heatmap" button appears
- [ ] "Show Trace" button appears (if trace available)
- [ ] Click "Show Heatmap" - heatmap image displays
- [ ] Click "Show Trace" - orchestrator steps display
- [ ] "View Full Report" button works
- [ ] "New Analysis" button resets form

#### Error Handling (backend down)
- [ ] Red error box appears
- [ ] Error message is clear
- [ ] Suggests backend is not running

---

### **Report Page (`/report/[caseId]`)**

Access via: Click "View Report →" from Dashboard

- [ ] Page loads with case ID in URL
- [ ] "Back" button works
- [ ] Case ID displays in header
- [ ] 4 summary cards show (Diagnosis, Confidence, Agent, Inference Time)
- [ ] Diagnosis badge colored correctly
- [ ] Heatmap section displays
- [ ] Heatmap image loads (or placeholder)
- [ ] Analysis Timeline section shows
- [ ] Orchestrator steps render as numbered list
- [ ] Each step shows: step type, agent, action, output
- [ ] Confidence bars display for steps
- [ ] Case Details sidebar shows all info
- [ ] System Metrics sidebar displays
- [ ] Metric rows show labels and values
- [ ] GPU utilization bar displays (if available)
- [ ] "New Analysis" button navigates to /analyze
- [ ] "Back to Dashboard" button navigates to /

**Mock Data Verification:**
- Case ID: case-demo-001
- Diagnosis: Pneumonia (92%)
- Agent: LungAgent
- 4 orchestrator steps (plan, assign, execute, adapt)

---

### **System Page (`/system`)**

- [ ] Page loads successfully
- [ ] System status badge shows (HEALTHY with green dot)
- [ ] Status updates every 5 seconds
- [ ] 4 metric cards display (Uptime, Total Cases, Avg Inference, System Load)
- [ ] Profiler Metrics section shows
- [ ] Progress bars display for each metric
- [ ] Values and units show correctly
- [ ] Performance Stats table displays
- [ ] System Health section shows 4 indicators
- [ ] All health indicators show "healthy" status
- [ ] "Refresh Metrics" button works
- [ ] "API Documentation" link opens http://localhost:8000/docs
- [ ] Mock data displays when backend unavailable

**Expected Metrics (Mock):**
- Uptime: 1d 0h
- Total Cases: 42
- Avg Inference: 1.52s
- Total Latency: 1.52s
- Planner Latency: 0.004ms
- Steps/sec: 1300
- GPU Util: 47%

---

### **Navigation & Routing**

- [ ] Click "Dashboard" in navbar → navigates to /
- [ ] Click "Analyze" in navbar → navigates to /analyze
- [ ] Click "System" in navbar → navigates to /system
- [ ] Active page highlights in navbar
- [ ] Logo click returns to dashboard
- [ ] Browser back/forward buttons work
- [ ] Direct URL access works for all pages

---

### **Responsive Design**

Test at different viewport sizes:

#### Desktop (1920x1080)
- [ ] All pages display correctly
- [ ] Grid layouts use multiple columns
- [ ] No horizontal scrolling
- [ ] Proper spacing maintained

#### Tablet (768x1024)
- [ ] Layouts adapt appropriately
- [ ] Stat cards stack properly
- [ ] Tables remain readable
- [ ] Navigation accessible

#### Mobile (375x667)
- [ ] Single column layouts
- [ ] Touch-friendly button sizes
- [ ] Hamburger menu (if implemented)
- [ ] Scrollable tables

---

### **Error Handling**

#### Backend Offline
- [ ] Dashboard shows mock cases with warning
- [ ] Analyze page shows connection error
- [ ] Report page shows mock data
- [ ] System page shows cached data with warning

#### Invalid Case ID
- [ ] Report page shows error message
- [ ] "Return to Dashboard" button available

#### Upload Invalid File
- [ ] Error message displays
- [ ] User can try again
- [ ] Form doesn't break

---

### **Performance**

- [ ] Dashboard loads in <1 second
- [ ] Page transitions feel instant
- [ ] No console errors in browser DevTools
- [ ] No TypeScript errors in terminal
- [ ] Images load smoothly
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks during navigation

---

### **Type Safety & Code Quality**

```bash
# Run these commands to verify
cd frontend

# Type checking
npm run build  # Should complete without TypeScript errors

# Linting
npm run lint   # Should pass without errors
```

- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build output shows all pages compiled

---

## 🧪 Integration Testing (Backend + Frontend)

### **Full Workflow Test**

1. **Start both servers**
   - [ ] Backend: http://localhost:8000
   - [ ] Frontend: http://localhost:3000

2. **Upload and analyze image**
   - [ ] Navigate to /analyze
   - [ ] Select "Pneumonia"
   - [ ] Upload `sample_cxr.jpg`
   - [ ] Click "Run Analysis"
   - [ ] Wait for results (~2 seconds)

3. **Verify results**
   - [ ] Diagnosis appears
   - [ ] Confidence bar shows
   - [ ] Heatmap loads
   - [ ] Trace displays orchestrator steps

4. **View full report**
   - [ ] Click "View Full Report"
   - [ ] Report page loads with all data
   - [ ] Heatmap displays
   - [ ] Timeline shows all steps
   - [ ] Metrics are populated

5. **Check dashboard**
   - [ ] Navigate to Dashboard
   - [ ] New case appears in table
   - [ ] Click "View Report →"
   - [ ] Correct report loads

6. **Monitor system**
   - [ ] Navigate to /system
   - [ ] Metrics show real data
   - [ ] Values are reasonable
   - [ ] Status is "healthy"

---

## 📊 Expected API Responses

### **Analyze Image**
```json
{
  "case_id": "uuid-string",
  "diagnosis": "Pneumonia",
  "probability": 0.92,
  "agent": "LungAgent",
  "inference_time": 1.52,
  "timestamp": "2025-11-03T00:00:00Z",
  "artifacts": {
    "heatmap_png": "data:image/png;base64,..."
  },
  "trace": [
    {
      "step": "plan",
      "action": "Decompose chest X-ray analysis",
      "confidence": 0.95
    },
    {
      "step": "assign",
      "agent": "LungAgent",
      "action": "Assigned pneumonia detection",
      "confidence": 0.98
    }
  ]
}
```

---

## ✅ Sign-Off Checklist

### **Functionality**
- [ ] All 4 pages work
- [ ] Navigation functions correctly
- [ ] File upload works
- [ ] Results display properly
- [ ] Mock data displays when backend down
- [ ] Real data displays when backend up

### **Design**
- [ ] Clinical aesthetic maintained
- [ ] Colors are appropriate
- [ ] Typography is readable
- [ ] Spacing is consistent
- [ ] Icons display correctly

### **Performance**
- [ ] Page loads are fast
- [ ] No lag during interactions
- [ ] Smooth animations
- [ ] No memory leaks

### **Code Quality**
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Clean code structure
- [ ] Well documented

### **Documentation**
- [ ] README is accurate
- [ ] Test checklist complete
- [ ] API contracts documented
- [ ] Known issues listed

---

## 🐛 Known Issues

### **Backend Endpoints Missing**
- `/cases` - Returns case history (using mock data)
- `/report/{case_id}` - Returns detailed report (using mock data)
- `/system/status` - Returns system metrics (using mock data)
- `/analyze_heart` - Heart disease analysis (not yet implemented)

**Status:** Frontend handles gracefully with mock fallbacks

### **Features Not Yet Implemented**
- [ ] Patient ID input field
- [ ] Case filtering/search
- [ ] Export to PDF
- [ ] Print functionality
- [ ] User authentication
- [ ] Database persistence

---

## 📝 Test Results

**Tester Name:** _________________  
**Date:** _________________  
**Environment:** Local Development  

**Overall Status:** 
- [ ] ✅ Pass
- [ ] ⚠️ Pass with minor issues
- [ ] ❌ Fail

**Comments:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

## 🎯 Production Readiness

### **Ready for:**
- [ ] Local development
- [ ] Demo to stakeholders
- [ ] User acceptance testing
- [ ] Clinical trial deployment

### **Not yet ready for:**
- [ ] Production hospital deployment (needs authentication, HIPAA compliance)
- [ ] Multi-user concurrent access (needs database)
- [ ] Real patient data (needs security audit)

---

**Next Steps:**
1. Complete this checklist
2. Document any issues found
3. Fix critical bugs
4. Re-test
5. Deploy to staging environment

---

**Testing Tools:**
- Browser: Chrome DevTools
- Network: Check API calls in Network tab
- Console: Check for errors
- React DevTools: Check component state
- Lighthouse: Performance audit

**Test Image Location:**
`/Users/yosefshammout/Desktop/MyndraHealth/Myndra/tests/assets/sample_cxr.jpg`
