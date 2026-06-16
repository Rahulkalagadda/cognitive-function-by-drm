import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileText, User } from "lucide-react";

import { useAssessmentStore } from "@/stores/assessment.store";
import { getTranslation, TranslationKeys } from "@/lib/translations";

export default function PatientBottomNav() {
  const pathname = usePathname();
  const { language } = useAssessmentStore();

  const langCode = language || "en";

  const navItems = [
    { name: getTranslation(langCode, "home"), href: "/patient/dashboard", icon: Home },
    { name: getTranslation(langCode, "reports"), href: "/patient/reports", icon: FileText },
    { name: getTranslation(langCode, "profile"), href: "/patient/profile", icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-surface-card border-t border-border-default pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs font-bold transition-all duration-200 active:scale-90 relative",
                isActive ? "text-brand-primary" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              <span>{item.name}</span>
              {isActive && (
                <div className="absolute bottom-1.5 left-50 w-1 h-1 rounded-full bg-brand-primary"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
