import { useEffect } from "react";
import { useAssessment } from "./useAssessment";

export function useTimer(isActive: boolean) {
  const { tickTimer, currentSession } = useAssessment();
  const timeRemaining = currentSession?.timeRemainingSeconds ?? 0;

  useEffect(() => {
    if (!isActive || currentSession?.status !== "started") return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, tickTimer, currentSession?.status]);

  return timeRemaining;
}
