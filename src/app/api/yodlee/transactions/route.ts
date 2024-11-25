import { plaidClient } from "@/lib/plaid";
import { axiosYodleeExternal } from "@/utils/yodlee-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const accessToken = searchParams.get("accessToken");
    const accountIds = searchParams.get("accountIds");
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    const endDate = new Date();
    const formattedEndDate = endDate.toISOString().split("T")[0];

    const transactionsResponse = await axiosYodleeExternal("/transactions", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        accountId: accountIds,
        fromDate: formattedStartDate,
        toDate: formattedEndDate,
      },
    });
    return NextResponse.json({
      transactions: transactionsResponse.data.transaction,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
