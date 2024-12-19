CREATE TABLE IF NOT EXISTS cells (
  id TEXT PRIMARY KEY,
  color TEXT,
  canvas_id TEXT,
  x_position INTEGER,
  y_position INTEGER,
  inserted_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION truncate_cells() RETURNS void AS $$
BEGIN
  TRUNCATE TABLE cells CASCADE;
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('truncate_cells', '*/30 * * * *', 'SELECT truncate_cells()');
