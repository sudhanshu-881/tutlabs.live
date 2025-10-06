-- Tutor profiles table
CREATE TABLE IF NOT EXISTS tutor_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  education TEXT,
  experience TEXT,
  subjects TEXT[],
  rate_per_hour INTEGER,
  city VARCHAR(255),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  available_mon BOOLEAN NOT NULL DEFAULT FALSE,
  available_tue BOOLEAN NOT NULL DEFAULT FALSE,
  available_wed BOOLEAN NOT NULL DEFAULT FALSE,
  available_thu BOOLEAN NOT NULL DEFAULT FALSE,
  available_fri BOOLEAN NOT NULL DEFAULT FALSE,
  available_sat BOOLEAN NOT NULL DEFAULT FALSE,
  available_sun BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
