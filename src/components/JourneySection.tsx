import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Frown,
  Target,
  Map,
  BookOpen,
  Wrench,
  FileText,
  BarChart3,
  Trophy,
  Briefcase,
  Wallet,
} from "lucide-react";

const steps = [
  { emoji: "😕", icon: Frown, title: "Confused Student", desc: "You're stuck. No idea where to start or what to pick.", color: "#94A3B8" },
  { emoji: "🎯", icon: Target, title: "Career Assessment", desc: "AI-powered test maps your skills, interests & strengths.", color: "#14B8A6" },
  { emoji: "🛣️", icon: Map, title: "Choose Roadmap", desc: "Get a personalised step-by-step path to your goal.", color: "#3B82F6" },
  { emoji: "📚", icon: BookOpen, title: "Learn Skills", desc: "Curated lessons, no more random YouTube rabbit holes.", color: "#8B5CF6" },
  { emoji: "🛠️", icon: Wrench, title: "Build Projects", desc: "Real-world projects that prove what you can actually do.", color: "#F59E0B" },
  { emoji: "📄", icon: FileText, title: "Resume Builder", desc: "Auto-generate a recruiter-ready resume from your work.", color: "#EC4899" },
  { emoji: "📊", icon: BarChart3, title: "ATS Ready", desc: "Score-checked & optimised to pass every ATS filter.", color: "#10B981" },
  { emoji: "🏆", icon: Trophy, title: "Hackathon", desc: "Compete, network, and stand out from the crowd.", color: "#F97316" },
  { emoji: "💼", icon: Briefcase, title: "Internship", desc: "Land internships that match your skills & goals.", color: "#6366F1" },
  { emoji: "💰", icon: Wallet, title: "Earn", desc: "Convert skills into income — jobs, freelance, founder.", color: "#22C55E" },
];

export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] py-24 md:py-32">
      {/* Background grid + glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.18), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F766E]">
            The Arthak Journey
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-[#0F172A] md:text-6xl">
            Your Journey From{" "}
            <span className="bg-gradient-to-r from-[#EF4444] to-[#F59E0B] bg-clip-text text-transparent">
              Confusion
            </span>{" "}
            To{" "}
            <span className="bg-gradient-to-r from-[#14B8A6] to-[#22C55E] bg-clip-text text-transparent">
              Career Success
            </span>
          </h2>
          <p className="mt-5 text-lg text-[#64748B]">
            Ten clear steps. One simple path. From lost to legendary.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Background track */}
          <div className="absolute left-1/2 top-0 hidden h-full w-[3px] -translate-x-1/2 rounded-full bg-[#0F172A]/8 md:block" />
          {/* Animated fill */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-1/2 top-0 hidden w-[3px] -translate-x-1/2 rounded-full md:block"
          >
            <div className="h-full w-full rounded-full bg-gradient-to-b from-[#14B8A6] via-[#3B82F6] to-[#22C55E] shadow-[0_0_20px_rgba(20,184,166,0.6)]" />
          </motion.div>

          {/* Mobile track */}
          <div className="absolute left-6 top-0 h-full w-[3px] rounded-full bg-[#0F172A]/8 md:hidden" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-6 top-0 w-[3px] rounded-full bg-gradient-to-b from-[#14B8A6] via-[#3B82F6] to-[#22C55E] shadow-[0_0_20px_rgba(20,184,166,0.6)] md:hidden"
          />

          <div className="space-y-12 md:space-y-20">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Card */}
                  <div className={`w-full pl-20 md:w-[calc(50%-3.5rem)] md:pl-0 ${isLeft ? "md:pr-14 md:text-right" : "md:pl-14 md:text-left"}`}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group relative overflow-hidden rounded-2xl border border-[#0F172A]/8 bg-white p-6 shadow-[0_10px_40px_-15px_rgba(15,23,42,0.15)]"
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-1 opacity-80"
                        style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
                      />
                      <div
                        className={`mb-3 flex items-center gap-3 ${isLeft ? "md:justify-end" : "md:justify-start"}`}
                      >
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: step.color }}>
                          Step {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#0F172A]">{step.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[#64748B]">{step.desc}</p>
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                        style={{ background: step.color }}
                      />
                    </motion.div>
                  </div>

                  {/* Node */}
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
                    className="absolute left-6 z-10 -translate-x-1/2 md:left-1/2"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: step.color }}
                      />
                      <div
                        className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#FAF7F2] text-2xl shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}
                      >
                        <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Spacer for other side (desktop) */}
                  <div className="hidden md:block md:w-[calc(50%-3.5rem)]" />
                </motion.div>
              );
            })}
          </div>

          {/* End marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mt-16 flex justify-center"
          >
            <div className="rounded-full bg-gradient-to-r from-[#14B8A6] to-[#22C55E] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(34,197,94,0.6)]">
              🚀 You made it. Welcome to Career Success.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}