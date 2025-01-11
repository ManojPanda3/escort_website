-- Create offers table
CREATE TABLE offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    "user" UUID NOT NULL,
    owner UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes
CREATE INDEX transactions_offer_id_idx ON transactions(offer_id);
CREATE INDEX transactions_user_idx ON transactions("user");
CREATE INDEX transactions_owner_idx ON transactions(owner);

