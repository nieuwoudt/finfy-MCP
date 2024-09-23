import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    const liabilities = await plaidClient.liabilitiesGet({
      access_token: access_token,
    });

    return NextResponse.json({
      liabilities: liabilities.data.liabilities,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
