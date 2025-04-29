-- Schema for webhook monitoring

-- Create webhook events table for monitoring
CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  payload_preview TEXT,
  status_code INTEGER,
  error_message TEXT,
  batch_id VARCHAR(255),
  user_id VARCHAR(255),
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
COMMENT ON TABLE webhook_events IS 'Tracks webhook events for monitoring and debugging';

-- Create index for faster querying of recent events
CREATE INDEX IF NOT EXISTS webhook_events_created_at_idx ON webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS webhook_events_source_idx ON webhook_events(source);
CREATE INDEX IF NOT EXISTS webhook_events_type_idx ON webhook_events(event_type);

-- Enable row level security
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Only allow admin users to view webhook events
CREATE POLICY "Webhook events are viewable by admins" 
  ON webhook_events FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'service_role');

-- Create a view for webhook statistics
CREATE OR REPLACE VIEW webhook_stats AS
SELECT 
  source,
  event_type,
  COUNT(*) as count,
  MIN(created_at) as first_seen,
  MAX(created_at) as last_seen,
  AVG(processing_time_ms) as avg_processing_time_ms
FROM webhook_events
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY source, event_type
ORDER BY source, event_type;

-- Create policy for the view
CREATE POLICY "Webhook stats are viewable by admins" 
  ON webhook_stats FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'service_role'); 