-- Requirements table
CREATE TABLE IF NOT EXISTS requirements (
  id SERIAL PRIMARY KEY,
  parent_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  city VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
