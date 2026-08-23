# 🧭 Odyssey — AI-Powered Smart Travel Planner

Odyssey is a modern, high-performance travel planning application combining interactive mapping, live destination exploration, AI-generated itineraries, and personalized travel insights.

---

## 📁 Repository Structure

```text
travel-app/
├── Odyssey/
│   ├── FrontEnd/                    # React 18 + Vite Frontend Application
│   │   ├── public/                  # Static assets
│   │   ├── src/
│   │   │   ├── assets/              # Curated destination imagery
│   │   │   ├── components/          # Modular React UI Components
│   │   │   │   ├── common/          # Reusable UI widgets (ThemeToggle, Toast, MobileDeviceFrame)
│   │   │   │   ├── dashboard/       # Dashboard sections (Header, BottomNav, Explore, NearYou, etc.)
│   │   │   │   ├── map/             # Interactive Leaflet mapping with GPS beacon
│   │   │   │   ├── modals/          # Trip creation, details, and location modals
│   │   │   │   └── index.js         # Unified component export barrel
│   │   │   ├── context/             # AuthContext (Supabase) & ThemeContext (Dark/Light)
│   │   │   ├── lib/                 # Utilities (Tailwind cn class merge helper)
│   │   │   ├── pages/               # LandingPage & Dashboard views
│   │   │   ├── services/            # API, Gemini AI, Google Places, Map & Location services
│   │   │   ├── App.jsx              # Main App entry with auth routing
│   │   │   ├── index.css            # Tailwind & custom glassmorphism styles
│   │   │   └── main.jsx             # React DOM root render
│   │   ├── .env.example             # Frontend environment template
│   │   ├── package.json             # Frontend dependencies & Vite scripts
│   │   ├── tailwind.config.js       # Tailwind CSS configuration
│   │   └── vite.config.js           # Vite build configuration
│   │
│   └── BackEnd/                     # FastAPI + Python Backend Service
│       ├── app/
│       │   ├── api/                 # API endpoint routers
│       │   ├── core/                # Core configurations
│       │   ├── schemas/             # Pydantic data validation schemas
│       │   ├── services/            # Gemini AI & Itinerary generator services
│       │   └── main.py              # FastAPI application instance & health checks
│       ├── .env.example             # Backend environment template
│       ├── requirements.txt         # Python dependencies
│       └── run.py                   # Development server runner
│
├── .gitignore                       # Git ignore rules for Frontend & Backend
├── package.json                     # Root npm orchestration scripts
└── README.md                        # Project documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (3.10+ recommended for backend)

---

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd Odyssey/FrontEnd

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and insert your API keys
cp .env.example .env

# Run development server
npm run dev
```

The frontend will start at **`http://localhost:5173`**.

---

### 3. Backend Setup

```bash
# Navigate to the backend directory
cd Odyssey/BackEnd

# Create and activate a Python virtual environment (optional but recommended)
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and insert your keys
cp .env.example .env

# Start FastAPI server
python run.py
```

The backend API will run on **`http://localhost:8000`** with interactive Swagger documentation at **`http://localhost:8000/docs`**.

---

### 4. Root Convenience Commands

From the workspace root (`travel app`), you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Frontend Vite development server |
| `npm run dev:frontend` | Starts the Frontend Vite development server |
| `npm run dev:backend` | Starts the Python FastAPI backend server |
| `npm run build` | Builds the Frontend for production |
| `npm run preview` | Previews the production build locally |

---

## 🔑 Environment Variables

### Frontend (`Odyssey/FrontEnd/.env`)
- `VITE_SUPABASE_URL`: Supabase project URL for authentication.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon/public API key.
- `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:8000/api/v1`).
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps Platform key for Places, Geocoding, and Street View.
- `VITE_GEMINI_API_KEY`: *(Optional)* Direct Gemini API key for client-side AI trip suggestions.

### Backend (`Odyssey/BackEnd/.env`)
- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_KEY`: Supabase service/anon key for auth verification.
- `GEMINI_API_KEY`: Google Gemini API key for structured itinerary generation.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Leaflet / React-Leaflet, Lucide Icons, Supabase JS, Axios.
- **Backend**: FastAPI, Uvicorn, Pydantic v2, Google GenAI SDK, Supabase Python Client, Python-Dotenv.
