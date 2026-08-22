from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from app.schemas.trip import TripCreateRequest, ItineraryResponseSchema
from app.services.gemini_service import generate_itinerary_ai

app = FastAPI(
    title="Odyssey Travel Planner API",
    description="FastAPI backend for generating tailored travel itineraries using Gemini AI and Supabase authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for development & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

@app.get("/")
def read_root():
    return {
        "name": "Odyssey Travel Planner API",
        "status": "online",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/health")
@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "odyssey-backend"
    }

@app.post("/api/v1/ai/generate-itinerary", response_model=ItineraryResponseSchema)
def generate_itinerary(req: TripCreateRequest):
    try:
        return generate_itinerary_ai(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
