from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from app.schemas.trip import TripCreateRequest, ItineraryResponseSchema
from app.services.gemini_service import generate_itinerary_ai

app = FastAPI(
    title="Odyssey Travel Planner API",
    description="FastAPI backend for generating tailored travel itineraries using Gemini",
    version="1.0.0"
)

# Configure CORS so the frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development. For production, specify the frontend domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the itinerary router
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Odyssey Travel Planner API. Documentation is available at /docs"}

@app.post("/api/v1/ai/generate-itinerary", response_model=ItineraryResponseSchema)
def generate_itinerary(req: TripCreateRequest):
    try:
        return generate_itinerary_ai(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
