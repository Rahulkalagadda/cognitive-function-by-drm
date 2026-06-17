"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, AlertCircle, ArrowLeft, Mail, Phone, Lock } from "lucide-react";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useToast } from "@/hooks/use-toast";

function PatientLoginPage() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();
  const { toast } = useToast();

  // Navigation & Form State
  const [loginStep, setLoginStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [pinDigits, setPinDigits] = useState<string[]>(Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Focus management for OTP screen
  useEffect(() => {
    if (loginStep === "otp") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
        setActiveInput(0);
      }, 50);
    }
  }, [loginStep]);

  // Validate Email or Phone
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const val = identifier.trim();
    if (!val) {
      setLocalError("Please enter your email address or mobile number.");
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = /^\d{10}$/.test(val.replace(/[- )(]/g, "")); // support simple 10 digit formats

    if (!isEmail && !isPhone) {
      setLocalError("Please enter a valid email address or 10-digit mobile number.");
      return;
    }

    // Generate simulated 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    // Display simulated OTP toast
    toast({
      title: "🔑 Secure OTP Code Sent",
      description: `[MOCK SMS/EMAIL] Your CAP verification code is: ${otp}`,
      duration: 12000,
    });

    setLoginStep("otp");
  };

  // OTP inputs handling
  const handleInputChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // Allow numbers only

    const newDigits = [...pinDigits];
    newDigits[index] = value.substring(value.length - 1); // Only take last character
    setPinDigits(newDigits);
    setLocalError(null);

    // Auto-advance to next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newDigits = [...pinDigits];
      if (newDigits[index] === "" && index > 0) {
        newDigits[index - 1] = "";
        setPinDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
        setActiveInput(index - 1);
      } else {
        newDigits[index] = "";
        setPinDigits(newDigits);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && !isNaN(Number(pasteData))) {
      const newDigits = pasteData.split("");
      setPinDigits(newDigits);
      inputRefs.current[5]?.focus();
      setActiveInput(5);
    }
  };

  // OTP Verification Submission
  const handleSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const pin = pinDigits.join("");

    if (pin.length < 6) {
      setLocalError("Please enter all 6 digits of the OTP.");
      return;
    }

    if (pin !== generatedOtp) {
      setLocalError("Incorrect verification code. Please check the simulated toast code and try again.");
      return;
    }

    try {
      // Map to pre-configured patient accounts or guest
      const normalizedIdentifier = identifier.trim().toLowerCase();
      const isSunita = 
        normalizedIdentifier === "sunita.mehta@gmail.com" || 
        normalizedIdentifier.replace(/[- )(]/g, "") === "9876543210";
      
      const isArjun = 
        normalizedIdentifier === "arjun.bansal@gmail.com" || 
        normalizedIdentifier.replace(/[- )(]/g, "") === "9876543211";

      const token = isSunita ? "sunita-token-48" : isArjun ? "arjun-token-23" : "guest-token";

      await login({
        pin: pin,
        role: "patient"
      });

      // Navigate to assessment onboarding with token
      router.replace(`/assessment/${token}`);
    } catch (e: any) {
      console.error(e);
      setLocalError(e.message || "Failed to log in. Please try again.");
    }
  };

  return (
    <div className="bg-[#F0F9FF] min-h-screen flex flex-col items-center justify-center py-10 px-6 select-none md:select-text">
      {/* Header Section */}
      <header className="mb-6 text-center select-none">
        <h1 className="text-xl font-black text-brand-primary tracking-tight mb-1">CAP</h1>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-80">
          Cognitive Assessment Platform
        </p>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-[420px] bg-white rounded-3xl shadow-card p-8 sm:p-10 flex flex-col items-center border border-border-default transition-all duration-300">
        
        {/* Animated Shield/Lock Icon Wrapper */}
        <div className="w-14 h-14 bg-brand-secondary/10 rounded-full flex items-center justify-center mb-6">
          {loginStep === "identifier" ? (
            <ShieldCheck className="h-8 w-8 text-brand-secondary" />
          ) : (
            <Lock className="h-7 w-7 text-brand-primary animate-pulse" />
          )}
        </div>

        {loginStep === "identifier" ? (
          /* STEP 1: Email / Mobile Input */
          <div className="w-full space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-extrabold text-on-surface mb-2">
                Patient Authentication
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Enter your email address or mobile number to receive a secure login code.
              </p>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/50">
                  {identifier.includes("@") || !/^\d+$/.test(identifier.replace(/[- )(]/g, "")) ? (
                    <Mail className="h-4.5 w-4.5" />
                  ) : (
                    <Phone className="h-4.5 w-4.5" />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="email@example.com or 10-digit mobile"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setLocalError(null);
                  }}
                  className="w-full h-12 pl-10 pr-4 border border-border-default rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/15 focus:border-brand-primary text-xs font-semibold text-on-surface transition-all placeholder:text-on-surface-variant/40"
                />
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] text-on-surface-variant/80 leading-relaxed font-semibold">
                💡 <strong>Demo Tip:</strong> Enter <code className="bg-slate-200/60 px-1 py-0.5 rounded font-mono text-[9px] text-brand-primary">sunita.mehta@gmail.com</code> or <code className="bg-slate-200/60 px-1 py-0.5 rounded font-mono text-[9px] text-brand-primary">9876543210</code> to log in directly as Sunita Mehta.
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/95 hover:to-blue-600/95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98] shadow-md shadow-brand-primary/20 text-sm cursor-pointer group"
              >
                <span>Request verification code</span>
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: 6-Digit OTP Verification */
          <div className="w-full space-y-6">
            <div className="text-center relative">
              <button
                type="button"
                onClick={() => {
                  setLoginStep("identifier");
                  setLocalError(null);
                  setPinDigits(Array(6).fill(""));
                }}
                className="absolute left-0 top-0.5 p-1 -ml-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              
              <h2 className="text-lg font-extrabold text-on-surface mb-2">
                Enter Verification Code
              </h2>
              <p className="text-[11px] text-on-surface-variant leading-relaxed px-6">
                We sent a 6-digit code to <strong className="text-on-surface">{identifier}</strong>. Check your screen toast message.
              </p>
            </div>

            <form onSubmit={handleSubmitOtp} className="space-y-6">
              {/* Digit Code Fields */}
              <div className="flex gap-2.5 justify-between w-full">
                {pinDigits.map((digit, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-14 flex items-center justify-center bg-white border-2 rounded-xl shadow-sm transition-all ${
                      activeInput === idx
                        ? "border-brand-primary ring-2 ring-brand-primary/10"
                        : "border-border-default"
                    }`}
                  >
                    <input
                      ref={(el) => {
                        inputRefs.current[idx] = el!;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onFocus={() => setActiveInput(idx)}
                      onChange={(e) => handleInputChange(e.target.value, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      onPaste={handlePaste}
                      className="w-full h-full text-center font-mono text-xl font-bold bg-transparent outline-none border-none p-0 text-on-surface focus:ring-0"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/95 hover:to-blue-600/95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98] shadow-md shadow-brand-primary/20 text-sm cursor-pointer group"
              >
                {isLoading ? "Verifying..." : "Verify code & start"}
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 border-t border-border-default pt-6 w-full text-center">
          <p className="text-[11px] text-on-surface-variant/80 font-medium">
            Clinicians: <a className="text-brand-secondary hover:underline font-bold" href="/login">Sign in to Dashboard</a>
          </p>
        </footer>
      </main>

      {/* Errors display */}
      {(localError || authError) && (
        <div className="mt-6 w-full max-w-[420px] bg-red-50 border border-status-error/20 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="h-5 w-5 text-status-error shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-status-error leading-relaxed">
            {localError || authError}
          </p>
        </div>
      )}
    </div>
  );
}

export default withErrorBoundary(PatientLoginPage);
