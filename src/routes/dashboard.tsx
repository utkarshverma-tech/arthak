import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ComponentType, type SVGProps } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Target, Map, GraduationCap, FolderGit2, FileText, Gauge, MessageSquare,
  Briefcase, Trophy, Bot, BarChart3, Settings, User as UserIcon, LogOut,
  Search, Bell, Sparkles, Command, Sun, Moon, ChevronRight, ChevronLeft,
  Play, Clock, ArrowUpRight, CheckCircle2, Circle, Lock, Bookmark, MapPin,
  Flame, TrendingUp, Send, Plus, X, Star, Zap
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute>
      <DashboardShell />
    </ProtectedRoute>
  ),
});

const C = {
  bg: "#FAFAFA",
  surface: "#F4F4F5",
  card: "#FFFFFF",
  primary: "#14B8A6",
  secondary: "#3B82F6",
  accent: "#FF8A00",
  highlight: "#FFC857",
  warmGlow: "rgba(255,140,0,0.06)",
  text: "#09090B",
  muted: "#71717A",
  border: "rgba(9,9,11,0.06)",
  borderStrong: "rgba(9,9,11,0.12)",
};

/* ============== SHELL ============== */
function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <div className="min-h-screen font-sans antialiased" style={{ background: C.bg, color: C.text }}>
      <MeshBackdrop />
      <div className="relative flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex-1 min-w-0">
          <TopNav />
          <main className="px-6 lg:px-10 pb-24 pt-6 mx-auto max-w-[1400px]">
            <Hero />
            <Snapshots />
            <div className="mt-10 grid grid-cols-12 gap-6">
              <div className="col-span-12 xl:col-span-8"><AIRecommendations /></div>
              <div className="col-span-12 xl:col-span-4"><RoadmapProgress /></div>
            </div>
            <ContinueLearning />
            <div className="mt-10 grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-7"><Projects /></div>
              <div className="col-span-12 lg:col-span-5"><Hackathons /></div>
            </div>
            <Internships />
            <div className="mt-10 grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8"><Analytics /></div>
              <div className="col-span-12 lg:col-span-4"><Activity /></div>
            </div>
          </main>
        </div>
      </div>
      <FloatingAI open={aiOpen} setOpen={setAiOpen} />
    </div>
  );
}

function MeshBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden bg-[#FAFAFA]">
      {/* Slow moving soft mesh gradient blobs */}
      <motion.div
        animate={{
          x: [0, 45, -20, 0],
          y: [0, -35, 20, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-[140px] opacity-[0.06]"
        style={{ background: C.primary }}
      />
      <motion.div
        animate={{
          x: [0, -35, 45, 0],
          y: [0, 25, -35, 0],
        }}
        transition={{ duration: 19, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full blur-[140px] opacity-[0.05]"
        style={{ background: C.accent }}
      />
      <motion.div
        animate={{
          x: [0, 20, -30, 0],
          y: [0, 30, -15, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full blur-[140px] opacity-[0.04]"
        style={{ background: C.secondary }}
      />
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "linear-gradient(rgba(9,9,11,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(9,9,11,.6) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
    </div>
  );
}

/* ============== SIDEBAR ============== */
const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Target, label: "My Career" },
  { icon: Map, label: "Roadmaps", to: "/roadmaps" },
  { icon: GraduationCap, label: "Learning" },
  { icon: FolderGit2, label: "Projects" },
  { icon: FileText, label: "Resume Builder", to: "/resume-builder" },
  { icon: Gauge, label: "ATS Score" },
  { icon: MessageSquare, label: "Interview Prep" },
  { icon: Briefcase, label: "Internships" },
  { icon: Trophy, label: "Hackathons" },
  { icon: Bot, label: "AI Career Coach" },
  { icon: BarChart3, label: "Analytics" },
];

function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const { user, signOut } = useAuth();
  const [active, setActive] = useState("Dashboard");
  const w = collapsed ? 76 : 260;
  return (
    <aside
      className="sticky top-0 h-screen shrink-0 border-r transition-[width] duration-300 ease-out"
      style={{ width: w, borderColor: C.border, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-4 overflow-hidden">
          {!collapsed ? (
            <Link to="/" className="relative w-32 h-12 flex items-center shrink-0">
              <img
                src={logoImg}
                alt="Arthak Logo"
                className="absolute left-[-42px] top-1/2 -translate-y-1/2 h-36 w-auto max-w-none object-contain"
              />
            </Link>
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-xl text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
              <Sparkles className="h-4 w-4" />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const isActive = active === item.label;
              const Inner = (
                <button
                  onClick={() => setActive(item.label)}
                  className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition"
                  style={{
                    color: isActive ? C.primary : C.muted,
                    background: isActive ? "rgba(20,184,166,0.06)" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(9,9,11,0.02)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  {isActive && (
                    <motion.span layoutId="sb-glow" className="absolute inset-0 rounded-xl"
                      style={{ boxShadow: `inset 0 0 0 1px rgba(20,184,166,0.18), 0 0 16px -6px rgba(20,184,166,0.12)` }} />
                  )}
                  <item.icon className="relative h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span className="relative truncate">{item.label}</span>}
                  {!collapsed && isActive && <ChevronRight className="relative ml-auto h-3.5 w-3.5 opacity-60" />}
                </button>
              );
              return (
                <li key={item.label}>
                  {item.to ? <Link to={item.to} className="block">{Inner}</Link> : Inner}
                </li>
              );
            })}
          </ul>

          <div className="my-4 h-px" style={{ background: C.border }} />
          <ul className="space-y-0.5">
            {[{ icon: Settings, label: "Settings" }, { icon: UserIcon, label: "Profile" }].map((i) => (
              <li key={i.label}>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition hover:bg-black/5" style={{ color: C.muted }}>
                  <i.icon className="h-[18px] w-[18px]" />
                  {!collapsed && <span>{i.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t p-3" style={{ borderColor: C.border }}>
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl p-2" style={{ background: "rgba(9,9,11,0.02)" }}>
              <div className="grid h-9 w-9 place-items-center rounded-lg text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                {(user?.fullName || "U").split(" ").map(p => p[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold" style={{ color: C.text }}>{user?.fullName || "Student"}</p>
                <p className="truncate text-[10px]" style={{ color: C.muted }}>{user?.email || "you@arthak.com"}</p>
              </div>
              <button onClick={() => signOut()} className="rounded-lg p-1.5 transition hover:bg-black/5" aria-label="Logout">
                <LogOut className="h-4 w-4" style={{ color: C.muted }} />
              </button>
            </div>
          ) : (
            <button onClick={() => signOut()} className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/5">
              <LogOut className="h-4 w-4" style={{ color: C.muted }} />
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition hover:bg-black/5"
            style={{ color: C.muted }}
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <><ChevronLeft className="h-3 w-3" /> Collapse</>}
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ============== TOPNAV ============== */
function TopNav() {
  const [dark, setDark] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-6 lg:px-10"
      style={{ borderColor: C.border, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(16px)" }}>
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: C.muted }} />
        <input
          placeholder="Search anything — roadmaps, projects, internships…"
          className="h-10 w-full rounded-xl border pl-9 pr-16 text-sm outline-none transition focus:border-zinc-300"
          style={{ background: "rgba(9,9,11,0.02)", borderColor: C.border, color: C.text }}
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border px-1.5 py-0.5 text-[10px] font-mono"
          style={{ borderColor: C.border, color: C.muted, background: "rgba(9,9,11,0.02)" }}>
          <Command className="mr-0.5 inline h-2.5 w-2.5" />K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <NavIcon icon={Plus} label="Quick action" />
        <button className="hidden md:inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:bg-black/5"
          style={{ borderColor: C.border, color: C.text }}>
          <Sparkles className="h-3.5 w-3.5" style={{ color: C.primary }} /> Ask AI
        </button>
        <NavIcon icon={Bell} label="Notifications" badge />
        <button onClick={() => setDark(!dark)} className="grid h-9 w-9 place-items-center rounded-xl transition hover:bg-black/5">
          {dark ? <Moon className="h-4 w-4" style={{ color: C.muted }} /> : <Sun className="h-4 w-4" style={{ color: C.muted }} />}
        </button>
        <div className="ml-1 h-7 w-px" style={{ background: C.border }} />
        <UserMenu />
      </div>
    </header>
  );
}

function NavIcon({ icon: Icon, label, badge }: { icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; badge?: boolean }) {
  return (
    <button aria-label={label} className="relative grid h-9 w-9 place-items-center rounded-xl transition hover:bg-black/5">
      <Icon className="h-4 w-4" style={{ color: C.muted }} />
      {badge && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />}
    </button>
  );
}

/* ============== HERO ============== */
function Hero() {
  const { user } = useAuth();
  const first = user?.fullName?.split(" ")[0] || "Utkarsh";
  const progress = 62;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Floating ambient light particles
  const particles = [
    { size: 5, x: "8%", y: "15%", delay: 0 },
    { size: 7, x: "84%", y: "12%", delay: 1.5 },
    { size: 4, x: "78%", y: "78%", delay: 3.5 },
    { size: 6, x: "12%", y: "82%", delay: 0.8 },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border p-8 lg:p-10"
      style={{
        borderColor: C.border,
        background: `linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(255,138,0,0.04) 40%, #FFFFFF 85%)`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.01)"
      }}
    >
      {/* Slow moving ambient glow behind hero card */}
      <motion.div
        animate={{
          x: [-20, 30, -20],
          y: [-15, 15, -15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl opacity-35"
        style={{ background: C.primary }}
      />
      <motion.div
        animate={{
          x: [20, -30, 20],
          y: [15, -15, 15],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25"
        style={{ background: C.accent }}
      />

      {/* Subtle orange energy streaks flowing behind content */}
      <motion.div
        animate={{
          x: [-100, 200, -100],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-20 top-1/4 h-[80px] w-[300px] rounded-full blur-[60px]"
        style={{ background: "linear-gradient(90deg, #FF8A00, #FFC857)", pointerEvents: "none" }}
      />

      {/* Tiny floating light particles around the main hero */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -12, 0],
            opacity: [0.15, 0.7, 0.15],
          }}
          transition={{ duration: 5 + i * 1.5, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            background: C.accent,
            boxShadow: `0 0 8px ${C.accent}`,
            pointerEvents: "none"
          }}
        />
      ))}

      <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold bg-white/60"
            style={{ borderColor: C.borderStrong, color: C.muted }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-teal-500" style={{ boxShadow: `0 0 8px ${C.primary}` }} />
            Career OS · Live
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight lg:text-[46px] leading-[1.05]" style={{ color: C.text }}>
            {greet}, {first} <span className="inline-block">👋</span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px]" style={{ color: C.muted }}>
            You're on track to become an <span className="font-semibold text-zinc-900">AI Engineer</span>.
            Your next milestone unlocks in <span className="text-zinc-900 font-semibold">3 days</span>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button className="group relative overflow-hidden inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow: `0 12px 24px -10px ${C.primary}` }}>
              {/* Premium Shimmer sweep */}
              <motion.div
                animate={{
                  left: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
                className="absolute top-0 bottom-0 w-1/3 skew-x-12 bg-white/25 blur-sm"
                style={{ pointerEvents: "none" }}
              />
              <Play className="h-4 w-4" /> Continue Journey
              <ArrowUpRight className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5" />
            </button>
            <div className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm bg-white/50" style={{ borderColor: C.border, color: C.muted }}>
              <Clock className="h-4 w-4" /> Next task · <span className="text-zinc-900 font-semibold">45 min</span>
            </div>
          </div>

          {/* Today's Mission (Glowing orange border pulse) */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 1px rgba(255, 138, 0, 0.1), 0 4px 12px rgba(0,0,0,0.01)",
                "0 0 0 1.5px rgba(255, 138, 0, 0.3), 0 4px 16px rgba(255, 138, 0, 0.08)",
                "0 0 0 1px rgba(255, 138, 0, 0.1), 0 4px 12px rgba(0,0,0,0.01)",
              ]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-6 rounded-2xl border p-4 bg-white/70"
            style={{ borderColor: "rgba(255, 138, 0, 0.18)" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: C.accent }}>Next recommended task</p>
              <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(255,138,0,0.08)", color: C.accent }}>Priority · High</span>
            </div>
            <p className="mt-1.5 text-[15px] font-bold text-zinc-900">Build a CNN image classifier · Module 04</p>
            <p className="mt-1 text-xs" style={{ color: C.muted }}>Estimated 45 min · +80 XP · unlocks Portfolio Milestone</p>
          </motion.div>
        </div>

        <ProgressRing value={progress} />
      </div>
    </motion.section>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 78, c = 2 * Math.PI * r;
  // Calculate coordinates for the tip indicator dot (starts from top, i.e., -90 degrees)
  const theta = (value / 100) * 2 * Math.PI;
  const tipX = 100 + r * Math.sin(theta);
  const tipY = 100 - r * Math.cos(theta);

  return (
    <div className="relative mx-auto grid place-items-center">
      <svg width="200" height="200" className="-rotate-90">
        <defs>
          <linearGradient id="ring-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.primary} />
            <stop offset="60%" stopColor={C.secondary} />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        
        {/* Track circle (precise and thin) */}
        <circle cx="100" cy="100" r={r} stroke="rgba(9,9,11,0.03)" strokeWidth="8" fill="none" />
        
        {/* Faint pulsing outer glow */}
        <motion.circle
          cx="100" cy="100" r={r} stroke="url(#ring-g)" strokeWidth="12" strokeLinecap="round" fill="none"
          strokeDasharray={`${c}`}
          strokeDashoffset={`${c * (1 - value / 100)}`}
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "blur(5px)", pointerEvents: "none" }}
        />

        {/* Primary progress circle */}
        <motion.circle
          cx="100" cy="100" r={r} stroke="url(#ring-g)" strokeWidth="8" strokeLinecap="round" fill="none"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${(value / 100) * c} ${c}` }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0px 2px 4px rgba(20, 184, 166, 0.2))` }}
        />

        {/* Premium tip indicator dot with glowing pulse */}
        <motion.circle
          cx={tipX} cy={tipY} r="4.5" fill="#FFFFFF"
          style={{
            filter: "drop-shadow(0px 0px 4px rgba(20, 184, 166, 0.8))"
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-[0.18em] text-zinc-400">Progress</p>
          <p className="mt-0.5 text-4xl font-extrabold tracking-tight text-zinc-900">{value}%</p>
          <p className="mt-0.5 text-[10px] font-bold tracking-[0.12em] text-zinc-500 uppercase">AI Engineer</p>
        </div>
      </div>
    </div>
  );
}

/* ============== SNAPSHOTS ============== */
function Snapshots() {
  const items = [
    { icon: Target, label: "Career", value: "AI Engineer", sub: "Path locked", accent: "#06B6D4" },
    { icon: Flame, label: "Streak", value: "7 Days", sub: "Active streak", accent: "#FF8A00" },
    { icon: Zap, label: "XP Progress", value: "240 XP", sub: "Level 12", accent: "#FFC857" },
    { icon: Map, label: "Roadmap", value: "62%", sub: "18 / 29 done", accent: "#14B8A6" },
    { icon: FolderGit2, label: "Projects", value: "7", sub: "2 in progress", accent: "#3B82F6" },
    { icon: FileText, label: "Resume", value: "88", sub: "Score / 100", accent: "#14B8A6" },
    { icon: Gauge, label: "ATS Score", value: "92", sub: "Optimized", accent: "#22C55E" },
    { icon: MessageSquare, label: "Interviews", value: "4", sub: "2 upcoming", accent: "#7C3AED" },
  ];
  return (
    <section className="mt-10">
      <SectionHeader eyebrow="At a glance" title="Career snapshot" />
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
        {items.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            whileHover={{ y: -3 }}
            className="group relative overflow-hidden rounded-2xl border p-4 bg-white transition-all duration-200 hover:shadow-md"
            style={{
              borderColor: C.border,
              boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
            }}
          >
            {/* Soft amber/highlight light trail appearing on hover */}
            <div className="absolute inset-x-0 -top-px h-px opacity-0 transition group-hover:opacity-100"
              style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }} />

            {/* Streak Flame icon animated flame effect */}
            {s.label === "Streak" ? (
              <motion.div
                animate={{
                  scale: [1, 1.16, 1],
                  filter: ["drop-shadow(0 0 2px rgba(255,138,0,0.4))", "drop-shadow(0 0 6px rgba(255,138,0,0.7))", "drop-shadow(0 0 2px rgba(255,138,0,0.4))"],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <s.icon className="h-4 w-4 animate-pulse" style={{ color: s.accent }} />
              </motion.div>
            ) : s.label === "XP Progress" ? (
              <div className="inline-flex relative">
                {/* XP card faint warm glow */}
                <div className="absolute inset-0 pointer-events-none rounded-full opacity-35 blur-[2px]"
                     style={{ background: "radial-gradient(circle, rgba(255,138,0,0.4), transparent 80%)" }} />
                <s.icon className="relative h-4 w-4" style={{ color: s.accent }} />
              </div>
            ) : (
              <s.icon className="h-4 w-4" style={{ color: C.muted }} />
            )}

            {/* XP Sparkles particles */}
            {s.label === "XP Progress" && [1, 2].map((spark) => (
              <motion.div
                key={spark}
                animate={{
                  y: [0, -10, 0],
                  x: [0, spark === 1 ? 4 : -4, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: spark * 1.2,
                  ease: "easeInOut"
                }}
                className="absolute rounded-full bg-[#FFC857]"
                style={{
                  width: 3,
                  height: 3,
                  right: spark === 1 ? "15%" : "25%",
                  top: spark === 1 ? "15%" : "30%",
                  boxShadow: "0 0 4px #FFC857",
                  pointerEvents: "none"
                }}
              />
            ))}

            <p className="mt-3 text-[10px] uppercase font-bold tracking-wider text-zinc-400">{s.label}</p>
            <p className="mt-0.5 text-xl font-bold tracking-tight text-zinc-900">{s.value}</p>
            <p className="mt-0.5 text-[11px]" style={{ color: C.muted }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============== AI RECOMMENDATIONS ============== */
function AIRecommendations() {
  const recs = [
    { title: "Finish your Resume", time: "20 min", priority: "High", conf: 96, tint: C.primary, icon: FileText },
    { title: "Complete CNN Project", time: "1h 30m", priority: "High", conf: 92, tint: "#FF8A00", icon: FolderGit2 },
    { title: "Improve LinkedIn headline", time: "10 min", priority: "Med", conf: 88, tint: C.secondary, icon: Sparkles },
    { title: "Apply to 5 internships", time: "35 min", priority: "High", conf: 90, tint: C.primary, icon: Briefcase },
    { title: "Prepare SQL interview", time: "45 min", priority: "Med", conf: 84, tint: "#8B5CF6", icon: MessageSquare },
  ];
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 1px rgba(255,138,0,0.06), 0 4px 20px rgba(0,0,0,0.01)",
          "0 0 0 2px rgba(255,138,0,0.22), 0 4px 24px rgba(255,138,0,0.06)",
          "0 0 0 1px rgba(255,138,0,0.06), 0 4px 20px rgba(0,0,0,0.01)",
        ]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-[32px] overflow-hidden"
    >
      <Panel glow>
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
              style={{ borderColor: "rgba(255,138,0,0.2)", color: C.accent, background: "rgba(255,138,0,0.05)" }}>
              <Bot className="h-3 w-3 animate-pulse" /> AI · Personalized for you
            </span>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900">Today's AI recommendations</h2>
          </div>
          <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-900">Refresh</button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {recs.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className="group relative overflow-hidden rounded-2xl border p-4 bg-zinc-50/40"
              style={{ borderColor: C.border }}
            >
              <div className="relative flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{ background: `${r.tint}0f`, border: `1px solid ${r.tint}1f` }}>
                  <r.icon className="h-4 w-4" style={{ color: r.tint }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-zinc-900">{r.title}</p>
                    <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ background: r.priority === "High" ? "rgba(239,68,68,0.08)" : "rgba(59,130,246,0.08)", color: r.priority === "High" ? "#EF4444" : C.secondary }}>
                      {r.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{r.time} · Confidence {r.conf}%</p>
                  
                  {/* Progress Bar with Premium Flowing Gradient */}
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100" style={{ boxShadow: "inset 0 1px 1.5px rgba(0,0,0,0.04)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${r.conf}%` }}
                      viewport={{ once: true }}
                      animate={{
                        backgroundPosition: ["0% 50%", "200% 50%"],
                      }}
                      style={{
                        background: `linear-gradient(90deg, ${r.tint}, ${C.primary}, ${r.tint})`,
                        backgroundSize: "200% 100%",
                      }}
                      transition={{
                        default: { duration: 1, ease: "easeOut" },
                        backgroundPosition: { duration: 6, repeat: Infinity, ease: "linear" }
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 transition group-hover:opacity-100 group-hover:translate-x-0.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </Panel>
    </motion.div>
  );
}

/* ============== ROADMAP ============== */
function RoadmapProgress() {
  const steps = [
    { label: "Foundations", status: "done" },
    { label: "Python + Math", status: "done" },
    { label: "Machine Learning", status: "done" },
    { label: "Deep Learning", status: "current" },
    { label: "MLOps", status: "locked" },
    { label: "Portfolio + Job", status: "locked" },
  ];
  return (
    <Panel glow>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Roadmap progress</h2>
        <span className="text-xs font-semibold text-zinc-500">AI Engineer</span>
      </div>
      <ol className="relative mt-6 space-y-4 pl-6">
        <span className="absolute left-[10px] top-1.5 bottom-1.5 w-px bg-zinc-100" />
        {steps.map((s, i) => {
          const Icon = s.status === "done" ? CheckCircle2 : s.status === "current" ? Circle : Lock;
          const tint = s.status === "done" ? C.primary : s.status === "current" ? C.secondary : "#A1A1AA";
          return (
            <motion.li key={s.label}
              initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="relative">
              <span className="absolute -left-6 top-1 grid h-5 w-5 place-items-center rounded-full bg-white"
                style={{
                  boxShadow: s.status === "current" ? `0 0 0 3px rgba(59,130,246,0.12), 0 0 12px rgba(59,130,246,0.25)` : "0 1px 2px rgba(0,0,0,0.05)",
                  border: `1px solid ${s.status === "locked" ? "rgba(9,9,11,0.06)" : "transparent"}`
                }}>
                <Icon className="h-3.5 w-3.5" style={{ color: tint }} />
              </span>
              <p className="text-sm font-semibold text-zinc-900">{s.label}</p>
              <p className="text-[11px] text-zinc-500 font-medium">
                {s.status === "done" ? "Completed" : s.status === "current" ? "In progress · 62%" : "Locked"}
              </p>
              {s.status === "current" && (
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100" style={{ boxShadow: "inset 0 1px 1.5px rgba(0,0,0,0.04)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "62%" }}
                    viewport={{ once: true }}
                    animate={{
                      backgroundPosition: ["0% 50%", "200% 50%"],
                    }}
                    style={{
                      background: `linear-gradient(90deg, ${C.primary}, ${C.secondary}, ${C.primary})`,
                      backgroundSize: "200% 100%",
                    }}
                    transition={{
                      default: { duration: 1.2, ease: "easeOut" },
                      backgroundPosition: { duration: 6, repeat: Infinity, ease: "linear" }
                    }}
                    className="h-full rounded-full"
                  />
                </div>
              )}
            </motion.li>
          );
        })}
      </ol>
    </Panel>
  );
}

/* ============== CONTINUE LEARNING ============== */
function ContinueLearning() {
  const courses = [
    { title: "Deep Learning Specialization", sub: "Module 04 · Convolutions", pct: 68, tint: C.primary, time: "45 min left" },
    { title: "SQL for Data Roles", sub: "Window functions", pct: 42, tint: C.secondary, time: "1h 10m left" },
    { title: "System Design Basics", sub: "Load balancing", pct: 24, tint: "#8B5CF6", time: "2h left" },
    { title: "Product Sense for Engineers", sub: "Metrics & tradeoffs", pct: 81, tint: "#F59E0B", time: "20 min left" },
    { title: "LinkedIn Personal Brand", sub: "Content strategy", pct: 55, tint: "#EC4899", time: "35 min left" },
  ];
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between">
        <SectionHeader eyebrow="Pick up where you left" title="Continue learning" />
        <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-950">See library →</button>
      </div>
      <div className="mt-5 -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {courses.map((c, i) => (
          <motion.article key={c.title}
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="group relative w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border bg-white"
            style={{ borderColor: C.border, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}
          >
            <div className="relative h-32 overflow-hidden" style={{ background: `linear-gradient(135deg, ${c.tint}1f, ${C.secondary}12)` }}>
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 40%)"
              }} />
              <div className="absolute bottom-3 left-3 rounded-lg px-2 py-1 text-[10px] font-semibold text-zinc-900"
                style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)" }}>
                {c.time}
              </div>
              <button className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full text-white opacity-0 transition group-hover:opacity-100"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                <Play className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="truncate text-sm font-semibold text-zinc-900">{c.title}</p>
              <p className="mt-0.5 truncate text-xs text-zinc-500">{c.sub}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100" style={{ boxShadow: "inset 0 1px 1.5px rgba(0,0,0,0.04)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.pct}%` }}
                    viewport={{ once: true }}
                    animate={{
                      backgroundPosition: ["0% 50%", "200% 50%"],
                    }}
                    style={{
                      background: `linear-gradient(90deg, ${c.tint}, ${C.secondary}, ${c.tint})`,
                      backgroundSize: "200% 100%",
                    }}
                    transition={{
                      default: { duration: 1.2, ease: "easeOut" },
                      backgroundPosition: { duration: 6, repeat: Infinity, ease: "linear" }
                    }}
                    className="h-full rounded-full"
                  />
                </div>
                <span className="text-[11px] font-semibold text-zinc-500">{c.pct}%</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ============== PROJECTS ============== */
function Projects() {
  const items = [
    { title: "Image Classifier with CNN", diff: "Intermediate", time: "6h", skills: ["PyTorch", "CV", "Numpy"], tint: C.primary },
    { title: "Movie Recommender", diff: "Beginner", time: "4h", skills: ["Pandas", "ML"], tint: C.secondary },
    { title: "LLM Summarizer API", diff: "Advanced", time: "10h", skills: ["FastAPI", "LangChain"], tint: "#8B5CF6" },
  ];
  return (
    <Panel glow>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Recommended projects</h2>
        <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-950">Browse all →</button>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((p, i) => (
          <motion.div key={p.title}
            initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-4 rounded-2xl border p-4 bg-zinc-50/40 transition hover:border-zinc-300"
            style={{ borderColor: C.border }}>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${p.tint}, ${C.secondary})` }}>
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900">{p.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 font-medium">
                <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{p.diff}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{p.time}</span>
                <span>·</span>
                <span>{p.skills.join(" · ")}</span>
              </div>
            </div>
            <button className="rounded-lg border px-3 py-1.5 text-xs font-semibold bg-white border-zinc-200 transition group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950">Start</button>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

/* ============== HACKATHONS ============== */
function Hackathons() {
  const events = [
    { title: "Global AI Sprint", days: 3, hours: 14, prize: "$25k", team: "1–4" },
    { title: "Open Source Weekend", days: 9, hours: 2, prize: "$8k", team: "Solo" },
  ];
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Upcoming hackathons</h2>
        <Trophy className="h-4.5 w-4.5" style={{ color: C.accent }} />
      </div>
      <div className="mt-5 space-y-3">
        {events.map((e, i) => (
          <motion.div key={e.title}
            initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-2xl border p-4 bg-white"
            style={{
              borderColor: "rgba(255, 138, 0, 0.15)",
              background: `linear-gradient(135deg, rgba(255,138,0,0.04), #FFFFFF)`
            }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">{e.title}</p>
                <p className="mt-0.5 text-[11px] text-zinc-500 font-medium">Prize {e.prize} · Team {e.team}</p>
              </div>
              <button className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${C.accent}, #FFC857)` }}>Register</button>
            </div>
            <div className="mt-3 flex gap-2 text-center">
              {[{ v: e.days, l: "days" }, { v: e.hours, l: "hrs" }, { v: 42, l: "min" }, { v: 18, l: "sec" }].map((t) => (
                <div key={t.l} className="flex-1 rounded-lg border py-2 bg-white/70" style={{ borderColor: C.border }}>
                  <p className="text-lg font-bold text-zinc-900 tabular-nums">{String(t.v).padStart(2, "0")}</p>
                  <p className="text-[9px] uppercase tracking-widest font-semibold text-zinc-400">{t.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

/* ============== INTERNSHIPS ============== */
function Internships() {
  const jobs = [
    { co: "Anthropic", role: "ML Research Intern", loc: "SF · Remote", sal: "$8k/mo", remote: true, initials: "AN", tint: C.primary },
    { co: "Vercel", role: "Frontend Intern", loc: "NYC", sal: "$6.5k/mo", remote: false, initials: "VC", tint: C.secondary },
    { co: "Linear", role: "Product Engineer Intern", loc: "Remote", sal: "$7k/mo", remote: true, initials: "LN", tint: "#8B5CF6" },
    { co: "Stripe", role: "Data Engineer Intern", loc: "Bangalore", sal: "₹1.4L/mo", remote: false, initials: "ST", tint: "#F59E0B" },
  ];
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between">
        <SectionHeader eyebrow="Live feed" title="Internships matched for you" />
        <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-950">Explore all →</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {jobs.map((j, i) => (
          <motion.div key={j.co}
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className="group flex flex-col rounded-2xl border p-4 bg-white hover:shadow-md transition-all duration-200"
            style={{ borderColor: C.border }}>
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl text-xs font-bold text-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${j.tint}, ${C.secondary})` }}>{j.initials}</div>
              <button className="rounded-lg p-1.5 transition hover:bg-zinc-100" aria-label="Bookmark">
                <Bookmark className="h-4 w-4" style={{ color: C.muted }} />
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold text-zinc-900">{j.co}</p>
            <p className="text-xs text-zinc-500 font-medium">{j.role}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{j.loc}</span>
              {j.remote && <span className="rounded-md px-1.5 py-0.5" style={{ background: "rgba(20,184,166,0.08)", color: C.primary }}>Remote</span>}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: C.border }}>
              <span className="text-sm font-bold text-zinc-900">{j.sal}</span>
              <button className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>Apply</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============== ANALYTICS ============== */
function Analytics() {
  const bars = [4, 6, 3, 8, 7, 9, 5, 10, 8, 11, 9, 12, 10, 14];
  const growth = [10, 18, 22, 30, 42, 48, 60, 68, 74, 82, 88, 92];
  const max = Math.max(...bars);
  const gmax = Math.max(...growth);
  const path = growth.map((v, i) => `${(i / (growth.length - 1)) * 100},${100 - (v / gmax) * 90}`).join(" ");

  const stats = [
    { icon: Clock, label: "Study hrs", v: "48.5" },
    { icon: Send, label: "Applications", v: "31" },
    { icon: MessageSquare, label: "Interviews", v: "4" },
    { icon: Flame, label: "Streak", v: "23d" },
  ];
  return (
    <Panel glow>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Analytics</h2>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500">
          <TrendingUp className="h-3 w-3 text-emerald-500" /> +18% vs last week
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border p-3 bg-zinc-50/40" style={{ borderColor: C.border }}>
            <s.icon className="h-3.5 w-3.5" style={{ color: C.muted }} />
            <p className="mt-2 text-xl font-bold tracking-tight text-zinc-900">{s.v}</p>
            <p className="text-[11px] text-zinc-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 border-t pt-5" style={{ borderColor: C.border }}>
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-zinc-400">Weekly activity</p>
          <div className="mt-3 flex h-32 items-end gap-1.5">
            {bars.map((b, i) => (
              <motion.div key={i}
                initial={{ height: 0 }} whileInView={{ height: `${(b / max) * 100}%` }} viewport={{ once: true }} transition={{ delay: i * 0.03, duration: 0.6 }}
                className="flex-1 rounded-md"
                style={{ background: `linear-gradient(180deg, ${C.primary}, ${C.secondary})` }} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase font-bold tracking-wider text-zinc-400">Career growth</p>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 h-32 w-full">
            <defs>
              <linearGradient id="grow-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.secondary} stopOpacity="0.12" />
                <stop offset="100%" stopColor={C.secondary} stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.polyline
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }}
              fill="none" stroke={C.secondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              points={path} />
            <polygon fill="url(#grow-g)" points={`0,100 ${path} 100,100`} />
          </svg>
        </div>
      </div>
    </Panel>
  );
}

/* ============== ACTIVITY ============== */
function Activity() {
  const items = [
    { icon: FileText, tint: C.primary, title: "Resume updated", sub: "ATS 88 → 92", t: "2m ago" },
    { icon: GraduationCap, tint: C.secondary, title: "Course completed", sub: "Transformers 101", t: "1h ago" },
    { icon: Gauge, tint: "#8B5CF6", title: "ATS improved", sub: "+4 points", t: "3h ago" },
    { icon: FolderGit2, tint: "#F59E0B", title: "Project submitted", sub: "CNN Classifier", t: "Yesterday" },
    { icon: Briefcase, tint: "#EC4899", title: "Applied to Vercel", sub: "Frontend Intern", t: "Yesterday" },
  ];
  return (
    <Panel>
      <h2 className="text-xl font-bold tracking-tight text-zinc-900">Recent activity</h2>
      <ol className="relative mt-5 space-y-4 pl-5">
        <span className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-100" />
        {items.map((it, i) => (
          <motion.li key={i}
            initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="relative">
            <span className="absolute -left-5 top-1 grid h-4 w-4 place-items-center rounded-full bg-white"
              style={{ boxShadow: `0 0 0 2px ${it.tint}33` }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: it.tint }} />
            </span>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-950">{it.title}</p>
                <p className="truncate text-[11px] text-zinc-500 font-medium">{it.sub}</p>
              </div>
              <span className="shrink-0 text-[10px] text-zinc-400 font-medium">{it.t}</span>
            </div>
          </motion.li>
        ))}
      </ol>
    </Panel>
  );
}

/* ============== FLOATING AI ============== */
function FloatingAI({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full text-white"
        style={{
          background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
          boxShadow: `0 16px 36px -8px ${C.primary}, 0 0 20px -4px ${C.secondary}`,
        }}
        aria-label="Open AI assistant"
      >
        <motion.span
          className="absolute inset-0 rounded-full animate-pulse"
          style={{ background: `radial-gradient(circle, ${C.secondary}55, transparent 70%)` }}
        />
        {open ? <X className="relative h-5 w-5" /> : <Bot className="relative h-5 w-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[92vw] overflow-hidden rounded-2xl border"
            style={{ borderColor: C.borderStrong, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: `0 30px 60px -15px rgba(0,0,0,0.1), 0 0 0 1px ${C.border}` }}
          >
            <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: C.border }}>
              <div className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Arthak AI Coach</p>
                <p className="text-[10px] text-zinc-500 font-medium">Personalized for your AI Engineer path</p>
              </div>
            </div>
            <div className="max-h-[280px] space-y-3 overflow-y-auto px-4 py-4 text-sm">
              <div className="rounded-xl border px-3 py-2 text-zinc-900 bg-zinc-50/50" style={{ borderColor: C.border }}>
                Hey Utkarsh — want me to plan your next 3 hours to hit the CNN milestone today?
              </div>
              <div className="ml-auto max-w-[80%] rounded-xl px-3 py-2 text-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                Yes, break it down step-by-step.
              </div>
            </div>
            <div className="flex items-center gap-2 border-t p-3" style={{ borderColor: C.border }}>
              <input placeholder="Ask anything about your career…" className="h-10 flex-1 rounded-xl border px-3 text-sm outline-none focus:border-zinc-300"
                style={{ borderColor: C.border, background: "rgba(9,9,11,0.02)", color: C.text }} />
              <button className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============== SHARED ============== */
interface PanelProps {
  children: React.ReactNode;
  glow?: boolean;
}

function Panel({ children, glow }: PanelProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border p-6 lg:p-7 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-white"
      style={{ borderColor: C.border, boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
      {glow && (
        <motion.div
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "10%", "-10%"],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none opacity-[0.03] blur-[40px]"
          style={{
            background: "radial-gradient(circle, #FF8A00 0%, #14B8A6 100%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-bold tracking-tight lg:text-2xl text-zinc-900">{title}</h2>
    </div>
  );
}