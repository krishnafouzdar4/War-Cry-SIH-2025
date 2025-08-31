
# server.py
# Safar Saathi — Minimal Python backend (FastAPI + SQLite)
# Run: uvicorn server:app --reload --port 8000

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from uuid import uuid4
import sqlite3
from contextlib import contextmanager
from datetime import datetime

DB_PATH = "safarsaathi.db"

# ---------- Database helpers ----------
@contextmanager
def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()

def init_db():
    with db() as conn:
        c = conn.cursor()
        c.execute("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, created_at TEXT)")
        c.execute("CREATE TABLE IF NOT EXISTS consent (user_id TEXT PRIMARY KEY, given INTEGER NOT NULL DEFAULT 0, timestamp TEXT)")
        c.execute("CREATE TABLE IF NOT EXISTS trips (id TEXT PRIMARY KEY, user_id TEXT, start_time TEXT, end_time TEXT, start_lat REAL, start_lng REAL, end_lat REAL, end_lng REAL, mode TEXT, purpose TEXT, destination TEXT, survey_rating TEXT, survey_issues TEXT)")
        c.execute("CREATE TABLE IF NOT EXISTS trip_points (id TEXT PRIMARY KEY, trip_id TEXT, lat REAL, lng REAL, accuracy REAL, ts TEXT)")

init_db()

# ---------- FastAPI app ----------
app = FastAPI(title="Safar Saathi Backend", version="0.1.0")

# Allow local front-ends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Schemas ----------
class SignUp(BaseModel):
    name: str
    email: str
    password: str

class SignIn(BaseModel):
    email: str
    password: str

class ConsentIn(BaseModel):
    user_id: str
    given: bool

class TripStartIn(BaseModel):
    user_id: str = Field(..., description="Use 'guest' if not signed-in")
    start_lat: float
    start_lng: float
    mode: Optional[str] = None
    purpose: Optional[str] = None
    destination: Optional[str] = None

class TripUpdateIn(BaseModel):
    trip_id: str
    lat: float
    lng: float
    accuracy: Optional[float] = None

class TripEndIn(BaseModel):
    trip_id: str
    end_lat: float
    end_lng: float
    survey_rating: Optional[str] = None
    survey_issues: Optional[str] = None

# ---------- Helpers ----------
def now_iso() -> str:
    return datetime.utcnow().isoformat()

def user_exists(email: str) -> bool:
    with db() as conn:
        r = conn.execute("SELECT 1 FROM users WHERE email=?", (email,)).fetchone()
        return r is not None

def get_user_by_email(email: str):
    with db() as conn:
        return conn.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()

# ---------- Routes ----------

@app.get("/api/health")
def health():
    return {"ok": True, "time": now_iso()}

# Auth (very basic; plaintext password since it's a prototype)
@app.post("/api/auth/signup")
def signup(payload: SignUp):
    if user_exists(payload.email):
        raise HTTPException(status_code=409, detail="Email already registered")
    uid = str(uuid4())
    with db() as conn:
        conn.execute("INSERT INTO users (id, name, email, password, created_at) VALUES (?,?,?,?,?)",
                     (uid, payload.name, payload.email, payload.password, now_iso()))
        conn.execute("INSERT OR REPLACE INTO consent (user_id, given, timestamp) VALUES (?,?,?)",
                     (uid, 0, now_iso()))
    return {"user_id": uid, "name": payload.name, "email": payload.email}

@app.post("/api/auth/signin")
def signin(payload: SignIn):
    u = get_user_by_email(payload.email)
    if not u or u["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": u["id"], "name": u["name"], "email": u["email"]}

# Consent
@app.post("/api/consent")
def set_consent(c: ConsentIn):
    with db() as conn:
        conn.execute("INSERT OR REPLACE INTO consent (user_id, given, timestamp) VALUES (?,?,?)",
                     (c.user_id, 1 if c.given else 0, now_iso()))
    return {"ok": True}

@app.get("/api/consent/{user_id}")
def get_consent(user_id: str):
    with db() as conn:
        r = conn.execute("SELECT * FROM consent WHERE user_id=?", (user_id,)).fetchone()
        if not r:
            return {"user_id": user_id, "given": False, "timestamp": None}
        return {"user_id": user_id, "given": bool(r["given"]), "timestamp": r["timestamp"]}

