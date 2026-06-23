-- ============================================================
-- Storage bucket for article cover images, uploaded via the
-- admin article forms (drag-and-drop / file picker).
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-covers', 'article-covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read article covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload article covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update article covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete article covers" ON storage.objects;

CREATE POLICY "Public can read article covers"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'article-covers');

CREATE POLICY "Authenticated can upload article covers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'article-covers');

CREATE POLICY "Authenticated can update article covers"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'article-covers')
  WITH CHECK (bucket_id = 'article-covers');

CREATE POLICY "Authenticated can delete article covers"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'article-covers');
