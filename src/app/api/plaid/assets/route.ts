import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    const assets = await plaidClient.assetReportGet({
      asset_report_token: access_token,
      include_insights: true,
    });

    return NextResponse.json({
      assets: assets.data.report,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
