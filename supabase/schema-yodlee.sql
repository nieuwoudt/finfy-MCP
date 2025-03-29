-- Schema extensions for Yodlee integration

-- Add data provider column to users if it doesn't already exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS data_provider VARCHAR(50);

-- Create webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE webhook_logs IS 'Stores webhook events from data providers like Yodlee';

-- Create table for data processing status
CREATE TABLE IF NOT EXISTS data_processing_status (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE data_processing_status IS 'Tracks status of data processing jobs for providers like Yodlee';

-- Create table for provider accounts
CREATE TABLE IF NOT EXISTS provider_accounts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  provider_name VARCHAR(255),
  refresh_status VARCHAR(50) DEFAULT 'PENDING',
  auto_refresh_status VARCHAR(50),
  last_refresh TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE provider_accounts IS 'Stores provider account details and status';
CREATE UNIQUE INDEX IF NOT EXISTS provider_accounts_provider_id_idx ON provider_accounts(provider, provider_account_id);

-- Create table for Yodlee accounts
CREATE TABLE IF NOT EXISTS accounts_yodlee (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  account_id BIGINT,
  provider_account_id BIGINT,
  account_name VARCHAR(255),
  account_status VARCHAR(50),
  account_type VARCHAR(100),
  account_number VARCHAR(100),
  displayed_name VARCHAR(255),
  bank_transfer_code_id VARCHAR(100),
  bank_transfer_code_type VARCHAR(50),
  container VARCHAR(50),
  provider_id VARCHAR(100),
  provider_name VARCHAR(255),
  provider_logo TEXT,
  balance_amount DECIMAL(12, 2),
  balance_currency VARCHAR(10),
  available_balance_amount DECIMAL(12, 2), 
  available_balance_currency VARCHAR(10),
  current_balance_amount DECIMAL(12, 2),
  current_balance_currency VARCHAR(10),
  aggregation_source VARCHAR(100),
  is_asset BOOLEAN,
  is_manual BOOLEAN,
  include_in_net_worth BOOLEAN,
  user_classification VARCHAR(100),
  full_account_number VARCHAR(100),
  payment_account_number VARCHAR(100),
  created_date TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE accounts_yodlee IS 'Stores account details from Yodlee';
CREATE INDEX IF NOT EXISTS accounts_yodlee_user_id_idx ON accounts_yodlee(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS accounts_yodlee_user_id_account_id_idx ON accounts_yodlee(user_id, account_id);

-- Create table for Yodlee transactions
CREATE TABLE IF NOT EXISTS transactions_yodlee (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_id BIGINT,
  account_id BIGINT,
  container VARCHAR(50),
  category VARCHAR(255),
  category_id INTEGER,
  category_type VARCHAR(50),
  category_source VARCHAR(50),
  high_level_category_id INTEGER,
  amount DECIMAL(12, 2),
  currency VARCHAR(10),
  description TEXT,
  description_original TEXT,
  is_manual BOOLEAN,
  date DATE,
  transaction_date DATE,
  post_date DATE,
  status VARCHAR(50),
  source_type VARCHAR(50),
  running_balance_amount DECIMAL(12, 2),
  running_balance_currency VARCHAR(10),
  check_number VARCHAR(50),
  created_date TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE transactions_yodlee IS 'Stores transaction details from Yodlee';
CREATE INDEX IF NOT EXISTS transactions_yodlee_user_id_idx ON transactions_yodlee(user_id);
CREATE INDEX IF NOT EXISTS transactions_yodlee_account_id_idx ON transactions_yodlee(account_id);
CREATE INDEX IF NOT EXISTS transactions_yodlee_date_idx ON transactions_yodlee(date);
CREATE UNIQUE INDEX IF NOT EXISTS transactions_yodlee_user_id_transaction_id_idx ON transactions_yodlee(user_id, transaction_id);

-- Enable Row Level Security
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_processing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_yodlee ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions_yodlee ENABLE ROW LEVEL SECURITY;

-- Create policies for the tables
CREATE POLICY "Webhook logs are viewable by admins only" 
  ON webhook_logs FOR SELECT 
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Data processing status is viewable by the user that owns the data" 
  ON data_processing_status FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Provider accounts are viewable by the user that owns the account" 
  ON provider_accounts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Yodlee accounts are viewable by the user that owns the account" 
  ON accounts_yodlee FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Yodlee transactions are viewable by the user that owns the transaction" 
  ON transactions_yodlee FOR SELECT 
  USING (auth.uid() = user_id);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_provider_accounts_timestamp
  BEFORE UPDATE ON provider_accounts
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_data_processing_status_timestamp
  BEFORE UPDATE ON data_processing_status
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp(); 