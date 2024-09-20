import { getUser } from "@/auth/server";

export async function GET(req: Request) {
  const user = await getUser();
  return Response.json(user);
}
