from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import City
from schemas import CityResponse

router = APIRouter()

@router.get("/", response_model=list[CityResponse])
def get_active_cities(db: Session = Depends(get_db)):
    """Get all active cities. Public endpoint."""
    cities = db.query(City).filter(City.active == True).all()
    return cities