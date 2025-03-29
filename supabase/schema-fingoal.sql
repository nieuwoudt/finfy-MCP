-- Schema extensions for FinGoal integration

-- Add a data provider column to the users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_provider VARCHAR(50);
COMMENT ON COLUMN users.data_provider IS 'The financial data provider (plaid, fingoal, etc.) preferred by the user';

-- Create a table to store FinGoal enrichment batch processing status
CREATE TABLE IF NOT EXISTS enrichment_batches (
  id SERIAL PRIMARY KEY,
  batch_id VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  transaction_count INTEGER DEFAULT 0
);
COMMENT ON TABLE enrichment_batches IS 'Tracks the status of FinGoal transaction enrichment batch processes';

-- Create a table to store transaction tags
CREATE TABLE IF NOT EXISTS transaction_tags (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(255) NOT NULL,
  tag VARCHAR(255) NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'fingoal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE transaction_tags IS 'Stores tags associated with transactions from providers like FinGoal';
-- Create unique index to prevent duplicate tags
CREATE UNIQUE INDEX IF NOT EXISTS transaction_tags_unique_idx ON transaction_tags(transaction_id, tag);

-- Create a table to store user tags
CREATE TABLE IF NOT EXISTS user_tags (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  tag_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  confidence FLOAT DEFAULT 0,
  tag_type VARCHAR(50),
  tag_description TEXT,
  source VARCHAR(50) NOT NULL DEFAULT 'fingoal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE user_tags IS 'Stores user tags from providers like FinGoal, representing user behaviors or preferences';
-- Create unique index to prevent duplicate user tags
CREATE UNIQUE INDEX IF NOT EXISTS user_tags_unique_idx ON user_tags(user_id, tag_id);

-- Create a table to store FinGoal tag updates
CREATE TABLE IF NOT EXISTS fingoal_tag_updates (
  id SERIAL PRIMARY KEY,
  guid VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE fingoal_tag_updates IS 'Tracks FinGoal tag update webhook events';

-- Create a table to store savings recommendations
CREATE TABLE IF NOT EXISTS savings_recommendations (
  id SERIAL PRIMARY KEY,
  finsight_id VARCHAR(255) NOT NULL UNIQUE,
  unique_id VARCHAR(255),
  user_id VARCHAR(255) NOT NULL,
  transaction_id VARCHAR(255),
  insight_cta_url TEXT,
  finsight_image TEXT,
  insight_text TEXT,
  recommendation VARCHAR(255),
  amount_found DECIMAL(12, 2),
  category VARCHAR(100),
  finsight_date TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE savings_recommendations IS 'Stores savings recommendations from FinGoal';

-- Update the transactions table to add enrichment fields if they don't exist
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'plaid';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS enriched BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS original_data JSONB;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS enrichment_data JSONB;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Enable row-level security for new tables
ALTER TABLE enrichment_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE fingoal_tag_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for the new tables
CREATE POLICY "Enrichment batches are viewable by all authenticated users" 
  ON enrichment_batches FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Transaction tags are viewable by transaction owner" 
  ON transaction_tags FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM transactions t 
      WHERE t.transaction_id = transaction_tags.transaction_id
      AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "User tags are viewable by tag owner" 
  ON user_tags FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "FinGoal tag updates are viewable by administrators" 
  ON fingoal_tag_updates FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Savings recommendations are viewable by recommendation owner" 
  ON savings_recommendations FOR SELECT USING (user_id = auth.uid());

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_enrichment_batches_timestamp
BEFORE UPDATE ON enrichment_batches
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_savings_recommendations_timestamp
BEFORE UPDATE ON savings_recommendations
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp(); 