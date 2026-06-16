import React, { useState } from "react";
import Logo from "../shared/Logo";
import Avatar from "../shared/Avatar";
import { Bell, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DoctorMobileDrawer from "./DoctorMobileDrawer";

export default function DoctorHeader() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-surface-card border-b border-border-default md:sticky md:top-0">
        <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto md:max-w-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-muted transition-colors active:scale-95"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="md:hidden">
              <Logo />
            </div>
            <div className="hidden md:block">
              <span className="text-sm font-bold text-on-surface-variant">Clinical Workspace</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-muted transition-all active:scale-95"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error rounded-full border-2 border-surface-card"></span>
            </button>

            <div className="h-px bg-border-default w-6 self-stretch hidden md:block"></div>

            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-on-surface leading-tight">{user.name}</p>
                  <p className="text-xs text-on-surface-variant">Clinician</p>
                </div>
                <Avatar name={user.name} src={user.avatarUrl} className="h-9 w-9" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Drawer */}
      <DoctorMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
