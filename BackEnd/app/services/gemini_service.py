import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from app.schemas.trip import TripCreateRequest, ItineraryResponseSchema

load_dotenv()

def generate_itinerary_ai(req: TripCreateRequest) -> ItineraryResponseSchema:
    # 1. Initialize client using key from .env
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    # 2. Construct clear prompt with system instructions
    prompt = f"""
    You are an expert travel AI. Create a day-by-day itinerary for a trip to {req.destination}.
    
    Trip Details:
    - Duration: {req.duration_days} days
    - Total Budget: ${req.budget}
    - Travelers: {req.travelers}
    - Style: {req.travel_style}
    - Interests: {', '.join(req.interests)}
    
    Constraints:
    1. Total estimated cost across all activities must stay within ${req.budget}.
    2. Provide 3 activity slots per day (Morning, Afternoon, Evening).
    """

    # 3. Call Gemini 2.5 Flash with forced JSON schema output
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ItineraryResponseSchema,
            temperature=0.3, # Low temperature ensures strict schema adherence
        ),
    )
    
    # 4. Parse JSON string directly into validated Pydantic object
    return ItineraryResponseSchema.model_validate_json(response.text)
