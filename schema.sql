CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    trip_number TEXT,
    origin TEXT,
    origin_lat REAL,
    origin_lng REAL,
    destination TEXT,
    destination_lat REAL,
    destination_lng REAL,
    mode TEXT,
    timestamp TEXT,
    duration_seconds INTEGER,
    accompanying TEXT,
    consent INTEGER,
    raw_payload TEXT
);
INSERT INTO trips (..., origin_lat, origin_lng, destination_lat, destination_lng, duration_seconds, ...)
