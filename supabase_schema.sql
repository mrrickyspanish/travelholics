-- Create the cruise_inquiries table
CREATE TABLE IF NOT EXISTS public.cruise_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'closed'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cruise_inquiries ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (public submissions)
CREATE POLICY "Allow public submissions" 
ON public.cruise_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Create a policy that only allows authenticated users (Yolanda) to view/edit
CREATE POLICY "Allow authenticated viewing" 
ON public.cruise_inquiries 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated updates" 
ON public.cruise_inquiries 
FOR UPDATE 
TO authenticated 
USING (true);
