import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  className?: string;
  fallbackClassName?: string;
}

export default function Avatar({ name, src, className, fallbackClassName }: AvatarProps) {
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  
  // Pick background based on first letter to make avatars distinct
  const bgColors = [
    "bg-brand-primary/10 text-brand-primary",
    "bg-brand-secondary/10 text-brand-secondary",
    "bg-brand-accent/10 text-brand-accent",
    "bg-status-pending/10 text-status-pending",
    "bg-status-info/10 text-status-info"
  ];
  const colorIndex = initials.charCodeAt(0) % bgColors.length;
  const pickedColor = bgColors[colorIndex];

  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border-default shadow-sm", className)}>
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="40px"
          className="aspect-square h-full w-full object-cover"
          unoptimized // since we use mock URLs
        />
      ) : (
        <div className={cn("flex h-full w-full items-center justify-center font-bold text-sm", pickedColor, fallbackClassName)}>
          {initials}
        </div>
      )}
    </div>
  );
}
