-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS policy: Only admins can insert/update/delete roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create survey_responses table
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_type TEXT NOT NULL CHECK (LENGTH(client_type) <= 50),
  date_of_transaction DATE NOT NULL,
  sex TEXT CHECK (sex IN ('Male', 'Female', 'Prefer not to say')),
  age INTEGER CHECK (age >= 1 AND age <= 120),
  region TEXT CHECK (LENGTH(region) <= 100),
  service_availed TEXT NOT NULL CHECK (LENGTH(service_availed) <= 200),
  cc1 TEXT CHECK (cc1 IN ('Yes', 'No')),
  cc2 TEXT CHECK (cc2 IN ('Easy to see', 'Somewhat easy', 'Difficult', 'N/A')),
  cc3 TEXT CHECK (cc3 IN ('Yes', 'No', 'N/A')),
  sqd0 INTEGER CHECK (sqd0 >= 1 AND sqd0 <= 5),
  sqd1 INTEGER CHECK (sqd1 >= 1 AND sqd1 <= 5),
  sqd2 INTEGER CHECK (sqd2 >= 1 AND sqd2 <= 5),
  sqd3 INTEGER CHECK (sqd3 >= 1 AND sqd3 <= 5),
  sqd4 INTEGER CHECK (sqd4 >= 1 AND sqd4 <= 5),
  sqd5 INTEGER CHECK (sqd5 >= 1 AND sqd5 <= 5),
  sqd6 INTEGER CHECK (sqd6 >= 1 AND sqd6 <= 5),
  sqd7 INTEGER CHECK (sqd7 >= 1 AND sqd7 <= 5),
  sqd8 INTEGER CHECK (sqd8 >= 1 AND sqd8 <= 5),
  suggestions TEXT CHECK (LENGTH(suggestions) <= 2000),
  email TEXT CHECK (LENGTH(email) <= 255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on survey_responses
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- RLS policy: Anyone can insert survey responses (public can submit)
CREATE POLICY "Anyone can submit surveys"
  ON public.survey_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS policy: Only admins can view survey responses
CREATE POLICY "Admins can view all surveys"
  ON public.survey_responses
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy: Only admins can update/delete survey responses
CREATE POLICY "Admins can manage surveys"
  ON public.survey_responses
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete surveys"
  ON public.survey_responses
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));