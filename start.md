# 🚀 Odyssey — Quick Start Guide

Welcome to **Odyssey**, an AI-powered smart travel planning application built with **React (Vite) + Tailwind CSS** on the frontend and **FastAPI + Google Gemini** on the backend.

Follow this guide to get both the frontend and backend running on your local machine in minutes.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

| Tool | Recommended Version | Download Link |
| :--- | :--- | :--- |
| **Node.js** | v18.x or higher (includes npm) | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.10 or higher (includes pip) | [python.org](https://www.python.org/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

---

## ⚡ Option 1: Quick Start from Project Root

If you want to run everything quickly using root npm orchestration scripts:

### 1. Configure Environment Files

#### Frontend (`Odyssey/FrontEnd/.env`)
Copy the template and configure your keys:
```bash
# Windows PowerShell / Bash
cp Odyssey/FrontEnd/.env.example Odyssey/FrontEnd/.env
```

#### Backend (`Odyssey/BackEnd/.env`)
Copy the template and configure your keys:
```bash
# Windows PowerShell / Bash
cp Odyssey/BackEnd/.env.example Odyssey/BackEnd/.env
```

*(See [Environment Variables Reference](#-environment-variables-reference) below for key details).*

### 2. Install & Start

#### Run Backend:
```bash
# Install backend packages and run
pip install -r Odyssey/BackEnd/requirements.txt
npm run dev:backend
```
> Backend runs at: **`http://localhost:8000`** | Swagger Docs: **`http://localhost:8000/docs`**

#### Run Frontend (in a separate terminal):
```bash
# Install frontend packages and run
npm --prefix Odyssey/FrontEnd install
npm run dev:frontend
```
> Frontend runs at: **`http://localhost:5173`**

---

## 🛠️ Option 2: Step-by-Step Manual Setup

### 1️⃣ Backend Setup (FastAPI + Python)

1. **Navigate to the backend folder**:
   ```bash
   cd Odyssey/BackEnd
   ```

2. **Create and activate a Python virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
     *(If script execution is restricted on Windows PowerShell, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*
   - **macOS / Linux**:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup `.env` configuration**:
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys in `Odyssey/BackEnd/.env`:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_KEY="your-supabase-service-or-anon-key"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

5. **Start the FastAPI server**:
   ```bash
   python run.py
   ```
   *Alternative:*
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

6. **Verify Backend**:
   - Health Check: [http://localhost:8000/health](http://localhost:8000/health)
   - Interactive API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2️⃣ Frontend Setup (React 18 + Vite + Tailwind CSS)

1. **Open a new terminal and navigate to the frontend folder**:
   ```bash
   cd Odyssey/FrontEnd
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Setup `.env` configuration**:
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration in `Odyssey/FrontEnd/.env`:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   VITE_API_BASE_URL="http://localhost:8000/api/v1"
   VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   VITE_GEMINI_API_KEY=""
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   - Open your browser and navigate to: **`http://localhost:5173`**

---

## 📱 Mobile App (Capacitor iOS & Android)

Odyssey includes Capacitor for native iOS and Android deployment.

```bash
cd Odyssey/FrontEnd

# Build production bundle and sync with native platforms
npm run build:mobile

# Open in Android Studio
npm run cap:open:android

# Open in Xcode (macOS only)
npm run cap:open:ios
```

---

## 🔑 Environment Variables Reference

### Frontend Configuration (`Odyssey/FrontEnd/.env`)

| Variable | Description | Required | Where to get it |
| :--- | :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase Project URL | ✅ Yes | [Supabase Dashboard](https://supabase.com/dashboard) -> Project Settings -> API |
| `VITE_SUPABASE_ANON_KEY` | Supabase Public/Anon API Key | ✅ Yes | [Supabase Dashboard](https://supabase.com/dashboard) -> Project Settings -> API |
| `VITE_API_BASE_URL` | Backend API Base URL | ✅ Yes | Default: `http://localhost:8000/api/v1` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps Platform API Key | ⚠️ Recommended | [Google Cloud Console](https://console.cloud.google.com/) (Maps JS, Places API) |
| `VITE_GEMINI_API_KEY` | Direct Client-side Gemini Key | ❌ Optional | [Google AI Studio](https://aistudio.google.com/) |

### Backend Configuration (`Odyssey/BackEnd/.env`)

| Variable | Description | Required | Where to get it |
| :--- | :--- | :--- | :--- |
| `SUPABASE_URL` | Supabase Project URL | ✅ Yes | [Supabase Dashboard](https://supabase.com/dashboard) -> Project Settings -> API |
| `SUPABASE_KEY` | Supabase Service Role or Anon Key | ✅ Yes | [Supabase Dashboard](https://supabase.com/dashboard) -> Project Settings -> API |
| `GEMINI_API_KEY` | Google Gemini API Key | ✅ Yes | [Google AI Studio](https://aistudio.google.com/) |

---

## 📜 Available NPM Scripts Summary

From the root workspace directory (`travel app/`):

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `npm --prefix Odyssey/FrontEnd run dev` | Starts the Frontend Vite server |
| `npm run dev:frontend` | `npm --prefix Odyssey/FrontEnd run dev` | Starts the Frontend Vite server |
| `npm run dev:backend` | `python Odyssey/BackEnd/run.py` | Starts the Python FastAPI backend server |
| `npm run install:frontend` | `npm --prefix Odyssey/FrontEnd install` | Installs frontend dependencies |
| `npm run build` | `npm --prefix Odyssey/FrontEnd run build` | Builds the frontend for production |
| `npm run preview` | `npm --prefix Odyssey/FrontEnd run preview` | Previews the production build locally |

---

## 🔍 Troubleshooting & FAQs

### 1. `Cannot connect to backend (http://localhost:8000)`
- Ensure the backend virtual environment is activated and `python run.py` is running without errors.
- Check that port `8000` is not being used by another application.

### 2. `Execution of scripts is disabled on this system (Windows PowerShell)`
Run PowerShell as Administrator or set execution policy for the current process:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 3. `Supabase authentication or API errors`
- Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` match your Supabase project in `Odyssey/FrontEnd/.env`.
- Ensure Email Auth provider is enabled in your Supabase project under Authentication -> Providers.

### 4. `Google Maps or Places not loading`
- Verify that `VITE_GOOGLE_MAPS_API_KEY` is provided in `Odyssey/FrontEnd/.env`.
- Make sure **Maps JavaScript API**, **Places API**, and **Geocoding API** are enabled in your Google Cloud Console project.

---

### Happy Travelling with Odyssey! 🌍✈️
