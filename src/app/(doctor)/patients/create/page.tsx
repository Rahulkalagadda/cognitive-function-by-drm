"use client";

import React, { useState, useRef, useEffect } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, PatientSchemaInput } from "@/lib/validators";
import { usePatient } from "@/hooks/usePatient";
import { useRouter } from "next/navigation";
import CopyLinkButton from "@/components/patient/CopyLinkButton";
import { Check, Clipboard, Sparkles, UserCheck, X } from "lucide-react";
import Link from "next/link";
import { withErrorBoundary } from "@/components/shared/ErrorBoundary";
import { toastSuccess, toastError } from "@/lib/toast";

function CreatePatientPage() {
  const { createPatient, isLoading } = usePatient();
  const router = useRouter();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [successData, setSuccessData] = useState<{
    name: string;
    medicalId: string;
    token: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PatientSchemaInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      status: "Scheduled",
      gender: "Female"
    }
  });

  // Focus management: return focus to trigger when modal is closed
  useEffect(() => {
    if (!successData) {
      submitButtonRef.current?.focus();
    }
  }, [successData]);

  const onSubmit = async (data: PatientSchemaInput) => {
    try {
      const patient = await createPatient({
        name: data.name,
        email: data.email,
        age: data.age,
        gender: data.gender,
        phone: data.phone,
        status: data.status
      });

      setSuccessData({
        name: patient.name,
        medicalId: patient.medicalId,
        token: patient.assessmentToken
      });
      toastSuccess("Patient Registered", `Successfully registered ${patient.name}.`);
    } catch (e: any) {
      console.error(e);
      toastError("Registration Failed", e.message || "Could not register patient.");
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
        <PageHeader
        title="Create Patient Record"
        description="Register a new patient into CogHealth, setup details and generate assessment token."
      />

      <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="name-input" className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                Full Name
              </label>
              <input
                id="name-input"
                type="text"
                {...register("name")}
                aria-describedby={errors.name ? "name-error" : undefined}
                placeholder="e.g. Sunita Mehta"
                className="w-full px-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
              {errors.name && (
                <p id="name-error" className="text-[10px] font-bold text-status-error">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email-input" className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                {...register("email")}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="e.g. sunita@gmail.com"
                className="w-full px-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
              {errors.email && (
                <p id="email-error" className="text-[10px] font-bold text-status-error">{errors.email.message}</p>
              )}
            </div>

            {/* Age */}
            <div className="space-y-1">
              <label htmlFor="age-input" className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                Age
              </label>
              <input
                id="age-input"
                type="number"
                {...register("age")}
                aria-describedby={errors.age ? "age-error" : undefined}
                placeholder="e.g. 48"
                className="w-full px-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none"
              />
              {errors.age && (
                <p id="age-error" className="text-[10px] font-bold text-status-error">{errors.age.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label htmlFor="gender-input" className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                Gender
              </label>
              <select
                id="gender-input"
                {...register("gender")}
                aria-describedby={errors.gender ? "gender-error" : undefined}
                className="w-full px-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none font-bold"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p id="gender-error" className="text-[10px] font-bold text-status-error">{errors.gender.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor="phone-input" className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                Phone Number (10 digits)
              </label>
              <input
                id="phone-input"
                type="text"
                {...register("phone")}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none font-mono"
              />
              {errors.phone && (
                <p id="phone-error" className="text-[10px] font-bold text-status-error">{errors.phone.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label htmlFor="status-input" className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                Initial Status
              </label>
              <select
                id="status-input"
                {...register("status")}
                aria-describedby={errors.status ? "status-error" : undefined}
                className="w-full px-4 py-2.5 border border-border-default rounded-xl text-xs bg-surface-page focus:ring-2 focus:ring-brand-primary focus:outline-none font-bold"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Stable">Stable</option>
                <option value="Critical">Critical</option>
                <option value="Testing">Testing</option>
              </select>
              {errors.status && (
                <p id="status-error" className="text-[10px] font-bold text-status-error">{errors.status.message}</p>
              )}
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
            <button
              type="button"
              onClick={() => router.push("/patients")}
              className="px-5 py-2.5 border border-border-default rounded-xl hover:bg-surface-muted text-xs font-bold transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              ref={submitButtonRef}
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-brand-primary text-white hover:bg-brand-primary/95 shadow-md shadow-brand-primary/20 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:bg-brand-primary/45"
            >
              {isLoading ? "Saving Record..." : "Register Patient"}
            </button>
          </div>
        </form>
      </div>

      {/* SUCCESS MODAL POP-UP (Matches 'Create Patient - Success State with Modal') */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-surface-card rounded-2xl border border-border-default p-6 shadow-modal relative flex flex-col items-center text-center animate-scaleIn">
            
            <button
              onClick={() => {
                setSuccessData(null);
                router.push("/patients");
              }}
              aria-label="Close success details dialog"
              className="absolute top-4 right-4 p-2 rounded-lg text-on-surface-variant hover:bg-surface-muted transition-colors active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-12 rounded-full bg-status-complete/15 text-status-complete flex items-center justify-center mb-4">
              <UserCheck className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-extrabold text-on-surface mb-1 tracking-tight">
              Patient Registered Successfully!
            </h3>
            
            <p className="text-xs text-on-surface-variant font-medium mb-5">
              Record created for <strong className="text-on-surface">{successData.name}</strong> (ID: {successData.medicalId})
            </p>

            <div className="w-full bg-surface-page p-4 rounded-xl border border-border-default mb-6 space-y-3">
              <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-widest">
                Active Assessment Token Link
              </p>
              
              <div className="flex justify-center">
                <CopyLinkButton token={successData.token} autoFocus />
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessData(null);
                router.push("/patients");
              }}
              className="w-full py-2.5 bg-brand-primary text-white hover:bg-brand-primary/95 shadow-md shadow-brand-primary/20 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              Done & Return to List
            </button>

          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default withErrorBoundary(CreatePatientPage);
