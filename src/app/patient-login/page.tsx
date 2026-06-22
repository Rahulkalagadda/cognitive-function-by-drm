"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, AlertCircle, ArrowLeft, Mail, Phone, Lock, CheckCircle2 } from "lucide-react";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { lookupPatient, requestOtp, verifyOtp } from "@/services/api/auth.service";

interface LookupResult {
  patient_id: string;
  name: string;
  channel: string;
}

function PatientLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";
  const prefillEmail = searchParams.get("email") || "";

  // Steps: "identifier" → "otp" → "done"
  const [loginStep, setLoginStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState(prefillEmail);
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [pinDigits, setPinDigits] = useState<string[]>(Array(6).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (loginStep === "otp") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
        setActiveInput(0);
      }, 50);
    }
  }, [loginStep]);

  // Step 1: lookup patient by email or phone, then request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const val = identifier.trim();
    if (!val) {
      setLocalError("Please enter your email address or mobile number.");
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = /^\d{10,15}$/.test(val.replace(/[\s\-)(]/g, ""));

    if (!isEmail && !isPhone) {
      setLocalError("Please enter a valid email address or 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Lookup patient_id from email/phone
      const lookup = await lookupPatient(val);
      setLookupResult(lookup);

      // 2. Request OTP using patient_id
      const otpData = await requestOtp(lookup.patient_id, lookup.channel, "login");

      // In sandbox mode the backend returns the code in the response
      if (otpData.code_simulation) {
        setOtpHint(otpData.code_simulation);
      }

      setLoginStep("otp");
    } catch (err: any) {
      setLocalError(err.message || "No account found with this email or phone. Please check the details or contact your clinician.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP digit input handlers
  const handleInputChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newDigits = [...pinDigits];
    newDigits[index] = value.substring(value.length - 1);
    setPinDigits(newDigits);
    setLocalError(null);
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

  // Step 2: Verify OTP and redirect to dashboard
  const handleSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const pin = pinDigits.join("");

    if (pin.length < 6) {
      setLocalError("Please enter all 6 digits of the OTP.");
      return;
    }

    if (!lookupResult) return;

    setIsLoading(true);
    try {
      await verifyOtp(lookupResult.patient_id, pin, "login");

      // Store minimal patient session info in localStorage and cookies.
      // cap_auth is required by middleware to allow access to /patient/* routes.
      localStorage.setItem("cap_patient_id", lookupResult.patient_id);
      localStorage.setItem("cap_patient_name", lookupResult.name);
      localStorage.setItem("cap_token", lookupResult.patient_id);
      localStorage.setItem("cap_role", "patient");
      document.cookie = `cap_auth=${lookupResult.patient_id}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `cap_role=patient; path=/; max-age=86400; SameSite=Lax`;

      router.replace("/patient/dashboard");
    } catch (err: any) {
      setLocalError(err.message || "Incorrect verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F0F9FF] min-h-screen flex flex-col items-center justify-center py-10 px-6 select-none md:select-text">
      {/* Header */}
      <header className="mb-6 text-center select-none">
        <h1 className="text-xl font-black text-brand-primary tracking-tight mb-1">CAP</h1>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-80">
          Cognitive Assessment Platform
        </p>
      </header>

      {/* Registered success banner */}
      {registered && (
        <div className="w-full max-w-[420px] mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
            Account created successfully! Sign in below to view your past assessment reports.
          </p>
        </div>
      )}

      {/* Main Card */}
      <main className="w-full max-w-[420px] bg-white rounded-3xl shadow-card p-8 sm:p-10 flex flex-col items-center border border-border-default transition-all duration-300">

        {/* Icon */}
        <div className="w-14 h-14 bg-brand-secondary/10 rounded-full flex items-center justify-center mb-6">
          {loginStep === "identifier" ? (
            <ShieldCheck className="h-8 w-8 text-brand-secondary" />
          ) : (
            <Lock className="h-7 w-7 text-brand-primary animate-pulse" />
          )}
        </div>

        {loginStep === "identifier" ? (
          /* STEP 1: Email / Phone input */
          <div className="w-full space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-extrabold text-on-surface mb-2">
                Patient Sign In
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Enter your email or mobile number to receive a secure verification code.
              </p>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/50">
                  {identifier.includes("@") || !/^\d+$/.test(identifier.replace(/[\s\-)(]/g, ""))
                    ? <Mail className="h-4 w-4" />
                    : <Phone className="h-4 w-4" />
                  }
                </div>
                <input
                  type="text"
                  placeholder="email@example.com or 10-digit mobile"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setLocalError(null); }}
                  className="w-full h-12 pl-10 pr-4 border border-border-default rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/15 focus:border-brand-primary text-xs font-semibold text-on-surface transition-all placeholder:text-on-surface-variant/40"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/95 hover:to-blue-600/95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98] shadow-md shadow-brand-primary/20 text-sm cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Looking up account…</span>
                ) : (
                  <>
                    <span>Request verification code</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>

        ) : (
          /* STEP 2: 6-digit OTP entry */
          <div className="w-full space-y-6">
            <div className="text-center relative">
              <button
                type="button"
                onClick={() => { setLoginStep("identifier"); setLocalError(null); setPinDigits(Array(6).fill("")); }}
                className="absolute left-0 top-0.5 p-1 -ml-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <h2 className="text-lg font-extrabold text-on-surface mb-2">
                Enter Verification Code
              </h2>
              <p className="text-[11px] text-on-surface-variant leading-relaxed px-6">
                A 6-digit code was sent to <strong className="text-on-surface">{identifier}</strong>.
              </p>
            </div>

            {/* Sandbox hint: show OTP from backend */}
            {otpHint && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                  🧪 Sandbox Mode — Your code
                </p>
                <p className="text-2xl font-mono font-black text-amber-900 tracking-widest">{otpHint}</p>
              </div>
            )}

            <form onSubmit={handleSubmitOtp} className="space-y-6">
              {/* Digit fields */}
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
                      ref={(el) => { inputRefs.current[idx] = el!; }}
                      type="text"
                      inputMode="numeric"
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
                disabled={isLoading || pinDigits.join("").length < 6}
                className="w-full h-12 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-brand-primary/95 hover:to-blue-600/95 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98] shadow-md shadow-brand-primary/20 text-sm cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying…" : "Verify & Sign In"}
                {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>

            <p className="text-center text-[11px] text-on-surface-variant/70 font-medium">
              Didn't receive a code?{" "}
              <button
                type="button"
                onClick={() => { setLoginStep("identifier"); setPinDigits(Array(6).fill("")); setLocalError(null); setOtpHint(null); }}
                className="text-brand-primary font-bold hover:underline cursor-pointer"
              >
                Try again
              </button>
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 border-t border-border-default pt-6 w-full text-center">
          <p className="text-[11px] text-on-surface-variant/80 font-medium">
            Clinicians:{" "}
            <a className="text-brand-secondary hover:underline font-bold" href="/login">
              Sign in to Dashboard
            </a>
          </p>
        </footer>
      </main>

      {/* Error display */}
      {localError && (
        <div className="mt-6 w-full max-w-[420px] bg-red-50 border border-status-error/20 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="h-5 w-5 text-status-error shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-status-error leading-relaxed">{localError}</p>
        </div>
      )}
    </div>
  );
}

const PatientLoginPageWithError = withErrorBoundary(PatientLoginPageContent);

export default function PatientLoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#F0F9FF] min-h-screen flex flex-col items-center justify-center py-10 px-6 select-none md:select-text">
        <header className="mb-6 text-center select-none">
          <h1 className="text-xl font-black text-brand-primary tracking-tight mb-1">CAP</h1>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-80">
            Cognitive Assessment Platform
          </p>
        </header>
        <main className="w-full max-w-[420px] bg-white rounded-3xl shadow-card p-8 sm:p-10 flex flex-col items-center border border-border-default">
          <p className="text-xs text-on-surface-variant font-medium">Loading form...</p>
        </main>
      </div>
    }>
      <PatientLoginPageWithError />
    </Suspense>
  );
}
