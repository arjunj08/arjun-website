import { NextResponse } from "next/server";
import { adminDb, checkAuth, isFirebaseConfigured } from "@/lib/firebaseAdmin";
import { getLocalSettings, saveLocalSettings } from "@/lib/localDb";

const DEFAULT_SETTINGS = {
  title: "The Living Book",
  author: "A Passionate Educator",
  description: "A cinematic 3D interactive learning journey through deep space, tailored for students and thinkers.",
  coverTitle: "The Living Book",
  accentColor: "#6366f1",
};

export async function GET() {
  try {
    if (!isFirebaseConfigured) {
      return NextResponse.json(getLocalSettings());
    }
    const doc = await adminDb.collection("settings").doc("book").get();
    if (!doc.exists) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }
    return NextResponse.json(doc.data());
  } catch (error: any) {
    console.error("GET Settings Error:", error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PATCH(request: Request) {
  try {
    const adminUser = await checkAuth();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, author, description, coverTitle, accentColor } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (description !== undefined) updateData.description = description;
    if (coverTitle !== undefined) updateData.coverTitle = coverTitle;
    if (accentColor !== undefined) updateData.accentColor = accentColor;

    if (!isFirebaseConfigured) {
      const current = getLocalSettings();
      const updated = { ...current, ...updateData };
      saveLocalSettings(updated);
      return NextResponse.json({ success: true, settings: updated });
    }

    await adminDb.collection("settings").doc("book").set(updateData, { merge: true });

    return NextResponse.json({ success: true, settings: updateData });
  } catch (error: any) {
    console.error("PATCH Settings Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
