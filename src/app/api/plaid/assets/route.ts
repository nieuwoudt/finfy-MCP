import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    const assetReportCreateResponse = await plaidClient.assetReportCreate({
      access_tokens: [access_token],
      days_requested: 730,
    });

    const assetReportToken = assetReportCreateResponse.data.asset_report_token;

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const assetReportGetResponse = await plaidClient.assetReportGet({
      asset_report_token: assetReportToken,
      include_insights: true,
    });

    return NextResponse.json({
      assets: assetReportGetResponse.data.report,
    });
  } catch (error: any) {
    console.error("Error fetching asset report:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Error fetching asset report", error: error.response?.data || error.message },
      { status: 200 }
    );
  }
}
