import React from "react";
import Logo from "../shared/Logo";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "@/hooks/useAuth";

export default function PatientHeader() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-surface-card border-b border-border-default pt-safe shadow-sm">
      <div className="flex justify-between items-center h-16 px-6 max-w-lg mx-auto">
        <Logo className="text-xl" />
        
        <div className="flex items-center gap-3">
          <LanguageSelector variant="dropdown" />
          {user && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-brand-secondary/10 text-brand-secondary flex items-center justify-center font-bold text-xs">
                {user.name[0]}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
