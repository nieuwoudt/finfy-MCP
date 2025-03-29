import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/nextjs";
import { saveAccountYodlee, saveTransactionsYodlee } from "@/utils/yodlee-api";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { userId, providerAccountId } = await req.json();
    
    if (!userId || !providerAccountId) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 1. Retrieve user's access token or create a new one
    const tokenResponse = await fetch(`${process.env.YODLEE_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Api-Version": process.env.YODLEE_API_VERSION || "1.1",
        "loginName": process.env.YODLEE_LOGIN_NAME as string,
      },
      body: new URLSearchParams({
        clientId: process.env.YODLEE_CLIENT_ID as string,
        secret: process.env.YODLEE_CLIENT_SECRET as string,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Failed to get access token: ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.token.accessToken;

    // 2. Fetch account details
    const accountsResponse = await fetch(`${process.env.YODLEE_BASE_URL}/accounts?providerAccountId=${providerAccountId}`, {
      method: "GET",
      headers: {
        "Api-Version": process.env.YODLEE_API_VERSION || "1.1",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (!accountsResponse.ok) {
      const errorData = await accountsResponse.json();
      throw new Error(`Failed to fetch accounts: ${JSON.stringify(errorData)}`);
    }

    const accountsData = await accountsResponse.json();
    const accounts = accountsData.account || [];

    // 3. Get provider details for one account to retrieve the logo
    if (accounts.length > 0) {
      const providerId = accounts[0].providerId;
      
      const providerResponse = await fetch(`${process.env.YODLEE_BASE_URL}/providers?providerId=${providerId}`, {
        method: "GET",
        headers: {
          "Api-Version": process.env.YODLEE_API_VERSION || "1.1",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (providerResponse.ok) {
        const providerData = await providerResponse.json();
        const provider = providerData.provider && providerData.provider[0];
        
        // 4. Save account information
        await saveAccountYodlee(accounts, userId, provider);
      }
    }

    // 5. Get account IDs for fetching transactions
    const accountIds = accounts.map((account: any) => account.id).join(",");
    
    if (accountIds) {
      // 6. Fetch and save transactions
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 2); // 2 years of history
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = new Date().toISOString().split("T")[0];

      const transactionsResponse = await fetch(`${process.env.YODLEE_BASE_URL}/transactions?accountId=${accountIds}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`, {
        method: "GET",
        headers: {
          "Api-Version": process.env.YODLEE_API_VERSION || "1.1",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        const transactions = transactionsData.transaction || [];
        
        // 7. Save transactions
        await saveTransactionsYodlee(transactions, userId);
      }
    }

    // 8. Update the processing status
    await supabase
      .from("data_processing_status")
      .insert({
        user_id: userId,
        provider: "yodlee",
        provider_account_id: providerAccountId,
        status: "completed",
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      message: "Data processing completed successfully",
      accounts_count: accounts.length
    });
  } catch (error) {
    console.error("Error processing latest data:", error);
    Sentry.captureException(error);
    
    return NextResponse.json(
      { message: "Error processing data", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 