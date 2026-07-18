import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, createContext, useContext, type ComponentType, type SVGProps } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  LayoutDashboard, Map, GraduationCap, FileText, Briefcase, Trophy, Bot,
  Settings, Search, Bell, ChevronDown, ChevronRight, ArrowLeft, ArrowUpRight,
  TrendingUp, Clock, Target, Sparkles, Play, CheckCircle2,
  Circle, Lock, Send, X, LifeBuoy, BarChart3, Flame, Award, Zap,
  MapPin, Bookmark, Calendar, Users, Code2, MessageSquare, GitBranch,
  Rocket, Star, Layers, Activity, ArrowRight, ShieldCheck, Gauge,
  Brain, Cpu, LineChart, Eye, Server, Linkedin, Timer, Building2,
  Command, CircleDot, Hexagon, Crown, Medal, Gem, Flag, Verified,
  Menu, User,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute>
      <DashboardShell />
    </ProtectedRoute>
  ),
});

/* ============ TOKENS ============ */
const C = {
  bg: "#FAFAF7",
  panel: "#FFFFFF",
  ink: "#0A0A0B",
  ink2: "#3F3F46",
  muted: "#8A8A93",
  line: "#EEEBE3",
  lineSoft: "#F4F1EA",
  accent: "#14B8A6",
  accentDeep: "#0D9488",
  accentSoft: "#CCFBF1",
  accentGlow: "rgba(20,184,166,0.16)",
  good: "#16A34A",
  goodSoft: "#DCFCE7",
  bad: "#E11D48",
  badSoft: "#FFE4E6",
  warn: "#EA9F1F",
  warnSoft: "#FEF3D7",
  indigo: "#4F46E5",
  indigoSoft: "#EEECFE",
  purple: "#9333EA",
  purpleSoft: "#F3E8FF",
};

