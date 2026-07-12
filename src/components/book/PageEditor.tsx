"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import { TextStyle } from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import FontFamily from "@tiptap/extension-font-family";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Save,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Search,
  Crown,
  Palette,
} from "lucide-react";

interface PageEditorProps {
  initialContent: string;
  pageId: string;
  onSaveStatusChange: (status: "idle" | "saving" | "saved" | "error") => void;
}

// 1. Extend Tiptap extensions to support custom inline and block CSS styling attributes
const CustomTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
      color: {
        default: null,
        parseHTML: (element) => element.style.color,
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return { style: `color: ${attributes.color}` };
        },
      },
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) return {};
          return { style: `background-color: ${attributes.backgroundColor}` };
        },
      },
      letterSpacing: {
        default: null,
        parseHTML: (element) => element.style.letterSpacing,
        renderHTML: (attributes) => {
          if (!attributes.letterSpacing) return {};
          return { style: `letter-spacing: ${attributes.letterSpacing}` };
        },
      },
      float: {
        default: null,
        parseHTML: (element) => element.style.float,
        renderHTML: (attributes) => {
          if (!attributes.float) return {};
          return { style: `float: ${attributes.float}` };
        },
      },
      marginTop: {
        default: null,
        parseHTML: (element) => element.style.marginTop,
        renderHTML: (attributes) => {
          if (!attributes.marginTop) return {};
          return { style: `margin-top: ${attributes.marginTop}` };
        },
      },
      marginRight: {
        default: null,
        parseHTML: (element) => element.style.marginRight,
        renderHTML: (attributes) => {
          if (!attributes.marginRight) return {};
          return { style: `margin-right: ${attributes.marginRight}` };
        },
      },
      fontWeight: {
        default: null,
        parseHTML: (element) => element.style.fontWeight,
        renderHTML: (attributes) => {
          if (!attributes.fontWeight) return {};
          return { style: `font-weight: ${attributes.fontWeight}` };
        },
      },
    };
  },
});

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      lineHeight: {
        default: null,
        parseHTML: (element) => element.style.lineHeight,
        renderHTML: (attributes) => {
          if (!attributes.lineHeight) return {};
          return { style: `line-height: ${attributes.lineHeight}` };
        },
      },
      paragraphSpacing: {
        default: null,
        parseHTML: (element) => element.style.marginBottom,
        renderHTML: (attributes) => {
          if (!attributes.paragraphSpacing) return {};
          return { style: `margin-bottom: ${attributes.paragraphSpacing}` };
        },
      },
      indent: {
        default: null,
        parseHTML: (element) => element.style.textIndent,
        renderHTML: (attributes) => {
          if (!attributes.indent) return {};
          return { style: `text-indent: ${attributes.indent}` };
        },
      },
      textAlign: {
        default: null,
        parseHTML: (element) => element.style.textAlign,
        renderHTML: (attributes) => {
          if (!attributes.textAlign) return {};
          return { style: `text-align: ${attributes.textAlign}` };
        },
      },
    };
  },
});

const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      textAlign: {
        default: null,
        parseHTML: (element) => element.style.textAlign,
        renderHTML: (attributes) => {
          if (!attributes.textAlign) return {};
          return { style: `text-align: ${attributes.textAlign}` };
        },
      },
    };
  },
});

