import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { stepsOnboarding } from "@/utils/variables";
import { supabase } from "./lib/supabase/client";

export async function getUser(response: NextResponse, request: NextRequest) {
  const supabaseClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  return user;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const path = new URL(request.url).pathname;

  const protectedRoutes = ["/", "/onboarding"];
  const authRoutes = [
    "/login",
    "/sign-up",
    "/authentication",
    "/confirm-email",
  ];
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  if (isProtectedRoute || isAuthRoute) {
    const user = await getUser(response, request);

    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL("/authentication", request.url));
    }
    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (isProtectedRoute) {
      return NextResponse.redirect(
        new URL(`/onboarding/${stepsOnboarding.at(0)}`, request.url)
      );
    }
  } else {
    const user = await getUser(response, request);
    if (!user && !isAuthRoute) {
      return NextResponse.redirect(new URL("/authentication", request.url));
    }
    if (!path.includes("/dashboard")) {
      const { data } = await supabase
        .from("users")
        .select()
        .eq("email", user?.email)
        .single();
      if (data?.plan && data?.selected_currency && data?.name) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }else if(user){
      return NextResponse.redirect(new URL("/onboarding", request.url));

    }
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/.*|auth/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
