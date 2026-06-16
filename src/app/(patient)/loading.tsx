import React from "react";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function PatientLoading() {
  return <LoadingScreen type="fullscreen" message="Loading secure assessment..." />;
}
