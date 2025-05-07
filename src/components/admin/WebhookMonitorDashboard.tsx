import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import { 
  AlertCircle, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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

interface SourceDistribution {
  name: string;
  value: number;
}

interface EventTypeDistribution {
  name: string;
  value: number;
}

const WebhookMonitorDashboard: React.FC = () => {
  const [recentEvents, setRecentEvents] = useState<WebhookEvent[]>([]);
  const [fingoalStats, setFingoalStats] = useState<WebhookStats | null>(null);
  const [yodleeStats, setYodleeStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeWindow, setTimeWindow] = useState<string>("24");
  const [refreshing, setRefreshing] = useState(false);
  const [sourceDistribution, setSourceDistribution] = useState<SourceDistribution[]>([]);
  const [eventTypeDistribution, setEventTypeDistribution] = useState<EventTypeDistribution[]>([]);
  const [alertThreshold, setAlertThreshold] = useState<number>(80); // Success rate threshold for alerts
  const [failedEvents, setFailedEvents] = useState<WebhookEvent[]>([]);

  // Fetch webhook data
  const fetchWebhookData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);

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
        .rpc('get_webhook_stats', { 
          source_param: WebhookSource.FINGOAL,
          hours_param: parseInt(timeWindow)
        });

      if (fingoalError) throw new Error(`Error fetching FinGoal stats: ${fingoalError.message}`);
      setFingoalStats(fingoalData || null);

      // Fetch stats for Yodlee
      const { data: yodleeData, error: yodleeError } = await supabase
        .rpc('get_webhook_stats', { 
          source_param: WebhookSource.YODLEE,
          hours_param: parseInt(timeWindow)
        });

      if (yodleeError) throw new Error(`Error fetching Yodlee stats: ${yodleeError.message}`);
      setYodleeStats(yodleeData || null);

      // Fetch failed events for the alert system
      const { data: failedData, error: failedError } = await supabase
        .from('webhook_events')
        .select('*')
        .eq('event_type', WebhookEventType.FAILED)
        .order('created_at', { ascending: false })
        .limit(5);

      if (failedError) throw new Error(`Error fetching failed events: ${failedError.message}`);
      setFailedEvents(failedData || []);

      // Fetch data for source distribution chart
      const { data: sourceData, error: sourceError } = await supabase
        .rpc('get_webhook_source_distribution', { hours_param: parseInt(timeWindow) });

      if (sourceError) throw new Error(`Error fetching source distribution: ${sourceError.message}`);
      setSourceDistribution(
        sourceData?.map((item: any) => ({ name: item.source, value: parseInt(item.count) })) || []
      );

      // Fetch data for event type distribution chart
      const { data: eventTypeData, error: eventTypeError } = await supabase
        .rpc('get_webhook_event_type_distribution', { hours_param: parseInt(timeWindow) });

      if (eventTypeError) throw new Error(`Error fetching event type distribution: ${eventTypeError.message}`);
      setEventTypeDistribution(
        eventTypeData?.map((item: any) => ({ name: formatEventType(item.event_type), value: parseInt(item.count) })) || []
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching webhook data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWebhookData();
    // Set up polling for regular updates
    const interval = setInterval(fetchWebhookData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [timeWindow]);

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

  // Check if any source has a success rate below threshold
  const hasLowSuccessRate = () => {
    if (fingoalStats && parseFloat(fingoalStats.success_rate) < alertThreshold) return true;
    if (yodleeStats && parseFloat(yodleeStats.success_rate) < alertThreshold) return true;
    return false;
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];

  if (loading && !refreshing) {
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Webhook Monitoring Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Select
            value={timeWindow}
            onValueChange={(value: string) => setTimeWindow(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Window" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last Hour</SelectItem>
              <SelectItem value="6">Last 6 Hours</SelectItem>
              <SelectItem value="12">Last 12 Hours</SelectItem>
              <SelectItem value="24">Last 24 Hours</SelectItem>
              <SelectItem value="48">Last 2 Days</SelectItem>
              <SelectItem value="168">Last Week</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchWebhookData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {/* Alerts */}
      {hasLowSuccessRate() && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Webhook Performance Alert</AlertTitle>
          <AlertDescription>
            One or more webhook integrations have a success rate below {alertThreshold}%. Please investigate immediately.
          </AlertDescription>
        </Alert>
      )}

      {failedEvents.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Recent Webhook Failures</AlertTitle>
          <AlertDescription>
            There are {failedEvents.length} recent webhook failures. The most recent one occurred at {formatDate(failedEvents[0].created_at)}.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard title="FinGoal Webhooks" stats={fingoalStats} />
        <StatsCard title="Yodlee Webhooks" stats={yodleeStats} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution by Source</CardTitle>
            <CardDescription>Percentage of webhooks received from each source</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribution by Event Type</CardTitle>
            <CardDescription>Breakdown of webhook events by type</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventTypeDistribution}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
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
                <TableHead>Error</TableHead>
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
                  <TableCell>
                    {event.error_message ? (
                      <span className="text-red-600 truncate max-w-[150px] inline-block" title={event.error_message}>
                        {event.error_message.substring(0, 20)}...
                      </span>
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {recentEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No events recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm">
            View All Events
          </Button>
        </CardFooter>
      </Card>

      {/* Failed Events Tab */}
      <Card>
        <CardHeader>
          <CardTitle>Failed Webhook Events</CardTitle>
          <CardDescription>Recent webhook failures that need attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Error Message</TableHead>
                <TableHead>Status Code</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failedEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{formatDate(event.created_at)}</TableCell>
                  <TableCell className="font-medium">{event.source}</TableCell>
                  <TableCell className="truncate max-w-[200px]" title={event.error_message}>
                    {event.error_message || "Unknown error"}
                  </TableCell>
                  <TableCell>{event.status_code || "N/A"}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Retry</Button>
                  </TableCell>
                </TableRow>
              ))}
              {failedEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No failed events - everything is running smoothly!
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

  // Determine status color based on success rate
  const getStatusColor = (rate: string) => {
    const rateNum = parseFloat(rate);
    if (rateNum >= 95) return "text-green-600";
    if (rateNum >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          <Badge variant={parseFloat(stats.success_rate) >= 95 ? "success" : parseFloat(stats.success_rate) >= 80 ? "warning" : "destructive"}>
            {stats.success_rate}% Success
          </Badge>
        </CardTitle>
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
            <p className={stats.failed > 0 ? "text-red-600 text-2xl font-bold" : "text-2xl font-bold"}>
              {stats.failed}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Success Rate</p>
            <p className={`text-2xl font-bold ${getStatusColor(stats.success_rate)}`}>
              {stats.success_rate}%
            </p>
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
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  
  if (eventType === WebhookEventType.PROCESSED || eventType === WebhookEventType.ENRICHMENT_COMPLETED) {
    variant = "default"; // green
  } else if (eventType === WebhookEventType.FAILED || eventType === WebhookEventType.INVALID_SIGNATURE) {
    variant = "destructive"; // red
  } else if (eventType === WebhookEventType.RECEIVED) {
    variant = "secondary"; // gray
  }
  
  return (
    <Badge variant={variant}>
      {formatEventType(eventType)}
    </Badge>
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