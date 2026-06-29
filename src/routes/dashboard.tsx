import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Target, TrendingUp, BookOpen, FileText, Flame, Trophy, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <ProtectedRoute>
      <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
        <Header />
        <DashboardContent />
      </div>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const first = user?.fullName?.split(" ")[0] || "there";

  const stats = [
    { icon: Flame, label: "Day streak", value: "7", tint: "#EF4444" },
    { icon: Sparkles, label: "XP earned", value: "240", tint: "#F59E0B" },
    { icon: Trophy, label: "Milestones", value: "3", tint: "#14B8A6" },
    { icon: TrendingUp, label: "ATS score", value: "82", tint: "#3B82F6" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: "rgba(212,175,55,0.4)", color: "#9C7715", background: "rgba(212,175,55,0.08)" }}>
          <Sparkles className="h-3 w-3" /> Career Operating System
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>
          Welcome back, {first} 👋
        </h1>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "#475569" }}>
          Here's your roadmap progress, resume status and what to do next.
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border bg-white/70 p-4"
            style={{ borderColor: "rgba(15,23,42,0.08)", boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: "#64748B" }}>{s.label}</span>
              <s.icon className="h-4 w-4" style={{ color: s.tint }} />
            </div>
            <p className="mt-2 text-2xl font-semibold" style={{ color: "#0F172A" }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Your Roadmap" icon={Target} cta="Open roadmap" body="AI Engineer · 32% complete — keep going, you're crushing it." />
        <Card title="Resume Intelligence" icon={FileText} cta="Improve resume" body="ATS score 82 · 3 suggestions to push you above 90." />
        <Card title="Learn Today" icon={BookOpen} cta="Resume lesson" body="Continue: Foundations of Machine Learning · Lesson 4." />
      </div>
    </main>
  );
}

function Card({ title, icon: Icon, body, cta }: { title: string; icon: React.ComponentType<{ className?: string }>; body: string; cta: string }) {
  return (
    <div className="group rounded-2xl border bg-white/70 p-5 transition hover:-translate-y-0.5 hover:shadow-lg" style={{ borderColor: "rgba(15,23,42,0.08)" }}>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, #14B8A6, #3B82F6)" }}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-base font-semibold" style={{ color: "#0F172A" }}>{title}</h3>
      </div>
      <p className="mt-3 text-sm" style={{ color: "#475569" }}>{body}</p>
      <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#0F766E" }}>
        {cta} <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
