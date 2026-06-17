"use client";

import React, { useState, useEffect, useRef } from "react";
import { TaskResponse } from "@/types/task.types";

interface TowerPuzzleTaskProps {
  isPractice: boolean;
  onComplete: (metrics: any) => void;
}

type BallColor = "red" | "green" | "blue";
type PegsState = Record<number, BallColor[]>;

export default function TowerPuzzleTask({ isPractice, onComplete }: TowerPuzzleTaskProps) {
  // Target arrangement: Peg 1: [blue], Peg 2: [green], Peg 3: [red]
  const targetState: PegsState = {
    1: ["blue"],
    2: ["green"],
    3: ["red"]
  };

  // Start state: Peg 1 has blue (bottom), green (middle), red (top)
  // Peg 2 and 3 are empty. Peg capacities: Peg 1: 3, Peg 2: 2, Peg 3: 1
  const [pegs, setPegs] = useState<PegsState>({
    1: ["blue", "green", "red"],
    2: [],
    3: []
  });

  const pegCapacities: Record<number, number> = {
    1: 3,
    2: 2,
    3: 1
  };

  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [planningTime, setPlanningTime] = useState<number>(0);
  const [isDone, setIsDone] = useState(false);

  const startTime = useRef<number>(0);
  const firstMoveTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = Date.now();
  }, []);

  const handlePegClick = (pegId: number) => {
    if (isDone) return;

    if (selectedPeg === null) {
      // Select top ball of this peg if not empty
      if (pegs[pegId].length > 0) {
        setSelectedPeg(pegId);
      }
    } else {
      // Move ball from selectedPeg to current peg
      if (selectedPeg === pegId) {
        // Deselect
        setSelectedPeg(null);
        return;
      }

      const sourceBalls = [...pegs[selectedPeg]];
      const targetBalls = [...pegs[pegId]];

      // Check capacities
      if (targetBalls.length >= pegCapacities[pegId]) {
        // Peg full, show warning or just cancel selection
        setSelectedPeg(null);
        return;
      }

      // Record first move time (planning time)
      if (moveCount === 0) {
        firstMoveTime.current = Date.now() - startTime.current;
        setPlanningTime(firstMoveTime.current);
      }

      // Move the top ball
      const movedBall = sourceBalls.pop()!;
      targetBalls.push(movedBall);

      const nextPegs = {
        ...pegs,
        [selectedPeg]: sourceBalls,
        [pegId]: targetBalls
      };

      setPegs(nextPegs);
      setMoveCount((prev) => prev + 1);
      setSelectedPeg(null);

      // Check target match
      const isMatch =
        JSON.stringify(nextPegs[1]) === JSON.stringify(targetState[1]) &&
        JSON.stringify(nextPegs[2]) === JSON.stringify(targetState[2]) &&
        JSON.stringify(nextPegs[3]) === JSON.stringify(targetState[3]);

      if (isMatch) {
        setIsDone(true);
        const totalDuration = (Date.now() - startTime.current) / 1000;
        
        setTimeout(() => {
          onComplete({
            accuracy: moveCount + 1 <= 5 ? 100 : Math.max(0, 100 - (moveCount + 1 - 5) * 15), // 5 is minimum moves
            reactionTime: Math.round(firstMoveTime.current || 2000), // planning time in ms
            missedResponses: 0,
            correctResponses: moveCount + 1,
            commissionErrors: Math.max(0, moveCount + 1 - 5),
            completionTime: Math.round(totalDuration)
          });
        }, 1000);
      }
    }
  };

  const getBallBg = (color: BallColor) => {
    if (color === "red") return "bg-[#EF4444]";
    if (color === "green") return "bg-[#10B981]";
    return "bg-[#2563EB]";
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-4">
      <div className="text-center space-y-1">
        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          {isPractice ? "Practice Trial Attempt" : "Active Assessment Phase"}
        </p>
        <p className="text-xs text-on-surface-variant font-medium">
          Rearrange the pegs to match the target. Click a peg to select the top ball, then click another peg to drop it.
        </p>
      </div>

      {/* Target state representation */}
      <div className="border border-border-default bg-surface-muted/30 p-2.5 rounded-xl space-y-1.5 w-full max-w-[280px]">
        <p className="text-[9px] font-black uppercase text-on-surface-variant text-center tracking-wider">
          Target arrangement (Goal)
        </p>
        <div className="flex justify-around items-end h-16 relative">
          {/* Target Pegs */}
          {[1, 2, 3].map((pegId) => (
            <div key={pegId} className="flex flex-col items-center relative w-12">
              {/* Peg pole */}
              <div 
                className="w-1 bg-border-strong rounded-full" 
                style={{ height: `${pegCapacities[pegId] * 20 + 8}px` }} 
              />
              {/* Balls */}
              <div className="absolute bottom-0 flex flex-col-reverse gap-0.5">
                {targetState[pegId].map((color, i) => (
                  <div key={i} className={`w-6 h-5 rounded-full ${getBallBg(color)} opacity-70`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Play Area */}
      <div className="flex justify-around items-end h-40 w-full max-w-[320px] bg-white border border-border-default rounded-2xl p-4 shadow-sm relative">
        {[1, 2, 3].map((pegId) => {
          const isSelectedSource = selectedPeg === pegId;
          const balls = pegs[pegId];
          const capacity = pegCapacities[pegId];

          return (
            <div
              key={pegId}
              onClick={() => handlePegClick(pegId)}
              className={`flex flex-col items-center relative w-16 cursor-pointer p-1 rounded-xl transition-all ${
                isSelectedSource ? "bg-brand-primary/5 ring-2 ring-brand-primary/20" : "hover:bg-surface-page/50"
              }`}
            >
              {/* Capacity Limit Tag */}
              <span className="absolute -top-6 text-[8px] font-bold text-on-surface-variant/50">
                Max {capacity}
              </span>

              {/* Peg Pole */}
              <div
                className={`w-1.5 rounded-full transition-colors ${
                  isSelectedSource ? "bg-brand-primary" : "bg-border-strong"
                }`}
                style={{ height: `${capacity * 26 + 10}px` }}
              />

              {/* Balls */}
              <div className="absolute bottom-1 flex flex-col-reverse gap-1">
                {balls.map((color, i) => {
                  const isTopBall = i === balls.length - 1;
                  const isSelectedBall = isSelectedSource && isTopBall;

                  return (
                    <div
                      key={i}
                      className={`w-9 h-7 rounded-full transition-all shadow-sm ${getBallBg(color)} ${
                        isSelectedBall ? "ring-4 ring-offset-2 ring-brand-primary animate-pulse scale-105" : ""
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-xs flex justify-between items-center text-[10px] text-on-surface-variant/80 font-bold px-2 pt-2">
        <span>Moves Taken: {moveCount}</span>
        {isPractice && isDone && (
          <span className="text-score-good">✓ Match Completed!</span>
        )}
        <span>Min moves: 5</span>
      </div>
    </div>
  );
}
