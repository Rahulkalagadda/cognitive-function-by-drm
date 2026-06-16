import React from "react";
import { useClipboard } from "@/hooks/useClipboard";
import { Link2, Check } from "lucide-react";

interface CopyLinkButtonProps {
  token: string;
  autoFocus?: boolean;
}

export default function CopyLinkButton({ token, autoFocus }: CopyLinkButtonProps) {
  const { copied, copy } = useClipboard();
  
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const link = `${origin}/assessment/${token}`;

  return (
    <button
      onClick={() => copy(link)}
      autoFocus={autoFocus}
      aria-label="Copy secure assessment link"
      className="inline-flex items-center gap-2 px-4 py-2 border border-brand-primary text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-status-complete" />
          <span className="text-status-complete">Copied!</span>
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" />
          <span>Copy Assessment Link</span>
        </>
      )}
    </button>
  );
}
