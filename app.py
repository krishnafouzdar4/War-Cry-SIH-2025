from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
import json
import uuid
import argparse
from datetime import datetime

DB_PATH = 'trips.db'

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

def init_db():
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        with open('schema.sql', 'r') as f:
            cur.executescript(f.read())
        conn.commit()
        conn.close()
        print('Database initialized.')
    else:
        print('Database already exists.')

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

@app.route('/api/trips', methods=['POST'])
def create_trip():
    data = request.get_json(force=True)
    if not data.get('consent'):
        return jsonify({'error':'consent_required'}), 400

    trip_id = str(uuid.uuid4())
    trip_number = data.get('trip_number') or ''
    origin = data.get('origin') or ''
    origin_lat = data.get('origin_lat')
    origin_lng = data.get('origin_lng')
    destination = data.get('destination') or ''
    destination_lat = data.get('destination_lat')
    destination_lng = data.get('destination_lng')
    mode = data.get('mode') or ''
    timestamp = data.get('timestamp') or datetime.utcnow().isoformat()
    duration_seconds = data.get('duration_seconds')
    accompanying = json.dumps(data.get('accompanying') or [])
    consent = 1 if data.get('consent') else 0

    raw_payload = json.dumps(data)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('''INSERT INTO trips (id, trip_number, origin, origin_lat, origin_lng,
                destination, destination_lat, destination_lng, mode, timestamp,
                duration_seconds, accompanying, consent, raw_payload)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (trip_id, trip_number, origin, origin_lat, origin_lng,
                 destination, destination_lat, destination_lng, mode, timestamp,
                 duration_seconds, accompanying, consent, raw_payload))
    conn.commit()
    conn.close()

    return jsonify({'status':'ok','id':trip_id}), 201

@app.route('/api/trips', methods=['GET'])
def list_trips():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('SELECT id, trip_number, origin, destination, mode, timestamp, consent FROM trips ORDER BY timestamp DESC')
    rows = cur.fetchall()
    res = [dict(row) for row in rows]
    conn.close()
    return jsonify(res)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--init-db', action='store_true', help='Initialize the sqlite database')
    args = parser.parse_args()
    if args.init_db:
        init_db()
    else:
        if not os.path.exists(DB_PATH):
            init_db()
        app.run(host='0.0.0.0', port=5000, debug=True)
