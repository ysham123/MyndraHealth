# 🩻 Myndra Radiology — Clinical Interface

Clean, hospital-grade web interface for AI-powered radiology diagnostics.

**Built with:** Next.js 15 (App Router) + TypeScript + Tailwind CSS  
**Design:** Minimalist clinical UI optimized for radiologists  
**Backend:** Myndra MARL framework (multi-agent orchestration)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:8000`

### Installation & Run

```bash
cd /Users/yosefshammout/Desktop/MyndraHealth/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Main dashboard with tab navigation
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── radiology/
│   │   ├── RadiologyRunner.tsx       # Main radiology interface
│   │   ├── ResultCard.tsx            # Result display cards
│   │   └── OrchestratorTrace.tsx     # Trace & profiler UI
│   └── marl/
│       └── MarlRunner.tsx            # MARL experiments interface
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   └── api.ts                # Backend API integration
└── .env.local                # Environment configuration
```

---

## 🎨 Features

### Radiology Tab 🩻
- **File Upload:** Drag-and-drop chest X-ray images (JPEG/PNG)
- **Dual Analysis:** Simultaneous pneumonia & cardiomegaly detection
- **Result Cards:** Diagnosis, confidence bars, saliency heatmaps
- **Orchestrator Trace:** View plan → assignments → results → adaptations
- **System Metrics:** Profiler latency breakdown

### MARL Experiments Tab 📊
- **Configuration Form:** Environment, method, seeds, steps, actors
- **Live Polling:** Real-time job status updates
- **Visualizations:** Auto-display learning curves and AUC plots
- **Metrics Table:** Performance summary statistics

---

## 🔧 Configuration

### Environment Variables

Create/edit `.env.local`:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Integration

The frontend expects these FastAPI endpoints:

**Radiology:**
- `POST /analyze_pneumonia` → `RadiologyReport`
- `POST /analyze_cardiomegaly` → `RadiologyReport`
- `POST /analyze_dual` → `DualAnalysisReport`

**MARL:**
- `POST /run_marl` → `{ job_id: string }`
- `GET /results/marl/{job_id}` → `MarlSummary`

---

## 🧪 Development

### Run Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

---

## 🎯 Usage Examples

### Test Radiology Analysis

1. Start backend: `cd ../Myndra && ./venv/bin/uvicorn backend.main:app --reload`
2. Start frontend: `npm run dev`
3. Navigate to http://localhost:3000
4. Upload a chest X-ray image (use `../Myndra/tests/assets/sample_cxr.jpg`)
5. Click "Run Analysis"
6. View results with heatmaps

### Test MARL Experiments

1. Switch to "MARL Experiments" tab
2. Configure: `simple_spread_v3`, `ippo`, 3 seeds, 5000 steps
3. Click "Run MARL Experiment"
4. Wait for polling to complete (~30-60 seconds)
5. View learning curves and metrics

---

## 🏗️ Architecture

### Component Hierarchy

```
page.tsx (Dashboard)
├── RadiologyRunner
│   ├── File upload controls
│   ├── ResultCard (×2: pneumonia, cardiomegaly)
│   └── OrchestratorTrace
│       ├── Plan/Assignments/Results/Adaptations
│       └── Profiler metrics table
└── MarlRunner
    ├── Configuration form
    ├── Job status polling
    └── Results display (metrics + plots)
```

### Data Flow

1. **User uploads file** → `RadiologyRunner` state
2. **Click "Run"** → `analyzeDual()` API call
3. **Backend processes** → Returns `DualAnalysisReport`
4. **State updates** → Components re-render with results
5. **Display cards** → Show diagnosis, probability, heatmaps

---

## 🎨 Styling

### Design System

- **Palette:** White/gray clinical look with black accents
- **Typography:** System fonts, clean hierarchy
- **Spacing:** Generous whitespace (Tailwind spacing scale)
- **Components:** Rounded corners (xl), subtle shadows
- **Interactions:** Smooth transitions, hover states

### Tailwind Classes Used

- Layout: `grid`, `flex`, `space-y-*`, `gap-*`
- Colors: `bg-gray-50`, `border-gray-200`, `text-gray-700`
- Effects: `rounded-xl`, `shadow-sm`, `hover:bg-gray-100`
- Responsive: `lg:grid-cols-2`, `sm:px-6`

---

## 📊 Type Safety

All API responses are fully typed:

```typescript
// lib/types.ts
export type Diagnosis = "Pneumonia" | "Normal" | "Cardiomegaly" | ...;

export interface RadiologyReport {
  diagnosis: Diagnosis;
  probability: number;
  steps: Step[];
  artifacts?: { heatmap_png?: string; log?: string };
}
```

TypeScript ensures compile-time safety across all components.

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variable in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` = your production backend URL

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🐛 Troubleshooting

### Backend Connection Failed

```
Error: Analysis failed: Failed to fetch
```

**Fix:** Ensure backend is running:
```bash
cd ../Myndra
./venv/bin/uvicorn backend.main:app --reload
```

### CORS Issues

If running frontend and backend on different origins, add CORS middleware to FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Type Errors

```bash
npm run type-check
```

Ensure all imports in components match exported names in `lib/`.

---

## 📚 Tech Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| Next.js | 15.x | React framework with App Router |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| React | 19.x | UI library |

---

## 🎓 Research Context

**Project:** Myndra Health - Multi-Agent Clinical Intelligence System  
**Author:** Yosef Shammout (Wayne State University, CS)  
**Framework:** Myndra v2 MARL (Planner-Aware Multi-Agent RL)  
**License:** MIT

---

## ✅ Status

**Production Ready** ✅

- ✅ Radiology interface fully functional
- ✅ MARL experiments interface complete
- ✅ Backend integration tested
- ✅ Type-safe API layer
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

---

For backend documentation, see `../Myndra/RADIOLOGY_STACK_README.md`
