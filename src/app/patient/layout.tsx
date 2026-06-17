"use client";

import React, { useEffect } from "react";
import PatientHeader from "@/components/patient/PatientHeader";
import PatientBottomNav from "@/components/patient/PatientBottomNav";
import { useAuth } from "@/hooks/useAuth";

export default function PatientPortalLayout({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="min-h-screen bg-surface-page flex flex-col antialiased">
      <PatientHeader />
      <main className="pt-20 pb-20 w-full flex-1 max-w-lg mx-auto px-4">
        {children}
      </main>
      <PatientBottomNav />
    </div>
  );
}
