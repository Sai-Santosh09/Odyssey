import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from app.schemas.trip import TripCreateRequest, ItineraryResponseSchema

load_dotenv()

SYSTEM_INSTRUCTION = """
You are an expert travel concierge, flight/train/bus transit intelligence, and accommodation AI with Google Search Grounding.
Whenever generating a travel plan or itinerary:
1. Ground your recommendations in REAL-TIME live web search data for the specified destination.
2. Search for genuine, real hotels and resorts in the destination area matching the traveler's budget and vibe.
3. Look up actual live market pricing across the 3 major hotel booking engines: Booking.com, Expedia, and Agoda.
4. Generate comprehensive travel & transport booking options across 3 modes of transit:
   - Flight (e.g. Major airlines, direct/connecting routes, flight duration, per-person & total fares)
   - Train (e.g. High-speed / Express train, scenic route, comfort level, per-person & total fares)
   - Bus / Coach (e.g. AC Volvo Multi-Axle sleeper / express coach, overnight option, per-person & total fares)
5. Return the actual, grounded price comparisons for both Stays and Transit modes.
6. Provide realistic, geographically grouped daily activities that respect the overall budget.
"""

def generate_itinerary_ai(req: TripCreateRequest) -> ItineraryResponseSchema:
    # 1. Initialize client using key from .env
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    # 2. Construct clear prompt with Google Search grounding
    prompt = f"""
    Use Google Search to look up live, actual current hotel and transit rates (Flight, Train, Bus) and create a day-by-day travel plan for {req.destination}.
    
    Trip Parameters:
    - Destination: {req.destination}
    - Duration: {req.duration_days} days
    - Total Budget: ${req.budget} USD
    - Travelers: {req.travelers}
    - Travel Style: {req.travel_style}
    - Interests: {', '.join(req.interests) if req.interests else 'General Tourism'}
    
    Live Grounding Requirements:
    1. Search Google for real, top-rated hotels in {req.destination} and extract 3-platform prices (Booking.com, Agoda, Expedia).
    2. Search and provide multi-mode transit price comparisons across Flight, Train, and Bus to {req.destination} with duration and pricing for {req.travelers} travelers.
    3. Include 3 daily activity slots (Morning, Afternoon, Evening) whose estimated costs remain within ${req.budget} USD.
    """

    # 3. Call Gemini 2.5 Flash with Google Search Grounding enabled
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ItineraryResponseSchema,
            system_instruction=SYSTEM_INSTRUCTION,
            tools=[types.Tool(google_search=types.GoogleSearch())],
            temperature=0.2,
        ),
    )
    
    # 4. Parse JSON string directly into validated Pydantic object
    return ItineraryResponseSchema.model_validate_json(response.text)
