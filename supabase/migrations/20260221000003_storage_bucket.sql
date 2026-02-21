-- Create public storage bucket for admin file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'comm-files',
  'comm-files',
  true,
  52428800, -- 50MB limit
  ARRAY['application/json', 'application/pdf', 'application/zip', 'text/plain', 'text/markdown', 'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'video/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read comm-files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'comm-files');

-- Allow service role to upload (admin API uses service role key)
CREATE POLICY "Service role upload comm-files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'comm-files');

CREATE POLICY "Service role delete comm-files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'comm-files');
