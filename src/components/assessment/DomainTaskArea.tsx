import React, { useState, useEffect, useRef } from "react";
import { AssessmentStep } from "@/types/assessment.types";
import { cn } from "@/lib/utils";
import { Plus, X, Award, Check } from "lucide-react";

interface DomainTaskAreaProps {
  step: AssessmentStep;
  savedResponse: any;
  onResponse: (response: any) => void;
}

export default function DomainTaskArea({ step, savedResponse, onResponse }: DomainTaskAreaProps) {
  const taskType = step.taskType.replace("-", "_"); // normalize to underscore

  if (taskType === "word_recall") {
    return (
      <WordRecallTask
        words={step.config.words || ["Apple", "River", "Cabinet", "Shadow", "Anchor", "Breeze"]}
        savedResponse={savedResponse}
        onResponse={onResponse}
      />
    );
  }

  if (taskType === "reasoning_puzzle" || taskType === "pattern_matrix") {
    return (
      <PatternMatrixTask
        savedResponse={savedResponse}
        onResponse={onResponse}
      />
    );
  }

  if (taskType === "coordination_test" || taskType === "attention_click") {
    return (
      <AttentionClickTask
        savedResponse={savedResponse}
        onResponse={onResponse}
      />
    );
  }

  if (taskType === "perception_test" || taskType === "symbol_sequence") {
    return (
      <SymbolSequenceTask
        savedResponse={savedResponse}
        onResponse={onResponse}
      />
    );
  }

  return (
    <div className="text-center p-6 text-on-surface-variant font-bold">
      Unsupported cognitive task.
    </div>
  );
}

/* ==================== SUB-COMPONENTS ==================== */

