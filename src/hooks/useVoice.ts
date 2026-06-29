import { useState, useEffect, useRef } from "react";

export function useVoice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const warmUp = () => {
    try {
      // 1. Play a brief silent HTML5 Audio element to switch the browser audio session to the media/loudspeaker channel
      const dummyAudio = new Audio(
        "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU2LjQxAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV"
      );
      dummyAudio.play().catch(() => {});

      // 2. Initialize and resume a silent Web Audio Context to further enforce media session mode
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        osc.start(0);
        osc.stop(0.01);
      }
    } catch (e) {
      // Silently catch browser security blocks
    }
  };

  const speak = (text: string, langCode: string) => {
    if (!synthRef.current) return;

    try {
      // Workaround for Chrome SpeechSynthesis freeze bug: resume before canceling
      if (synthRef.current.paused) {
        synthRef.current.resume();
      }
      synthRef.current.cancel();
    } catch {
      // Silently ignore cancel errors — not actionable by the user
    }

    // Warm up audio session to route sound to the main speaker/loudspeaker
    warmUp();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Map language code
    let lang = "en-US";
    if (langCode === "hi") lang = "hi-IN";
    else if (langCode === "mr") lang = "mr-IN"; 
    else if (langCode === "te") lang = "te-IN";

    utterance.lang = lang;

    // Retrieve voices
    const voices = synthRef.current.getVoices();

    // Prioritize natural, Google, or Siri voices
    const getVoiceScore = (v: SpeechSynthesisVoice) => {
      const name = v.name.toLowerCase();
      if (name.includes("natural")) return 3;
      if (name.includes("google")) return 2;
      if (name.includes("microsoft")) return 1;
      return 0;
    };

    // Filter matching voices
    const matchingVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().includes(langCode.toLowerCase()) ||
        v.lang.toLowerCase().startsWith(lang.toLowerCase())
    );

    // Sort by quality score (descending)
    matchingVoices.sort((a, b) => getVoiceScore(b) - getVoiceScore(a));

    if (matchingVoices.length > 0) {
      utterance.voice = matchingVoices[0];
    } else {
      // Fallback for Marathi to Hindi if needed
      if (langCode === "mr") {
        const fallbackHindi = voices.filter((v) => v.lang.toLowerCase().includes("hi"));
        fallbackHindi.sort((a, b) => getVoiceScore(b) - getVoiceScore(a));
        if (fallbackHindi.length > 0) {
          utterance.voice = fallbackHindi[0];
        }
        // else: system default voice will be used
      }
      // else: system default voice will be used for other languages
    }

    // Adjust rate and pitch for a more natural human cadence
    utterance.rate = 0.95; // Slightly slower for clarity in clinical instructions
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
    };
    utterance.onend = () => {
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    speak,
    stop,
    warmUp,
  };
}
