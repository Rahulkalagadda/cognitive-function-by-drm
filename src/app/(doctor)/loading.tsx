import React from "react";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function DoctorLoading() {
  return <LoadingScreen type="fullscreen" message="Loading clinical portal..." />;
}
