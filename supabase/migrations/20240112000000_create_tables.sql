-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    isvip BOOLEAN,
    about TEXT,
    name TEXT,
    height NUMERIC,
    dress_size BIGINT,
    profile_picture TEXT,
    location TEXT,
    place_of_service TEXT,
    hair_color TEXT,
    eye_color TEXT,
    body_type TEXT,
    phone_number TEXT,
    is_traveling BOOLEAN,
    traveling_location TEXT,
    bookmark UUID DEFAULT gen_random_uuid(),
    interest TEXT,
    cover_image TEXT,
    age SMALLINT,
    user_type TEXT
);

-- Create meetup table
CREATE TABLE IF NOT EXISTS meetup (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    owner UUID REFERENCES users(id),
    date TEXT,
    "from time" TIME WITHOUT TIME ZONE,
    "until time" DATE
);

-- Create offers table
CREATE TABLE IF NOT EXISTS offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create pictures table
CREATE TABLE IF NOT EXISTS pictures (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    picture TEXT,
    likes NUMERIC,
    title TEXT,
    owner UUID REFERENCES users(id),
    ranking NUMERIC,
    "is main" BOOLEAN
);

-- Create rates table
CREATE TABLE IF NOT EXISTS rates (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    reason TEXT,
    price TEXT,
    duration TIME WITHOUT TIME ZONE,
    outcall BOOLEAN,
    owner UUID REFERENCES users(id)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    owner UUID REFERENCES users(id),
    service TEXT
);

-- Create story table
CREATE TABLE IF NOT EXISTS story (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    url TEXT,
    title TEXT,
    likes NUMERIC DEFAULT 0,
    owner UUID REFERENCES users(id),
    isVideo BOOLEAN
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    comment TEXT,
    name TEXT REFERENCES users(name),
    profile_picture TEXT REFERENCES users(profile_picture),
    owner UUID REFERENCES users(id),
    "to" UUID REFERENCES users(id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    "user" UUID NOT NULL,
    owner UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS transactions_offer_id_idx ON transactions(offer_id);
CREATE INDEX IF NOT EXISTS transactions_user_idx ON transactions("user");
CREATE INDEX IF NOT EXISTS transactions_owner_idx ON transactions(owner);

-- Update column names if they don't match
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'testimonials' 
        AND column_name = 'comments'
    ) THEN
        ALTER TABLE testimonials RENAME COLUMN comments TO comment;
    END IF;
END $$;
