import { NextResponse } from "next/server";
import { plaidClient } from "@/lib/plaid";

export async function POST() {
  try {
    const user = await plaidClient.userCreate({
      client_user_id: process.env.PLAID_CLIENT_ID as string,
    });

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching transactions" },
      { status: 500 }
    );
  }
}