/* ============ SHELL ============ */
function DashboardShell() {
  const [aiOpen, setAiOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div
      className="min-h-screen antialiased"
      style={{
        background: C.bg,
        color: C.ink,
        fontFamily:
          '"Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        fontFeatureSettings: '"ss01","cv11"',
      }}
    >
      <Header />
      <div className="relative flex min-h-[calc(100vh-64px)]">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1 px-6 lg:px-12 pt-5 pb-10 lg:py-10 mx-auto w-full max-w-[1440px]">
            {/* Mobile Menu trigger */}
            <div className="flex lg:hidden mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="group flex items-center gap-2 rounded-full border bg-white/90 backdrop-blur-md px-4 py-2.5 text-xs font-bold transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden"
                style={{
                  borderColor: C.line,
                  color: C.ink,
                }}
              >
                {/* Subtle background glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${C.accentGlow} 0%, transparent 80%)`
                  }}
                />
                
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]"></span>
                </span>
                
                <Menu className="h-3.5 w-3.5 stroke-[2.5]" style={{ color: C.accentDeep }} />
                <span className="tracking-wider uppercase font-extrabold text-[10px]">Menu</span>
              </button>
            </div>

            <Hero />
            <Section><TodaysMission /></Section>
            <Section><CareerSnapshot /></Section>
            <Section><AIInsights /></Section>
            <Section><RoadmapPanel /></Section>
            <Section><ContinueLearning /></Section>
            <Section><Internships /></Section>
            <Section><Projects /></Section>
            <Section><Hackathons /></Section>
            <Section><Mentors /></Section>
            <Section><ActivityTimeline /></Section>
            <Section><AnalyticsInsights /></Section>
            <Section><BadgesSection /></Section>
            <Section last><CareerDNA /></Section>
          </main>
        </div>
      </div>
      <AIDock open={aiOpen} setOpen={setAiOpen} />
    </div>
  );
}

function Section({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return <div className={last ? "mt-16 mb-10" : "mt-16"}>{children}</div>;
}

/* ============ SIDEBAR ============ */
type NavItem = { icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; to?: string; active?: boolean };

function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const groups: { heading?: string; items: NavItem[] }[] = [
    { items: [{ icon: LayoutDashboard, label: "Dashboard", to: "/dashboard", active: true }] },
    {
      heading: "Career Center",
      items: [
        { icon: Map, label: "Roadmaps", to: "/roadmaps" },
        { icon: GraduationCap, label: "Learning" },
        { icon: FileText, label: "Resume", to: "/resume-builder" },
        { icon: Code2, label: "Projects" },
        { icon: Briefcase, label: "Internships" },
        { icon: Rocket, label: "Hackathons" },
      ],
    },
    {
      heading: "Growth",
      items: [
        { icon: Trophy, label: "Achievements" },
        { icon: BarChart3, label: "Analytics" },
        { icon: Users, label: "Mentors" },
      ],
    },
    {
      items: [
        { icon: Settings, label: "Settings" },
        { icon: User, label: "Profile", to: "/profile" },
      ],
    },
  ];
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[252px] shrink-0 flex-col border-r transition-all duration-300 ease-out lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      style={{ borderRight: `1px solid ${C.line}`, background: C.panel }}
    >
      <div className="h-[72px] px-5 flex items-center justify-between lg:hidden" style={{ borderBottom: `1px solid ${C.line}` }}>
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="h-9 w-9 rounded-[11px] grid place-items-center text-white font-black text-[15px] relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${C.ink} 0%, #26262c 100%)` }}
          >
            <span className="relative z-10">A</span>
            <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full blur-md" style={{ background: C.accent, opacity: 0.6 }} />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight">ARTHAK</div>
            <div className="text-[9.5px] tracking-[0.14em] uppercase font-medium" style={{ color: C.muted }}>Career OS</div>
          </div>
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-black/[0.04] transition cursor-pointer"
          aria-label="Close"
        >
          <ArrowLeft className="h-4 w-4" style={{ color: C.muted }} />
        </button>
      </div>

      <nav className="px-3 py-5 flex flex-col gap-5 overflow-y-auto flex-1">
        {groups.map((g, gi) => (
          <div key={gi} className="flex flex-col gap-0.5">
            {g.heading && (
              <div className="px-3 pb-2 text-[10px] font-semibold tracking-[0.16em] uppercase" style={{ color: C.muted }}>
                {g.heading}
              </div>
            )}
            {g.items.map((n) => {
              const Comp: any = n.to ? Link : "button";
              const props: any = n.to ? { to: n.to } : {};
              const active = n.active;
              const isHighlighted = active || hoveredLabel === n.label;
              return (
                <Comp
                  key={n.label}
                  {...props}
                  onMouseEnter={() => setHoveredLabel(n.label)}
                  onMouseLeave={() => setHoveredLabel(null)}
                  className="group relative flex items-center gap-3 px-3 h-10 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: isHighlighted ? "linear-gradient(180deg, #0F0F12 0%, #1A1A1F 100%)" : "transparent",
                    color: isHighlighted ? "#FFFFFF" : C.ink2,
                    boxShadow: isHighlighted ? `0 8px 24px -12px ${C.accentGlow}, 0 0 0 1px rgba(255,255,255,0.04) inset` : "none",
                  }}
                >
                  {isHighlighted && (
                    <span
                      className="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
                      style={{ background: C.accent, boxShadow: `0 0 12px ${C.accent}` }}
                    />
                  )}
                  <n.icon
                    className="h-[16px] w-[16px] transition-transform duration-200 group-hover:scale-110"
                    style={{ color: isHighlighted ? C.accent : "currentColor" }}
                  />
                  <span>{n.label}</span>
                  {isHighlighted && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
                  )}
                </Comp>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto p-3">
        <button
          className="w-full rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-black/[0.02] transition"
          style={{ background: C.lineSoft, border: `1px solid ${C.line}` }}
        >
          <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
            <LifeBuoy className="h-4 w-4" style={{ color: C.accent }} />
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] font-semibold">Need help?</div>
            <div className="text-[11px] leading-tight" style={{ color: C.muted }}>Chat with your AI mentor</div>
          </div>
        </button>
      </div>
    </aside>
  );
}

/* ============ TOP BAR ============ */
function TopBar() {
  const { user } = useAuth();
  const [focused, setFocused] = useState(false);
  const initials = (user?.fullName || "AR").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return (
    <header
      className="h-[72px] px-6 lg:px-12 flex items-center gap-3 sticky top-0 z-30"
      style={{ background: `${C.bg}D9`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.line}` }}
    >
      <div className="flex-1">
        <motion.div
          animate={{
            boxShadow: focused
              ? `0 0 0 4px ${C.accentGlow}, 0 8px 24px -12px ${C.accentGlow}`
              : "0 1px 2px rgba(0,0,0,0.02)",
            borderColor: focused ? C.accent : C.line,
          }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[640px] h-11 px-4 rounded-full flex items-center gap-2.5"
          style={{ background: C.panel, border: `1px solid ${C.line}` }}
        >
          <Sparkles className="h-4 w-4" style={{ color: focused ? C.accent : C.muted }} />
          <input
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask Arthak AI anything…"
            className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[color:var(--ph)]"
            style={{ ["--ph" as any]: C.muted }}
          />
          <kbd className="hidden md:inline text-[10.5px] px-1.5 py-0.5 rounded font-mono" style={{ background: C.lineSoft, color: C.muted }}>
            ⌘K
          </kbd>
        </motion.div>
      </div>
      <button
        className="h-10 pl-3 pr-4 rounded-full flex items-center gap-1.5 text-[12.5px] font-semibold text-white transition-transform hover:scale-[1.02]"
        style={{
          background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDeep} 100%)`,
          boxShadow: `0 10px 24px -10px ${C.accentGlow}`,
        }}
        title="Ask AI"
      >
        <Sparkles className="h-3.5 w-3.5" /> AI
      </button>
      <button
        className="h-10 w-10 grid place-items-center rounded-full relative hover:bg-black/[0.03] transition"
        style={{ background: C.panel, border: `1px solid ${C.line}` }}
      >
        <Bell className="h-4 w-4" style={{ color: C.ink2 }} />
        <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full" style={{ background: C.accent, boxShadow: `0 0 6px ${C.accent}` }} />
      </button>
      <button
        className="h-10 pl-1 pr-3 gap-2 flex items-center rounded-full hover:bg-black/[0.02] transition"
        style={{ background: C.panel, border: `1px solid ${C.line}` }}
      >
        <span
          className="h-8 w-8 rounded-full grid place-items-center text-[12px] font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})` }}
        >
          {initials}
        </span>
        <ChevronDown className="h-3.5 w-3.5" style={{ color: C.muted }} />
      </button>
    </header>
  );
}

/* ============ COUNT-UP ============ */
function CountUp({ to, suffix = "", duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString() + suffix);
  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration, ease: [0.2, 0.8, 0.2, 1] });
      return () => controls.stop();
    }
  }, [inView, to, duration, mv]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

/* ============ HERO ============ */
function Hero() {
  const { user } = useAuth();
  const first = (user?.fullName || "there").split(" ")[0];
  const pct = 62;
  const R = 96, C0 = 2 * Math.PI * R;
  return (
    <section
      className="relative overflow-hidden rounded-[28px] p-8 lg:p-12"
      style={{
        background: `linear-gradient(135deg, #FFFFFF 0%, #FBF8F1 60%, #FFF3E8 100%)`,
        border: `1px solid ${C.line}`,
        boxShadow: "0 1px 2px rgba(15,15,15,0.03), 0 24px 60px -30px rgba(15,15,15,0.08)",
      }}
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-70 blur-3xl"
        style={{ background: `radial-gradient(circle, ${C.accentSoft} 0%, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${C.indigoSoft} 0%, transparent 70%)` }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: C.muted }}>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: C.good, boxShadow: `0 0 8px ${C.good}` }}
            />
            Good evening, {first}
          </div>
          <h1 className="mt-3 text-[36px] lg:text-[46px] leading-[1.02] font-semibold tracking-[-0.02em]">
            You're closer to your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(120deg, ${C.accent}, ${C.accentDeep})` }}
            >
              AI Engineer
            </span>{" "}
            dream than yesterday.
          </h1>
          <p className="mt-4 text-[15px] max-w-[500px] leading-relaxed" style={{ color: C.ink2 }}>
            You're <span className="font-semibold" style={{ color: C.ink }}>{pct}% through</span> your roadmap.
            3 milestones remaining — estimated completion in{" "}
            <span className="font-semibold" style={{ color: C.ink }}>42 days</span>.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <button
              className="h-11 px-5 rounded-xl text-[13.5px] font-semibold text-white flex items-center gap-2 transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})`,
                boxShadow: `0 14px 30px -12px ${C.accentGlow}`,
              }}
            >
              <Play className="h-4 w-4" /> Continue Journey
            </button>
            <Link
              to="/roadmaps"
              className="h-11 px-5 rounded-xl text-[13.5px] font-semibold flex items-center gap-2 hover:bg-black/[0.03] transition"
              style={{ border: `1px solid ${C.line}`, color: C.ink, background: C.panel }}
            >
              View Roadmap <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mini stat row */}
          <div className="mt-8 pt-6 grid grid-cols-2 md:grid-cols-4 gap-3" style={{ borderTop: `1px solid ${C.line}` }}>
            {[
              { icon: Flame, label: "Day streak", value: "27", color: C.accent, tint: C.accentSoft },
              { icon: Trophy, label: "Badges", value: "8", color: C.warn, tint: C.warnSoft },
              { icon: Star, label: "Career score", value: "782", color: C.indigo, tint: C.indigoSoft },
              { icon: Crown, label: "Level", value: "12", color: C.good, tint: C.goodSoft },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: s.tint }}>
                  <s.icon className="h-[18px] w-[18px]" style={{ color: s.color }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10.5px] uppercase tracking-[0.12em] font-medium" style={{ color: C.muted }}>{s.label}</div>
                  <div className="text-[16px] font-semibold tracking-tight truncate">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Ring + orbital constellation */}
        <HeroRing pct={pct} R={R} C0={C0} />
      </div>
    </section>
  );
}

