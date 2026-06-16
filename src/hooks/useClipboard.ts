import { useState, useCallback } from "react";

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch((err) => {
        console.error("Clipboard copy failed: ", err);
      });
    }
  }, []);

  return { copied, copy };
}
