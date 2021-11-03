CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  lat FLOAT,
  lng FLOAT
);

CREATE TABLE hobbies (
  id SERIAL PRIMARY KEY,
  activity TEXT NOT NULL,
  meet_address TEXT NOT NULL,
  user_username TEXT NOT NULL REFERENCES users (username) ON DELETE CASCADE,
  lat FLOAT,
  lng FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
