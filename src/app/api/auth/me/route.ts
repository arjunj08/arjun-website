import { NextResponse } from "next/server";
import { adminAuth, isFirebaseConfigured } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!isFirebaseConfigured) {
      if (sessionCookie === "mock_admin_session_cookie") {
        return NextResponse.json({
          authenticated: true,
          user: {
            email: "admin@livingbook.edu",
            uid: "mock-admin-uid",
          },
        });
      }
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    return NextResponse.json({
      authenticated: true,
      user: {
        email: decodedClaims.email,
        uid: decodedClaims.uid,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
