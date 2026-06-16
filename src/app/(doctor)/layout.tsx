"use client";

import React, { useEffect } from "react";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import DoctorHeader from "@/components/doctor/DoctorHeader";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If not loading, verify clinician credentials
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "doctor") {
        router.push("/patient/dashboard");
      }
    }
  }, [mounted, isAuthenticated, isLoading, user, router]);

  if (!mounted || isLoading || !isAuthenticated || user?.role !== "doctor") {
    return <LoadingScreen message="Verifying clinician access credentials..." />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-md focus:outline-none text-xs font-bold uppercase tracking-wider"
      >
        Skip to main content
      </a>
      <DoctorSidebar />
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto">
        <DoctorHeader />
        <main id="main-content" className="p-6 md:p-8 max-w-7xl w-full mx-auto pb-24">
          <React.Suspense fallback={<LoadingScreen type="fullscreen" message="Loading page components..." />}>
            {children}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
