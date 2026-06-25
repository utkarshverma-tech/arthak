import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Compass,
  Map as MapIcon,
  Sparkles,
  FolderGit2,
  FileText,
  Briefcase,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  Circle,
  ArrowUpRight,
} from "lucide-react";

/* ---------- shared card shell ---------- */
function FeatureCard({
  children,
  className = "",
  index = 0,
  span = "",
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
  span?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-[24px] border border-[#E9E3D5] bg-[#FFFDF8]/90 backdrop-blur-sm p-7 shadow-[0_1px_2px_rgba(30,30,30,0.04),0_18px_40px_-24px_rgba(30,30,30,0.18)] transition-all duration-500 hover:shadow-[0_2px_4px_rgba(212,175,55,0.08),0_30px_60px_-20px_rgba(212,175,55,0.28)] hover:border-[#D4AF37]/40 ${span} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]"
        style={{ background: "radial-gradient(600px circle at var(--mx,50%) var(--my,0%), rgba(212,175,55,0.12), transparent 40%)" }}
      />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </motion.div>
  );
}

function CardHeader({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-[#D4AF37]/5 border border-[#D4AF37]/25 grid place-items-center text-[#B8941F]">
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <h3 className="text-[#1E1E1E] font-semibold text-lg tracking-tight">{title}</h3>
      </div>
      <p className="text-[#6B6B6B] text-[14.5px] leading-relaxed mb-5">{desc}</p>
    </>
  );
}

/* ---------- 1. Career Discovery ---------- */
function CareerDiscoveryVisual() {
  const paths = ["Engineering", "Design", "Data", "Business"];
  return (
    <div className="relative mt-auto h-36 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F3EDDF] border border-[#E9E3D5] overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2 gap-2 p-3">
        {paths.map((p, i) => (
          <motion.div
            key={p}
            animate={{ opacity: [0.4, 1, 0.4], borderColor: ["#E9E3D5", "#D4AF37", "#E9E3D5"] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5 }}
            className="rounded-lg border bg-[#FFFDF8] flex items-center justify-center text-[12px] font-medium text-[#1E1E1E]"
          >
            {p}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 2. Blueprint (abstract nodes) ---------- */
function BlueprintVisual() {
  return (
    <div className="relative mt-auto h-36 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F3EDDF] border border-[#E9E3D5] overflow-hidden">
      <svg viewBox="0 0 300 140" className="absolute inset-0 w-full h-full">
        {[
          [40, 70], [110, 35], [110, 105], [190, 70], [260, 40], [260, 100],
        ].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="6" fill="#D4AF37"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.25, duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
          />
        ))}
        {[
          ["M40,70 L110,35"], ["M40,70 L110,105"], ["M110,35 L190,70"],
          ["M110,105 L190,70"], ["M190,70 L260,40"], ["M190,70 L260,100"],
        ].map(([d], i) => (
          <motion.path key={i} d={d} stroke="#D4AF37" strokeWidth="1.5" fill="none" strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 1.2, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.5 }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ---------- 3. Skills ---------- */
function SkillsVisual() {
  const skills = ["Python", "JavaScript", "SQL", "Machine Learning", "Cloud"];
  return (
    <div className="relative mt-auto h-36 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F3EDDF] border border-[#E9E3D5] overflow-hidden p-3 flex flex-wrap gap-2 content-center justify-center">
      {skills.map((s, i) => (
        <motion.span
          key={s}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.35, duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
          className="px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#D4AF37]/30 text-[12px] font-medium text-[#1E1E1E] shadow-sm"
        >
          {s}
        </motion.span>
      ))}
    </div>
  );
}

/* ---------- 4. Projects ---------- */
function ProjectsVisual() {
  const items = [
    { name: "Portfolio Site", done: true },
    { name: "AI Chatbot", done: true },
    { name: "Data Dashboard", done: false },
  ];
  return (
    <div className="relative mt-auto h-36 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F3EDDF] border border-[#E9E3D5] overflow-hidden p-3 flex flex-col gap-2 justify-center">
      {items.map((it, i) => (
        <motion.div
          key={it.name}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#E9E3D5]"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4 }}
          >
            {it.done ? (
              <CheckCircle2 className="w-4 h-4 text-[#B8941F]" />
            ) : (
              <Circle className="w-4 h-4 text-[#6B6B6B]" />
            )}
          </motion.div>
          <span className="text-[12.5px] text-[#1E1E1E] font-medium flex-1">{it.name}</span>
          <span className="text-[10.5px] text-[#6B6B6B]">{it.done ? "Completed" : "In Progress"}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- 5. Resume score ---------- */
function ResumeScoreVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-50px" });
  const count = useMotionValue(45);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(45);
  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    if (inView) animate(count, 92, { duration: 2.2, ease: "easeOut" });
    return () => unsub();
  }, [inView, count, rounded]);
  return (
    <div ref={ref} className="relative mt-auto h-36 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F3EDDF] border border-[#E9E3D5] overflow-hidden p-4 flex items-center gap-4">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="34" stroke="#E9E3D5" strokeWidth="7" fill="none" />
          <motion.circle
            cx="40" cy="40" r="34" stroke="#D4AF37" strokeWidth="7" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0.45 }}
            animate={inView ? { pathLength: 0.92 } : {}}
            transition={{ duration: 2.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-[#1E1E1E] font-bold text-lg">{display}</div>
      </div>
      <div className="flex-1">
        <div className="text-[12px] text-[#6B6B6B] mb-1">Resume Score</div>
        <div className="text-[14px] font-semibold text-[#1E1E1E]">ATS Optimized</div>
        <div className="text-[11.5px] text-[#B8941F] mt-1">+47 points improved</div>
      </div>
    </div>
  );
}

/* ---------- 6. Opportunities ---------- */
function OpportunitiesVisual() {
  const opps = ["Google Internship", "Hackathon 2026", "Microsoft SWE", "TCS CodeVita"];
  return (
    <div className="relative mt-auto h-36 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F3EDDF] border border-[#E9E3D5] overflow-hidden p-3 flex flex-col gap-2 justify-center">
      {opps.map((o, i) => (
        <motion.div
          key={o}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: i * 0.4, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FFFDF8] border border-[#E9E3D5]"
        >
          <span className="text-[12.5px] text-[#1E1E1E] font-medium">{o}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#B8941F]" />
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- 7. Progress timeline ---------- */
function ProgressVisual() {
  const stages = ["Beginner", "Intermediate", "Advanced", "Ready"];
  return (
    <div className="relative mt-auto h-36 rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F3EDDF] border border-[#E9E3D5] overflow-hidden p-4 flex flex-col justify-center gap-3">
      <div className="relative h-2 rounded-full bg-[#E9E3D5] overflow-hidden">
        <motion.div
          initial={{ width: "10%" }}
          whileInView={{ width: "78%" }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-full"
        />
      </div>
      <div className="flex justify-between text-[10.5px] text-[#6B6B6B] font-medium">
        {stages.map((s) => <span key={s}>{s}</span>)}
      </div>
    </div>
  );
}

/* ---------- 8. Dashboard ---------- */
function DashboardVisual() {
  const widgets = [
    { label: "Career Score", value: "8.4" },
    { label: "Skills", value: "12/18" },
    { label: "Projects", value: "5" },
    { label: "Resume", value: "92" },
    { label: "Opportunities", value: "24" },
    { label: "Weekly Goals", value: "4/5" },
  ];
  return (
    <div className="relative mt-auto rounded-xl bg-gradient-to-br from-[#FAF7F2] to-[#F3EDDF] border border-[#E9E3D5] overflow-hidden p-3">
      <div className="grid grid-cols-3 gap-2">
        {widgets.map((w, i) => (
          <motion.div
            key={w.label}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
            className="rounded-lg bg-[#FFFDF8] border border-[#E9E3D5] p-2.5"
          >
            <div className="text-[9.5px] text-[#6B6B6B] uppercase tracking-wider mb-1">{w.label}</div>
            <div className="text-[15px] font-bold text-[#1E1E1E]">{w.value}</div>
            <motion.div
              className="h-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] mt-1.5"
              animate={{ width: ["30%", "85%", "30%"] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Section ---------- */
export function FeaturesSection() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-feature-card]");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const features = [
    { icon: Compass, title: "Career Discovery", desc: "Understand your strengths, interests, and goals to discover the most suitable career path.", visual: <CareerDiscoveryVisual /> },
    { icon: MapIcon, title: "Personalized Career Blueprint", desc: "Receive a unique step-by-step career journey tailored specifically to you.", visual: <BlueprintVisual /> },
    { icon: Sparkles, title: "Skill Development", desc: "Learn the exact skills needed for your chosen career path.", visual: <SkillsVisual /> },
    { icon: FolderGit2, title: "Project-Based Learning", desc: "Build real-world projects that strengthen your portfolio and practical experience.", visual: <ProjectsVisual /> },
    { icon: FileText, title: "Resume Intelligence", desc: "Create professional resumes optimized for recruiters and ATS systems.", visual: <ResumeScoreVisual /> },
    { icon: Briefcase, title: "Opportunity Hub", desc: "Discover internships, hackathons, competitions, and career opportunities.", visual: <OpportunitiesVisual /> },
    { icon: TrendingUp, title: "Career Progress Tracking", desc: "Track your growth from beginner to career-ready through measurable milestones.", visual: <ProgressVisual /> },
    { icon: LayoutDashboard, title: "Career Command Center", desc: "Manage your entire career journey from a single dashboard.", visual: <DashboardVisual /> },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-[#FAF7F2] overflow-hidden" onMouseMove={handleMouseMove}>
      {/* background ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.10), transparent 60%)" }}
        />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent 60%)" }}
        />
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#D4AF37]/30"
            style={{ left: `${(i * 83) % 100}%`, top: `${(i * 47) % 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#FFFDF8] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="text-[11.5px] tracking-[0.18em] font-semibold text-[#B8941F] uppercase">Features</span>
          </div>
          <h2 className="text-[34px] sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1E1E1E] leading-[1.05] max-w-4xl mx-auto">
            Everything You Need To <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent">Build Your Career</span>
          </h2>
          <p className="mt-6 text-[#6B6B6B] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            One platform. One journey. Everything you need from career discovery to career readiness.
          </p>
        </motion.div>

        {/* bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {features.map((f, i) => (
            <div key={f.title} data-feature-card className="contents">
              <FeatureCard index={i}>
                <CardHeader icon={f.icon} title={f.title} desc={f.desc} />
                {f.visual}
              </FeatureCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;