function HeroRing({ pct, R, C0 }: { pct: number; R: number; C0: number }) {
  const size = 300;
  return (
    <div className="relative mx-auto lg:mx-0" style={{ width: size, height: size }}>
      {/* Progress ring */}
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.accent} />
            <stop offset="100%" stopColor={C.accentDeep} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={C.lineSoft} strokeWidth="12" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={R} fill="none"
          stroke="url(#hero-ring)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={C0}
          initial={{ strokeDashoffset: C0 }}
          animate={{ strokeDashoffset: C0 * (1 - pct / 100) }}
          transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </svg>

      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[44px] font-semibold tracking-[-0.03em] leading-none tabular-nums">
          <CountUp to={pct} suffix="%" />
        </div>
        <div className="mt-1.5 text-[10.5px] uppercase tracking-[0.16em] font-semibold" style={{ color: C.muted }}>
          AI Engineer
        </div>
        <div className="mt-1.5 text-[12px] font-semibold" style={{ color: C.accent }}>3,280 XP</div>
      </div>

      {/* Pulse */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: `2px solid ${C.accent}` }}
        animate={{ scale: [1, 1.08], opacity: [0.3, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  );
}

/* ============ SECTION HEADER ============ */
function SectionHeader({ eyebrow, title, sub, action }: { eyebrow?: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        {eyebrow && (
          <div className="text-[10.5px] uppercase tracking-[0.16em] font-semibold" style={{ color: C.accent }}>
            {eyebrow}
          </div>
        )}
        <h2 className="mt-1.5 text-[24px] font-semibold tracking-[-0.02em]">{title}</h2>
        {sub && <p className="mt-1 text-[13px]" style={{ color: C.muted }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ============ CARD ============ */
function Card({ children, className = "", padded = true }: { children: React.ReactNode; className?: string; padded?: boolean }) {
  return (
    <section
      className={`rounded-[20px] ${padded ? "p-6" : ""} ${className}`}
      style={{
        background: C.panel,
        border: `1px solid ${C.line}`,
        boxShadow: "0 1px 2px rgba(15,15,15,0.02)",
      }}
    >
      {children}
    </section>
  );
}

/* ============ TODAY'S MISSION ============ */
function TodaysMission() {
  type M = { text: string; done: boolean; diff: "Easy" | "Medium" | "Hard"; xp: number; time: string };
  const initial: M[] = [
    { text: "Complete CNN Module", done: true, diff: "Medium", xp: 80, time: "25 min" },
    { text: "Solve Deep Learning Quiz", done: false, diff: "Hard", xp: 120, time: "15 min" },
    { text: "Improve resume ATS score", done: false, diff: "Easy", xp: 40, time: "10 min" },
    { text: "Apply to 2 internships", done: false, diff: "Medium", xp: 60, time: "20 min" },
  ];
  const [tasks, setTasks] = useState<M[]>(initial);
  const done = tasks.filter((t) => t.done).length;
  const pct = Math.round((done / tasks.length) * 100);
  const diffColor = (d: M["diff"]) =>
    d === "Easy" ? { c: C.good, s: C.goodSoft } : d === "Medium" ? { c: C.warn, s: C.warnSoft } : { c: C.bad, s: C.badSoft };

  return (
    <div>
      <SectionHeader
        eyebrow="Today's Mission"
        title="Four moves to level up today"
        sub="Complete all missions to unlock the Deep Learning badge"
        action={
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{ background: C.accentSoft, color: C.accent }}>
              <Zap className="h-3.5 w-3.5" /> +300 XP
            </span>
          </div>
        }
      />
      <Card>
        <div className="grid md:grid-cols-2 gap-3">
          {tasks.map((t, i) => {
            const d = diffColor(t.diff);
            return (
              <motion.button
                key={i}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                onClick={() =>
                  setTasks((prev) => prev.map((x, idx) => (idx === i ? { ...x, done: !x.done } : x)))
                }
                className="text-left rounded-2xl p-4 flex items-center gap-3.5 transition"
                style={{
                  background: t.done ? C.lineSoft : C.panel,
                  border: `1px solid ${t.done ? C.line : C.line}`,
                  boxShadow: t.done ? "none" : "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                <motion.span
                  layout
                  className="h-6 w-6 rounded-full grid place-items-center shrink-0"
                  style={{
                    background: t.done ? C.ink : C.panel,
                    border: `1px solid ${t.done ? C.ink : C.line}`,
                  }}
                >
                  <AnimatePresence>
                    {t.done && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                        <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={2.5} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <div className="flex-1 min-w-0">
                  <div className={`text-[13.5px] font-semibold ${t.done ? "line-through" : ""}`}
                       style={{ color: t.done ? C.muted : C.ink }}>
                    {t.text}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md"
                          style={{ background: d.s, color: d.c }}>{t.diff}</span>
                    <span className="text-[11px] flex items-center gap-1" style={{ color: C.muted }}>
                      <Clock className="h-3 w-3" /> {t.time}
                    </span>
                    <span className="text-[11px] font-semibold flex items-center gap-0.5" style={{ color: C.accent }}>
                      <Zap className="h-3 w-3" /> +{t.xp} XP
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: C.lineSoft }}>
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.accentDeep})` }}
            />
          </div>
          <div className="text-[12.5px] font-semibold tabular-nums">{done}/{tasks.length} · {pct}%</div>
        </div>
      </Card>
    </div>
  );
}

/* ============ CAREER SNAPSHOT ============ */
function CareerSnapshot() {
  const items = [
    { icon: TrendingUp, label: "Career Score", value: "782", max: 1000, sub: "+24 this week", trend: "+3.2%", up: true, tint: C.accentSoft, color: C.accent, pct: 78 },
    { icon: Target, label: "Roadmap", value: "62%", sub: "AI Engineer", trend: "+8%", up: true, tint: C.indigoSoft, color: C.indigo, pct: 62 },
    { icon: Clock, label: "Learning Hours", value: "48h", sub: "this month", trend: "+18%", up: true, tint: C.warnSoft, color: C.warn, pct: 65 },
    { icon: ShieldCheck, label: "Verified Skills", value: "14", sub: "of 20", trend: "+2", up: true, tint: C.goodSoft, color: C.good, pct: 70 },
    { icon: Gauge, label: "ATS Score", value: "87", sub: "resume ready", trend: "+8", up: true, tint: C.purpleSoft, color: C.purple, pct: 87 },
  ];
  return (
    <div>
      <SectionHeader eyebrow="Snapshot" title="Career at a glance" sub="Track the metrics that make you hireable" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {items.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="rounded-[20px] p-5 group"
            style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl grid place-items-center transition-transform group-hover:scale-110"
                   style={{ background: s.tint }}>
                <s.icon className="h-[15px] w-[15px]" style={{ color: s.color }} strokeWidth={2} />
              </div>
              <span className="text-[10.5px] font-semibold flex items-center gap-0.5"
                    style={{ color: s.up ? C.good : C.bad }}>
                <TrendingUp className="h-3 w-3" /> {s.trend}
              </span>
            </div>
            <div className="mt-5 text-[11px] uppercase tracking-[0.12em] font-medium" style={{ color: C.muted }}>{s.label}</div>
            <div className="mt-1 text-[26px] font-semibold tracking-[-0.02em] leading-none">{s.value}</div>
            <div className="mt-1.5 text-[11.5px]" style={{ color: C.muted }}>{s.sub}</div>
            <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: C.lineSoft }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: i * 0.05 }}
                className="h-full rounded-full"
                style={{ background: s.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ AI INSIGHTS ============ */
function AIInsights() {
  const items = [
    {
      title: "You're 82% ready for AI Engineer roles",
      why: "Based on your completed modules and 14 verified skills, you're ahead of 71% of learners on this track.",
      tag: "Readiness", conf: 92, impact: "High", improve: "+12%", priority: "high", cta: "See what's missing",
    },
    {
      title: "Improving SQL can boost interview chances by 18%",
      why: "5 of the 12 internships in your match list require SQL — it's your biggest missing signal.",
      tag: "Skill Gap", conf: 88, impact: "High", improve: "+18%", priority: "high", cta: "Start SQL track",
    },
    {
      title: "You've ignored resume updates for 9 days",
      why: "Your ATS score dropped 3 points since your last save. A 10-minute refresh could recover it.",
      tag: "Resume", conf: 81, impact: "Medium", improve: "+5%", priority: "medium", cta: "Open resume",
    },
    {
      title: "Finish CNN before moving to Deep Learning",
      why: "3 later modules assume CNN fundamentals — skipping risks slowdowns down the track.",
      tag: "Roadmap", conf: 95, impact: "High", improve: "+22%", priority: "high", cta: "Resume CNN",
    },
  ];
  const priorityColor = (p: string) =>
    p === "high" ? { c: C.accent, s: C.accentSoft } : p === "medium" ? { c: C.warn, s: C.warnSoft } : { c: C.good, s: C.goodSoft };
  return (
    <div>
      <SectionHeader
        eyebrow="AI Insights"
        title="What Arthak is thinking today"
        sub="Personalized reasoning from your last 30 days of activity"
        action={
          <button className="text-[12.5px] font-semibold flex items-center gap-1.5 h-9 px-3 rounded-lg hover:bg-black/[0.03] transition"
                  style={{ color: C.ink2, border: `1px solid ${C.line}`, background: C.panel }}>
            <Sparkles className="h-3.5 w-3.5" style={{ color: C.accent }} /> Refresh
          </button>
        }
      />
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, i) => {
          const p = priorityColor(it.priority);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className="rounded-[20px] p-5 relative overflow-hidden"
              style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg grid place-items-center relative"
                       style={{ background: `linear-gradient(135deg, ${C.ink}, #2a2a30)` }}>
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full" style={{ background: C.accent }} />
                  </div>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: C.muted }}>
                    {it.tag}
                  </span>
                </div>
                <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: p.s, color: p.c }}>
                  {it.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <div className="mt-4 text-[15.5px] font-semibold leading-snug tracking-tight">{it.title}</div>
              <div className="mt-2 text-[12.5px] leading-relaxed" style={{ color: C.ink2 }}>
                <span className="font-semibold" style={{ color: C.muted }}>Why: </span>{it.why}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 py-3" style={{ borderTop: `1px dashed ${C.line}`, borderBottom: `1px dashed ${C.line}` }}>
                <div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: C.muted }}>Confidence</div>
                  <div className="text-[13px] font-semibold" style={{ color: C.good }}>{it.conf}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: C.muted }}>Impact</div>
                  <div className="text-[13px] font-semibold">{it.impact}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: C.muted }}>Estimated</div>
                  <div className="text-[13px] font-semibold" style={{ color: C.accent }}>{it.improve}</div>
                </div>
              </div>
              <button className="mt-4 h-9 px-4 rounded-lg text-[12.5px] font-semibold flex items-center gap-1.5 text-white transition-transform hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})` }}>
                {it.cta} <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ ROADMAP PANEL ============ */
function RoadmapPanel() {
  const steps = [
    { title: "Career Discovery", meta: "Completed · 6 modules", state: "done" as const },
    { title: "Foundation Skills", meta: "Completed · 12 modules", state: "done" as const },
    { title: "Frontend Engineering", meta: "In progress · 8 of 14 modules", state: "current" as const, pct: 57 },
    { title: "Backend & Systems", meta: "Unlocks after Frontend", state: "locked" as const },
    { title: "Interview Mastery", meta: "Locked", state: "locked" as const },
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="Roadmap"
        title="Your Career Roadmap"
        sub="Full‑stack Developer track"
        action={
          <Link to="/roadmaps" className="text-[12.5px] font-semibold flex items-center gap-1" style={{ color: C.accent }}>
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        }
      />
      <Card>
        <div className="flex flex-col gap-3">
          {steps.map((s, i) => {
            const Icon = s.state === "done" ? CheckCircle2 : s.state === "current" ? Circle : Lock;
            const bg =
              s.state === "current"
                ? `linear-gradient(135deg, ${C.accentSoft} 0%, #FFF5EC 100%)`
                : s.state === "done"
                ? C.goodSoft
                : C.lineSoft;
            const border = s.state === "current" ? "#FCD3B8" : s.state === "done" ? "#BBF7D0" : C.line;
            const iconColor = s.state === "done" ? C.good : s.state === "current" ? C.accent : C.muted;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl relative"
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  boxShadow: s.state === "current" ? `0 8px 24px -12px ${C.accentGlow}` : "none",
                }}
              >
                {s.state === "current" && (
                  <motion.span
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ border: `1px solid ${C.accent}` }}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  />
                )}
                <div className="h-10 w-10 rounded-full grid place-items-center relative"
                     style={{ background: C.panel, border: `1px solid ${border}` }}>
                  <Icon className="h-[18px] w-[18px]" style={{ color: iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold truncate">{s.title}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: C.muted }}>{s.meta}</div>
                  {s.state === "current" && (
                    <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "#FFFFFF" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.accentDeep})` }}
                      />
                    </div>
                  )}
                </div>
                {s.state === "current" && (
                  <button
                    className="h-9 px-4 rounded-lg text-[12px] font-semibold text-white flex items-center gap-1.5 transition-transform hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})`,
                      boxShadow: `0 8px 20px -10px ${C.accentGlow}`,
                    }}
                  >
                    <Play className="h-3.5 w-3.5" /> Resume
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ============ CONTINUE LEARNING ============ */
function ContinueLearning() {
  const items = [
    {
      title: "System Design Fundamentals",
      lessons: 12, remaining: 4, duration: "6h", diff: "Advanced",
      pct: 68, aiRec: true,
      grad: `linear-gradient(135deg, ${C.indigo} 0%, #6366F1 100%)`,
      icon: Server,
    },
    {
      title: "TypeScript Deep Dive",
      lessons: 8, remaining: 5, duration: "3h", diff: "Intermediate",
      pct: 42, aiRec: false,
      grad: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDeep} 100%)`,
      icon: Code2,
    },
    {
      title: "Product Case Interviews",
      lessons: 6, remaining: 1, duration: "2h", diff: "Intermediate",
      pct: 85, aiRec: true,
      grad: `linear-gradient(135deg, ${C.good} 0%, #22C55E 100%)`,
      icon: Trophy,
    },
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="Continue Learning"
        title="Pick up where you left off"
        action={
          <button className="text-[12.5px] font-semibold flex items-center gap-1" style={{ color: C.accent }}>
            Browse library <ChevronRight className="h-3.5 w-3.5" />
          </button>
        }
      />
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-[20px] overflow-hidden group"
            style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}
          >
            {/* Cover */}
            <div className="relative h-32 overflow-hidden" style={{ background: it.grad }}>
              <div
                aria-hidden
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 40%)",
                }}
              />
              <it.icon className="absolute -bottom-4 -right-4 h-32 w-32 text-white opacity-25" strokeWidth={1.25} />
              {it.aiRec && (
                <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur"
                      style={{ background: "rgba(255,255,255,0.9)", color: C.ink }}>
                  <Sparkles className="h-3 w-3" style={{ color: C.accent }} /> AI Pick
                </span>
              )}
              <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: "rgba(0,0,0,0.35)", color: "#fff", backdropFilter: "blur(6px)" }}>
                {it.diff}
              </span>
            </div>
            <div className="p-5">
              <div className="text-[14.5px] font-semibold leading-snug">{it.title}</div>
              <div className="mt-2 flex items-center gap-3 text-[11.5px]" style={{ color: C.muted }}>
                <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> {it.lessons} lessons</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {it.duration}</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: C.lineSoft }}>
                <motion.div
                  initial={{ width: 0 }} whileInView={{ width: `${it.pct}%` }} viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.accentDeep})` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span style={{ color: C.muted }}>{it.pct}% · {it.remaining} left</span>
                <button className="text-[11.5px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: C.accent }}>
                  Continue <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ INTERNSHIPS ============ */
function Internships() {
  const roles = [
    { role: "Frontend Engineer Intern", co: "Linear", loc: "Remote", remote: true, stipend: "₹45k/mo", logo: "L", color: "#8B5CF6", match: 94, hot: true, deadline: "3 days left", rating: 4.8 },
    { role: "Product Design Intern", co: "Razorpay", loc: "Bengaluru", remote: false, stipend: "₹40k/mo", logo: "R", color: "#3B82F6", match: 89, hot: false, deadline: "12 days left", rating: 4.6 },
    { role: "AI Research Intern", co: "Sarvam AI", loc: "Remote", remote: true, stipend: "₹60k/mo", logo: "S", color: "#EA580C", match: 96, hot: true, deadline: "5 days left", rating: 4.9 },
    { role: "Full‑Stack Intern", co: "Zerodha", loc: "Hybrid", remote: false, stipend: "₹35k/mo", logo: "Z", color: "#0EA5E9", match: 78, hot: false, deadline: "1 day left", rating: 4.7 },
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="Opportunities"
        title="Internships matched to you"
        sub="AI‑matched to your Frontend Engineering track"
        action={
          <button className="text-[12.5px] font-semibold flex items-center gap-1" style={{ color: C.accent }}>
            See all 24 <ChevronRight className="h-3.5 w-3.5" />
          </button>
        }
      />
      <div className="grid md:grid-cols-2 gap-4">
        {roles.map((r, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="rounded-[20px] p-5"
            style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}
          >
            <div className="flex items-start gap-3.5">
              <div className="h-12 w-12 rounded-xl grid place-items-center text-white text-[15px] font-bold shrink-0"
                   style={{ background: r.color, boxShadow: `0 8px 18px -8px ${r.color}55` }}>{r.logo}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[14.5px] font-semibold truncate">{r.role}</div>
                    <div className="text-[12px] mt-0.5 flex items-center gap-1.5" style={{ color: C.muted }}>
                      <span className="font-semibold" style={{ color: C.ink2 }}>{r.co}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5"><Star className="h-3 w-3" style={{ color: C.warn }} /> {r.rating}</span>
                    </div>
                  </div>
                  <button className="h-8 w-8 rounded-lg grid place-items-center hover:bg-black/[0.04] shrink-0">
                    <Bookmark className="h-3.5 w-3.5" style={{ color: C.muted }} />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1"
                        style={{ background: C.indigoSoft, color: C.indigo }}>
                    <Sparkles className="h-3 w-3" /> AI Match {r.match}%
                  </span>
                  {r.remote && (
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
                          style={{ background: C.goodSoft, color: C.good }}>Remote</span>
                  )}
                  {r.hot && (
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1"
                          style={{ background: C.accentSoft, color: C.accent }}>
                      <Flame className="h-3 w-3" /> Hiring fast
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11.5px]" style={{ color: C.muted }}>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.loc}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Timer className="h-3 w-3" style={{ color: C.bad }} /> {r.deadline}</span>
                </div>
                <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px dashed ${C.line}` }}>
                  <div className="text-[15px] font-semibold tracking-tight">{r.stipend}</div>
                  <button className="h-9 px-4 rounded-lg text-[12px] font-semibold text-white flex items-center gap-1.5 transition-transform hover:scale-[1.02]"
                          style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})` }}>
                    <Zap className="h-3.5 w-3.5" /> Easy Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ PROJECTS ============ */
function Projects() {
  const items = [
    {
      title: "Realtime Chat App", stack: ["React", "Socket.io", "Node"],
      stars: 24, level: "Intermediate", weeks: "2 weeks", portfolio: 85, resume: 78, demand: "High",
      color: C.indigo,
    },
    {
      title: "AI Resume Ranker", stack: ["Python", "LLM", "FastAPI"],
      stars: 42, level: "Advanced", weeks: "3 weeks", portfolio: 96, resume: 92, demand: "Very High",
      color: C.accent,
    },
    {
      title: "Portfolio v3", stack: ["Next.js", "Framer", "Tailwind"],
      stars: 18, level: "Beginner", weeks: "1 week", portfolio: 72, resume: 65, demand: "Medium",
      color: C.good,
    },
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="Portfolio"
        title="Recommended Projects"
        sub="Build → showcase → get hired"
        action={
          <button className="text-[12.5px] font-semibold flex items-center gap-1" style={{ color: C.accent }}>
            Explore <ChevronRight className="h-3.5 w-3.5" />
          </button>
        }
      />
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-[20px] p-5"
            style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}
          >
            <div className="flex items-start justify-between">
              <div className="h-11 w-11 rounded-xl grid place-items-center"
                   style={{ background: C.lineSoft, border: `1px solid ${C.line}` }}>
                <GitBranch className="h-4 w-4" style={{ color: p.color }} />
              </div>
              <div className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: C.ink2 }}>
                <Star className="h-3.5 w-3.5" style={{ color: C.warn }} fill={C.warn} /> {p.stars}
              </div>
            </div>
            <div className="mt-4 text-[15px] font-semibold leading-snug">{p.title}</div>
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {p.stack.map((s) => (
                <span key={s} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
                      style={{ background: C.lineSoft, color: C.ink2 }}>{s}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px]" style={{ color: C.muted }}>
              <span className="flex items-center gap-1"><Gauge className="h-3 w-3" /> {p.level}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.weeks}</span>
            </div>

            <div className="mt-4 space-y-2.5">
              <ValueBar label="Portfolio value" value={p.portfolio} color={C.accent} />
              <ValueBar label="Resume value" value={p.resume} color={C.indigo} />
            </div>

            <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px dashed ${C.line}` }}>
              <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: C.good }}>
                <TrendingUp className="h-3 w-3" /> {p.demand} recruiter demand
              </span>
              <button className="h-8 px-3 rounded-lg text-[11.5px] font-semibold text-white flex items-center gap-1"
                      style={{ background: C.ink }}>
                Start <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ValueBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10.5px] mb-1">
        <span style={{ color: C.muted }}>{label}</span>
        <span className="font-semibold" style={{ color: C.ink2 }}>{value}%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: C.lineSoft }}>
        <motion.div
          initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ============ HACKATHONS ============ */
