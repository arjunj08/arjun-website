import { NextResponse } from "next/server";
import { adminAuth, isFirebaseConfigured } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken, email, password } = body;

    // Fallback authentication
    if (!isFirebaseConfigured) {
      if (email === "admin@livingbook.edu" && password === "SelectAPowerfulPassword123") {
        const response = NextResponse.json({ success: true, user: { email } });
        
        response.cookies.set("admin_session", "mock_admin_session_cookie", {
          maxAge: 60 * 60 * 24 * 5,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" && !request.url.includes("localhost") && !request.url.includes("127.0.0.1"),
          sameSite: "strict",
          path: "/",
        });
        
        return response;
      }
      return NextResponse.json({ error: "Invalid email or password." }, { status: 450 });
    }

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    // Verify the ID token to ensure the user exists
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Set session cookie duration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ success: true, user: { email: decodedToken.email } });
    
    // Set the cookie as HTTP-only, secure, SameSite=Strict
    response.cookies.set("admin_session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && !request.url.includes("localhost") && !request.url.includes("127.0.0.1"),
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 401 });
  }
}
