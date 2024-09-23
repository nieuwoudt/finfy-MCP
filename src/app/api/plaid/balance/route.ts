import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    const balances = await plaidClient.accountsBalanceGet({
      access_token: access_token,
    });

    return NextResponse.json({
      balances: balances.data.accounts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
