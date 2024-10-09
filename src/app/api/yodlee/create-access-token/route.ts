import { NextRequest, NextResponse } from "next/server";

// Yodlee FastLink Endpoint
export async function GET(req: NextRequest) {
  try {
    const currentUrl = req.url;

    // Generate Yodlee Session Token using form-urlencoded format
    const tokenResponse = await fetch(`${process.env.YODLEE_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Api-Version": process.env.YODLEE_API_VERSION || "1.1",
        "loginName": "sbMemk6s4a3914f7601" as string, // loginName in header
      },
      body: new URLSearchParams({
        clientId: process.env.YODLEE_CLIENT_ID as string,
        secret: process.env.YODLEE_CLIENT_SECRET as string,
      }),
    });

    // Directly parse the response as JSON
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Error generating Yodlee session token: ${JSON.stringify(tokenData)}`);
    }

    // Return the session token and FastLink URL to the frontend
    return NextResponse.json({
      accessToken: tokenData.token.accessToken, 
      fastLinkURL: `${process.env.YODLEE_FASTLINK_URL}`,
    });
  } catch (error) {
    console.error("Yodlee API error:", error);
    return NextResponse.json(
      { message: "Error creating Yodlee link token" },
      { status: 500 }
    );
  }
}
