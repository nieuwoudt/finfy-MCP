// import { plaidClient } from '@/lib/plaid';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const { public_token } = await req.json();
//     const exchangeResponse = await plaidClient.itemPublicTokenExchange({
//       public_token,
//     });
//     const accessToken = exchangeResponse.data.access_token;
//     return NextResponse.json({ access_token: accessToken });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: 'Error exchanging token' }, { status: 500 });
//   }
// }
