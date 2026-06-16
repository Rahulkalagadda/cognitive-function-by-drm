"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, initialize } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user?.role === "doctor") {
        router.replace("/dashboard");
      } else if (user?.role === "patient") {
        router.replace("/patient/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [mounted, isAuthenticated, isLoading, user, router]);

  return <LoadingScreen message="Redirecting to authorized portal workspace..." />;
}