// --- 1. WORD RECALL TASK ---
function WordRecallTask({
  words,
  savedResponse,
  onResponse
}: {
  words: string[];
  savedResponse: string[] | undefined;
  onResponse: (response: string[]) => void;
}) {
  const [phase, setPhase] = useState<"show" | "recall">("show");
  const [inputVal, setInputVal] = useState("");
  const recalledList = savedResponse || [];

  // Limit display words to 6 (3x2 grid)
  const displayWords = words.slice(0, 6);

  const handleAddWord = () => {
    const cleaned = inputVal.trim();
    if (cleaned && !recalledList.includes(cleaned)) {
      const updated = [...recalledList, cleaned];
      onResponse(updated);
      setInputVal("");
    }
  };

  return (
    <div className="h-full flex flex-col justify-between select-none">
      {phase === "show" ? (
        <div className="flex-1 flex flex-col justify-center items-center gap-6">
          <p className="text-xs text-brand-primary font-bold uppercase tracking-widest text-center">
            Memorize the 6 words below:
          </p>
          <div className="grid grid-cols-3 gap-3 w-full">
            {displayWords.map((word) => (
              <div
                key={word}
                className="h-16 flex items-center justify-center bg-slate-50 rounded-xl border border-border-default shadow-sm text-[20px] font-extrabold text-on-surface select-none"
              >
                {word}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPhase("recall")}
            className="mt-4 px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-sm shrink-0"
          >
            I'm Ready to Recall
          </button>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-center items-center gap-4">
          <p className="text-xs text-brand-secondary font-bold uppercase tracking-widest text-center">
            Type as many words as you can recall:
          </p>
          
          <div className="flex gap-2 w-full max-w-xs">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
              placeholder="Enter recalled word..."
              aria-label="Recalled word entry"
              className="flex-grow min-h-[44px] px-3 border border-border-default rounded-xl text-xs focus:ring-2 focus:ring-brand-primary focus:outline-none bg-surface-page"
            />
            <button
              onClick={handleAddWord}
              aria-label="Add word to list"
              className="bg-brand-secondary text-white min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center shadow-sm active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center max-w-sm pt-2">
            {recalledList.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs font-bold rounded-full uppercase"
              >
                <span>{word}</span>
                <button
                  onClick={() => onResponse(recalledList.filter((w) => w !== word))}
                  aria-label={`Remove word ${word}`}
                  className="hover:text-status-error ml-1 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- 2. PATTERN MATRIX TASK ---
function PatternMatrixTask({
  savedResponse,
  onResponse
}: {
  savedResponse: string | undefined;
  onResponse: (response: string) => void;
}) {
  const options = ["circle", "triangle", "square", "star"];

  const renderShape = (shape: string, className = "h-6 w-6 text-on-surface") => {
    if (shape === "circle") return <div className={cn("rounded-full bg-current", className)} />;
    if (shape === "square") return <div className={cn("bg-current", className)} />;
    if (shape === "triangle") {
      return (
        <svg viewBox="0 0 100 100" className={cn("fill-current", className)}>
          <polygon points="50,15 90,85 10,85" />
        </svg>
      );
    }
    // Star shape
    return (
      <svg viewBox="0 0 100 100" className={cn("fill-current", className)}>
        <polygon points="50,10 63,38 93,38 69,56 78,86 50,68 22,86 31,56 7,38 37,38" />
      </svg>
    );
  };

  return (
    <div className="h-full flex flex-col justify-between py-2 select-none">
      {/* 3x3 Grid Matrix */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="grid grid-cols-3 gap-3 w-56">
          {/* Row 1 */}
          <div className="h-14 w-14 bg-slate-50 border border-border-default rounded-xl flex items-center justify-center text-brand-primary">
            {renderShape("circle")}
          </div>
          <div className="h-14 w-14 bg-slate-50 border border-border-default rounded-xl flex items-center justify-center text-brand-primary">
            {renderShape("triangle")}
          </div>
          <div className="h-14 w-14 bg-slate-50 border border-border-default rounded-xl flex items-center justify-center text-brand-primary">
            {renderShape("square")}
          </div>

          {/* Row 2 */}
          <div className="h-14 w-14 bg-slate-50 border border-border-default rounded-xl flex items-center justify-center text-brand-secondary">
            {renderShape("triangle")}
          </div>
          <div className="h-14 w-14 bg-slate-50 border border-border-default rounded-xl flex items-center justify-center text-brand-secondary">
            {renderShape("square")}
          </div>
          <div className="h-14 w-14 bg-slate-50 border border-border-default rounded-xl flex items-center justify-center text-brand-secondary">
            {renderShape("circle")}
          </div>

          {/* Row 3 (last has ?) */}
          <div className="h-14 w-14 bg-slate-50 border border-border-default rounded-xl flex items-center justify-center text-brand-accent">
            {renderShape("square")}
          </div>
          <div className="h-14 w-14 bg-slate-50 border border-border-default rounded-xl flex items-center justify-center text-brand-accent">
            {renderShape("circle")}
          </div>
          <div className="h-14 w-14 border-2 border-dashed border-border-strong rounded-xl flex items-center justify-center bg-surface-muted/30">
            <span className="text-lg font-bold text-on-surface-variant">?</span>
          </div>
        </div>
      </div>

      {/* 4 Answer options 2x2 grid */}
      <div className="shrink-0 mt-4 space-y-2">
        <p className="text-[10px] font-extrabold uppercase text-center text-on-surface-variant tracking-wider">
          Choose matching target option:
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {options.map((shape) => {
            const isSelected = savedResponse === shape;
            return (
              <button
                key={shape}
                type="button"
                onClick={() => onResponse(shape)}
                className={cn(
                  "min-h-[44px] flex items-center justify-center gap-2 rounded-xl border transition-all active:scale-[0.98]",
                  isSelected
                    ? "border-2 border-brand-primary bg-blue-50/50 text-brand-primary"
                    : "border-border-default bg-white hover:bg-surface-muted text-on-surface-variant"
                )}
              >
                {renderShape(shape, "h-5 w-5")}
                <span className="text-[10px] font-bold uppercase tracking-wider">{shape}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- 3. ATTENTION CLICK TASK ---
function AttentionClickTask({
  savedResponse,
  onResponse
}: {
  savedResponse: number | undefined;
  onResponse: (response: number) => void;
}) {
  const taps = savedResponse || 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dotPos, setDotPos] = useState({ top: 40, left: 50 });

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResponse(taps + 1);
    
    // Random position within container boundaries
    const randomTop = Math.floor(15 + Math.random() * 70);
    const randomLeft = Math.floor(15 + Math.random() * 70);
    setDotPos({ top: randomTop, left: randomLeft });
  };

  return (
    <div className="h-full flex flex-col justify-between py-2 select-none">
      <div className="shrink-0 flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant mb-2">
        <span>Click target circles:</span>
        <span className="text-brand-secondary font-mono text-xs bg-brand-secondary/10 px-2.5 py-0.5 rounded-full">
          Score: {taps}
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 w-full relative bg-slate-50 border border-border-default rounded-2xl overflow-hidden shadow-inner min-h-[160px]"
      >
        <button
          onClick={handleTap}
          style={{ top: `${dotPos.top}%`, left: `${dotPos.left}%` }}
          className="absolute min-h-[44px] min-w-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary border-4 border-white shadow-md active:scale-90 transition-transform flex items-center justify-center text-white"
          aria-label="Click target"
        >
          <div className="h-3.5 w-3.5 rounded-full bg-white animate-ping" />
        </button>
      </div>
    </div>
  );
}

// --- 4. SYMBOL SEQUENCE TASK ---
function SymbolSequenceTask({
  savedResponse,
  onResponse
}: {
  savedResponse: string[] | undefined;
  onResponse: (response: string[]) => void;
}) {
  const targetSeq = ["red", "blue", "green"];
  const [phase, setPhase] = useState<"show" | "recreate">("show");
  const currentSelections = savedResponse || [];

  useEffect(() => {
    // Show symbols for 2.5 seconds, then switch to recreate phase
    const timer = setTimeout(() => {
      setPhase("recreate");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleColorClick = (color: string) => {
    if (currentSelections.length < targetSeq.length) {
      const updated = [...currentSelections, color];
      onResponse(updated);
    }
  };

  const resetSelection = () => {
    onResponse([]);
  };

  const colorClasses: Record<string, string> = {
    red: "bg-status-error text-white",
    blue: "bg-brand-primary text-white",
    green: "bg-status-complete text-white"
  };

  return (
    <div className="h-full flex flex-col justify-between py-2 select-none">
      {phase === "show" ? (
        <div className="flex-1 flex flex-col justify-center items-center gap-5">
          <p className="text-xs text-brand-primary font-bold uppercase tracking-widest text-center">
            Memorize the colored sequence:
          </p>
          <div className="flex gap-4">
            {targetSeq.map((color, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center font-extrabold shadow-sm border border-black/5 animate-pulse",
                  colorClasses[color]
                )}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-center items-center gap-5">
          <p className="text-xs text-brand-secondary font-bold uppercase tracking-widest text-center">
            Recreate the color sequence:
          </p>

          {/* Current selections display */}
          <div className="flex gap-4 h-14 items-center">
            {targetSeq.map((_, idx) => {
              const selectedColor = currentSelections[idx];
              return (
                <div
                  key={idx}
                  className={cn(
                    "h-12 w-12 rounded-xl border border-dashed flex items-center justify-center font-bold text-xs shadow-inner uppercase",
                    selectedColor
                      ? cn("border-transparent font-extrabold text-white", colorClasses[selectedColor])
                      : "border-border-strong text-on-surface-variant/40 bg-surface-muted/20"
                  )}
                >
                  {selectedColor ? idx + 1 : "?"}
                </div>
              );
            })}
          </div>

          {/* Select buttons */}
          <div className="space-y-3 w-full max-w-xs">
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(colorClasses).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorClick(color)}
                  disabled={currentSelections.length >= targetSeq.length}
                  className={cn(
                    "min-h-[44px] rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] border shadow-sm",
                    currentSelections.length >= targetSeq.length
                      ? "bg-slate-100 border-border-default text-on-surface-variant/30 cursor-not-allowed"
                      : "bg-white border-border-default text-on-surface-variant hover:bg-slate-50"
                  )}
                >
                  <div className={cn("h-3.5 w-3.5 rounded-full mr-1.5 shrink-0", colorClasses[color])} />
                  <span>{color}</span>
                </button>
              ))}
            </div>

            {currentSelections.length > 0 && (
              <button
                onClick={resetSelection}
                className="w-full min-h-[44px] bg-surface-muted hover:bg-border-default text-on-surface-variant font-bold text-[10px] rounded-xl uppercase tracking-wider transition-all active:scale-95"
              >
                Clear Selections
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
