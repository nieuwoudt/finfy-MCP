import { plaidClient } from "@/lib/plaid";
import { NextRequest, NextResponse } from "next/server";
import { CountryCode, Products } from "plaid";

export async function GET(req: NextRequest) {
  try {
    const currentUrl = req.url;
    console.log(currentUrl, "currentUrl");
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: process.env.PLAID_CLIENT_ID as string },
      client_name: "Finfy",
      language: "en",
      country_codes: [CountryCode.Us],
      products: [
        Products.Auth,
        Products.Transactions,
        Products.Investments,
        Products.Liabilities,
        Products.Assets
      ],
      webhook: `${currentUrl}/api/plaid/webhook`,
    });

    return NextResponse.json({ link_token: tokenResponse.data.link_token });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating link token" },
      { status: 500 }
    );
  }
}
