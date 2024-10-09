import { plaidClient } from "@/lib/plaid";
import { axiosYodleeExternal } from "@/utils/yodlee-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const accessToken = searchParams.get('accessToken');
    const accountId = searchParams.get('accountId');
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    const endDate = new Date();
    const formattedEndDate = endDate.toISOString().split("T")[0];

    const transactionsResponse = await axiosYodleeExternal("/transactions", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        accountId,
        fromDate: formattedStartDate,
        toDate: formattedEndDate,
      },
    });
    console.log(transactionsResponse, 'transactionsResponse')
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