// Premium Google Fonts
const fontsList = [
  { name: "Cinzel", value: "Cinzel, serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { name: "EB Garamond", value: "'EB Garamond', serif" },
  { name: "Libre Baskerville", value: "'Libre Baskerville', serif" },
  { name: "Crimson Text", value: "'Crimson Text', serif" },
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Lora", value: "Lora, serif" },
  { name: "Merriweather", value: "Merriweather, serif" },
  { name: "Spectral", value: "Spectral, serif" },
  { name: "Dancing Script", value: "'Dancing Script', cursive" },
  { name: "Great Vibes", value: "'Great Vibes', cursive" },
  { name: "Courier Prime", value: "'Courier Prime', monospace" },
  { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
];

export default function PageEditor({
  initialContent,
  pageId,
  onSaveStatusChange,
}: PageEditorProps) {
  // Parsed initial content helper
  const getInitialContent = useCallback(() => {
    try {
      return JSON.parse(initialContent);
    } catch (e) {
      return initialContent;
    }
  }, [initialContent]);

  // Performance Optimization: Use refs for saving to eliminate typing lag
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<string>(initialContent);

  const triggerAutosave = useCallback(
    (contentStr: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      onSaveStatusChange("saving");

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/pages/${pageId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: contentStr }),
          });

          if (response.ok) {
            onSaveStatusChange("saved");
            setTimeout(() => onSaveStatusChange("idle"), 2000);
          } else {
            onSaveStatusChange("error");
          }
        } catch (err) {
          console.error("Autosave error:", err);
          onSaveStatusChange("error");
        }
      }, 1500);
    },
    [pageId, onSaveStatusChange]
  );

  // Initialize Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
      }),
      CustomParagraph,
      CustomHeading,
      Underline,
      CustomTextStyle,
      FontFamily,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: getInitialContent(),
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none text-stone-850 font-serif leading-relaxed text-lg book-page-flow-editor min-h-[450px] p-6",
      },
    },
    onUpdate: ({ editor }) => {
      const json = JSON.stringify(editor.getJSON());
      contentRef.current = json;
      triggerAutosave(json);
    },
  });

  // Keep editor content synced ONLY when pageId changes (prevents loop typing lag)
  useEffect(() => {
    if (editor) {
      const parsed = getInitialContent();
      // Only set content if it actually belongs to a new chapter load
      editor.commands.setContent(parsed);
      contentRef.current = JSON.stringify(parsed);
    }
  }, [pageId, editor]);

  // Clean timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Selection state attributes
  const [currentFont, setCurrentFont] = useState("default");
  const [currentSize, setCurrentSize] = useState(18);
  const [currentLineHeight, setCurrentLineHeight] = useState(1.65);
  const [currentSpacing, setCurrentSpacing] = useState(0);
  const [currentParaSpacing, setCurrentParaSpacing] = useState(16);
  const [currentIndent, setCurrentIndent] = useState(0);

  const [fontSearch, setFontSearch] = useState("");
  const [fontPickerOpen, setFontPickerOpen] = useState(false);

  const updateSelectionStates = useCallback(() => {
    if (!editor) return;
    const textAttrs = editor.getAttributes("textStyle");
    const paraAttrs = editor.getAttributes("paragraph");

    setCurrentFont(textAttrs.fontFamily || "default");

    const sizeStr = textAttrs.fontSize || "18px";
    setCurrentSize(parseInt(sizeStr) || 18);

    const lh = paraAttrs.lineHeight || "1.65";
    setCurrentLineHeight(parseFloat(lh) || 1.65);

    const ls = textAttrs.letterSpacing || "0em";
    setCurrentSpacing(parseFloat(ls) || 0);

    const ps = paraAttrs.paragraphSpacing || "16px";
    setCurrentParaSpacing(parseInt(ps) || 16);

    const ind = paraAttrs.indent || "0px";
    setCurrentIndent(parseInt(ind) || 0);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.on("selectionUpdate", updateSelectionStates);
    editor.on("transaction", updateSelectionStates);
    return () => {
      editor.off("selectionUpdate", updateSelectionStates);
      editor.off("transaction", updateSelectionStates);
    };
  }, [editor, updateSelectionStates]);

  if (!editor) return null;

  // Formatting triggers
  const handleSetFontSize = (sizeVal: number) => {
    setCurrentSize(sizeVal);
    editor.chain().focus().setMark("textStyle", { fontSize: `${sizeVal}px` }).run();
  };

  const handleSetLineHeight = (lhVal: number) => {
    setCurrentLineHeight(lhVal);
    editor.chain().focus().updateAttributes("paragraph", { lineHeight: `${lhVal}` }).run();
  };

  const handleSetLetterSpacing = (lsVal: number) => {
    setCurrentSpacing(lsVal);
    editor.chain().focus().setMark("textStyle", { letterSpacing: `${lsVal}em` }).run();
  };

  const handleSetParaSpacing = (psVal: number) => {
    setCurrentParaSpacing(psVal);
    editor.chain().focus().updateAttributes("paragraph", { paragraphSpacing: `${psVal}px` }).run();
  };

  const handleSetIndent = (indVal: number) => {
    setCurrentIndent(indVal);
    editor.chain().focus().updateAttributes("paragraph", { indent: `${indVal}px` }).run();
  };

  const handleSetAlignment = (align: "left" | "center" | "right" | "justify") => {
    editor.chain().focus().updateAttributes("paragraph", { textAlign: align }).run();
    editor.chain().focus().updateAttributes("heading", { textAlign: align }).run();
  };

  const handleToggleDropCap = () => {
    const isDropCap = editor.isActive("textStyle", { float: "left" });
    if (isDropCap) {
      editor.chain().focus().setMark("textStyle", {
        fontSize: null,
        float: null,
        lineHeight: null,
        marginTop: null,
        marginRight: null,
        fontFamily: null,
        fontWeight: null,
      }).run();
    } else {
      editor.chain().focus().setMark("textStyle", {
        fontSize: "3.5rem",
        float: "left",
        lineHeight: "0.8",
        marginTop: "0.15em",
        marginRight: "0.15em",
        fontFamily: "Cinzel, serif",
        fontWeight: "bold",
      }).run();
    }
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const src = readerEvent.target?.result as string;
          if (src) {
            editor.chain().focus().setImage({ src }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Predefined color palette
  const textColors = [
    { name: "Obsidian", value: "#1c1917" },
    { name: "Crimson Red", value: "#991b1b" },
    { name: "Gold Leaf", value: "#b45309" },
    { name: "Cobalt Blue", value: "#1e3a8a" },
    { name: "Forest Green", value: "#064e3b" },
  ];

  const highlightColors = [
    { name: "Transparent", value: "transparent" },
    { name: "Soft Gold", value: "#fef08a" },
    { name: "Soft Sky", value: "#e0f2fe" },
    { name: "Soft Rose", value: "#ffe4e6" },
    { name: "Soft Mint", value: "#d1fae5" },
  ];

  const activeFontObj = fontsList.find((f) => f.value === currentFont) || { name: "Default Font" };

  return (
    <div className="relative w-full h-full flex flex-col select-none">
      {/* 1. Floating Desktop Publishing Toolbar */}
      <div className="flex flex-col gap-2 p-3 mb-4 bg-stone-900/95 text-stone-200 rounded-xl shadow-2xl border border-stone-800 backdrop-blur-md z-20 sticky top-0">
        
        {/* Row 1: Core inline editor styles */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive("bold") ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive("italic") ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive("underline") ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-5 bg-stone-800 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => handleSetAlignment("left")}
            className={`p-2 rounded transition-colors ${
              editor.isActive({ textAlign: "left" }) ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleSetAlignment("center")}
            className={`p-2 rounded transition-colors ${
              editor.isActive({ textAlign: "center" }) ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleSetAlignment("right")}
            className={`p-2 rounded transition-colors ${
              editor.isActive({ textAlign: "right" }) ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleSetAlignment("justify")}
            className={`p-2 rounded transition-colors ${
              editor.isActive({ textAlign: "justify" }) ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Align Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-5 bg-stone-800 mx-1" />

          {/* Heading tags */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded transition-colors font-serif text-xs font-bold leading-none ${
              editor.isActive("heading", { level: 1 }) ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded transition-colors font-serif text-xs font-bold leading-none ${
              editor.isActive("heading", { level: 2 }) ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Heading 2"
          >
            H2
          </button>

          <div className="w-px h-5 bg-stone-800 mx-1" />

          {/* Lists / Quote / Image */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive("bulletList") ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive("orderedList") ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Ordered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded transition-colors ${
              editor.isActive("blockquote") ? "bg-indigo-600 text-white" : "hover:bg-stone-800"
            }`}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-stone-800 transition-colors"
            title="Upload image"
          >
            <ImageIcon className="w-3.5 h-3.5 text-stone-300" />
          </button>

          <div className="w-px h-5 bg-stone-800 mx-1" />

          {/* Undo / Redo */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded text-stone-400 hover:bg-stone-800 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded text-stone-400 hover:bg-stone-800 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          {/* Save manually */}
          <button
            onClick={async () => {
              onSaveStatusChange("saving");
              try {
                const response = await fetch(`/api/pages/${pageId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ content: contentRef.current }),
                });
                if (response.ok) {
                  onSaveStatusChange("saved");
                  setTimeout(() => onSaveStatusChange("idle"), 2000);
                } else {
                  onSaveStatusChange("error");
                }
              } catch {
                onSaveStatusChange("error");
              }
            }}
            className="ml-auto flex items-center gap-1 bg-indigo-650 hover:bg-indigo-550 text-white font-serif text-[10px] uppercase font-bold px-3 py-1.5 rounded shadow transition-all"
          >
            <Save className="w-3 h-3" />
            Save Tome
          </button>
        </div>

        {/* Row 2: Premium Typography Shelf */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
          
          {/* Custom Searchable Font Picker */}
          <div className="relative">
            <button
              onClick={() => setFontPickerOpen(!fontPickerOpen)}
              className="bg-stone-800 border border-stone-700 hover:bg-stone-750 text-stone-200 text-[10px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors font-serif min-w-[130px] justify-between cursor-pointer"
            >
              <span>{activeFontObj.name}</span>
              <span className="text-[8px] text-stone-500">▼</span>
            </button>

            {fontPickerOpen && (
              <div className="absolute top-full left-0 mt-1.5 bg-[#0f0e22] border border-[#1d1b3c] rounded-xl shadow-2xl p-3 z-45 w-60 space-y-2">
                <div className="relative flex items-center">
                  <Search className="w-3 h-3 text-stone-500 absolute left-2.5" />
                  <input
                    type="text"
                    placeholder="Search premium fonts..."
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    className="w-full bg-[#05040f] border border-[#1b1931] focus:border-indigo-500 focus:outline-none pl-7 pr-3 py-1 text-[11px] rounded text-white font-serif"
                  />
                </div>

                <div className="max-h-44 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                  <button
                    onClick={() => {
                      editor.chain().focus().unsetFontFamily().run();
                      setFontPickerOpen(false);
                    }}
                    className="w-full text-left text-[10px] text-stone-400 hover:bg-white/5 px-2 py-1 rounded transition-colors"
                  >
                    Reset default
                  </button>

                  {fontsList
                    .filter((f) => f.name.toLowerCase().includes(fontSearch.toLowerCase()))
                    .map((f) => (
                      <button
                        key={f.value}
                        onClick={() => {
                          editor.chain().focus().setFontFamily(f.value).run();
                          setFontPickerOpen(false);
                        }}
                        className={`w-full text-left text-[11px] hover:bg-white/5 px-2 py-1.5 rounded transition-colors block truncate ${
                          currentFont === f.value ? "text-indigo-400 font-bold bg-white/5" : "text-stone-250"
                        }`}
                        style={{ fontFamily: f.value }}
                      >
                        {f.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Font Size slider */}
          <div className="flex items-center gap-2">
            <span className="w-16 text-right">Size: {currentSize}px</span>
            <button
              onClick={() => handleSetFontSize(Math.max(12, currentSize - 1))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              -
            </button>
            <input
              type="range"
              min={12}
              max={36}
              value={currentSize}
              onChange={(e) => handleSetFontSize(Number(e.target.value))}
              className="w-20 accent-indigo-550 cursor-pointer h-1 rounded"
            />
            <button
              onClick={() => handleSetFontSize(Math.min(36, currentSize + 1))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>

          {/* Line Height slider */}
          <div className="flex items-center gap-2">
            <span className="w-20 text-right">Line: {currentLineHeight.toFixed(2)}</span>
            <button
              onClick={() => handleSetLineHeight(Math.max(1.0, currentLineHeight - 0.05))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              -
            </button>
            <input
              type="range"
              min={1.0}
              max={2.5}
              step={0.05}
              value={currentLineHeight}
              onChange={(e) => handleSetLineHeight(Number(e.target.value))}
              className="w-20 accent-indigo-550 cursor-pointer h-1 rounded"
            />
            <button
              onClick={() => handleSetLineHeight(Math.min(2.5, currentLineHeight + 0.05))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>

          {/* Letter Spacing slider */}
          <div className="flex items-center gap-2">
            <span className="w-20 text-right">Space: {currentSpacing.toFixed(2)}em</span>
            <button
              onClick={() => handleSetLetterSpacing(Math.max(-0.05, currentSpacing - 0.01))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              -
            </button>
            <input
              type="range"
              min={-0.05}
              max={0.25}
              step={0.01}
              value={currentSpacing}
              onChange={(e) => handleSetLetterSpacing(Number(e.target.value))}
              className="w-20 accent-indigo-550 cursor-pointer h-1 rounded"
            />
            <button
              onClick={() => handleSetLetterSpacing(Math.min(0.25, currentSpacing + 0.01))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>

          {/* Paragraph Spacing slider */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-right">Para: {currentParaSpacing}px</span>
            <button
              onClick={() => handleSetParaSpacing(Math.max(0, currentParaSpacing - 2))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              -
            </button>
            <input
              type="range"
              min={0}
              max={40}
              step={2}
              value={currentParaSpacing}
              onChange={(e) => handleSetParaSpacing(Number(e.target.value))}
              className="w-20 accent-indigo-550 cursor-pointer h-1 rounded"
            />
            <button
              onClick={() => handleSetParaSpacing(Math.min(40, currentParaSpacing + 2))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>

          {/* Indent slider */}
          <div className="flex items-center gap-2">
            <span className="w-18 text-right">Indent: {currentIndent}px</span>
            <button
              onClick={() => handleSetIndent(Math.max(0, currentIndent - 5))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              -
            </button>
            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={currentIndent}
              onChange={(e) => handleSetIndent(Number(e.target.value))}
              className="w-20 accent-indigo-550 cursor-pointer h-1 rounded"
            />
            <button
              onClick={() => handleSetIndent(Math.min(80, currentIndent + 5))}
              className="w-5 h-5 rounded bg-stone-850 hover:bg-stone-750 text-white flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>

          {/* Drop Cap */}
          <button
            onClick={handleToggleDropCap}
            className={`px-3 py-1 rounded transition-colors font-serif font-bold text-[10px] uppercase border ${
              editor.isActive("textStyle", { float: "left" })
                ? "bg-indigo-600 text-white border-indigo-500/40"
                : "bg-stone-850 hover:bg-stone-750 text-stone-200 border-stone-850"
            }`}
          >
            Drop Cap
          </button>

          {/* Predefined Colors dropdown Popover */}
          <div className="relative group">
            <button className="bg-stone-850 hover:bg-stone-750 text-stone-200 border border-stone-700 px-3 py-1 rounded flex items-center gap-1 cursor-pointer">
              <Palette className="w-3.5 h-3.5" />
              <span>Colors</span>
            </button>
            <div className="absolute top-full right-0 mt-1 bg-stone-900 border border-stone-800 rounded-lg shadow-2xl p-3 hidden group-hover:block z-30 space-y-3 w-44">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-stone-500 mb-1 font-bold">Text Color</p>
                <div className="flex gap-1.5">
                  {textColors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => editor.chain().focus().setMark("textStyle", { color: c.value }).run()}
                      className="w-5 h-5 rounded-full border border-stone-700"
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-stone-500 mb-1 font-bold">Highlight Color</p>
                <div className="flex gap-1.5 flex-wrap">
                  {highlightColors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => editor.chain().focus().setMark("textStyle", { backgroundColor: c.value }).run()}
                      className="w-5 h-5 rounded border border-stone-700"
                      style={{ backgroundColor: c.value === "transparent" ? "#000" : c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Editor Content Canvas */}
      <div className="flex-1 overflow-y-auto px-1 pr-3 scrollbar-paper min-h-[450px] bg-[#faf7ee] bg-paper-texture border border-stone-300 rounded-xl relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
