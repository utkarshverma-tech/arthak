import { useState } from "react";
import { Search, ChevronDown, Menu, X, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import NProgress from "nprogress";
import { CATEGORIES } from "@/lib/roadmaps-data";
import logoImg from "@/assets/logo.png";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roadmapsOpen, setRoadmapsOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [mobileRoadmapsOpen, setMobileRoadmapsOpen] = useState(false);
  const [mobileActiveCat, setMobileActiveCat] = useState<string | null>(null);
  const { isAuthenticated, openModal } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
      style={{
        backgroundColor: "rgba(250, 247, 242, 0.85)",
        borderColor: "rgba(15, 23, 42, 0.08)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo slot */}
        <Link to="/" className="relative w-36 h-16 flex items-center shrink-0">
          <img
            src={logoImg}
            alt="Arthak Logo"
            className="absolute left-[-70px] top-[calc(50%-6px)] -translate-y-1/2 h-52 w-auto max-w-none object-contain pointer-events-none"
          />
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div
            className="flex w-full items-center gap-2 rounded-full border px-4 py-2 transition focus-within:border-[#14B8A6]"
            style={{
              borderColor: "rgba(15, 23, 42, 0.12)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <Search className="h-4 w-4" style={{ color: "#64748B" }} />
            <input
              type="text"
              placeholder="Search careers, skills, roadmaps…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#94A3B8]"
              style={{ color: "#0F172A" }}
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-black/5" style={{ color: "#0F172A" }}>
            Home
          </Link>
          <Link to="/" hash="careers" className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-black/5" style={{ color: "#0F172A" }}>
            Career Paths
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setRoadmapsOpen(true)}
            onMouseLeave={() => {
              setRoadmapsOpen(false);
              setActiveCat(null);
            }}
          >
            <button
              type="button"
              className="group flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-black/5"
              style={{ color: "#0F172A" }}
              aria-expanded={roadmapsOpen}
              aria-haspopup="menu"
            >
              Roadmaps
              <ChevronDown
                className={`h-3.5 w-3.5 opacity-60 transition-transform duration-300 ${
                  roadmapsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {roadmapsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-full pt-3 z-50"
                >
                  {/* Outer luxury frame */}
                  <div
                    className="relative rounded-3xl p-[1px] overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.05) 35%, rgba(212,175,55,0.05) 65%, rgba(212,175,55,0.55) 100%)",
                      boxShadow:
                        "0 30px 80px -30px rgba(15,23,42,0.35), 0 10px 30px -15px rgba(212,175,55,0.25)",
                    }}
                  >
                    <div
                      className="relative rounded-3xl p-3 backdrop-blur-2xl"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,253,248,0.92) 0%, rgba(250,247,242,0.88) 100%)",
                      }}
                    >
                      {/* Ambient glow blobs */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -top-16 -left-10 h-40 w-40 rounded-full blur-3xl"
                        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.25), transparent 70%)" }}
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -bottom-20 right-0 h-48 w-48 rounded-full blur-3xl"
                        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)" }}
                      />

                      <div className="relative flex items-stretch gap-2">
                        {/* First level: categories */}
                        <div className="w-[300px]">
                          <div className="flex items-center justify-between px-3 pb-2 pt-1">
                            <span
                              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                              style={{ color: "#94886A" }}
                            >
                              Explore
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#B5A06A" }}>
                              <Sparkles className="h-3 w-3" />
                              {CATEGORIES.length} domains
                            </span>
                          </div>
                          <ul role="menu" className="flex flex-col gap-0.5">
                            {CATEGORIES.map((cat, i) => {
                              const active = activeCat === cat.slug;
                              return (
                                <motion.li
                                  key={cat.slug}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.02 * i, duration: 0.25 }}
                                  onMouseEnter={() => setActiveCat(cat.slug)}
                                >
                                  <Link
                                    to="/roadmaps"
                                    search={{ category: cat.slug }}
                                    className="group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-300"
                                    style={{
                                      background: active
                                        ? "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))"
                                        : "transparent",
                                      boxShadow: active
                                        ? "inset 0 0 0 1px rgba(212,175,55,0.35)"
                                        : "inset 0 0 0 1px rgba(15,23,42,0)",
                                    }}
                                  >
                                    {/* Emoji tile */}
                                    <span
                                      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:-translate-y-0.5"
                                      style={{
                                        background:
                                          "linear-gradient(135deg, #FFFFFF 0%, #F6EFDB 100%)",
                                        boxShadow:
                                          "0 1px 0 rgba(255,255,255,0.9) inset, 0 6px 14px -6px rgba(30,30,30,0.18)",
                                      }}
                                    >
                                      {cat.emoji}
                                    </span>
                                    <span className="flex flex-1 flex-col">
                                      <span
                                        className="text-sm font-semibold leading-tight"
                                        style={{ color: "#1A1A1A" }}
                                      >
                                        {cat.name}
                                      </span>
                                      <span
                                        className="text-[11px] leading-tight"
                                        style={{ color: "#7A7160" }}
                                      >
                                        {cat.careers.length} careers
                                      </span>
                                    </span>
                                    <ChevronDown
                                      className={`h-3.5 w-3.5 -rotate-90 transition-all duration-300 ${
                                        active ? "translate-x-0.5 opacity-100" : "opacity-40"
                                      }`}
                                      style={{ color: active ? "#B5891A" : "#94886A" }}
                                    />
                                  </Link>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Divider */}
                        <div
                          aria-hidden
                          className="my-2 w-px self-stretch"
                          style={{
                            background:
                              "linear-gradient(180deg, transparent, rgba(212,175,55,0.35), transparent)",
                          }}
                        />

                        {/* Second level: careers */}
                        <div className="w-[340px]">
                          <AnimatePresence mode="wait">
                            {activeCat ? (
                              <motion.div
                                key={activeCat}
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              >
                                {(() => {
                                  const cat = CATEGORIES.find((c) => c.slug === activeCat)!;
                                  return (
                                    <>
                                      <div className="flex items-center justify-between px-3 pb-2 pt-1">
                                        <span
                                          className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                                          style={{ color: "#94886A" }}
                                        >
                                          {cat.short}
                                        </span>
                                        <Link
                                          to="/roadmaps"
                                          search={{ category: cat.slug }}
                                          className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider hover:underline"
                                          style={{ color: "#B5891A" }}
                                        >
                                          View all
                                          <ArrowUpRight className="h-3 w-3" />
                                        </Link>
                                      </div>
                                      <ul role="menu" className="flex flex-col gap-0.5">
                                        {cat.careers.map((cr, i) => (
                                          <motion.li
                                            key={cr.slug}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.02 * i, duration: 0.22 }}
                                          >
                                            <Link
                                              to="/roadmaps"
                                              search={{ category: cat.slug, career: cr.slug }}
                                              className="group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-300 hover:bg-[rgba(212,175,55,0.08)]"
                                            >
                                              <span
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                                                style={{
                                                  background:
                                                    "linear-gradient(135deg, #FFFFFF 0%, #F4ECD5 100%)",
                                                  boxShadow:
                                                    "0 1px 0 rgba(255,255,255,0.9) inset, 0 6px 14px -6px rgba(30,30,30,0.18)",
                                                }}
                                              >
                                                {cr.emoji}
                                              </span>
                                              <span className="flex flex-1 flex-col">
                                                <span
                                                  className="text-sm font-semibold leading-tight"
                                                  style={{ color: "#1A1A1A" }}
                                                >
                                                  {cr.name}
                                                </span>
                                                <span
                                                  className="line-clamp-1 text-[11px] leading-tight"
                                                  style={{ color: "#7A7160" }}
                                                >
                                                  {cr.desc}
                                                </span>
                                              </span>
                                              <ArrowUpRight
                                                className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                                                style={{ color: "#B5891A" }}
                                              />
                                            </Link>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </>
                                  );
                                })()}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 px-6 text-center"
                              >
                                <div
                                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #FFFFFF 0%, #F4ECD5 100%)",
                                    boxShadow:
                                      "0 1px 0 rgba(255,255,255,0.9) inset, 0 10px 24px -10px rgba(30,30,30,0.2)",
                                  }}
                                >
                                  ✨
                                </div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#1A1A1A" }}
                                >
                                  Hover a domain
                                </p>
                                <p className="text-xs" style={{ color: "#7A7160" }}>
                                  Explore curated career roadmaps inside each track.
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Footer CTA */}
                      <div
                        className="relative mt-2 flex items-center justify-between rounded-2xl px-4 py-2.5"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
                          boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.18)",
                        }}
                      >
                        <span className="text-[12px]" style={{ color: "#5C5440" }}>
                          Not sure where to start?
                        </span>
                        <Link
                          to="/roadmaps"
                          className="flex items-center gap-1 text-[12px] font-semibold"
                          style={{ color: "#9C7715" }}
                        >
                          Take Career Assessment
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link
            to="/resume-builder"
            className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-black/5"
            style={{ color: "#0F172A" }}
          >
            Resume Builder
          </Link>
          <a href="#features" className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-black/5" style={{ color: "#0F172A" }}>
            Features
          </a>
          <a href="#about" className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-black/5" style={{ color: "#0F172A" }}>
            About
          </a>
          <Link
            to="/dashboard"
            className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-black/5"
            style={{ color: "#0F172A" }}
          >
            Dashboard
          </Link>
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <button
                type="button"
                onClick={() => { NProgress.start(); navigate({ to: "/login", search: { view: "login" } }); }}
                className="hidden sm:inline-flex rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-black/5"
                style={{ color: "#0F172A", borderColor: "rgba(15,23,42,0.15)" }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { NProgress.start(); navigate({ to: "/login", search: { view: "signup" } }); }}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
                }}
              >
                Start Career Journey
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <button
            className="lg:hidden rounded-md p-2 hover:bg-black/5"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" style={{ color: "#0F172A" }} />
            ) : (
              <Menu className="h-5 w-5" style={{ color: "#0F172A" }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t px-4 py-4 space-y-4"
          style={{
            backgroundColor: "#FAF7F2",
            borderColor: "rgba(15, 23, 42, 0.08)",
          }}
        >
          <div
            className="flex items-center gap-2 rounded-full border px-4 py-2"
            style={{
              borderColor: "rgba(15, 23, 42, 0.12)",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Search className="h-4 w-4" style={{ color: "#64748B" }} />
            <input
              type="text"
              placeholder="Search…"
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: "#0F172A" }}
            />
          </div>
          <div className="flex flex-col gap-1.5 pt-2">
            <Link to="/" className="py-1.5 text-sm font-medium" style={{ color: "#0F172A" }} onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/" hash="careers" className="py-1.5 text-sm font-medium" style={{ color: "#0F172A" }} onClick={() => setMobileOpen(false)}>Career Paths</Link>
            <button
              type="button"
              onClick={() => setMobileRoadmapsOpen((v) => !v)}
              className="flex items-center justify-between py-1.5 text-left text-sm font-medium"
              style={{ color: "#0F172A" }}
            >
              Roadmaps
              <ChevronDown
                className={`h-3.5 w-3.5 transition ${mobileRoadmapsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileRoadmapsOpen && (
              <div className="ml-2 mb-2 flex flex-col gap-0.5 border-l pl-3" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
                {CATEGORIES.map((cat) => (
                  <div key={cat.slug}>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileActiveCat((s) => (s === cat.slug ? null : cat.slug))
                      }
                      className="flex w-full items-center justify-between py-1.5 text-left text-sm"
                      style={{ color: "#0F172A" }}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition ${mobileActiveCat === cat.slug ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileActiveCat === cat.slug && (
                      <div className="ml-3 flex flex-col gap-0.5 border-l pl-3 pb-1" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
                        {cat.careers.map((cr) => (
                          <Link
                            key={cr.slug}
                            to="/roadmaps"
                            search={{ category: cat.slug, career: cr.slug }}
                            onClick={() => setMobileOpen(false)}
                            className="py-1.5 text-sm"
                            style={{ color: "#334155" }}
                          >
                            {cr.emoji} {cr.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/resume-builder"
              className="py-1.5 text-sm font-medium"
              style={{ color: "#0F172A" }}
              onClick={() => setMobileOpen(false)}
            >
              Resume Builder
            </Link>
            <a href="#features" className="py-1.5 text-sm font-medium" style={{ color: "#0F172A" }} onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#about" className="py-1.5 text-sm font-medium" style={{ color: "#0F172A" }} onClick={() => setMobileOpen(false)}>About</a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="py-1.5 text-sm font-medium" style={{ color: "#0F172A" }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); NProgress.start(); navigate({ to: "/login", search: { view: "login" } }); }}
                  className="text-left py-1.5 text-sm font-medium font-semibold"
                  style={{ color: "#0F172A" }}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); NProgress.start(); navigate({ to: "/login", search: { view: "signup" } }); }}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #14B8A6, #3B82F6)" }}
                >
                  Start Career Journey
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}