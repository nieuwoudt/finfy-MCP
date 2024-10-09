import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, accountId } = await req.json();
    console.log(accessToken, accountId, process.env.YODLEE_BASE_URL)
    // Make request to Yodlee API for account details
    const response = await fetch(`${process.env.YODLEE_BASE_URL}/accounts`, {
      method: "GET",
      headers: {
        "Api-Version": process.env.YODLEE_API_VERSION || "1.1",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${accessToken}`,
        "loginName": "sbMemk6s4a3914f7601" as string, // loginName in header
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Yodlee account details: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data, 'data')
    // Extract only relevant data from accounts
    const accounts = data.account.map((account: any) => ({
      accountName: account.accountName,
      accountType: account.accountType,
      currentBalance: account.balance.amount,
      availableBalance: account.availableBalance?.amount,
      currency: account.balance.currency,
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
