import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    const { data: { user }, error } = await supabase.auth.getUser();

    // If user is not authenticated and trying to access any page other than /sign-in, redirect to /sign-in
    if (!user && request.nextUrl.pathname !== "/sign-in" && request.nextUrl.pathname !== "/sign-up" && request.nextUrl.pathname !== "/forgot-password") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Optional redirect for logged-in users to /protected or another main page
    // if (user && request.nextUrl.pathname === "/") {
    //   return NextResponse.redirect(new URL("/protected", request.url));
    // }

    return response;
  } catch (e) {
    // Handle errors in middleware setup or environment configuration
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};