function Hackathons() {
  const events = [
    { name: "Vercel Ship AI Jam", days: 3, prize: "$5,000", participants: "3.2k", diff: "Intermediate", ending: true, color: C.accent },
    { name: "Smart India Hackathon", days: 12, prize: "₹1,00,000", participants: "18k", diff: "Beginner", ending: false, color: C.indigo },
    { name: "ETH India 2026", days: 27, prize: "$25,000", participants: "5.1k", diff: "Advanced", ending: false, color: C.good },
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="Live"
        title="Hackathons happening now"
        sub="Compete, learn, and build your reputation"
      />
      <div className="grid md:grid-cols-3 gap-4">
        {events.map((e, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-[20px] p-5 relative overflow-hidden"
            style={{
              background: C.panel,
              border: `1px solid ${e.ending ? C.accent : C.line}`,
              boxShadow: e.ending ? `0 10px 30px -14px ${C.accentGlow}` : "0 1px 2px rgba(0,0,0,0.02)",
            }}
          >
            {e.ending && (
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1"
                    style={{ background: C.accentSoft, color: C.accent }}>
                <Flame className="h-3 w-3" /> Ending soon
              </span>
            )}
            <div className="h-11 w-11 rounded-xl grid place-items-center"
                 style={{ background: C.lineSoft }}>
              <Rocket className="h-5 w-5" style={{ color: e.color }} />
            </div>
            <div className="mt-4 text-[15px] font-semibold">{e.name}</div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-[10.5px] uppercase tracking-wider" style={{ color: C.muted }}>Starts in</span>
            </div>
            <div className="mt-1 flex items-end gap-3">
              <div>
                <div className="text-[32px] font-semibold tracking-[-0.02em] leading-none tabular-nums"
                     style={{ color: e.ending ? C.accent : C.ink }}>
                  {e.days}
                </div>
                <div className="text-[10.5px] uppercase tracking-wider" style={{ color: C.muted }}>days</div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2 text-[11px] pb-1">
                <div>
                  <div style={{ color: C.muted }}>Prize</div>
                  <div className="font-semibold" style={{ color: C.ink }}>{e.prize}</div>
                </div>
                <div>
                  <div style={{ color: C.muted }}>Joined</div>
                  <div className="font-semibold" style={{ color: C.ink }}>{e.participants}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px dashed ${C.line}` }}>
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
                    style={{ background: C.lineSoft, color: C.ink2 }}>{e.diff}</span>
              <button className="h-9 px-4 rounded-lg text-[12px] font-semibold text-white flex items-center gap-1.5"
                      style={{ background: e.ending ? `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})` : C.ink }}>
                Join <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ MENTORS ============ */
function Mentors() {
  const people = [
    { name: "Ananya Rao", role: "Sr. Frontend Engineer", co: "Google", exp: "8 yrs", online: true, response: "~2h", color: "#EA580C" },
    { name: "Rohit Sharma", role: "Product Manager", co: "Stripe", exp: "6 yrs", online: true, response: "~4h", color: "#4F46E5" },
    { name: "Priya Iyer", role: "Design Lead", co: "Figma", exp: "10 yrs", online: false, response: "~1d", color: "#16A34A" },
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="Mentors"
        title="1:1 with humans who've done it"
        action={
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{ background: C.goodSoft, color: C.good }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.good, boxShadow: `0 0 6px ${C.good}` }} /> 2 online now
          </span>
        }
      />
      <div className="grid md:grid-cols-3 gap-4">
        {people.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="rounded-[20px] p-5"
            style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-14 w-14 rounded-full grid place-items-center text-white text-[15px] font-bold"
                     style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}DD)` }}>
                  {p.name.split(" ").map((x) => x[0]).join("")}
                </div>
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full"
                  style={{
                    background: p.online ? C.good : C.muted,
                    border: `2px solid ${C.panel}`,
                    boxShadow: p.online ? `0 0 6px ${C.good}` : "none",
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold flex items-center gap-1">
                  {p.name} <Verified className="h-3.5 w-3.5" style={{ color: C.indigo }} />
                </div>
                <div className="text-[11.5px]" style={{ color: C.muted }}>{p.role}</div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold" style={{ color: C.ink2 }}>
                  <Building2 className="h-3 w-3" /> {p.co}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 py-3" style={{ borderTop: `1px dashed ${C.line}`, borderBottom: `1px dashed ${C.line}` }}>
              <div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: C.muted }}>Experience</div>
                <div className="text-[12.5px] font-semibold">{p.exp}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: C.muted }}>Response</div>
                <div className="text-[12.5px] font-semibold">{p.response}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button className="flex-1 h-9 rounded-lg text-[12px] font-semibold text-white flex items-center justify-center gap-1.5"
                      style={{ background: C.ink }}>
                <Calendar className="h-3.5 w-3.5" /> Book Session
              </button>
              <button className="h-9 w-9 rounded-lg grid place-items-center hover:bg-black/[0.04] transition"
                      style={{ border: `1px solid ${C.line}` }}>
                <Linkedin className="h-3.5 w-3.5" style={{ color: "#0A66C2" }} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ ACTIVITY TIMELINE ============ */
