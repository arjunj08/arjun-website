import { NextResponse } from "next/server";
import { adminDb, isFirebaseConfigured } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { getLocalPages, saveLocalPages } from "@/lib/localDb";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!isFirebaseConfigured) {
      const pages = getLocalPages();
      const index = pages.findIndex((p) => p.id === id);
      if (index !== -1) {
        pages[index].views = (pages[index].views || 0) + 1;
        saveLocalPages(pages);
      }
      return NextResponse.json({ success: true });
    }
    
    // Safely increment views field using FieldValue.increment
    await adminDb.collection("pages").doc(id).update({
      views: FieldValue.increment(1),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST Page View Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update view count" }, { status: 500 });
  }
}
