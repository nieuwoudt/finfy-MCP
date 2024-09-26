import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    const endDate = new Date();
    const formattedEndDate = endDate.toISOString().split("T")[0];

    const investments = await plaidClient.investmentsTransactionsGet({
      access_token: access_token,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    });

    return NextResponse.json({
      investments: investments.data.investment_transactions,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching investments" },
      { status: 500 }
    );
  }
}
