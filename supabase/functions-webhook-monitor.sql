-- SQL Functions for webhook monitoring

-- Function to get webhook stats for a specific source over the last 24 hours
CREATE OR REPLACE FUNCTION get_webhook_stats(source_param TEXT, hours_param INT DEFAULT 24)
RETURNS TABLE (
  source TEXT,
  total_received BIGINT,
  total_processed BIGINT,
  failed BIGINT,
  success_rate TEXT,
  avg_processing_time_ms FLOAT
) AS $$
DECLARE
  start_time TIMESTAMP;
BEGIN
  -- Calculate the start time based on hours_param
  start_time := NOW() - (hours_param * INTERVAL '1 hour');
  
  RETURN QUERY
  WITH webhook_data AS (
    SELECT 
      source,
      COUNT(*) FILTER (WHERE event_type = 'received') AS received,
      COUNT(*) FILTER (WHERE event_type = 'processed') AS processed,
      COUNT(*) FILTER (WHERE event_type = 'failed') AS failed,
      AVG(processing_time_ms) FILTER (WHERE processing_time_ms IS NOT NULL) AS avg_time
    FROM webhook_events
    WHERE source = source_param
      AND created_at >= start_time
    GROUP BY source
  )
  SELECT 
    wd.source,
    COALESCE(wd.received, 0) AS total_received,
    COALESCE(wd.processed, 0) AS total_processed,
    COALESCE(wd.failed, 0) AS failed,
    CASE 
      WHEN COALESCE(wd.received, 0) = 0 THEN '0.00'
      ELSE ROUND((COALESCE(wd.processed, 0)::FLOAT / NULLIF(wd.received, 0)::FLOAT) * 100, 2)::TEXT
    END AS success_rate,
    COALESCE(wd.avg_time, 0) AS avg_processing_time_ms
  FROM webhook_data wd;
END;
$$ LANGUAGE plpgsql;

-- Function to get webhook events for a specific batch ID
CREATE OR REPLACE FUNCTION get_batch_events(batch_id_param TEXT)
RETURNS SETOF webhook_events AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM webhook_events
  WHERE batch_id = batch_id_param
  ORDER BY created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get failed webhook events from the last X hours
CREATE OR REPLACE FUNCTION get_failed_events(hours_param INTEGER DEFAULT 24)
RETURNS SETOF webhook_events AS $$
DECLARE
  start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  start_time := NOW() - (hours_param || ' hours')::INTERVAL;
  
  RETURN QUERY
  SELECT *
  FROM webhook_events
  WHERE event_type = 'failed'
    AND created_at >= start_time
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Recent Webhook Events
CREATE OR REPLACE FUNCTION get_recent_webhook_events(limit_param INT DEFAULT 10)
RETURNS TABLE (
  id BIGINT,
  source TEXT,
  event_type TEXT,
  payload_preview TEXT,
  status_code INT,
  error_message TEXT,
  batch_id TEXT,
  user_id UUID,
  processing_time_ms INT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    we.id,
    we.source,
    we.event_type,
    we.payload_preview,
    we.status_code,
    we.error_message,
    we.batch_id,
    we.user_id,
    we.processing_time_ms,
    we.created_at
  FROM webhook_events we
  ORDER BY we.created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Test Webhook Ingestion
CREATE OR REPLACE FUNCTION test_webhook_ingestion(
  source_param TEXT,
  event_type_param TEXT,
  payload_param JSONB
)
RETURNS JSON AS $$
DECLARE
  event_id BIGINT;
  inserted_event JSONB;
BEGIN
  -- Insert test webhook event
  INSERT INTO webhook_events (
    source,
    event_type,
    payload_preview,
    status_code,
    processing_time_ms,
    created_at
  )
  VALUES (
    source_param,
    event_type_param,
    payload_param::TEXT,
    200,
    FLOOR(RANDOM() * 200 + 50)::INT,  -- Random processing time between 50-250ms
    NOW()
  )
  RETURNING id INTO event_id;
  
  -- Get the inserted event
  SELECT row_to_json(we) INTO inserted_event
  FROM webhook_events we
  WHERE we.id = event_id;
  
  RETURN json_build_object(
    'status', 'success',
    'message', 'Test webhook event created successfully',
    'event_id', event_id,
    'event', inserted_event
  );
END;
$$ LANGUAGE plpgsql;

-- Get Webhook Source Distribution
CREATE OR REPLACE FUNCTION get_webhook_source_distribution(hours_param INT DEFAULT 24)
RETURNS TABLE (
  source TEXT,
  count BIGINT
) AS $$
DECLARE
  start_time TIMESTAMP;
BEGIN
  -- Calculate the start time based on hours_param
  start_time := NOW() - (hours_param * INTERVAL '1 hour');
  
  RETURN QUERY
  SELECT 
    we.source,
    COUNT(*) AS count
  FROM webhook_events we
  WHERE we.created_at >= start_time
  GROUP BY we.source
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Get Webhook Event Type Distribution
CREATE OR REPLACE FUNCTION get_webhook_event_type_distribution(hours_param INT DEFAULT 24)
RETURNS TABLE (
  event_type TEXT,
  count BIGINT
) AS $$
DECLARE
  start_time TIMESTAMP;
BEGIN
  -- Calculate the start time based on hours_param
  start_time := NOW() - (hours_param * INTERVAL '1 hour');
  
  RETURN QUERY
  SELECT 
    we.event_type,
    COUNT(*) AS count
  FROM webhook_events we
  WHERE we.created_at >= start_time
  GROUP BY we.event_type
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Get Failed Webhook Events
CREATE OR REPLACE FUNCTION get_failed_webhook_events(limit_param INT DEFAULT 10, hours_param INT DEFAULT 24)
RETURNS TABLE (
  id BIGINT,
  source TEXT,
  event_type TEXT,
  payload_preview TEXT,
  status_code INT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  start_time TIMESTAMP;
BEGIN
  -- Calculate the start time based on hours_param
  start_time := NOW() - (hours_param * INTERVAL '1 hour');
  
  RETURN QUERY
  SELECT 
    we.id,
    we.source,
    we.event_type,
    we.payload_preview,
    we.status_code,
    we.error_message,
    we.created_at
  FROM webhook_events we
  WHERE we.event_type = 'failed'
    AND we.created_at >= start_time
  ORDER BY we.created_at DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql; 