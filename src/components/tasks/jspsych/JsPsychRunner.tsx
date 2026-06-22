"use client";

import React, { useEffect, useRef } from "react";
import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";

interface JsPsychRunnerProps {
  timeline: any[];
  onFinish: (data: any) => void;
  options?: any;
}

export default function JsPsychRunner({ timeline, onFinish, options = {} }: JsPsychRunnerProps) {
  const displayRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const jsPsychInstanceRef = useRef<any>(null);

  const onFinishRef = useRef(onFinish);
  const timelineRef = useRef(timeline);
  const optionsRef = useRef(options);

  // Keep refs in sync with latest props
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    timelineRef.current = timeline;
    optionsRef.current = options;
  }, [timeline, options]);

  useEffect(() => {
    if (!displayRef.current || initializedRef.current) return;

    initializedRef.current = true;
    const container = displayRef.current;

    const jsPsych = initJsPsych({
      display_element: container,
      on_finish: (data: any) => {
        onFinishRef.current(data);
      },
      ...optionsRef.current,
    });

    if (typeof window !== "undefined") {
      (window as any).jsPsych = jsPsych;
    }

    jsPsychInstanceRef.current = jsPsych;
    jsPsych.run(timelineRef.current);

    return () => {
      initializedRef.current = false;
      if (typeof window !== "undefined") {
        try {
          delete (window as any).jsPsych;
        } catch (e) {
          (window as any).jsPsych = undefined;
        }
      }
      if (jsPsychInstanceRef.current) {
        try {
          // Clean up DOM contents to avoid duplicate renders in React 18/19 Strict Mode
          container.innerHTML = "";
        } catch (e) {
          console.error("Cleanup error in jsPsych runner:", e);
        }
      }
    };
  }, []); // Run ONLY once on mount to prevent reset/blank render loops

  return (
    <div className="jspsych-runner-wrapper w-full h-full min-h-[380px] flex items-center justify-center bg-white rounded-xl p-4 overflow-auto border border-border-default">
      <div ref={displayRef} className="w-full h-full flex flex-col justify-center items-center jspsych-display-element" />
    </div>
  );
}

