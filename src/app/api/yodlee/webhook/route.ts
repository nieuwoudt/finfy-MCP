// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   console.log(body, "body");
//   if (body.webhook_type === "TRANSACTIONS") {
//     switch (body.webhook_code) {
//       case "INITIAL_UPDATE":
//         console.log("Initial transactions update received");
//         break;
//       case "HISTORICAL_UPDATE":
//         console.log("Historical transactions update received");
//         break;
//       case "DEFAULT_UPDATE":
//         console.log("New transactions available");
//         break;
//       case "TRANSACTIONS_REMOVED":
//         console.log("Transactions removed");
//         break;
//       default:
//         console.log("Unknown webhook event received");
//     }
//   }

//   return NextResponse.json({ status: "success" }, { status: 200 });
// }
