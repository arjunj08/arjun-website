import { NextResponse } from "next/server";
import { adminDb, checkAuth, isFirebaseConfigured } from "@/lib/firebaseAdmin";
import { getLocalPages, saveLocalPages } from "@/lib/localDb";

export async function PATCH(request: Request) {
  try {
    const adminUser = await checkAuth();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reorderedPages } = await request.json(); // Array of { id: string, order: number }
    if (!reorderedPages || !Array.isArray(reorderedPages)) {
      return NextResponse.json({ error: "Invalid pages payload" }, { status: 400 });
    }

    if (!isFirebaseConfigured) {
      const pages = getLocalPages();
      for (const item of reorderedPages) {
        const index = pages.findIndex((p) => p.id === item.id);
        if (index !== -1) {
          pages[index].order = item.order;
          pages[index].updatedAt = new Date().toISOString();
        }
      }
      saveLocalPages(pages);
      return NextResponse.json({ success: true });
    }

    const batch = adminDb.batch();

    for (const item of reorderedPages) {
      const docRef = adminDb.collection("pages").doc(item.id);
      batch.update(docRef, { 
        order: item.order,
        updatedAt: new Date().toISOString()
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PATCH Reorder Error:", error);
    return NextResponse.json({ error: error.message || "Failed to reorder chapters" }, { status: 500 });
  }
}
