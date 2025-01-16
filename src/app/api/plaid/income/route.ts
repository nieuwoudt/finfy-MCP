import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST(req: NextRequest) {
  try {
    const { user_token } = await req.json();

    const income = await plaidClient.creditBankIncomeGet({
      user_token,
    });

    return NextResponse.json({
      income: income.data.bank_income,
    });
  } catch (error: any) {
    console.error("Error fetching income:", error);

    if (
      error.response?.data?.error_code === "INCOME_VERIFICATION_NOT_FOUND" ||
      error.response?.data?.error_message ===
        "the requested data was not found. Please check the ID supplied."
    ) {
      return NextResponse.json({
        income: [],
      });
    }

    return NextResponse.json(
      { message: "An error occurred while fetching income data." },
      { status: 500 }
    );
  }
}
