from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class CategoryEnum(str, Enum):
    food = 'Food'
    sightseeing = 'Sightseeing'
    culture = 'Culture'
    relaxation = 'Relaxation'
    transit = 'Transit'
    nightlife = 'Nightlife'

class TimeOfDayEnum(str, Enum):
    morning = 'Morning'
    afternoon = 'Afternoon'
    evening = 'Evening'

class Activity(BaseModel):
    name: str = Field(..., description="Name of the activity or spot.")
    description: str = Field(..., description="A short explanation of what to do/see.")
    category: CategoryEnum = Field(..., description="The category of the activity.")
    time_of_day: TimeOfDayEnum = Field(..., description="When the activity takes place.")
    location: str = Field(..., description="The specific location, neighborhood, or address.")
    estimated_cost: float = Field(..., description="The estimated cost of this activity in USD (must be 0 if free).", ge=0)

class DayItinerary(BaseModel):
    day_number: int = Field(..., description="The day number, starting at 1.")
    theme: str = Field(..., description="A short theme or focus for the day.")
    morning: List[Activity] = Field(..., description="Exactly 1 main activity or transit + 1 breakfast spot.")
    afternoon: List[Activity] = Field(..., description="1-2 sightseeing/cultural activities + 1 lunch spot.")
    evening: List[Activity] = Field(..., description="Exactly 1 relaxation/nightlife activity + 1 dinner spot.")

class ItineraryResponse(BaseModel):
    destination: str = Field(..., description="The travel destination.")
    total_cost: float = Field(..., description="The sum of all estimated costs across all days.")
    days: List[DayItinerary] = Field(..., description="The day-by-day breakdown of the itinerary.")

class ItineraryRequest(BaseModel):
    destination: str = Field(..., description="The city/location to visit.")
    days: int = Field(..., description="Number of days for the trip.", ge=1, le=14)
    budget: float = Field(..., description="Total budget constraint for the activities.", ge=0)
    interests: Optional[List[str]] = Field(default=[], description="List of traveler interests (e.g. museums, food, shopping).")
