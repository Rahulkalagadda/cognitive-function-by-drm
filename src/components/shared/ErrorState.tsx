import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  retryAction?: () => void;
  retryLabel?: string;
}

export default function ErrorState({ title = "Something went wrong", message, retryAction, retryLabel = "Try Again" }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-status-error/20 bg-status-error/5 p-8 text-center max-w-md mx-auto my-6 shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status-error/10 text-status-error mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-md font-bold text-status-error mb-1">{title}</h3>
      <p className="text-sm text-on-surface-variant mb-6">{message}</p>
      {retryAction && (
        <button
          onClick={retryAction}
          className="bg-status-error hover:bg-status-error/95 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-transform active:scale-95"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
