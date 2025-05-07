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
    const { subject, message, to } = body;
    
    // Validate inputs
    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: subject and message are required' },
        { status: 400 }
      );
    }

    // Default recipient is the admin email if not specified
    const recipient = to || process.env.ADMIN_EMAIL || 'admin@finfy.ai';
    
    // Send the email using Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: recipient,
        subject,
        html: message,
      },
    });

    if (error) {
      console.error('Error sending email notification:', error);
      Sentry.captureException(error);
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }

    // Log the notification
    await supabase
      .from('notification_logs')
      .insert({
        type: 'email',
        recipient,
        subject,
        status: 'sent',
        created_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      message: 'Email notification sent successfully',
      data: data,
    });
  } catch (error) {
    console.error('Error in email notification API:', error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 