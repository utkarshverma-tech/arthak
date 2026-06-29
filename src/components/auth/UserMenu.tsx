import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Flame, Zap, LayoutDashboard, FileText, Map, FolderGit2, Trophy, Award, Settings, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;
  const initials = user.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <button className="relative rounded-full p-2 transition hover:bg-black/5" aria-label="Notifications">
        <Bell className="h-4 w-4" style={{ color: "#0F172A" }} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full" style={{ background: "#EF4444" }} />
      </button>
      <div className="hidden sm:flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold" style={{ borderColor: "rgba(15,23,42,0.1)", color: "#0F172A", background: "rgba(255,255,255,0.7)" }}>
        <Zap className="h-3 w-3" style={{ color: "#F59E0B" }} /> 240 XP
      </div>
      <div className="hidden md:flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold" style={{ borderColor: "rgba(15,23,42,0.1)", color: "#0F172A", background: "rgba(255,255,255,0.7)" }}>
        <Flame className="h-3 w-3" style={{ color: "#EF4444" }} /> 7
      </div>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-md transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #14B8A6, #3B82F6)" }}
          aria-label="Account menu"
        >
          {initials}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                background: "rgba(255,253,248,0.96)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 24px 60px -20px rgba(15,23,42,0.35), inset 0 0 0 1px rgba(212,175,55,0.25)",
                zIndex: 9999
              }}
            >
              <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "rgba(15,23,42,0.06)" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #14B8A6, #3B82F6)" }}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold" style={{ color: "#0F172A" }}>{user.fullName}</p>
                  <p className="truncate text-xs" style={{ color: "#64748B" }}>{user.email}</p>
                </div>
              </div>
              <ul className="p-1.5 text-sm">
                {[
                  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
                  { icon: UserIcon, label: "Profile", to: "/dashboard" },
                  { icon: FileText, label: "My Resume", to: "/resume-builder" },
                  { icon: Map, label: "Roadmaps", to: "/roadmaps" },
                  { icon: FolderGit2, label: "Projects", to: "/dashboard" },
                  { icon: Trophy, label: "Achievements", to: "/dashboard" },
                  { icon: Award, label: "Certificates", to: "/dashboard" },
                  { icon: Settings, label: "Settings", to: "/dashboard" },
                ].map(({ icon: Icon, label, to }) => (
                  <li key={label}>
                    <Link to={to} onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition hover:bg-black/5" style={{ color: "#0F172A" }}>
                      <Icon className="h-4 w-4 opacity-70" /> {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={async () => { setOpen(false); await signOut(); window.location.href = "/"; }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition hover:bg-red-50"
                    style={{ color: "#B91C1C" }}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
