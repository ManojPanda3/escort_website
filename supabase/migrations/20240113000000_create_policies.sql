-- Enable Row Level Security for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetup ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pictures ENABLE ROW LEVEL SECURITY;
ALTER TABLE rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE story ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Update users table to reference auth.users
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT auth.uid(),
ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);

-- Service role has full access to all tables
CREATE POLICY "Service role has full access"
ON users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access"
ON meetup FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access"
ON offers FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access"
ON pictures FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access"
ON rates FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access"
ON services FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access"
ON story FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access"
ON testimonials FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access"
ON transactions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Users table policies for authenticated users
CREATE POLICY "Users can view all profiles"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own non-restricted fields"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  -- Prevent updating restricted fields
  (isvip IS NOT DISTINCT FROM OLD.isvip) AND
  (place_of_service IS NOT DISTINCT FROM OLD.place_of_service)
);

-- Meetup table policies
CREATE POLICY "Users can view all meetups"
ON meetup FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own meetups"
ON meetup FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own meetups"
ON meetup FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Users can delete their own meetups"
ON meetup FOR DELETE
TO authenticated
USING (auth.uid() = owner);

-- Pictures table policies
CREATE POLICY "Users can view all pictures"
ON pictures FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own pictures"
ON pictures FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own pictures"
ON pictures FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Users can delete their own pictures"
ON pictures FOR DELETE
TO authenticated
USING (auth.uid() = owner);

-- Rates table policies
CREATE POLICY "Users can view all rates"
ON rates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own rates"
ON rates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own rates"
ON rates FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Users can delete their own rates"
ON rates FOR DELETE
TO authenticated
USING (auth.uid() = owner);

-- Services table policies
CREATE POLICY "Users can view all services"
ON services FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own services"
ON services FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own services"
ON services FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Users can delete their own services"
ON services FOR DELETE
TO authenticated
USING (auth.uid() = owner);

-- Story table policies
CREATE POLICY "Users can view all stories"
ON story FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own stories"
ON story FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own stories"
ON story FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Users can delete their own stories"
ON story FOR DELETE
TO authenticated
USING (auth.uid() = owner);

-- Testimonials table policies
CREATE POLICY "Users can view all testimonials"
ON testimonials FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert testimonials"
ON testimonials FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner);

CREATE POLICY "Users can update their own testimonials"
ON testimonials FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Users can delete their own testimonials"
ON testimonials FOR DELETE
TO authenticated
USING (auth.uid() = owner);

-- Offers table policies (only accessible by service_role)
-- No policies for authenticated users - only service_role has access via policy above

-- Transactions table policies
CREATE POLICY "Users can view their own transactions"
ON transactions FOR SELECT
TO authenticated
USING (auth.uid() = "user" OR auth.uid() = owner);

CREATE POLICY "Users can insert their own transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "user");
