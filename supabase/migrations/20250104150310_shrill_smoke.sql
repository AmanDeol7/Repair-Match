/*
  # Initial Database Schema

  1. Tables
    - profiles: User profiles for both requesters and repairers
    - repair_jobs: Repair job listings
    - bids: Bids on repair jobs
    - messages: Chat messages between users

  2. Security
    - RLS policies for each table
    - Authentication using Supabase Auth

  3. Indexes
    - Optimized queries for common operations
*/

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('requester', 'repairer')),
  bio TEXT,
  location TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5.00)
);

-- Repair jobs table
CREATE TABLE IF NOT EXISTS repair_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL CHECK (budget > 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed')),
  requester_id UUID NOT NULL REFERENCES profiles(id),
  repairer_id UUID REFERENCES profiles(id),
  location TEXT NOT NULL,
  category TEXT NOT NULL
);

-- Bids table
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  job_id UUID NOT NULL REFERENCES repair_jobs(id),
  repairer_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  estimated_days INTEGER NOT NULL CHECK (estimated_days > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected'))
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  job_id UUID NOT NULL REFERENCES repair_jobs(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Repair jobs policies
CREATE POLICY "Jobs are viewable by everyone"
  ON repair_jobs FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create jobs"
  ON repair_jobs FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update own jobs"
  ON repair_jobs FOR UPDATE
  USING (auth.uid() = requester_id);

-- Bids policies
CREATE POLICY "Bids are viewable by job owner and bidder"
  ON bids FOR SELECT
  USING (
    auth.uid() IN (
      SELECT requester_id FROM repair_jobs WHERE id = job_id
      UNION
      SELECT repairer_id
    )
  );

CREATE POLICY "Repairers can create bids"
  ON bids FOR INSERT
  WITH CHECK (
    auth.uid() = repairer_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'repairer'
    )
  );

-- Messages policies
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_repair_jobs_status ON repair_jobs(status);
CREATE INDEX IF NOT EXISTS idx_repair_jobs_category ON repair_jobs(category);
CREATE INDEX IF NOT EXISTS idx_bids_job_id ON bids(job_id);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages(sender_id, receiver_id);