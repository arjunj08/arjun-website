import { NextResponse } from "next/server";
import { adminDb, checkAuth, isFirebaseConfigured } from "@/lib/firebaseAdmin";
import { getLocalPages, saveLocalPages } from "@/lib/localDb";

export async function GET() {
  try {
    const adminUser = await checkAuth();

    if (!isFirebaseConfigured) {
      let pages = getLocalPages();
      if (!adminUser) {
        pages = pages.filter((p) => p.published);
      }
      pages.sort((a, b) => (a.order || 0) - (b.order || 0));
      return NextResponse.json(pages);
    }

    const snapshot = await adminDb.collection("pages").orderBy("order", "asc").get();
    const pages: any[] = [];
    
    snapshot.forEach((doc: any) => {
      const data = doc.data();
      pages.push({
        id: doc.id,
        ...data,
        createdAt: typeof data.createdAt === "object" && data.createdAt?.toDate 
          ? data.createdAt.toDate().toISOString() 
          : (data.createdAt || new Date().toISOString()),
        updatedAt: typeof data.updatedAt === "object" && data.updatedAt?.toDate 
          ? data.updatedAt.toDate().toISOString() 
          : (data.updatedAt || new Date().toISOString()),
      });
    });

    return NextResponse.json(pages);
  } catch (error: any) {
    console.error("GET Pages Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (isFirebaseConfigured) {
      const adminUser = await checkAuth();
      if (!adminUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await request.json().catch(() => ({}));
    const section = body.section || "writing";
    const customTitle = body.title;
    const customContent = body.content;
    const customPublished = typeof body.published === "boolean" ? body.published : false;
    const customFeatured = typeof body.featured === "boolean" ? body.featured : false;

    if (!isFirebaseConfigured) {
      const pages = getLocalPages();
      let nextChapterNumber = 1;
      let nextOrder = 1;

      if (pages.length > 0) {
        nextChapterNumber = Math.max(...pages.map((p) => p.chapterNumber || 0)) + 1;
        nextOrder = Math.max(...pages.map((p) => p.order || 0)) + 1;
      }

      const now = new Date().toISOString();
      const newPage = {
        id: `page-${Date.now()}`,
        chapterNumber: nextChapterNumber,
        title: customTitle || `New ${section.charAt(0).toUpperCase() + section.slice(1)} Article`,
        content: customContent || JSON.stringify({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "This article is waiting to be written..." }],
            },
          ],
        }),
        order: nextOrder,
        published: customPublished,
        featured: customFeatured,
        views: 0,
        section,
        createdAt: now,
        updatedAt: now,
      };

      pages.push(newPage);
      saveLocalPages(pages);

      return NextResponse.json(newPage);
    }

    // Determine the next chapterNumber and order
    const snapshot = await adminDb.collection("pages").orderBy("order", "desc").limit(1).get();
    let nextChapterNumber = 1;
    let nextOrder = 1;

    if (!snapshot.empty) {
      const lastDoc = snapshot.docs[0].data();
      nextChapterNumber = (lastDoc.chapterNumber || 0) + 1;
      nextOrder = (lastDoc.order || 0) + 1;
    }

    const now = new Date().toISOString();
    const newPage = {
      chapterNumber: nextChapterNumber,
      title: customTitle || `New ${section.charAt(0).toUpperCase() + section.slice(1)} Article`,
      content: customContent || JSON.stringify({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "This article is waiting to be written..." }],
          },
        ],
      }),
      order: nextOrder,
      published: customPublished,
      featured: customFeatured,
      views: 0,
      section,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection("pages").add(newPage);

    return NextResponse.json({
      id: docRef.id,
      ...newPage,
    });
  } catch (error: any) {
    console.error("POST Page Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create page" }, { status: 500 });
  }
}
