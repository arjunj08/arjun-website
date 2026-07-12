import fs from "fs";
import path from "path";
import { BookSettings, BookPage } from "./types";

const dbPath = path.join(process.cwd(), "local_db.json");

// Default seeded data
const defaultSettings: BookSettings = {
  title: "The Cosmic Almanac",
  author: "Prof. Stella Vance",
  description: "An interactive, cinematic exploration of astrophysics, dark matter, and deep space mechanics.",
  coverTitle: "COSMIC PHYSICS",
  accentColor: "#8b5cf6",
};

const defaultPages: BookPage[] = [
  {
    id: "page-1",
    chapterNumber: 1,
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
      ],
    }),
    published: true,
    views: 12,
  },
  {
    id: "page-2",
    chapterNumber: 2,
    title: "Echoes of the Big Bang",
    content: JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Echoes of the Big Bang" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The Cosmic Microwave Background radiation is the ancient light that has traveled across space for 13.8 billion years. It is the oldest footprint of creation, holding the secrets of structural genesis.",
            },
          ],
        },
      ],
    }),
    published: true,
    views: 8,
  },
];

interface LocalSchema {
  settings: BookSettings;
  pages: BookPage[];
}

function initDbIfNeeded() {
  if (!fs.existsSync(dbPath)) {
    const data: LocalSchema = {
      settings: defaultSettings,
      pages: defaultPages,
    };
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  }
}

export function getLocalSettings(): BookSettings {
  initDbIfNeeded();
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    const data = JSON.parse(raw) as LocalSchema;
    return data.settings || defaultSettings;
  } catch (err) {
    return defaultSettings;
  }
}

export function saveLocalSettings(settings: BookSettings) {
  initDbIfNeeded();
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    const data = JSON.parse(raw) as LocalSchema;
    data.settings = settings;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local settings:", err);
  }
}

export function getLocalPages(): BookPage[] {
  initDbIfNeeded();
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    const data = JSON.parse(raw) as LocalSchema;
    return data.pages || defaultPages;
  } catch (err) {
    return defaultPages;
  }
}

export function saveLocalPages(pages: BookPage[]) {
  initDbIfNeeded();
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    const data = JSON.parse(raw) as LocalSchema;
    data.pages = pages;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local pages:", err);
  }
}
