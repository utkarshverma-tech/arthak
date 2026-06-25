import { motion } from "framer-motion";
import { Compass, Map, FileText, Briefcase } from "lucide-react";
import careerImg from "@/assets/problem-career.jpg";
import roadmapImg from "@/assets/problem-roadmap.jpg";
import resumeImg from "@/assets/problem-resume.jpg";
import internshipImg from "@/assets/problem-internship.jpg";

const problems = [
  {
    icon: Compass,
    emoji: "😕",
    title: "Don't know which career to choose",
    desc: "Hundreds of paths, zero clarity. Most students pick based on peer pressure, not passion or potential.",
    accent: "#14B8A6",
    image: careerImg,
  },
  {
    icon: Map,
    emoji: "🛣️",
    title: "No clear roadmap",
    desc: "Random YouTube tutorials and scattered courses lead nowhere. You need a step-by-step plan built for you.",
    accent: "#3B82F6",
    image: roadmapImg,
  },
  {
    icon: FileText,
    emoji: "📄",
    title: "Weak resume",
    desc: "Generic templates that fail ATS scans. Recruiters spend 6 seconds — your resume needs to win them instantly.",
    accent: "#F59E0B",
    image: resumeImg,
  },
  {
    icon: Briefcase,
    emoji: "💼",
    title: "No internship opportunities",
    desc: "Without experience, no offers. Without offers, no experience. Time to break that loop with real projects.",
    accent: "#EC4899",
    image: internshipImg,
  },
];

export function ProblemSection() {
  return (
    <section
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-14 sm:mb-20"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium mb-5"
            style={{
              borderColor: "rgba(15, 23, 42, 0.1)",
              backgroundColor: "#FFFFFF",
              color: "#64748B",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#EC4899" }} />
            The student reality
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: "#0F172A" }}
          >
            Sound{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              familiar?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg" style={{ color: "#64748B" }}>
            Every ambitious student hits the same four walls. Arthak tears them down.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-xl"
                style={{
                  borderColor: "rgba(15, 23, 42, 0.08)",
                  boxShadow: "0 4px 20px -8px rgba(15, 23, 42, 0.08)",
                }}
              >
                {/* image */}
                <div
                  className="relative aspect-[5/3] w-full overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent}10, ${p.accent}05)`,
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-1"
                    style={{ backgroundColor: p.accent }}
                  />
                </div>

                <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${p.accent}15`,
                      color: p.accent,
                    }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <span className="text-2xl opacity-80" aria-hidden>
                    {p.emoji}
                  </span>
                </div>

                <h3
                  className="text-base sm:text-lg font-semibold leading-snug mb-2"
                  style={{ color: "#0F172A" }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                  {p.desc}
                </p>

                <div
                  className="mt-5 flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: p.accent }}
                >
                  <span className="h-1 w-1 rounded-full" style={{ backgroundColor: p.accent }} />
                  We solve this
                </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}