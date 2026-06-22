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
  };
}
