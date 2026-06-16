"use client";

import React, { useState } from "react";
import Logo from "@/components/shared/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaInput } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { Brain, Lock, Mail, Clipboard, KeyRound } from "lucide-react";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { toastSuccess, toastError } from "@/lib/toast";

function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [activeTab, setActiveTab] = useState<"doctor" | "patient">("doctor");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "doctor",
      email: "priya.sharma@caphealth.org",
      password: "password"
    }
  });

  const handleTabChange = (role: "doctor" | "patient") => {
    setActiveTab(role);
    setValue("role", role);
    if (role === "doctor") {
      setValue("email", "priya.sharma@caphealth.org");
      setValue("password", "password");
      setValue("pin", undefined);
    } else {
      setValue("email", undefined);
      setValue("password", undefined);
      setValue("pin", "sunita-token-48");
    }
  };

  const onSubmit = async (data: LoginSchemaInput) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        pin: data.pin,
        role: data.role
      });
      
      if (data.role === "doctor") {
        toastSuccess("Welcome, Dr. Priya Sharma", "Clinician session authorized successfully.");
        router.replace("/dashboard");
      } else {
        toastSuccess("Welcome, Sunita Mehta", "Patient session authorized successfully.");
        router.replace("/patient/dashboard");
      }
    } catch (e: any) {
      console.error(e);
      toastError("Authentication Failed", e.message || "Invalid credentials provided.");
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md px-6">
      
      {/* Visual illustration box */}
      <div className="flex flex-col items-center justify-center mb-8">
        <Logo className="text-3xl mb-4" />
        <div className="h-24 w-24 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm relative overflow-hidden group">
          {/* Subtle neural visualization */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/5 opacity-50" />
          <Brain className="h-12 w-12 text-brand-primary animate-pulse relative z-10" />
        </div>
      </div>

      <div className="bg-surface-card rounded-2xl border border-border-default shadow-modal overflow-hidden animate-scaleIn">
        
        {/* Portal Tabs Selector */}
        <div className="flex border-b border-border-default bg-surface-muted/30">
          <button
            type="button"
            onClick={() => handleTabChange("doctor")}
            className={`flex-1 py-3.5 text-center text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "doctor"
                ? "border-brand-primary text-brand-primary bg-surface-card"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Clinician Portal
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("patient")}
            className={`flex-1 py-3.5 text-center text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "patient"
                ? "border-brand-primary text-brand-primary bg-surface-card"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Patient Portal
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Clinician Fields */}
            {activeTab === "doctor" && (
              <>
                <div className="space-y-1">
                  <label htmlFor="clinician-email" className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                    Clinician Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-on-surface-variant/60" />
                    <input
                      id="clinician-email"
                      type="email"
                      {...register("email")}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      placeholder="priya.sharma@caphealth.org"
                      className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-[10px] font-bold text-status-error">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="clinician-password" className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-on-surface-variant/60" />
                    <input
                      id="clinician-password"
                      type="password"
                      {...register("password")}
                      aria-describedby={errors.password ? "password-error" : undefined}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    />
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-[10px] font-bold text-status-error">{errors.password.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Patient Fields */}
            {activeTab === "patient" && (
              <div className="space-y-1">
                <label htmlFor="patient-token" className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                  Assessment Access Token
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-on-surface-variant/60" />
                  <input
                    id="patient-token"
                    type="text"
                    {...register("pin")}
                    aria-describedby={errors.pin ? "pin-error" : undefined}
                    placeholder="Enter assessment token (e.g. sunita-token-48)"
                    className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none font-mono"
                  />
                </div>
                {errors.pin && (
                  <p id="pin-error" className="text-[10px] font-bold text-status-error">{errors.pin.message}</p>
                )}
                <p className="text-[9px] text-on-surface-variant font-medium leading-relaxed pt-1">
                  Assigned assessment tokens can be retrieved directly from your clinical doctor.
                </p>
              </div>
            )}

            {error && (
              <p className="text-[10px] font-bold text-status-error text-center bg-status-error/5 p-2.5 border border-status-error/15 rounded-xl animate-shake">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white shadow-md shadow-brand-primary/20 rounded-xl text-xs font-extrabold transition-all active:scale-95 disabled:bg-brand-primary/45 mt-2"
            >
              {isLoading ? "Signing In..." : "Secure Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(LoginPage);