function ActivityTimeline() {
  const feed = [
    { icon: CheckCircle2, color: C.good, tint: C.goodSoft, text: "Completed React Hooks module", time: "2h ago" },
    { icon: Award, color: C.accent, tint: C.accentSoft, text: "Earned Consistency badge", time: "Yesterday" },
    { icon: Layers, color: C.indigo, tint: C.indigoSoft, text: "Started TypeScript Deep Dive", time: "2d ago" },
    { icon: Briefcase, color: C.warn, tint: C.warnSoft, text: "Applied to Frontend Intern @ Razorpay", time: "3d ago" },
    { icon: Flame, color: C.accent, tint: C.accentSoft, text: "27‑day learning streak reached", time: "5d ago" },
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="Activity"
        title="Recent activity"
        action={
          <button className="text-[12.5px] font-semibold flex items-center gap-1 h-9 px-3 rounded-lg"
                  style={{ color: C.ink2, border: `1px solid ${C.line}`, background: C.panel }}>
            View full log
          </button>
        }
      />
      <Card>
        <div className="relative pl-2">
          <div className="absolute left-[17px] top-1 bottom-1 w-px" style={{ background: C.line }} />
          <div className="flex flex-col gap-4">
            {feed.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 relative"
              >
                <div className="h-8 w-8 rounded-full grid place-items-center shrink-0 relative z-10"
                     style={{ background: f.tint, border: `2px solid ${C.panel}` }}>
                  <f.icon className="h-3.5 w-3.5" style={{ color: f.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="text-[13px] font-medium" style={{ color: C.ink }}>{f.text}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.muted }}>{f.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============ ANALYTICS ============ */
function AnalyticsInsights() {
  const week = [42, 68, 55, 84, 72, 30, 58];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const insights = [
    { label: "Weekly Growth", value: "+18%", sub: "vs last week", color: C.good, tint: C.goodSoft, icon: TrendingUp },
    { label: "Career Readiness", value: "82%", sub: "AI Engineer track", color: C.accent, tint: C.accentSoft, icon: Gauge },
    { label: "Applications Sent", value: "31", sub: "this month", color: C.indigo, tint: C.indigoSoft, icon: Briefcase },
    { label: "Interview Rate", value: "23%", sub: "above cohort avg", color: C.warn, tint: C.warnSoft, icon: MessageSquare },
    { label: "Current Ranking", value: "Top 12%", sub: "in your cohort", color: C.purple, tint: C.purpleSoft, icon: Trophy },
  ];
  return (
    <div>
      <SectionHeader eyebrow="Analytics" title="Insights that move your career" sub="AI‑surfaced numbers, not empty charts" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {insights.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            className="rounded-[20px] p-5"
            style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}
          >
            <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: it.tint }}>
              <it.icon className="h-[15px] w-[15px]" style={{ color: it.color }} strokeWidth={2} />
            </div>
            <div className="mt-4 text-[11px] uppercase tracking-[0.12em] font-medium" style={{ color: C.muted }}>{it.label}</div>
            <div className="mt-1 text-[26px] font-semibold tracking-[-0.02em] leading-none">{it.value}</div>
            <div className="mt-1.5 text-[11.5px]" style={{ color: C.muted }}>{it.sub}</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 grid md:grid-cols-[1.4fr_1fr] gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Weekly learning activity</h3>
              <p className="text-[12px] mt-0.5" style={{ color: C.muted }}>6.5 hours this week — most of it on Thursday.</p>
            </div>
            <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                  style={{ background: C.goodSoft, color: C.good }}>
              <TrendingUp className="h-3 w-3" /> +18%
            </span>
          </div>
          <div className="mt-6 h-[140px] flex items-end gap-3">
            {week.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  className="w-full rounded-lg"
                  style={{
                    background: i === 3 ? `linear-gradient(180deg, ${C.accent}, ${C.accentDeep})` : C.lineSoft,
                    border: `1px solid ${i === 3 ? "transparent" : C.line}`,
                  }}
                />
                <div className="text-[10.5px] font-medium" style={{ color: i === 3 ? C.accent : C.muted }}>{days[i]}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: C.ink }}>
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-[15px] font-semibold tracking-tight">AI Prediction</h3>
          </div>
          <div className="mt-5 text-[13px] leading-relaxed" style={{ color: C.ink2 }}>
            At current pace, you'll be{" "}
            <span className="font-semibold" style={{ color: C.ink }}>interview‑ready in 6 weeks</span>{" "}
            and rank in the{" "}
            <span className="font-semibold" style={{ color: C.accent }}>top 5%</span>{" "}
            of your cohort.
          </div>
          <div className="mt-5 space-y-3">
            <PredictBar label="Interview Rate" value={73} color={C.accent} />
            <PredictBar label="Offer Probability" value={58} color={C.indigo} />
            <PredictBar label="Learning Momentum" value={88} color={C.good} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function PredictBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px] mb-1.5">
        <span style={{ color: C.ink2 }}>{label}</span>
        <span className="font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.lineSoft }}>
        <motion.div
          initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ============ BADGES ============ */
function BadgesSection() {
  const badges = [
    { icon: Flame, name: "27‑Day Streak", tier: "Legendary", unlocked: true, color: "#F97316", gradient: "linear-gradient(135deg, #F97316, #DC2626)" },
    { icon: Brain, name: "AI Explorer", tier: "Rare", unlocked: true, color: "#8B5CF6", gradient: "linear-gradient(135deg, #8B5CF6, #6366F1)" },
    { icon: Code2, name: "Code Craftsman", tier: "Rare", unlocked: true, color: "#0EA5E9", gradient: "linear-gradient(135deg, #0EA5E9, #0369A1)" },
    { icon: Trophy, name: "First Interview", tier: "Common", unlocked: true, color: "#16A34A", gradient: "linear-gradient(135deg, #22C55E, #15803D)" },
    { icon: Gem, name: "Skill Master", tier: "Legendary", unlocked: false, color: "#EC4899", gradient: "linear-gradient(135deg, #EC4899, #BE185D)" },
    { icon: Medal, name: "Hackathon Winner", tier: "Legendary", unlocked: false, color: "#EAB308", gradient: "linear-gradient(135deg, #FBBF24, #D97706)" },
    { icon: Crown, name: "Top 1% Learner", tier: "Legendary", unlocked: false, color: "#7C3AED", gradient: "linear-gradient(135deg, #A855F7, #6D28D9)" },
    { icon: Flag, name: "Career Ready", tier: "Rare", unlocked: false, color: C.accent, gradient: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})` },
  ];
  const tierColor = (t: string) =>
    t === "Legendary" ? { c: "#7C3AED", s: "#F3E8FF" } : t === "Rare" ? { c: C.indigo, s: C.indigoSoft } : { c: C.muted, s: C.lineSoft };
  return (
    <div>
      <SectionHeader
        eyebrow="Achievements"
        title="Your badge collection"
        sub="4 of 8 unlocked — 4 legendary badges await"
        action={
          <button className="text-[12.5px] font-semibold flex items-center gap-1" style={{ color: C.accent }}>
            View all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        }
      />
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {badges.map((b, i) => {
            const t = tierColor(b.tier);
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl p-4 flex flex-col items-center text-center relative overflow-hidden"
                style={{
                  background: b.unlocked ? C.panel : C.lineSoft,
                  border: `1px solid ${C.line}`,
                }}
              >
                {!b.unlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="h-3 w-3" style={{ color: C.muted }} />
                  </div>
                )}
                <div
                  className="h-14 w-14 rounded-2xl grid place-items-center relative"
                  style={{
                    background: b.unlocked ? b.gradient : "#E5E1D8",
                    boxShadow: b.unlocked ? `0 10px 24px -10px ${b.color}66` : "none",
                    filter: b.unlocked ? "none" : "grayscale(1)",
                    opacity: b.unlocked ? 1 : 0.5,
                  }}
                >
                  <b.icon className="h-6 w-6 text-white" strokeWidth={2} />
                  {b.unlocked && b.tier === "Legendary" && (
                    <motion.span
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ border: `2px solid ${b.color}` }}
                      animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                    />
                  )}
                </div>
                <div className="mt-3 text-[12px] font-semibold leading-tight" style={{ color: b.unlocked ? C.ink : C.muted }}>
                  {b.name}
                </div>
                <span className="mt-1.5 text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: t.s, color: t.c }}>
                  {b.tier}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ============ CAREER DNA ============ */
function CareerDNA() {
  const fits = [
    { role: "AI Engineer", pct: 92, icon: Brain, color: C.accent },
    { role: "ML Engineer", pct: 87, icon: Cpu, color: C.indigo },
    { role: "Data Scientist", pct: 84, icon: LineChart, color: C.good },
    { role: "Computer Vision", pct: 80, icon: Eye, color: C.purple },
    { role: "Backend Engineer", pct: 63, icon: Server, color: C.warn },
  ];
  return (
    <div>
      <SectionHeader
        eyebrow="Career DNA"
        title="Your AI‑predicted career fit"
        sub="Based on skills, interests, projects, and behavioral signals"
        action={
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{ background: C.ink, color: "#fff" }}>
            <Sparkles className="h-3 w-3" style={{ color: C.accent }} /> AI Analysis
          </span>
        }
      />
      <Card>
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-center">
          {/* Bars */}
          <div className="flex flex-col gap-5">
            {fits.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg grid place-items-center"
                         style={{ background: `${f.color}15` }}>
                      <f.icon className="h-4 w-4" style={{ color: f.color }} />
                    </div>
                    <div className="text-[14px] font-semibold">{f.role}</div>
                  </div>
                  <div className="text-[15px] font-semibold tabular-nums tracking-tight">
                    <CountUp to={f.pct} suffix="%" duration={1.2} />
                  </div>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.lineSoft }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${f.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1], delay: i * 0.08 + 0.1 }}
                    className="h-full rounded-full relative"
                    style={{
                      background: `linear-gradient(90deg, ${f.color}, ${f.color}DD)`,
                      boxShadow: `0 0 12px ${f.color}55`,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Top fit hexagon */}
          <div className="relative flex flex-col items-center">
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Hexagon className="h-48 w-48" style={{ color: C.accent, opacity: 0.15 }} strokeWidth={0.5} />
              </motion.div>
              <div className="h-48 w-48 grid place-items-center relative">
                <div
                  className="h-32 w-32 rounded-full grid place-items-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})`,
                    boxShadow: `0 20px 60px -20px ${C.accentGlow}`,
                  }}
                >
                  <Brain className="h-14 w-14 text-white" strokeWidth={1.5} />
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: `2px solid ${C.accent}` }}
                    animate={{ scale: [1, 1.2], opacity: [0.6, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-[10.5px] uppercase tracking-[0.16em] font-semibold" style={{ color: C.muted }}>
                Your top fit
              </div>
              <div className="mt-1 text-[20px] font-semibold tracking-tight">AI Engineer</div>
              <div className="mt-1 text-[12.5px]" style={{ color: C.accent }}>92% career alignment</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============ AI DOCK ============ */
function AIDock({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-40 w-[380px] rounded-2xl overflow-hidden"
            style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.25)" }}
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.line}` }}>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl grid place-items-center relative"
                     style={{ background: `linear-gradient(135deg, ${C.ink}, #26262c)` }}>
                  <Sparkles className="h-4 w-4 text-white" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full" style={{ background: C.accent }} />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold">ARTHAK AI</div>
                  <div className="text-[11px]" style={{ color: C.muted }}>Your career mentor</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-lg grid place-items-center hover:bg-black/[0.04]">
                <X className="h-4 w-4" style={{ color: C.muted }} />
              </button>
            </div>
            <div className="p-4 h-[260px] overflow-y-auto text-[13px]" style={{ color: C.ink2 }}>
              <div className="rounded-xl p-3.5 leading-relaxed" style={{ background: C.lineSoft }}>
                Hi! I noticed you're 57% through Frontend Engineering. Want me to suggest the next 3 lessons based on your goals?
              </div>
            </div>
            <div className="p-3 flex items-center gap-2" style={{ borderTop: `1px solid ${C.line}` }}>
              <input
                placeholder="Ask anything about your career…"
                className="flex-1 h-10 px-3 rounded-lg text-[13px] outline-none"
                style={{ background: C.lineSoft, color: C.ink }}
              />
              <button className="h-10 w-10 rounded-lg grid place-items-center text-white"
                      style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})` }}>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-6 right-6 z-40 h-14 pl-4 pr-5 rounded-full flex items-center gap-2 text-white"
        style={{
          background: `linear-gradient(135deg, ${C.ink} 0%, #26262c 100%)`,
          boxShadow: `0 20px 40px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset`,
        }}
      >
        <div className="h-8 w-8 rounded-full grid place-items-center relative"
             style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})` }}>
          <Bot className="h-4 w-4" />
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${C.accent}` }}
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </div>
        <span className="text-[13px] font-semibold">Ask AI</span>
      </motion.button>
    </>
  );
}

