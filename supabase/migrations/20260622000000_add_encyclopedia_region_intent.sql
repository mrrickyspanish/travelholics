ALTER TABLE encyclopedia_entries
  ADD COLUMN IF NOT EXISTS regions text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS intent  text  NOT NULL DEFAULT 'both'
    CHECK (intent IN ('trip_page', 'blog', 'both'));

CREATE INDEX IF NOT EXISTS encyclopedia_entries_regions_idx ON encyclopedia_entries USING GIN (regions);
