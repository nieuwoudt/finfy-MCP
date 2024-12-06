import { plaidClient } from '@/lib/plaid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { access_token } = await req.json();

    const identityGetResponse = await plaidClient.identityGet({
        access_token
    });

    return NextResponse.json({ identity: identityGetResponse.data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching user identity' }, { status: 500 });
  }
}
