"use client";

import React, { useState, useEffect, useRef } from "react";
import { TaskResponse } from "@/types/task.types";

interface ShapeMatchTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
}

type ShapeType = "circle" | "triangle" | "square" | "pentagon" | "star" | "diamond";

export default function ShapeMatchTask({ isPractice, onComplete }: ShapeMatchTaskProps) {
  const maxRounds = isPractice ? 3 : 10;

  const [currentRound, setCurrentRound] = useState(0);
  const [targetShape, setTargetShape] = useState<ShapeType>("circle");
  const [options, setOptions] = useState<ShapeType[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hasClicked, setHasClicked] = useState(false);

  const correctCount = useRef(0);
  const incorrectCount = useRef(0);
  const reactionTimes = useRef<number[]>([]);
  const lastDisplayTime = useRef<number>(0);
  const startTime = useRef<number>(0);

  const shapesList: ShapeType[] = ["circle", "triangle", "square", "pentagon", "star", "diamond"];

  const generateRound = () => {
    const target = shapesList[Math.floor(Math.random() * shapesList.length)];
    setTargetShape(target);

    // Shuffle options, make sure target is in options
    const others = shapesList.filter((s) => s !== target);
    const selectedOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    const finalOptions = [target, ...selectedOthers].sort(() => 0.5 - Math.random());

    setOptions(finalOptions);
    setHasClicked(false);
    setFeedback(null);
    lastDisplayTime.current = Date.now();
  };

  useEffect(() => {
    startTime.current = Date.now();
    generateRound();
  }, [currentRound]);

  const handleOptionSelect = (selected: ShapeType) => {
    if (hasClicked) return;
    setHasClicked(true);

    const timeDiff = Date.now() - lastDisplayTime.current;
    reactionTimes.current.push(timeDiff);

    if (selected === targetShape) {
      correctCount.current += 1;
      if (isPractice) {
        setFeedback("correct");
      }
    } else {
      incorrectCount.current += 1;
      if (isPractice) {
        setFeedback("incorrect");
      }
    }

    setTimeout(() => {
      if (currentRound + 1 >= maxRounds) {
        // End task
        const avgRT = reactionTimes.current.length > 0
          ? reactionTimes.current.reduce((a, b) => a + b, 0) / reactionTimes.current.length
          : 0;

        onComplete({
          accuracy: (correctCount.current / maxRounds) * 100,
          reactionTime: Math.round(avgRT),
          missedResponses: maxRounds - (correctCount.current + incorrectCount.current),
          correctResponses: correctCount.current,
          commissionErrors: incorrectCount.current,
          completionTime: (Date.now() - startTime.current) / 1000,
        });
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, isPractice ? 1000 : 300);
  };

  // Helper to render SVG shapes
  const renderShapeSVG = (shape: ShapeType, sizeClass = "w-10 h-10") => {
    const color = "#2563EB";
    if (shape === "circle") {
      return (
        <svg className={sizeClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill={color} />
        </svg>
      );
    }
    if (shape === "triangle") {
      return (
        <svg className={sizeClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,15 90,85 10,85" fill={color} />
        </svg>
      );
    }
    if (shape === "square") {
      return (
        <svg className={sizeClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="70" height="70" rx="4" fill={color} />
        </svg>
      );
    }
    if (shape === "pentagon") {
      return (
        <svg className={sizeClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 90,45 75,90 25,90 10,45" fill={color} />
        </svg>
      );
    }
    if (shape === "star") {
      return (
        <svg className={sizeClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill={color} />
        </svg>
      );
    }
    if (shape === "diamond") {
      return (
        <svg className={sizeClass} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 90,50 50,90 10,50" fill={color} />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-4">
      <div className="text-center space-y-1">
        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          {isPractice ? "Practice Trial Attempt" : "Active Assessment Phase"}
        </p>
        <p className="text-xs text-on-surface-variant font-medium">
          Identify which option shape below matches the center target shape exactly.
        </p>
      </div>

      {/* Target Shape Canvas */}
      <div className="w-32 h-32 rounded-2xl border border-border-default bg-surface-page flex items-center justify-center shadow-sm relative overflow-hidden">
        {renderShapeSVG(targetShape, "w-16 h-16")}

        {/* Feedback Overlay */}
        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center text-white text-xs font-black select-none opacity-90 ${
            feedback === "correct" ? "bg-score-good" : "bg-score-attention"
          }`}>
            {feedback === "correct" ? "✓ Match!" : "✗ Incorrect!"}
          </div>
        )}
      </div>

      {/* Option Grid */}
      <div className="w-full max-w-[280px] space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleOptionSelect(opt)}
              disabled={hasClicked}
              className="h-20 border border-border-default hover:border-brand-primary hover:bg-brand-primary/5 active:scale-95 bg-white rounded-xl flex items-center justify-center transition-all p-4 shadow-sm"
            >
              {renderShapeSVG(opt, "w-10 h-10")}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-[9px] text-on-surface-variant/70 font-semibold px-1">
          <span>Progress: {currentRound + 1}/{maxRounds}</span>
          {!isPractice && (
            <span>Correct: {correctCount.current}</span>
          )}
        </div>
      </div>
    </div>
  );
}
