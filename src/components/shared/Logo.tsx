import React from "react";
import Link from "next/link";
import { Brain } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-2xl font-extrabold text-brand-primary tracking-tight ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
        <Brain className="h-5 w-5" />
      </div>
      <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">CAP</span>
    </Link>
  );
}
