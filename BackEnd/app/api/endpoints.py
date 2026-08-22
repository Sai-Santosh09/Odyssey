from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os

from app.schemas.itinerary import ItineraryRequest, ItineraryResponse
from app.services.itinerary_service import generate_itinerary

router = APIRouter(prefix="/api/v1")
security = HTTPBearer()

def get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise HTTPException(
            status_code=500,
            detail="Supabase is not configured in backend .env"
        )
    return create_client(url, key)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    supabase_client: Client = Depends(get_supabase_client)
):
    token = credentials.credentials
    try:
        # Use get_user to verify the token with Supabase Auth
        user_response = supabase_client.auth.get_user(token)
        return user_response.user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid or expired credentials: {str(e)}"
        )

@router.post("/itinerary", response_model=ItineraryResponse)
def create_itinerary(
    request: ItineraryRequest,
    current_user = Depends(get_current_user)
):
    """
    Generate a realistic, highly tailored day-wise travel itinerary.
    Requires authentication via Supabase Auth Bearer token.
    """
    return generate_itinerary(request)
