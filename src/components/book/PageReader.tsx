"use client";

import React, { useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import { TextStyle } from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import FontFamily from "@tiptap/extension-font-family";

// 1. Extend Tiptap extensions to support custom inline and block CSS styling attributes in the reader
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

interface PageReaderProps {
  content: string;
  accentColor: string;
}

export default function PageReader({ content, accentColor }: PageReaderProps) {
  const parsedContent = useMemo(() => {
    try {
      return JSON.parse(content);
    } catch (e) {
      return content; // Fallback to raw content/HTML
    }
  }, [content]);

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
      }),
    ],
    content: parsedContent,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none text-stone-850 font-serif leading-relaxed text-lg book-page-flow",
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      const parsed = parsedContent;
      if (JSON.stringify(editor.getJSON()) !== JSON.stringify(parsed)) {
        editor.commands.setContent(parsed);
      }
    }
  }, [editor, content, parsedContent]);

  if (!editor) return null;

  return (
    <div 
      className="w-full h-full text-stone-850"
      style={{
        "--accent-color": accentColor,
        "--accent-border": `${accentColor}20`,
        "--accent-bg": `${accentColor}05`,
      } as React.CSSProperties}
    >
      <div key={content} className="book-content-container w-full h-full">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
