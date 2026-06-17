import React from "react";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <svg width="140" height="42" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
        <path d="M30 15C22 15 15 22 15 30C15 38 22 45 30 45C38 45 45 38 45 30C45 22 38 15 30 15ZM30 40C24.5 40 20 35.5 20 30C20 24.5 24.5 20 30 20C35.5 20 40 24.5 40 30C40 35.5 35.5 40 30 40Z" fill="#2563EB"/>
        <path d="M30 25C27.2 25 25 27.2 25 30C25 32.8 27.2 35 30 35C32.8 35 35 32.8 35 30C35 27.2 32.8 25 30 25Z" fill="#0D9488"/>
        <text x="65" y="42" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="700" fill="#2563EB">CAP</text>
      </svg>
    </Link>
  );
}
