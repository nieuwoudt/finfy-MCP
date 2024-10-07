

// import { NextRequest, NextResponse } from "next/server";
// import { plaidClient } from "@/lib/plaid";

// export async function POST(req: NextRequest) {
//   try {
//     const { access_token } = await req.json();

//     const transactionRefresh = await plaidClient.transactionsRefresh({
//       access_token: access_token,
//     });

//     return NextResponse.json({
//       transactionRefresh: transactionRefresh.data.request_id,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Error fetching transactions" },
//       { status: 500 }
//     );
//   }
// }
