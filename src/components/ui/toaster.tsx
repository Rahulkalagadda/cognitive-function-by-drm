"use client";

import React from "react";
import { useToastStore } from "@/stores/toast.store";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4">
      {toasts.map((toast) => {
        const Icon = {
          success: CheckCircle2,
          error: AlertCircle,
          info: Info,
        }[toast.type];

        return (
          <div
            key={toast.id}
            role="alert"
            aria-live="assertive"
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto transition-all duration-300 transform animate-slide-in-right",
              toast.type === "success" && "bg-emerald-50 border-emerald-200 text-emerald-800",
              toast.type === "error" && "bg-red-50 border-red-200 text-red-800",
              toast.type === "info" && "bg-blue-50 border-blue-200 text-blue-800"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 shrink-0 mt-0.5",
              toast.type === "success" && "text-emerald-600",
              toast.type === "error" && "text-red-600",
              toast.type === "info" && "text-blue-600"
            )} />
            <div className="flex-1 space-y-0.5">
              <h4 className="text-xs font-extrabold tracking-tight">{toast.title}</h4>
              {toast.description && (
                <p className="text-[11px] opacity-90 font-medium leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              className="shrink-0 text-on-surface-variant hover:text-on-surface p-0.5 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
