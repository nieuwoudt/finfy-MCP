import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the dashboard to avoid server-side rendering issues with Supabase client
const WebhookMonitorDashboard = dynamic(
  () => import('@/components/admin/WebhookMonitorDashboard'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Webhook Monitoring | Finfy Admin',
  description: 'Monitor and analyze webhook activity in the Finfy platform',
};

export default function WebhooksMonitoringPage() {
  return (
    <div className="container mx-auto py-8">
      <WebhookMonitorDashboard />
    </div>
  );
} 