CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE IF NOT EXISTS user_role AS ENUM ('user', 'admin');
CREATE TYPE IF NOT EXISTS report_severity AS ENUM ('low', 'medium', 'high');
CREATE TYPE IF NOT EXISTS report_status AS ENUM ('pending', 'under_review', 'in_progress', 'resolved', 'rejected');

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_name_not_blank CHECK (name IS NULL OR char_length(trim(name)) >= 2),
  CONSTRAINT users_email_not_blank CHECK (char_length(trim(email)) > 0)
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL CHECK (char_length(trim(title)) > 0),
  category VARCHAR(80) NOT NULL CHECK (char_length(trim(category)) > 0),
  description TEXT NOT NULL CHECK (char_length(trim(description)) >= 10),
  severity report_severity NOT NULL DEFAULT 'medium',
  status report_status NOT NULL DEFAULT 'pending',
  location_name VARCHAR(255) NOT NULL CHECK (char_length(trim(location_name)) > 0),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  reporter_name VARCHAR(120),
  reporter_email VARCHAR(255),
  reporter_phone VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reports_latitude_valid CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
  CONSTRAINT reports_longitude_valid CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
  CONSTRAINT reports_reporter_name_valid CHECK (reporter_name IS NULL OR char_length(trim(reporter_name)) > 0),
  CONSTRAINT reports_reporter_email_valid CHECK (reporter_email IS NULL OR reporter_email <> ''),
  CONSTRAINT reports_reporter_phone_valid CHECK (reporter_phone IS NULL OR char_length(trim(reporter_phone)) > 0),
  CONSTRAINT reports_image_url_valid CHECK (image_url IS NULL OR image_url ~ '^https?://')
);

CREATE TABLE IF NOT EXISTS report_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL CHECK (char_length(trim(image_url)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_severity ON reports(severity);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
DROP TRIGGER IF EXISTS trg_reports_updated_at ON reports;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Optional: create an admin user placeholder for your project.
-- Replace the generated password hash with your own secure admin password.
-- Example:
-- INSERT INTO users (name, email, password_hash, role)
-- VALUES ('RoadSafe Admin', 'admin@roadsafe.local', '$2a$10$7v7VtM2R9NuWlGkW1anx2u7ZoGvF0i8wEowdA0JwJk7r5mUUZ87Wq', 'admin')
-- ON CONFLICT (email) DO NOTHING;
