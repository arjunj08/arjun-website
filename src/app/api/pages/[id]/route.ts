import { NextResponse } from "next/server";
import { adminDb, checkAuth, isFirebaseConfigured } from "@/lib/firebaseAdmin";
import { getLocalPages, saveLocalPages } from "@/lib/localDb";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!isFirebaseConfigured) {
      const pages = getLocalPages();
      const page = pages.find((p) => p.id === id);
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
      const adminUser = await checkAuth();
      if (!page.published && !adminUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json(page);
    }

    const doc = await adminDb.collection("pages").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const adminUser = await checkAuth();
    const data = doc.data();

    // If not published and caller is not admin, deny access
    if (!data?.published && !adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      id: doc.id,
      ...data,
    });
  } catch (error: any) {
    console.error("GET Page ID Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch page" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    if (isFirebaseConfigured) {
      const adminUser = await checkAuth();
      if (!adminUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const { title, content, published, chapterNumber, section, featured } = body;

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;
    if (chapterNumber !== undefined) updateData.chapterNumber = Number(chapterNumber);
    if (section !== undefined) updateData.section = section;
    if (featured !== undefined) updateData.featured = featured;

    if (!isFirebaseConfigured) {
      const pages = getLocalPages();
      const index = pages.findIndex((p) => p.id === id);
      if (index === -1) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
      pages[index] = {
        ...pages[index],
        ...updateData,
      };
      saveLocalPages(pages);
      return NextResponse.json({ success: true, updatedFields: updateData });
    }

    await adminDb.collection("pages").doc(id).update(updateData);

    return NextResponse.json({ success: true, updatedFields: updateData });
  } catch (error: any) {
    console.error("PATCH Page ID Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (isFirebaseConfigured) {
      const adminUser = await checkAuth();
      if (!adminUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { id } = params;

    if (!isFirebaseConfigured) {
      let pages = getLocalPages();
      pages = pages.filter((p) => p.id !== id);
      saveLocalPages(pages);
      return NextResponse.json({ success: true });
    }

    await adminDb.collection("pages").doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Page ID Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete page" }, { status: 500 });
  }
}
