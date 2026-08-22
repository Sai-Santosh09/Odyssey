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

class HotelComparisonPlatform(BaseModel):
    platform_name: str = Field(..., description="Name of the booking platform (e.g. Booking.com, Expedia, Agoda).")
    price_per_night: float = Field(..., description="Price per night in the given currency.", ge=0)
    currency: str = Field(default="USD", description="Currency symbol or code (e.g. USD, INR).")

class Accommodation(BaseModel):
    hotel_name: str = Field(..., description="Name of the recommended hotel or resort.")
    location: Optional[str] = Field(default=None, description="Neighborhood or area.")
    rating: Optional[float] = Field(default=4.7, description="Average review rating out of 5.")
    room_type: Optional[str] = Field(default="Deluxe Room", description="Room tier or type.")
    hotel_comparisons: List[HotelComparisonPlatform] = Field(
        ...,
        description="Array of 3 simulated hotel prices for different booking platforms (e.g. Booking.com, Expedia, Agoda)."
    )

class TransportModeComparison(BaseModel):
    mode: str = Field(..., description="Transport mode: 'Flight', 'Train', 'Bus', or 'Cab'")
    operator_name: str = Field(..., description="Carrier or operator (e.g. IndiGo, Vande Bharat Express, Volvo Sleeper)")
    route_details: str = Field(..., description="Origin to destination summary")
    estimated_duration: str = Field(..., description="Travel duration (e.g. 1h 20m, 8h 30m, 12h)")
    price_per_person: float = Field(..., description="Price per traveler", ge=0)
    total_price: float = Field(..., description="Total price for all travelers", ge=0)
    currency: str = Field(default="INR", description="Currency symbol or code")
    badge: Optional[str] = Field(default=None, description="Feature tag (e.g. 'Fastest Option', 'Eco-Friendly', 'Best Budget')")
    is_recommended: bool = Field(default=False, description="Whether this is the recommended transport mode")
    booking_url: Optional[str] = Field(default=None, description="Direct booking search link")

class Activity(BaseModel):
    name: str = Field(..., description="Name of the activity or spot.")
    description: str = Field(..., description="A short explanation of what to do/see.")
    category: CategoryEnum = Field(..., description="The category of the activity.")
    time_of_day: TimeOfDayEnum = Field(..., description="When the activity takes place.")
    location: str = Field(..., description="The specific location, neighborhood, or address.")
    estimated_cost: float = Field(..., description="The estimated cost of this activity (must be 0 if free).", ge=0)

class DayItinerary(BaseModel):
    day_number: int = Field(..., description="The day number, starting at 1.")
    theme: str = Field(..., description="A short theme or focus for the day.")
    morning: List[Activity] = Field(..., description="Exactly 1 main activity or transit + 1 breakfast spot.")
    afternoon: List[Activity] = Field(..., description="1-2 sightseeing/cultural activities + 1 lunch spot.")
    evening: List[Activity] = Field(..., description="Exactly 1 relaxation/nightlife activity + 1 dinner spot.")

class ItineraryResponse(BaseModel):
    destination: str = Field(..., description="The travel destination.")
    total_cost: float = Field(..., description="The sum of all estimated costs across all days.")
    accommodation: Optional[Accommodation] = Field(
        default=None,
        description="Recommended accommodation with price comparisons across booking platforms."
    )
    hotel_comparisons: Optional[List[HotelComparisonPlatform]] = Field(
        default=None,
        description="Price comparisons across booking platforms."
    )
    transport_comparisons: Optional[List[TransportModeComparison]] = Field(
        default=None,
        description="Multi-mode transit comparison across Flight, Train, and Bus."
    )
    days: List[DayItinerary] = Field(..., description="The day-by-day breakdown of the itinerary.")

class ItineraryRequest(BaseModel):
    destination: str = Field(..., description="The city/location to visit.")
    days: int = Field(..., description="Number of days for the trip.", ge=1, le=14)
    budget: float = Field(..., description="Total budget constraint for the activities.", ge=0)
    interests: Optional[List[str]] = Field(default=[], description="List of traveler interests (e.g. museums, food, shopping).")
