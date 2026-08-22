import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import APIError
from fastapi import HTTPException

from app.schemas.itinerary import ItineraryRequest, ItineraryResponse

load_dotenv()

def get_genai_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY environment variable is not configured. Please set it in BackEnd/.env"
        )
    return genai.Client(api_key=api_key)

SYSTEM_PROMPT = """
You are an expert travel concierge API. Your sole function is to construct realistic, highly tailored day-wise travel itineraries based on user constraints.

CRITICAL CONSTRAINTS:
1. Realistic Logistics: Group activities by geographic proximity. Do not schedule morning and afternoon activities on opposite sides of a city.
2. Budget Strictness: The sum of all activity 'estimated_cost' values across all days MUST NOT exceed the user's total budget.
3. Schedule Balance:
   - Morning: 1 main activity or transit + breakfast spot.
   - Afternoon: 1-2 sightseeing/cultural activities + lunch spot.
   - Evening: 1 relaxation/nightlife activity + dinner spot.
4. Categorization: Every activity must belong to one of: ['Food', 'Sightseeing', 'Culture', 'Relaxation', 'Transit', 'Nightlife'].
"""

def generate_itinerary(request: ItineraryRequest) -> ItineraryResponse:
    client = get_genai_client()
    
    prompt = f"""
Generate a travel itinerary for:
- Destination: {request.destination}
- Duration: {request.days} days
- Budget: {request.budget} USD
- Interests: {', '.join(request.interests) if request.interests else 'General tourism'}

Remember: The sum of all estimated_cost values for all activities in the entire itinerary must be less than or equal to {request.budget} USD.
"""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ItineraryResponse,
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,
            )
        )
        
        response_json = json.loads(response.text)
        return ItineraryResponse(**response_json)
    except APIError as e:
        raise HTTPException(status_code=502, detail=f"Gemini API Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating itinerary: {str(e)}")
