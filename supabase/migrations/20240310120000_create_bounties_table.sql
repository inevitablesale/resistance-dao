
-- Create a table for bounties
CREATE TABLE IF NOT EXISTS bounties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_type TEXT NOT NULL,
  reward_amount NUMERIC NOT NULL,
  total_budget NUMERIC NOT NULL,
  used_budget NUMERIC NOT NULL DEFAULT 0,
  remaining_budget NUMERIC NOT NULL,
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  success_count INTEGER NOT NULL DEFAULT 0,
  hunter_count INTEGER NOT NULL DEFAULT 0,
  party_address TEXT,
  crowdfund_address TEXT,
  creator_address TEXT NOT NULL,
  eligible_nfts TEXT[] DEFAULT '{}',
  require_verification BOOLEAN NOT NULL DEFAULT false,
  bounty_type TEXT NOT NULL
);

-- Create a table for tracking referrals specifically for bounties
CREATE TABLE IF NOT EXISTS bounty_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bounty_id TEXT NOT NULL REFERENCES bounties(id),
  referrer_address TEXT NOT NULL,
  referred_address TEXT NOT NULL,
  referral_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  reward_amount NUMERIC,
  completed_at TIMESTAMP WITH TIME ZONE,
  verification_data JSONB,
  tx_hash TEXT,
  UNIQUE(bounty_id, referrer_address, referred_address)
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties (status);
CREATE INDEX IF NOT EXISTS idx_bounties_creator ON bounties (creator_address);
CREATE INDEX IF NOT EXISTS idx_bounty_referrals_bounty ON bounty_referrals (bounty_id);
CREATE INDEX IF NOT EXISTS idx_bounty_referrals_referrer ON bounty_referrals (referrer_address);
CREATE INDEX IF NOT EXISTS idx_bounty_referrals_status ON bounty_referrals (status);

-- Create RLS policies for bounties
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;

-- Anyone can view active bounties
CREATE POLICY view_active_bounties ON bounties 
  FOR SELECT USING (status = 'active' OR status = 'paused');

-- Creators can view all their bounties regardless of status
CREATE POLICY creators_view_own_bounties ON bounties 
  FOR SELECT USING (auth.uid()::text = creator_address);

-- Only creators can update their own bounties
CREATE POLICY creators_update_bounties ON bounties 
  FOR UPDATE USING (auth.uid()::text = creator_address);

-- Create RLS policies for bounty referrals
ALTER TABLE bounty_referrals ENABLE ROW LEVEL SECURITY;

-- Referrers can view their own referrals
CREATE POLICY referrers_view_own_referrals ON bounty_referrals 
  FOR SELECT USING (auth.uid()::text = referrer_address);

-- Bounty creators can view all referrals for their bounties
CREATE POLICY creators_view_bounty_referrals ON bounty_referrals 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bounties 
      WHERE bounties.id = bounty_referrals.bounty_id 
      AND bounties.creator_address = auth.uid()::text
    )
  );

-- Anyone can insert referrals (they'll need to be approved)
CREATE POLICY insert_referrals ON bounty_referrals 
  FOR INSERT WITH CHECK (true);
