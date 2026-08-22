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
You are an expert travel concierge and multi-modal transit intelligence API with live Google Search Grounding.
Your function is to construct realistic, highly tailored day-wise travel itineraries, hotel price comparisons, and multi-mode transit booking options (Flight, Train, Bus).

CRITICAL INSTRUCTIONS:
1. Real-Time Hotel Search: Ground accommodation recommendations in live web data for the target destination across Booking.com, Expedia, and Agoda.
2. Multi-Mode Transit Comparison: Provide realistic transit pricing and durations across:
   - Flight (e.g. Major airlines, non-stop flight duration, fare per person)
   - Train (e.g. High-speed / Express train, scenic route, comfort level)
   - Bus / Coach (e.g. AC Volvo sleeper / express coach, budget fare)
3. Realistic Logistics: Group activities by geographic proximity.
4. Budget Strictness: The sum of all activity 'estimated_cost' values across all days MUST NOT exceed the user's total budget.
"""

def generate_itinerary(request: ItineraryRequest) -> ItineraryResponse:
    client = get_genai_client()
    
    prompt = f"""
Search the live web and generate a grounded travel itinerary, hotel price comparison, and multi-modal transit comparison (Flight, Train, Bus) for:
- Destination: {request.destination}
- Duration: {request.days} days
- Budget: {request.budget} USD
- Interests: {', '.join(request.interests) if request.interests else 'General tourism'}

Requirements:
1. Ground real hotel names and live prices across Booking.com, Expedia, and Agoda in hotel_comparisons.
2. Provide transport_comparisons containing Flight, Train, and Bus options with operator names, durations, and per-person prices.
3. Ensure total estimated activity costs remain within {request.budget} USD.
"""

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ItineraryResponse,
                system_instruction=SYSTEM_PROMPT,
                tools=[types.Tool(google_search=types.GoogleSearch())],
                temperature=0.3,
            )
        )
        
        response_json = json.loads(response.text)
        return ItineraryResponse(**response_json)
    except APIError as e:
        raise HTTPException(status_code=502, detail=f"Gemini API Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating itinerary: {str(e)}")
