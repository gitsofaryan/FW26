-- 1. Create the memories table
CREATE TABLE public.memories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  height integer DEFAULT 350,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) on the memories table
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for the memories table
-- Allow anyone to read memories (public access)
CREATE POLICY "Enable read access for all users" ON public.memories
  FOR SELECT USING (true);

-- Allow anyone to insert memories (public submissions)
CREATE POLICY "Enable insert access for all users" ON public.memories
  FOR INSERT WITH CHECK (true);

-- Allow anyone to delete memories (based on our current open setup)
CREATE POLICY "Enable delete access for all users" ON public.memories
  FOR DELETE USING (true);

-- 4. Create the storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true);

-- 5. Create storage policies for the gallery-images bucket
-- Allow anyone to view images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');

-- Allow anyone to upload images
CREATE POLICY "Public Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery-images');

-- Allow anyone to delete images
CREATE POLICY "Public Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery-images');
