import sys
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)
os.chdir(backend_dir)

from database import SessionLocal, engine, Base
from models import City

def add_cities():
    db = SessionLocal()
    try:
        # Define cities to create with Arabic names and emoji icons
        cities_data = [
            {"id": 1, "name": "الرياض", "icon": "🏙️"},
            {"id": 2, "name": "جدة", "icon": "🌊"},
            {"id": 3, "name": "مكة المكرمة", "icon": "🕋"},
            {"id": 4, "name": "المدينة المنورة", "icon": "🕌"},
            {"id": 5, "name": "الدمام", "icon": "⚓"},
            {"id": 6, "name": "الخبر", "icon": "🌉"},
            {"id": 7, "name": "الظهران", "icon": "🛢️"},
            {"id": 8, "name": "الطائف", "icon": "🌹"},
            {"id": 9, "name": "أبها", "icon": "⛰️"},
            {"id": 10, "name": "خميس مشيط", "icon": "🦅"},
            {"id": 11, "name": "تبوك", "icon": "❄️"},
            {"id": 12, "name": "حائل", "icon": "🍲"},
            {"id": 13, "name": "بريدة", "icon": "🌴"},
            {"id": 14, "name": "عنيزة", "icon": "🏺"},
            {"id": 15, "name": "جازان", "icon": "☕"},
            {"id": 16, "name": "نجران", "icon": "🏰"},
            {"id": 17, "name": "الباحة", "icon": "🌲"},
            {"id": 18, "name": "سكاكا", "icon": "🫒"},
        ]

        for city_data in cities_data:
            # Check if city already exists by id
            existing_city = db.query(City).filter(City.id == city_data["id"]).first()
            if existing_city:
                print(f"City with id {city_data['id']} ({city_data['name']}) already exists")
                continue

            # Create city
            city = City(
                id=city_data["id"],
                name=city_data["name"],
                icon=city_data["icon"],
                active=True
            )
            db.add(city)
            print(f"Created city {city_data['name']} with icon {city_data['icon']}")

        db.commit()
        print("All cities created successfully")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_cities()