# Trips
@app.post("/api/trip/start")
def trip_start(t: TripStartIn):
    trip_id = str(uuid4())
    with db() as conn:
        conn.execute("INSERT INTO trips (id, user_id, start_time, start_lat, start_lng, mode, purpose, destination) VALUES (?,?,?,?,?,?,?,?)",
                     (trip_id, t.user_id, now_iso(), t.start_lat, t.start_lng, t.mode, t.purpose, t.destination))
        conn.execute("INSERT INTO trip_points (id, trip_id, lat, lng, accuracy, ts) VALUES (?,?,?,?,?,?)",
                     (str(uuid4()), trip_id, t.start_lat, t.start_lng, None, now_iso()))
    return {"trip_id": trip_id}

@app.post("/api/trip/update")
def trip_update(u: TripUpdateIn):
    with db() as conn:
        trip = conn.execute("SELECT id FROM trips WHERE id=?", (u.trip_id,)).fetchone()
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        conn.execute("INSERT INTO trip_points (id, trip_id, lat, lng, accuracy, ts) VALUES (?,?,?,?,?,?)",
                     (str(uuid4()), u.trip_id, u.lat, u.lng, u.accuracy, now_iso()))
    return {"ok": True}

@app.post("/api/trip/end")
def trip_end(e: TripEndIn):
    with db() as conn:
        trip = conn.execute("SELECT * FROM trips WHERE id=?", (e.trip_id,)).fetchone()
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")
        conn.execute("UPDATE trips SET end_time=?, end_lat=?, end_lng=?, survey_rating=?, survey_issues=? WHERE id=?",
                     (now_iso(), e.end_lat, e.end_lng, e.survey_rating, e.survey_issues, e.trip_id))
        conn.execute("INSERT INTO trip_points (id, trip_id, lat, lng, accuracy, ts) VALUES (?,?,?,?,?,?)",
                     (str(uuid4()), e.trip_id, e.end_lat, e.end_lng, None, now_iso()))
    return {"ok": True}

@app.get("/api/trips")
def trips(user_id: Optional[str] = None):
    with db() as conn:
        if user_id:
            rows = conn.execute("SELECT * FROM trips WHERE user_id=? ORDER BY start_time DESC", (user_id,)).fetchall()
        else:
            rows = conn.execute("SELECT * FROM trips ORDER BY start_time DESC").fetchall()
        trips = [dict(r) for r in rows]
    return {"trips": trips}

@app.get("/api/trip/{trip_id}/points")
def trip_points(trip_id: str):
    with db() as conn:
        rows = conn.execute("SELECT lat, lng, accuracy, ts FROM trip_points WHERE trip_id=? ORDER BY ts ASC", (trip_id,)).fetchall()
        pts = [dict(r) for r in rows]
    return {"points": pts}

# Simple Kerala recommendation endpoint (static demo list)
KERALA_PLACES = {
    "kochi": [
        {"name": "Fort Kochi", "lat": 9.966, "lng": 76.242},
        {"name": "Marine Drive", "lat": 9.981, "lng": 76.275},
        {"name": "Jew Town", "lat": 9.965, "lng": 76.259}
    ],
    "munnar": [
        {"name": "Tea Museum", "lat": 10.089, "lng": 77.062},
        {"name": "Eravikulam National Park", "lat": 10.150, "lng": 77.060},
        {"name": "Top Station", "lat": 10.130, "lng": 77.250}
    ],
    "thiruvananthapuram": [
        {"name": "Kovalam Beach", "lat": 8.402, "lng": 76.978},
        {"name": "Padmanabhaswamy Temple", "lat": 8.482, "lng": 76.943},
        {"name": "Veli Tourist Village", "lat": 8.521, "lng": 76.900}
    ]
}

@app.get("/api/places/recommend")
def recommend(destination: str):
    key = destination.strip().lower()
    return {"destination": destination, "places": KERALA_PLACES.get(key, [])}

# Admin export (CSV-like rows in JSON)
@app.get("/api/admin/export")
def admin_export():
    with db() as conn:
        trips = conn.execute("SELECT * FROM trips ORDER BY start_time DESC").fetchall()
        out = [["trip_id","user_id","start_time","end_time","mode","purpose","destination","start_lat","start_lng","end_lat","end_lng","survey_rating","survey_issues"]]
        for r in trips:
            out.append([
                r["id"], r["user_id"], r["start_time"], r["end_time"], r["mode"], r["purpose"], r["destination"],
                r["start_lat"], r["start_lng"], r["end_lat"], r["end_lng"], r["survey_rating"], r["survey_issues"]
            ])
    return {"rows": out}
