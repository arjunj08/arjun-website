/**
 * Helper to split element text content into words or individual characters.
 * Returns an array of newly created HTMLSpanElements.
 */
export function splitText(element: HTMLElement, type: 'words' | 'chars'): HTMLSpanElement[] {
  const text = element.textContent || "";
  element.innerHTML = ""; // Clear original text

  if (type === 'words') {
    const words = text.split(/\s+/).filter(Boolean);
    const spans: HTMLSpanElement[] = [];
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.style.display = "inline-block";
      span.style.whiteSpace = "nowrap";
      span.textContent = word;
      element.appendChild(span);
      spans.push(span);
      
      // Add space between words
      if (index < words.length - 1) {
        element.appendChild(document.createTextNode(" "));
      }
    });
    return spans;
  } else {
    // chars mode
    const words = text.split(/\s+/).filter(Boolean);
    const charSpans: HTMLSpanElement[] = [];
    words.forEach((word, wordIndex) => {
      // Create a container for the word so it wraps as a single unit
      const wordContainer = document.createElement("span");
      wordContainer.style.display = "inline-block";
      wordContainer.style.whiteSpace = "nowrap";
      
      // Split word into chars
      const chars = Array.from(word);
      chars.forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.style.display = "inline-block";
        charSpan.textContent = char;
        wordContainer.appendChild(charSpan);
        charSpans.push(charSpan);
      });
      
      element.appendChild(wordContainer);
      
      // Add space between word containers
      if (wordIndex < words.length - 1) {
        element.appendChild(document.createTextNode(" "));
      }
    });
    return charSpans;
  }
}

