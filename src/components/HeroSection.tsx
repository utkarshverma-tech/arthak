import { motion } from "framer-motion";
import {
  Compass,
  Map,
  Hammer,
  FileText,
  ShieldCheck,
  Trophy,
  Briefcase,
  Coins,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { InteractiveGrid } from "./InteractiveGrid";

const NODES = [
  { icon: Compass, label: "Career Assessment", angle: 0 },
  { icon: Map, label: "Roadmap", angle: 45 },
  { icon: Hammer, label: "Projects", angle: 90 },
  { icon: FileText, label: "Resume", angle: 135 },
  { icon: ShieldCheck, label: "ATS Score", angle: 180 },
  { icon: Trophy, label: "Hackathon", angle: 225 },
  { icon: Briefcase, label: "Internship", angle: 270 },
  { icon: Coins, label: "Earnings", angle: 315 },
];

const TRUST = [
  { value: "20+", label: "Career Paths" },
  { value: "500+", label: "Skills" },
  { value: "100+", label: "Roadmaps" },
  { value: "ATS", label: "Resume Builder" },
];

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#FAF7F2", color: "#0F172A" }}
    >
      {/* Ambient gradient glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #99F0E4 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #BFD7FF 0%, transparent 70%)" }}
      />
      {/* Interactive grid */}
      <InteractiveGrid />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28 pointer-events-none">
        {/* LEFT */}
        <div className="pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide"
            style={{
              borderColor: "rgba(13,148,136,0.35)",
              backgroundColor: "rgba(20,184,166,0.12)",
              color: "#0D9488",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Career Operating System for Students
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            From Confused Student
            <br />
            To{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #14B8A6, #3B82F6)",
              }}
            >
              Career Ready
            </span>{" "}
            Professional.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: "#475569" }}
          >
            Discover the right career path, follow structured roadmaps, build
            real-world projects, optimize your resume, participate in
            hackathons, and become internship ready.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg transition-all hover:shadow-xl hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #14B8A6, #0D9488)",
                color: "#FFFFFF",
                boxShadow: "0 10px 30px -10px rgba(20,184,166,0.5)",
              }}
            >
              Start Career Assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors hover:bg-black/5"
              style={{ borderColor: "rgba(15,23,42,0.15)", color: "#0F172A" }}
            >
              Explore Roadmaps
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-4"
            style={{ borderColor: "rgba(15,23,42,0.1)" }}
          >
            {TRUST.map((t) => (
              <div key={t.label}>
                <div
                  className="text-xl font-semibold"
                  style={{ color: "#0F172A" }}
                >
                  {t.value}
                </div>
                <div className="text-xs" style={{ color: "#64748B" }}>
                  {t.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <CareerJourney />
      </div>
    </section>
  );
}

function CareerJourney() {
  const size = 520;
  const radius = 210;
  const center = size / 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      className="relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center pointer-events-auto"
    >
      {/* Slow rotating orbit container (CSS keyframes for perfect sync with counter-rotation) */}
      <style>{`
        @keyframes arthak-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes arthak-orbit-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      `}</style>
      <div
        className="absolute inset-0"
        style={{ animation: "arthak-orbit 60s linear infinite" }}
      >
        {/* Orbit rings (SVG) */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#ring)"
            strokeWidth="1.25"
            strokeDasharray="4 6"
          />
          <circle
            cx={center}
            cy={center}
            r={radius - 50}
            fill="none"
            stroke="rgba(15,23,42,0.1)"
            strokeWidth="1"
          />
        </svg>

        {/* Nodes positioned on orbit */}
        {NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = center + radius * Math.cos(rad);
          const y = center + radius * Math.sin(rad);
          const Icon = node.icon;
          return (
            <div
              key={node.label}
              className="absolute"
              style={{
                left: `${(x / size) * 100}%`,
                top: `${(y / size) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div style={{ animation: "arthak-orbit-rev 60s linear infinite" }}>
                <motion.div
                  whileHover="hover"
                  animate="initial"
                  initial="initial"
                  variants={{
                    initial: {
                      y: 0,
                      scale: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.92)",
                      borderColor: "rgba(20, 184, 166, 0.3)",
                      boxShadow: "0 10px 24px -10px rgba(15,23,42,0.18)",
                    },
                    hover: {
                      y: -12,
                      scale: 1.06,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      borderColor: "rgba(20, 184, 166, 0.75)",
                      boxShadow: "0 25px 40px -10px rgba(20,184,166,0.35), 0 8px 20px -6px rgba(59,130,246,0.25)",
                    },
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 22 }}
                  className="flex cursor-pointer items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 backdrop-blur-md"
                >
                  <motion.span
                    className="flex h-7.5 w-7.5 items-center justify-center rounded-lg transition-colors duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(59,130,246,0.18))",
                      color: "#0D9488",
                    }}
                    variants={{
                      hover: {
                        scale: 1.1,
                        background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.span>
                  <motion.span
                    className="whitespace-nowrap text-xs font-semibold tracking-wide transition-colors duration-300"
                    style={{ color: "#0F172A" }}
                    variants={{
                      hover: {
                        color: "#0D9488",
                      },
                    }}
                  >
                    {node.label}
                  </motion.span>
                </motion.div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Center: Student figure */}
      <div
        className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(20,184,166,0.28), rgba(59,130,246,0.14) 60%, transparent 80%)",
        }}
      >
        <div
          className="flex h-32 w-32 items-center justify-center rounded-full border shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)",
            borderColor: "rgba(20,184,166,0.45)",
            boxShadow:
              "0 20px 60px -20px rgba(20,184,166,0.45), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <GraduationCap
            className="h-14 w-14"
            style={{ color: "#0D9488" }}
            strokeWidth={1.5}
          />
        </div>
        {/* pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: "rgba(20,184,166,0.5)" }}
          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default HeroSection;