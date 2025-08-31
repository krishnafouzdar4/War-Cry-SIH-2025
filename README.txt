
Safar Saathi — Python Backend (FastAPI + SQLite)

How to run (local):
1) Python 3.10+ install karo.
2) Dependencies install karo:
   pip install -r requirements.txt
3) Server start:
   uvicorn server:app --reload --port 8000
4) Frontend (index.html ya location-features.html) ko VS Code Live Server se open karo.

Important endpoints:
- POST /api/trip/start
- POST /api/trip/update
- POST /api/trip/end
- GET  /api/trips?user_id=...
- GET  /api/trip/{trip_id}/points
- GET  /api/places/recommend?destination=kochi|munnar|thiruvananthapuram
- POST /api/auth/signup  |  POST /api/auth/signin
- POST /api/consent      |  GET /api/consent/{user_id}
- GET  /api/admin/export
