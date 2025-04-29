-- SQL Functions for webhook monitoring

-- Function to get webhook stats for a specific source over the last 24 hours
CREATE OR REPLACE FUNCTION get_webhook_stats(source_param TEXT)
RETURNS JSON AS $$
DECLARE
  start_time TIMESTAMP WITH TIME ZONE;
  total_received INTEGER;
  total_processed INTEGER;
  failed INTEGER;
  success_rate DECIMAL;
  avg_processing_time DECIMAL;
  result JSON;
BEGIN
  -- Set the time window to the last 24 hours
  start_time := NOW() - INTERVAL '24 hours';
  
  -- Count total received webhooks
  SELECT COUNT(*) INTO total_received
  FROM webhook_events
  WHERE source = source_param
    AND event_type = 'received'
    AND created_at >= start_time;
  
  -- Count total processed webhooks
  SELECT COUNT(*) INTO total_processed
  FROM webhook_events
  WHERE source = source_param
    AND event_type = 'processed'
    AND created_at >= start_time;
  
  -- Count failed webhooks
  SELECT COUNT(*) INTO failed
  FROM webhook_events
  WHERE source = source_param
    AND event_type = 'failed'
    AND created_at >= start_time;
  
  -- Calculate success rate
  IF total_received > 0 THEN
    success_rate := (total_processed::DECIMAL / total_received) * 100;
  ELSE
    success_rate := 0;
  END IF;
  
  -- Calculate average processing time
  SELECT AVG(processing_time_ms) INTO avg_processing_time
  FROM webhook_events
  WHERE source = source_param
    AND processing_time_ms IS NOT NULL
    AND created_at >= start_time;
  
  -- If no processing times found, set to zero
  IF avg_processing_time IS NULL THEN
    avg_processing_time := 0;
  END IF;
  
  -- Build the result JSON
  result := json_build_object(
    'source', source_param,
    'total_received', total_received,
    'total_processed', total_processed,
    'failed', failed,
    'success_rate', ROUND(success_rate::NUMERIC, 2),
    'avg_processing_time_ms', ROUND(avg_processing_time::NUMERIC, 2)
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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