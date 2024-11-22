import { axiosYodleeExternal } from "@/utils/yodlee-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const accessToken = searchParams.get("accessToken");
    const providerAccountId = searchParams.get("providerAccountId");
    const requestId = searchParams.get("requestId");
    // Make request to Yodlee API for account details
    console.log(providerAccountId, requestId, "requestId");
    const response = await axiosYodleeExternal("/accounts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        providerAccountId,
        requestId,
        // include: "fullAccountNumber, fullAccountNumberList",
      },
    });

    if (!response.status) {
      throw new Error(
        `Error fetching Yodlee account details: ${response.statusText}`
      );
    }

    const data = await response.data;

    return NextResponse.json({
      accounts: data.account,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching Yodlee account details" },
      { status: 500 }
    );
  }
}
