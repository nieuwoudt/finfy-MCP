import { plaidClient } from "@/lib/plaid";
import { axiosYodleeExternal } from "@/utils/yodlee-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const accessToken = searchParams.get("accessToken");
    const providerId = searchParams.get("providerId");

    const providerResponse = await axiosYodleeExternal(`/providers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        
      },
      ...(providerId && { params: {
        providerId: providerId,
      }})
    });
    return NextResponse.json({
      provider: providerResponse.data.provider,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching providers" },
      { status: 500 }
    );
  }
}