/* Legacy retained (unused) */
function _StreakCard() { return null; }

/* ============ LEGACY EXPORTS FOR PROFILE ROUTE ============ */

export const getColors = (warm: boolean) => ({
  bg: "#FAF7F2",
  surface: warm ? "#F3EDE6" : "#F1F5F9",
  card: warm ? "rgba(255, 255, 255, 0.82)" : "rgba(255, 255, 255, 0.72)",
  primary: "#6366F1", // Indigo
  secondary: "#06B6D4", // Cyan
  accent: "#EC4899", // Rose
  highlight: "#F59E0B", // Amber
  text: warm ? "#2D2621" : "#0F172A",
  muted: warm ? "#7E7265" : "#64748B",
  border: warm ? "rgba(126, 114, 101, 0.06)" : "rgba(15, 23, 42, 0.05)",
  borderStrong: warm ? "rgba(126, 114, 101, 0.12)" : "rgba(15, 23, 42, 0.1)",
});

export const ThemeContext = createContext({
  isWarm: false,
  setIsWarm: (v: boolean) => {},
  C: getColors(false),
});

export function MeshBackdrop() {
  const { C } = useContext(ThemeContext);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* High-tech dot pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] transition-colors duration-300" style={{
        backgroundImage: `radial-gradient(${C.text} 1.5px, transparent 1.5px)`,
        backgroundSize: "24px 24px",
      }} />
      
      {/* Slow moving soft mesh gradient blobs */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 25, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full blur-[140px] opacity-[0.05]"
        style={{ background: C.primary }}
      />
      <motion.div
        animate={{
          x: [0, -40, 50, 0],
          y: [0, 30, -40, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full blur-[140px] opacity-[0.04]"
        style={{ background: C.accent }}
      />
      <motion.div
        animate={{
          x: [0, 30, -45, 0],
          y: [0, 40, -20, 0],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full blur-[140px] opacity-[0.035]"
        style={{ background: C.secondary }}
      />
    </div>
  );
}

export function FloatingAI({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { C } = useContext(ThemeContext);
  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full text-white"
        style={{
          background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
          boxShadow: `0 12px 30px -5px ${C.primary}66`,
        }}
        aria-label="Open AI assistant"
      >
        <motion.span
          className="absolute inset-0 rounded-full animate-pulse"
          style={{ background: `radial-gradient(circle, ${C.secondary}33, transparent 70%)` }}
        />
        {open ? <X className="relative h-5 w-5" /> : <Bot className="relative h-5 w-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[92vw] overflow-hidden rounded-2xl border"
            style={{ 
              borderColor: C.borderStrong, 
              background: "rgba(255, 255, 255, 0.85)", 
              backdropFilter: "blur(24px)", 
              boxShadow: `0 30px 60px -15px rgba(15,23,42,0.1), 0 0 0 1px ${C.border}` 
            }}
          >
            <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: C.border }}>
              <div className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: C.text }}>Arthak AI Coach</p>
                <p className="text-[10px] font-bold" style={{ color: C.muted }}>Personalized for your AI Engineer path</p>
              </div>
            </div>
            <div className="max-h-[280px] space-y-3 overflow-y-auto px-4 py-4 text-sm">
              <div className="rounded-xl border px-3 py-2 bg-slate-50/50" style={{ borderColor: C.border, color: C.text }}>
                Hey Utkarsh — want me to plan your next 3 hours to hit the CNN milestone today?
              </div>
              <div className="ml-auto max-w-[80%] rounded-xl px-3 py-2 text-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                Yes, break it down step-by-step.
              </div>
            </div>
            <div className="flex items-center gap-2 border-t p-3" style={{ borderColor: C.border }}>
              <input placeholder="Ask anything about your career…" className="h-10 flex-1 rounded-xl border px-3 text-sm outline-none focus:border-zinc-300"
                style={{ borderColor: C.border, background: `${C.text}05`, color: C.text }} />
              <button className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-sm transition hover:opacity-90" 
                style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
