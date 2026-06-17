"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaInput } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from "lucide-react";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { toastSuccess, toastError } from "@/lib/toast";
import Logo from "@/components/shared/Logo";

function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "doctor",
      email: "priya.sharma@caphealth.org",
      password: "password"
    }
  });

  const onSubmit = async (data: LoginSchemaInput) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        role: "doctor"
      });
      toastSuccess("Welcome, Dr. Priya Sharma", "Clinician session authorized successfully.");
      router.replace("/dashboard");
    } catch (e: any) {
      console.error(e);
      toastError("Authentication Failed", e.message || "Invalid credentials provided.");
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-page">
      {/* Left Panel: Illustration (Desktop Only) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-[#EBF3FF] to-white flex-col items-center justify-center p-8 border-r border-border-default">
        <div className="relative w-full max-w-lg aspect-[2/3] rounded-2xl overflow-hidden shadow-card">
          <img
            alt="Medical Neural Network Illustration"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4IipA_032R_zN8HN2QgVxOKWUysxvzAIHMIT_Gzw2RnpoChie33F7JvT4Y1izF9sw76qZCXY4xhN6AgoXNx86iO2KZGX7gqE7KXq-azMlfN-8QREtko2J1nbHvRfc3dqxmzyYM_jw5VeRNBCzquauDYi1rsD41q7MjB1K2aL1ofQNPDeJsd2mleH23HCtVX36xTTVAKYQkpKHk1ZVHuPLh5AW38OH2tPjRnKFj7L7HX6Iojf1hffhOBP_GVWOeODvnT7tPxafwbI"
          />
        </div>
        <div className="mt-8 text-center max-w-sm">
          <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary tracking-tight">
            Evidence-Based Cognitive Assessments
          </h2>
          <p className="mt-2 text-xs md:text-sm font-medium text-on-surface-variant leading-relaxed">
            Advanced clinical tools designed for neurological precision and diagnostic clarity.
          </p>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-[400px] flex flex-col space-y-6">
          {/* Brand Identity */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <Logo className="h-12 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Welcome back</h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1">
              Sign in to your clinical dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="dr.smith@hospital.org"
                  className="w-full px-4 py-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none text-sm"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-semibold text-status-error">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none text-sm pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/80 hover:text-brand-primary transition-colors flex items-center"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-status-error">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-brand-primary hover:bg-brand-primary/95 text-white font-semibold rounded-lg shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center text-sm"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Links & Extras */}
          <div className="flex flex-col items-center space-y-4">
            <a className="text-[#0D9488] text-xs font-semibold hover:underline decoration-2 underline-offset-4" href="#">
              Forgot password?
            </a>
            <a href="/patient-login" className="text-xs text-brand-primary font-bold hover:underline">
              Are you a patient? Enter assessment PIN
            </a>
            <div className="pt-4 border-t border-border-default w-full text-center">
              <p className="text-xs text-on-surface-variant font-medium">
                Need access? <a className="text-brand-primary hover:underline font-semibold" href="#">Contact your administrator</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withErrorBoundary(LoginPage);
