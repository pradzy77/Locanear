-- ZenLoc Database Schema for Cloudflare D1
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT 'cool',
    color TEXT NOT NULL DEFAULT '#10b981',
    friend_code TEXT UNIQUE NOT NULL,
    security_question TEXT,
    security_answer TEXT,
    lat REAL DEFAULT -6.2088,
    lng REAL DEFAULT 106.8456,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_code_a TEXT NOT NULL,
    user_code_b TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_code_a, user_code_b)
);

-- Seed default initial accounts
INSERT OR IGNORE INTO users (username, password, name, avatar, color, friend_code, lat, lng)
VALUES 
('ilprad', 'map123', 'Ilprad', 'cyber', '#06b6d4', 'ILPRAD-99', -6.2088, 106.8456),
('carrjies', 'map123', 'Carrjies', 'fox', '#f59e0b', 'CARRJIES-88', -6.2146, 106.8451);

INSERT OR IGNORE INTO friendships (user_code_a, user_code_b)
VALUES 
('ILPRAD-99', 'CARRJIES-88'),
('CARRJIES-88', 'ILPRAD-99');
