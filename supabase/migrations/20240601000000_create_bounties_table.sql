
-- Create enum types
CREATE TYPE bounty_status AS ENUM ('active', 'paused', 'expired', 'completed');
CREATE TYPE bounty_type AS ENUM ('nft_referral', 'talent_acquisition', 'business_development', 'custom');
CREATE TYPE reward_type AS ENUM ('fixed', 'percentage', 'tiered');

-- Create bounties table
CREATE TABLE IF NOT EXISTS bounties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  bounty_type bounty_type NOT NULL,
  reward_type reward_type NOT NULL,
  reward_amount NUMERIC NOT NULL,
  total_budget NUMERIC NOT NULL,
  used_budget NUMERIC NOT NULL DEFAULT 0,
  remaining_budget NUMERIC NOT NULL,
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  status bounty_status NOT NULL DEFAULT 'active',
  success_count INTEGER NOT NULL DEFAULT 0,
  hunter_count INTEGER NOT NULL DEFAULT 0,
  party_address TEXT,
  crowdfund_address TEXT,
  blockchain_deployed BOOLEAN NOT NULL DEFAULT FALSE,
  creator_address TEXT NOT NULL,
  success_criteria TEXT,
  eligible_nfts TEXT[],
  require_verification BOOLEAN NOT NULL DEFAULT TRUE,
  allow_public_hunters BOOLEAN NOT NULL DEFAULT TRUE,
  max_referrals_per_hunter INTEGER NOT NULL DEFAULT 10
);

-- Create index on status for faster queries
CREATE INDEX idx_bounties_status ON bounties (status);
CREATE INDEX idx_bounties_creator ON bounties (creator_address);

-- Create referrals table (in addition to the existing one)
CREATE TABLE IF NOT EXISTS bounty_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bounty_id TEXT NOT NULL REFERENCES bounties(id),
  referrer_address TEXT NOT NULL,
  referred_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  verification_date TIMESTAMP WITH TIME ZONE,
  reward_amount NUMERIC NOT NULL,
  payment_processed BOOLEAN NOT NULL DEFAULT FALSE,
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_tx_hash TEXT,
  UNIQUE(bounty_id, referrer_address, referred_address)
);

-- Create indexes for the referrals table
CREATE INDEX idx_referrals_bounty ON bounty_referrals (bounty_id);
CREATE INDEX idx_referrals_referrer ON bounty_referrals (referrer_address);
CREATE INDEX idx_referrals_referred ON bounty_referrals (referred_address);
CREATE INDEX idx_referrals_status ON bounty_referrals (status);

-- RLS Policies for bounties
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;

-- Anyone can view bounties
CREATE POLICY "Anyone can view bounties" 
  ON bounties FOR SELECT 
  USING (true);

-- Only the creator can update their bounties
CREATE POLICY "Creators can update their own bounties" 
  ON bounties FOR UPDATE 
  USING (creator_address = auth.uid());

-- Only verified users can insert bounties
CREATE POLICY "Authenticated users can create bounties" 
  ON bounties FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for referrals
ALTER TABLE bounty_referrals ENABLE ROW LEVEL SECURITY;

-- Anyone can view referrals where they are the referrer
CREATE POLICY "Users can view their own referrals" 
  ON bounty_referrals FOR SELECT 
  USING (referrer_address = auth.uid() OR referred_address = auth.uid());

-- Anyone can create referrals
CREATE POLICY "Anyone can create referrals" 
  ON bounty_referrals FOR INSERT 
  WITH CHECK (true);

-- Only the referrer can update their referrals
CREATE POLICY "Only referrers can update their referrals" 
  ON bounty_referrals FOR UPDATE 
  USING (referrer_address = auth.uid());
