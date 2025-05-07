-- Schema for webhook monitoring

-- Create webhook events table for monitoring
CREATE TABLE IF NOT EXISTS webhook_events (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_preview TEXT,
  status_code INTEGER,
  error_message TEXT,
  batch_id TEXT,
  user_id UUID,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE webhook_events IS 'Tracks webhook events for monitoring and debugging';

-- Create index for faster querying of recent events
CREATE INDEX IF NOT EXISTS webhook_events_created_at_idx ON webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS webhook_events_source_idx ON webhook_events(source);
CREATE INDEX IF NOT EXISTS webhook_events_type_idx ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS webhook_events_source_created_at_idx ON webhook_events (source, created_at DESC);

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

-- Create enrichment_batches table
CREATE TABLE IF NOT EXISTS enrichment_batches (
  id BIGSERIAL PRIMARY KEY,
  batch_request_id TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'processing', 'completed', 'failed')),
  transaction_count INTEGER NOT NULL DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Create index on status
CREATE INDEX IF NOT EXISTS enrichment_batches_status_idx ON enrichment_batches (status);

-- Create index on source
CREATE INDEX IF NOT EXISTS enrichment_batches_source_idx ON enrichment_batches (source);

-- Create webhook_alerts table for monitoring and notifications
CREATE TABLE IF NOT EXISTS webhook_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  status_code INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notified BOOLEAN DEFAULT FALSE,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')) DEFAULT 'medium'
);

-- Create index on resolved status
CREATE INDEX IF NOT EXISTS webhook_alerts_resolved_idx ON webhook_alerts (resolved);

-- Create index on notified status
CREATE INDEX IF NOT EXISTS webhook_alerts_notified_idx ON webhook_alerts (notified);

-- Create index on severity
CREATE INDEX IF NOT EXISTS webhook_alerts_severity_idx ON webhook_alerts (severity);

-- Create index for common query pattern
CREATE INDEX IF NOT EXISTS webhook_alerts_source_resolved_idx ON webhook_alerts (source, resolved);

-- Create notification_logs table for tracking sent notifications
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('email', 'slack', 'sms', 'push')),
  recipient TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on notification type
CREATE INDEX IF NOT EXISTS notification_logs_type_idx ON notification_logs (type);

-- Create index on status
CREATE INDEX IF NOT EXISTS notification_logs_status_idx ON notification_logs (status);

-- Create index on created_at
CREATE INDEX IF NOT EXISTS notification_logs_created_at_idx ON notification_logs (created_at DESC);

-- Create RLS policies
CREATE POLICY webhook_events_select_policy ON webhook_events
  FOR SELECT USING (true);

CREATE POLICY webhook_events_insert_policy ON webhook_events
  FOR INSERT WITH CHECK (true);

-- RLS for enrichment_batches
CREATE POLICY enrichment_batches_select_policy ON enrichment_batches
  FOR SELECT USING (true);

CREATE POLICY enrichment_batches_insert_policy ON enrichment_batches
  FOR INSERT WITH CHECK (true);

CREATE POLICY enrichment_batches_update_policy ON enrichment_batches
  FOR UPDATE USING (true);

-- RLS for webhook_alerts
CREATE POLICY webhook_alerts_select_policy ON webhook_alerts
  FOR SELECT USING (true);

CREATE POLICY webhook_alerts_insert_policy ON webhook_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY webhook_alerts_update_policy ON webhook_alerts
  FOR UPDATE USING (true);

-- RLS for notification_logs
CREATE POLICY notification_logs_select_policy ON notification_logs
  FOR SELECT USING (true);

CREATE POLICY notification_logs_insert_policy ON notification_logs
  FOR INSERT WITH CHECK (true); 