"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";

import { useAssessmentStore } from "@/stores/assessment.store";
import { getTranslation } from "@/lib/translations";

type CountdownState = 3 | 2 | 1 | "Go!";

function AssessmentStartTransitionPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = params;
  const [count, setCount] = useState<CountdownState>(3);
  const { language } = useAssessmentStore();

  useEffect(() => {
    const t3 = setTimeout(() => setCount(2), 1000);
    const t2 = setTimeout(() => setCount(1), 2000);
    const t1 = setTimeout(() => setCount("Go!"), 3000);
    const tGo = setTimeout(() => {
      router.push(`/assessment/${token}/domain/0`);
    }, 4000);

    return () => {
      clearTimeout(t3);
      clearTimeout(t2);
      clearTimeout(t1);
      clearTimeout(tGo);
    };
  }, [token, router]);

  const langCode = language || "en";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-primary text-white select-none">
      
      {/* Inline styles for pulse scale animation */}
      <style jsx global>{`
        @keyframes zoom-pulse {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          30% {
            transform: scale(1.25);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-zoom-pulse {
          animation: zoom-pulse 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <div className="text-center space-y-4">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">
          {getTranslation(langCode, "countdownGetReady")}
        </p>

        {/* Remount element on state change to restart animation */}
        <div 
          key={count} 
          className="text-8xl font-extrabold select-none tracking-tight animate-zoom-pulse"
        >
          {count === "Go!" ? getTranslation(langCode, "countdownGo") : count}
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(AssessmentStartTransitionPage);
