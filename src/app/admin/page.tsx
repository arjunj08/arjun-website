import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb, isFirebaseConfigured } from "@/lib/firebaseAdmin";
import { getLocalSettings, getLocalPages } from "@/lib/localDb";
import Dashboard from "@/components/admin/Dashboard";
import { BookPage, BookSettings } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;

  if (!sessionCookie) {
    redirect("/admin/login");
  }

  // Auth check
  if (isFirebaseConfigured) {
    try {
      await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      redirect("/admin/login");
    }
  } else {
    // If Firebase isn't configured, check mock session cookie
    if (sessionCookie !== "mock_admin_session_cookie") {
      redirect("/admin/login");
    }
  }

  // Fetch Settings (Fallback to default if not seeded yet)
  let settings: BookSettings = {
    title: "The Living Book",
    author: "A Passionate Educator",
    description: "An interactive cinematic learning experience.",
    coverTitle: "The Living Book",
    accentColor: "#6366f1",
  };

  if (isFirebaseConfigured) {
    try {
      const settingsDoc = await adminDb.collection("settings").doc("book").get();
      if (settingsDoc.exists) {
        const data = settingsDoc.data();
        settings = {
          title: data?.title || settings.title,
          author: data?.author || settings.author,
          description: data?.description || settings.description,
          coverTitle: data?.coverTitle || settings.coverTitle,
          accentColor: data?.accentColor || settings.accentColor,
        };
      }
    } catch (e) {
      console.error("Server-side settings fetch error:", e);
    }
  } else {
    settings = getLocalSettings();
  }

  // Fetch Pages / Chapters (All chapters for Admin)
  let pages: BookPage[] = [];
  if (isFirebaseConfigured) {
    try {
      const snapshot = await adminDb.collection("pages").orderBy("order", "asc").get();
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        pages.push({
          id: doc.id,
          chapterNumber: data.chapterNumber,
          title: data.title,
          content: data.content,
          order: data.order,
          published: data.published,
          featured: !!data.featured,
          views: data.views || 0,
          section: data.section || "writing",
          createdAt: typeof data.createdAt === "object" && data.createdAt?.toDate 
            ? data.createdAt.toDate().toISOString() 
            : (data.createdAt || new Date().toISOString()),
          updatedAt: typeof data.updatedAt === "object" && data.updatedAt?.toDate 
            ? data.updatedAt.toDate().toISOString() 
            : (data.updatedAt || new Date().toISOString()),
        });
      });
    } catch (e) {
      console.error("Server-side chapters fetch error:", e);
    }
  } else {
    pages = getLocalPages();
  }

  return <Dashboard initialSettings={settings} initialPages={pages} />;
}
