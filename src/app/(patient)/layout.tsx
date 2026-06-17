"use client";

import React, { useEffect } from "react";
import PatientHeader from "@/components/patient/PatientHeader";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Hide header inside active assessment tests to prevent distraction
  const isTesting = pathname.includes("/task/") || pathname.includes("/trial/") || pathname.includes("/instructions/");

  return (
    <div className="min-h-screen bg-surface-page flex flex-col antialiased">
      {!isTesting && <PatientHeader />}
      <div className={isTesting ? "w-full" : "pt-20 pb-20 w-full"}>
        <React.Suspense fallback={null}>
          {children}
        </React.Suspense>
      </div>
    </div>
  );
}
