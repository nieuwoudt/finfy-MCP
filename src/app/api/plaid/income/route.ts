import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    const income = await plaidClient.creditBankIncomeGet({
      user_token: access_token,
    });

    return NextResponse.json({
      income: income.data.bank_income,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
