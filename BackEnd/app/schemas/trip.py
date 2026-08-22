from pydantic import BaseModel, Field
from typing import List

class TripCreateRequest(BaseModel):
    destination: str = Field(..., description="The city/location to visit.")
    duration_days: int = Field(..., description="Duration of the trip in days.", ge=1, le=14)
    budget: float = Field(..., description="Total budget in USD.", ge=0)
    travelers: int = Field(default=1, description="Number of travelers.", ge=1)
    travel_style: str = Field(default="Balanced", description="Travel style (e.g. Budget, Luxury, Adventure, Cultural).")
    interests: List[str] = Field(default=[], description="List of traveler interests.")

class ActivitySchema(BaseModel):
    name: str = Field(..., description="Name of the activity or spot.")
    description: str = Field(..., description="A short description of the activity.")
    location: str = Field(..., description="Location or address.")
    estimated_cost: float = Field(..., description="Estimated cost of this activity in USD (must be 0 if free).", ge=0)

class DayItinerarySchema(BaseModel):
    day_number: int = Field(..., description="The day number, starting at 1.")
    theme: str = Field(..., description="Focus or theme of the day.")
    morning: ActivitySchema = Field(..., description="Activity slot for the morning.")
    afternoon: ActivitySchema = Field(..., description="Activity slot for the afternoon.")
    evening: ActivitySchema = Field(..., description="Activity slot for the evening.")

class ItineraryResponseSchema(BaseModel):
    destination: str = Field(..., description="The travel destination.")
    total_cost: float = Field(..., description="Sum of all estimated costs across all days.")
    days: List[DayItinerarySchema] = Field(..., description="Day-by-day breakdown of the itinerary.")
