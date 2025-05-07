import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/nextjs';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, channel, blocks } = body;
    
    // Validate inputs
    if (!text) {
      return NextResponse.json(
        { error: 'Missing required field: text is required' },
        { status: 400 }
      );
    }

    // Use default channel if not specified
    const targetChannel = channel || process.env.SLACK_DEFAULT_CHANNEL || 'webhook-alerts';
    
    // If SLACK_WEBHOOK_URL is not defined, log and return error
    if (!process.env.SLACK_WEBHOOK_URL) {
      console.error('SLACK_WEBHOOK_URL environment variable not set');
      return NextResponse.json(
        { error: 'Slack webhook URL not configured' },
        { status: 500 }
      );
    }

    // Send message to Slack
    const slackResponse = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: targetChannel,
        text,
        blocks: blocks || [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text,
            },
          },
        ],
      }),
    });

    if (!slackResponse.ok) {
      const errorData = await slackResponse.text();
      console.error('Error sending Slack notification:', errorData);
      Sentry.captureException(new Error(`Failed to send Slack notification: ${errorData}`));
      return NextResponse.json(
        { error: 'Failed to send Slack notification' },
        { status: 500 }
      );
    }

    // Log the notification
    await supabase
      .from('notification_logs')
      .insert({
        type: 'slack',
        recipient: targetChannel,
        subject: text.substring(0, 100),
        status: 'sent',
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      message: 'Slack notification sent successfully',
    });
  } catch (error) {
    console.error('Error in Slack notification API:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 