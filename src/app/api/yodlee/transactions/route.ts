// import { plaidClient } from '@/lib/plaid';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const { access_token } = await req.json();
    
//     const startDate = new Date();
//     startDate.setMonth(startDate.getMonth() - 1);
//     const formattedStartDate = startDate.toISOString().split('T')[0];

//     const endDate = new Date();
//     const formattedEndDate = endDate.toISOString().split('T')[0];

//     const transactionsResponse = await plaidClient.transactionsGet({
//       access_token: access_token,
//       start_date: formattedStartDate,
//       end_date: formattedEndDate,
//       options: {
//         count: 100,
//       },
//     });

//     return NextResponse.json({ transactions: transactionsResponse.data.transactions });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: 'Error fetching transactions' }, { status: 500 });
//   }
// }
