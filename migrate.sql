CREATE TABLE IF NOT EXISTS cells (
  id TEXT PRIMARY KEY,
  color TEXT,
  canvas_id TEXT,
  x_position INTEGER,
  y_position INTEGER,
  inserted_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
