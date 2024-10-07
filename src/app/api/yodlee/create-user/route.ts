// import { NextRequest, NextResponse } from "next/server";
// import { plaidClient } from "@/lib/plaid";

// export async function POST(req: NextRequest) {
//   try {
//     const { email, phone } = await req.json();
//     const user = await plaidClient.userCreate({
//       client_user_id: email || phone,
//     });
//     console.log();
//     return NextResponse.json({ user_token: user.data.user_token });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Error fetching user" },
//       { status: 500 }
//     );
//   }
// }
