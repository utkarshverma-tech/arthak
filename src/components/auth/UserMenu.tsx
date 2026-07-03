import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { User as UserIcon, Settings, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!user) return null;

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-md transition hover:opacity-90 active:scale-95 focus:outline-none"
        style={{
          background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
          border: "2px solid rgba(255, 255, 255, 0.15)",
        }}
        aria-label="Account menu"
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, scale: 0.96, filter: "blur(3px)" }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2.5 w-[310px] overflow-hidden rounded-[18px] p-4 text-left"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(9, 9, 11, 0.06)",
              boxShadow: "0 20px 50px -12px rgba(9, 9, 11, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              zIndex: 9999,
            }}
          >
            {/* Top User Section */}
            <div className="flex items-center gap-3 pb-3 mb-2.5 border-b" style={{ borderColor: "rgba(9, 9, 11, 0.06)" }}>
              {/* Circular user avatar (48px) */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
                  border: "1.5px solid rgba(255, 255, 255, 0.8)",
                }}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold tracking-tight text-zinc-900 leading-tight">
                  {user.fullName || "Utkarsh Verma"}
                </h4>
                <p className="mt-0.5 truncate text-[11px] text-zinc-500 font-semibold tracking-wide">
                  AI Engineer
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <ul className="space-y-0.5 text-[13px]">
              {[
                { icon: UserIcon, label: "My Profile" },
                { icon: Settings, label: "Account Settings" },
                { icon: HelpCircle, label: "Help" },
              ].map((item) => (
                <li key={item.label}>
                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-zinc-600 transition-colors duration-150 hover:bg-black/5 hover:text-zinc-900 group">
                    <item.icon className="h-4 w-4 text-zinc-400 transition-colors duration-150 group-hover:text-zinc-600" />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                </li>
              ))}

              <div className="my-1.5 h-px" style={{ background: "rgba(9, 9, 11, 0.06)" }} />

              <li>
                <button
                  onClick={async () => {
                    setOpen(false);
                    await signOut();
                    window.location.href = "/";
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-rose-600 transition-colors duration-150 hover:bg-rose-50 hover:text-rose-700 font-semibold group"
                >
                  <LogOut className="h-4 w-4 text-rose-500 transition-colors duration-150 group-hover:text-rose-600" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
