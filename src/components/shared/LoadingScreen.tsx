import React from "react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  type?: "fullscreen" | "inline";
}

export default function LoadingScreen({ message = "Loading Clinical Data...", type = "fullscreen" }: LoadingScreenProps) {
  const isFullscreen = type === "fullscreen";

  return (
    <div className={cn(
      "flex flex-col items-center justify-center bg-surface-page/90 backdrop-blur-sm z-50",
      isFullscreen ? "fixed inset-0" : "w-full py-12 rounded-2xl border border-border-default bg-white shadow-sm"
    )}>
      <div className="relative flex flex-col items-center">
        {/* Brain Pulsing Container */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-4 animate-bounce">
          <Brain className="h-10 w-10 text-brand-primary animate-pulse" />
        </div>
        {/* Loading ring */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent mb-4"></div>
        <p className="text-sm font-bold text-on-surface bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent tracking-wide animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}
