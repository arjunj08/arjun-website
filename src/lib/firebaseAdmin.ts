import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminAuth: any;
let adminDb: any;

const hasAdminConfig = 
  !!process.env.FIREBASE_CLIENT_EMAIL && 
  !!process.env.FIREBASE_PRIVATE_KEY && 
  (!!process.env.FIREBASE_PROJECT_ID || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

if (hasAdminConfig || getApps().length > 0) {
  try {
    const app = getApps().length > 0 
      ? getApp() 
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        });
    adminAuth = getAuth(app);
    adminDb = getFirestore(app);
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    adminAuth = {} as any;
    adminDb = {} as any;
  }
} else {
  // Mock objects for build time
  adminAuth = {} as any;
  adminDb = {} as any;
}

const isFirebaseConfigured = hasAdminConfig;

export async function checkAuth() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("admin_session")?.value;
    if (!sessionCookie) return null;
    
    // If Firebase isn't configured, check mock session cookie
    if (!isFirebaseConfigured) {
      if (sessionCookie === "mock_admin_session_cookie") {
        return { email: "admin@livingbook.edu" };
      }
      return null;
    }
    
    return await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    return null;
  }
}

export { adminAuth, adminDb, isFirebaseConfigured };
