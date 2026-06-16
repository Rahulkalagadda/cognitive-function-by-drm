import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../shared/Logo";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function DoctorSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Assessments", href: "/assessments", icon: ClipboardList },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-card border-r border-border-default h-screen sticky top-0 shrink-0">
      <div className="p-6">
        <Logo />
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                isActive
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-[1.02]"
                  : "text-on-surface-variant hover:bg-surface-muted hover:text-on-surface"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-default bg-surface-muted/50">
        {user && (
          <div className="flex items-center gap-3 px-4 py-2 mb-3">
            <div className="h-9 w-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
              {user.name.split(" ").pop()?.[0] || "D"}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
              <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-status-error hover:bg-status-error/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
