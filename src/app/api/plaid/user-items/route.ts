import { plaidClient } from '@/lib/plaid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { user_token } = await req.json();

    const userItemsResponse = await plaidClient.userItemsGet({
      user_token
    });

    return NextResponse.json({ userItems: userItemsResponse.data.items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching user items' }, { status: 500 });
  }
}
