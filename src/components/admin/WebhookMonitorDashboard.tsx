import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WebhookSource, WebhookEventType } from '@/utils/mcp/webhook-monitor';

interface WebhookEvent {
  id: number;
  source: string;
  event_type: string;
  payload_preview?: string;
  status_code?: number;
  error_message?: string;
  batch_id?: string;
  user_id?: string;
  processing_time_ms?: number;
  created_at: string;
}

interface WebhookStats {
  source: string;
  total_received: number;
  total_processed: number;
  failed: number;
  success_rate: string;
  avg_processing_time_ms: number;
}

const WebhookMonitorDashboard: React.FC = () => {
  const [recentEvents, setRecentEvents] = useState<WebhookEvent[]>([]);
  const [fingoalStats, setFingoalStats] = useState<WebhookStats | null>(null);
  const [yodleeStats, setYodleeStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch webhook data
  useEffect(() => {
    const fetchWebhookData = async () => {
      try {
        setLoading(true);

        // Fetch recent events
        const { data: eventsData, error: eventsError } = await supabase
          .from('webhook_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (eventsError) throw new Error(`Error fetching recent events: ${eventsError.message}`);
        setRecentEvents(eventsData || []);

        // Fetch stats for FinGoal
        const { data: fingoalData, error: fingoalError } = await supabase
          .rpc('get_webhook_stats', { source_param: WebhookSource.FINGOAL });

        if (fingoalError) throw new Error(`Error fetching FinGoal stats: ${fingoalError.message}`);
        setFingoalStats(fingoalData || null);

        // Fetch stats for Yodlee
        const { data: yodleeData, error: yodleeError } = await supabase
          .rpc('get_webhook_stats', { source_param: WebhookSource.YODLEE });

        if (yodleeError) throw new Error(`Error fetching Yodlee stats: ${yodleeError.message}`);
        setYodleeStats(yodleeData || null);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching webhook data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWebhookData();
    // Set up polling for regular updates
    const interval = setInterval(fetchWebhookData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format event type for display
  const formatEventType = (eventType: string) => {
    return eventType
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h3 className="text-lg font-medium">Error loading webhook data</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Webhook Monitoring Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard title="FinGoal Webhooks" stats={fingoalStats} />
        <StatsCard title="Yodlee Webhooks" stats={yodleeStats} />
      </div>

      {/* Recent Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Webhook Events</CardTitle>
          <CardDescription>The 10 most recent webhook events received by the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Processing Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{formatDate(event.created_at)}</TableCell>
                  <TableCell className="font-medium">{event.source}</TableCell>
                  <TableCell>{formatEventType(event.event_type)}</TableCell>
                  <TableCell>
                    {event.processing_time_ms ? `${event.processing_time_ms}ms` : '-'}
                  </TableCell>
                  <TableCell>
                    <EventStatusBadge eventType={event.event_type} />
                  </TableCell>
                </TableRow>
              ))}
              {recentEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No events recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Stats Card Component
const StatsCard: React.FC<{ title: string; stats: WebhookStats | null }> = ({ title, stats }) => {
  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Received</p>
            <p className="text-2xl font-bold">{stats.total_received}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Processed</p>
            <p className="text-2xl font-bold">{stats.total_processed}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Failed</p>
            <p className="text-2xl font-bold">{stats.failed}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold">{stats.success_rate}%</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Avg Processing Time</p>
            <p className="text-2xl font-bold">{Math.round(stats.avg_processing_time_ms)}ms</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Event Status Badge Component
const EventStatusBadge: React.FC<{ eventType: string }> = ({ eventType }) => {
  let statusClass = "bg-gray-100 text-gray-800";
  
  if (eventType === WebhookEventType.PROCESSED || eventType === WebhookEventType.ENRICHMENT_COMPLETED) {
    statusClass = "bg-green-100 text-green-800";
  } else if (eventType === WebhookEventType.FAILED || eventType === WebhookEventType.INVALID_SIGNATURE) {
    statusClass = "bg-red-100 text-red-800";
  } else if (eventType === WebhookEventType.RECEIVED) {
    statusClass = "bg-blue-100 text-blue-800";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
      {formatEventType(eventType)}
    </span>
  );
};

// Helper function to format event type
const formatEventType = (eventType: string) => {
  return eventType
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default WebhookMonitorDashboard; 