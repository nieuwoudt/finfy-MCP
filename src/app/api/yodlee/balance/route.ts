import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { access_token, providerAccountId } = await req.json();

    // Make request to Yodlee API for account details
    const response = await fetch(`${process.env.YODLEE_BASE_URL}/accounts?providerAccountId=${providerAccountId}&include=fullAccountNumber`, {
      method: "GET",
      headers: {
        "Api-Version": process.env.YODLEE_API_VERSION || "1.1",
        "Content-Type": "application/vnd.yodlee+json",
        "Authorization": `Bearer ${access_token}`, // Add the Bearer token here
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Yodlee account details: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract only relevant data from accounts
    const accounts = data.account.map((account: any) => ({
      accountName: account.accountName,
      accountType: account.accountType,
      currentBalance: account.currentBalance.amount,
      availableBalance: account.availableBalance?.amount,
      currency: account.currentBalance.currency,
      fullAccountNumber: account.fullAccountNumber,
      routingNumber: account.bankTransferCode?.find((code: any) => code.type === 'ROUTING_NUMBER')?.id,
    }));

    return NextResponse.json({
      accounts, // Return only the relevant fields
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching Yodlee account details" },
      { status: 500 }
    );
  }
}
