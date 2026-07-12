require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const sampleSettings = {
  title: "The Cosmic Almanac",
  author: "Prof. Stella Vance",
  description: "An interactive, cinematic exploration of astrophysics, dark matter, and deep space mechanics.",
  coverTitle: "COSMIC PHYSICS",
  accentColor: "#8b5cf6",
};

const samplePages = [
  {
    id: "page-1",
    chapterNumber: 1,
    title: "The Art of Slow Living",
    content: JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "The Art of Slow Living" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "In a world driven by speed and constant connectivity, the concept of slow living invites us to step back and reclaim our time. It is a mindful approach to daily life that emphasizes quality over quantity, presence over productivity, and deep appreciation for the micro-moments that define our existence.",
            },
          ],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Nature does not hurry, yet everything is accomplished. — Lao Tzu" }],
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Slow living isn't about doing everything at a snail's pace. It is about doing things at the right speed—aligning our daily rituals with our internal compass, enjoying the aroma of morning coffee, and walking beneath the open skies.",
            },
          ],
        },
      ],
    }),
    published: true,
    views: 24,
    section: "lifestyle",
    order: 1,
  },
  {
    id: "page-2",
    chapterNumber: 2,
    title: "Gran Turismo Dynamics",
    content: JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Gran Turismo Dynamics" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Supercars are not merely machines; they are works of kinetic art. The engineering behind modern Gran Turismo cars balances thermodynamic power with advanced active aerodynamics, generating high downforce to stabilize speeds at extreme corners.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "From carbon-fiber monocoque chassis to hybrid electric powertrains, the convergence of software and physics pushes the boundary of traction control, tire friction coefficient, and downforce distribution.",
            },
          ],
        },
      ],
    }),
    published: true,
    views: 18,
    section: "cars",
    order: 2,
  },
  {
    id: "page-3",
    chapterNumber: 3,
    title: "The Dark Ocean of Space",
    content: JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "The Dark Ocean of Space" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "For eons, humanity looked at the stars and wondered. What lies within the vast cosmic ocean? Today, we know that the universe is not empty space; it is a dynamic canvas of dark matter, gravitational waves, and warping space-time.",
            },
          ],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself. — Carl Sagan" }],
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "As you turn the pages of this book, you will travel from the edge of stellar event horizons to the microscopic vibrations of quantum string fields. Welcome to the voyage.",
            },
          ],
        },
      ],
    }),
    published: true,
    views: 15,
    section: "writing",
    order: 3,
  },
];

const seedLocal = () => {
  console.log("Firebase credentials not detected. Seeding local database local_db.json...");
  try {
    const data = {
      settings: sampleSettings,
      pages: samplePages,
    };
    fs.writeFileSync(
      path.join(__dirname, "../local_db.json"),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    console.log("Local database 'local_db.json' seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Local database seeding failed:", err);
    process.exit(1);
  }
};

if (!projectId || !clientEmail || !privateKey) {
  seedLocal();
} else {
  // Firestore Seeding Logic
  const admin = require("firebase-admin");
  const { cert } = require("firebase-admin/app");
  admin.initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  const { getAuth } = require("firebase-admin/auth");
  const { getFirestore } = require("firebase-admin/firestore");

  const auth = getAuth();
  const db = getFirestore();

  const seedFirestore = async () => {
    try {
      console.log("Firebase detected. Seeding Firestore collections...");

      // 1. Seed / verify admin user
      if (adminEmail && adminPassword) {
        try {
          const user = await auth.getUserByEmail(adminEmail);
          console.log(`Admin user '${adminEmail}' already exists (UID: ${user.uid}).`);
        } catch (err) {
          if (err.code === "auth/user-not-found") {
            const user = await auth.createUser({
              email: adminEmail,
              password: adminPassword,
              displayName: "Admin Teacher",
            });
            console.log(`Admin user '${adminEmail}' created successfully.`);
          } else {
            throw err;
          }
        }
      }

      // 2. Settings
      await db.collection("settings").doc("book").set(sampleSettings);
      console.log("Firestore Settings seeded.");

      // 3. Pages
      const pagesRef = db.collection("pages");
      const existing = await pagesRef.get();
      if (!existing.empty) {
        const batch = db.batch();
        existing.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }
      for (const page of samplePages) {
        await pagesRef.add({
          ...page,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      console.log("Firestore Chapters seeded.");
      console.log("Seeding completed successfully!");
      process.exit(0);
    } catch (err) {
      console.error("Firestore seeding failed:", err);
      process.exit(1);
    }
  };

  seedFirestore();
}
