import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Search,
  Sparkles,
  Shield,
  Zap,
  Download,
  Eye,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Briefcase,
  Brain,
  Code2,
  Palette,
  Cloud,
  Lock,
  LineChart,
  Layers,
  Star,
  TrendingUp,
  GraduationCap,
  FileText,
} from "lucide-react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/resume-builder")({
  head: () => ({
    meta: [
      { title: "Resume Builder — Arthak" },
      { name: "description", content: "Discover ATS-optimized, career-specific resume templates built for students, freshers and professionals. From Confusion to Career — with Arthak." },
      { property: "og:title", content: "Resume Builder — Arthak" },
      { property: "og:description", content: "Discover premium, ATS-optimized resume templates built for every career path." },
    ],
  }),
  component: ResumeBuilderPage,
});

// ─────────────────────────── Data ───────────────────────────
const FILTERS = [
  "All", "Student", "Fresher", "Software Engineer", "AI Engineer",
  "Data Scientist", "Cybersecurity", "Cloud Engineer", "Product Manager",
  "UI UX Designer", "Business", "Designer",
];

type Template = {
  id: string;
  name: string;
  category: string;
  ats: number;
  recommendedFor: string;
  accent: string; // gradient
  featured?: boolean;
};

const TEMPLATES: Template[] = [
  { id: "professional", name: "Professional", category: "Business", ats: 98, recommendedFor: "Corporate roles", accent: "from-indigo-500 to-cyan-500", featured: true },
  { id: "executive", name: "Executive", category: "Business", ats: 96, recommendedFor: "Senior leadership", accent: "from-amber-500 to-rose-500", featured: true },
  { id: "modern", name: "Modern", category: "Fresher", ats: 95, recommendedFor: "Freshers & grads", accent: "from-violet-500 to-fuchsia-500", featured: true },
  { id: "minimal", name: "Minimal", category: "Student", ats: 97, recommendedFor: "Students", accent: "from-slate-500 to-zinc-400", featured: true },
  { id: "tech", name: "Tech", category: "Software Engineer", ats: 99, recommendedFor: "SDEs & engineers", accent: "from-cyan-500 to-blue-600", featured: true },
  { id: "creative", name: "Creative", category: "Designer", ats: 92, recommendedFor: "Designers", accent: "from-pink-500 to-orange-500", featured: true },
  { id: "ai-engineer", name: "AI Engineer", category: "AI Engineer", ats: 97, recommendedFor: "AI / ML roles", accent: "from-emerald-500 to-teal-500" },
  { id: "data-scientist", name: "Data Scientist", category: "Data Scientist", ats: 96, recommendedFor: "Data roles", accent: "from-sky-500 to-indigo-600" },
  { id: "cyber", name: "Cybersecurity", category: "Cybersecurity", ats: 95, recommendedFor: "Security analysts", accent: "from-red-500 to-amber-500" },
  { id: "cloud", name: "Cloud Engineer", category: "Cloud Engineer", ats: 96, recommendedFor: "DevOps & Cloud", accent: "from-blue-500 to-cyan-400" },
  { id: "pm", name: "Product Manager", category: "Product Manager", ats: 94, recommendedFor: "PM roles", accent: "from-purple-500 to-indigo-500" },
  { id: "uiux", name: "UI UX", category: "UI UX Designer", ats: 93, recommendedFor: "Designers", accent: "from-fuchsia-500 to-pink-500" },
  { id: "student-starter", name: "Student Starter", category: "Student", ats: 94, recommendedFor: "First resume", accent: "from-teal-500 to-emerald-500" },
  { id: "fresher-pro", name: "Fresher Pro", category: "Fresher", ats: 96, recommendedFor: "Campus placements", accent: "from-indigo-500 to-violet-500" },
  { id: "business-elite", name: "Business Elite", category: "Business", ats: 95, recommendedFor: "MBA & analysts", accent: "from-yellow-500 to-orange-500" },
  { id: "designer-folio", name: "Designer Folio", category: "Designer", ats: 91, recommendedFor: "Portfolio-led", accent: "from-rose-500 to-purple-500" },
];

const CAREER_CARDS = [
  { name: "AI Engineer", icon: Brain, salary: "₹18–45 LPA", skills: ["Python", "PyTorch", "LLMs"], match: 96, template: "AI Engineer" },
  { name: "Data Scientist", icon: LineChart, salary: "₹14–38 LPA", skills: ["Python", "SQL", "ML"], match: 94, template: "Data Scientist" },
  { name: "Frontend Developer", icon: Code2, salary: "₹8–28 LPA", skills: ["React", "TS", "CSS"], match: 92, template: "Tech" },
  { name: "Backend Developer", icon: Layers, salary: "₹10–32 LPA", skills: ["Node", "DBs", "APIs"], match: 93, template: "Tech" },
  { name: "Cybersecurity Analyst", icon: Lock, salary: "₹9–30 LPA", skills: ["Networks", "SIEM", "Pentest"], match: 91, template: "Cybersecurity" },
  { name: "Cloud Engineer", icon: Cloud, salary: "₹12–34 LPA", skills: ["AWS", "K8s", "Terraform"], match: 92, template: "Cloud Engineer" },
  { name: "Product Manager", icon: Briefcase, salary: "₹16–42 LPA", skills: ["Strategy", "Analytics", "UX"], match: 90, template: "Product Manager" },
  { name: "UI UX Designer", icon: Palette, salary: "₹7–24 LPA", skills: ["Figma", "Research", "Systems"], match: 89, template: "UI UX" },
];

const SUCCESS_EXAMPLES = [
  { name: "Software Engineer", company: "Hired at Google", template: "Tech" },
  { name: "Data Scientist", company: "Hired at Microsoft", template: "Data Scientist" },
  { name: "Machine Learning", company: "Hired at OpenAI", template: "AI Engineer" },
  { name: "Cybersecurity", company: "Hired at Palo Alto", template: "Cybersecurity" },
  { name: "UI UX", company: "Hired at Figma", template: "UI UX" },
];

const WHY_ARTHAK = [
  { icon: Shield, title: "ATS Optimized Templates", desc: "Pass every screener with 95%+ ATS scores baked into every template." },
  { icon: Sparkles, title: "AI Resume Suggestions", desc: "Smart bullet rewrites, keyword targeting and tone polish — in one click." },
  { icon: GraduationCap, title: "Career Based Builder", desc: "Templates designed per role — AI, Data, PM, Design, Cloud, Cyber." },
  { icon: Download, title: "One Click PDF Export", desc: "Pixel-perfect PDF, DOCX and shareable links. No formatting surprises." },
  { icon: Layers, title: "Portfolio Integration", desc: "Auto-sync projects, GitHub, and case studies into a live portfolio." },
  { icon: Briefcase, title: "Internship Ready Profiles", desc: "Profiles tuned for recruiter discovery on the Arthak internship network." },
];

const COMPARE = [
  { feature: "Career-Specific Templates", us: true, them: false },
  { feature: "Resume + Roadmap Integration", us: true, them: false },
  { feature: "AI Career Guidance", us: true, them: false },
  { feature: "Live ATS Analysis", us: true, them: false },
  { feature: "Internship Ecosystem", us: true, them: false },
  { feature: "Student-Focused Design", us: true, them: false },
];

const STATS = [
  { value: 50, suffix: "+", label: "Premium Templates" },
  { value: 20, suffix: "+", label: "Career Paths" },
  { value: 95, suffix: "%", label: "ATS Optimization" },
  { value: 1000, suffix: "+", label: "Students Hired" },
];

// ─────────────────────── Helpers ───────────────────────
function useCounter(target: number, inView: boolean, duration = 1500) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, duration]);
  return v;
}

function StatItem({ stat }: { stat: typeof STATS[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const val = useCounter(stat.value, inView);
  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-[#0F172A] to-[#475569] bg-clip-text text-transparent">
        {val}{stat.suffix}
      </div>
      <div className="mt-2 text-sm text-[#475569] font-medium">{stat.label}</div>
    </div>
  );
}

// High-fidelity realistic resume preview component
function ResumePreview({ type }: { type: "modern" | "professional" | "ai" }) {
  if (type === "professional") {
    return (
      <div className="relative w-full aspect-[1/1.4] rounded-xl bg-[#FCFAF7] border border-[#0f172a]/10 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.18)] p-6 flex flex-col justify-between text-left select-none overflow-hidden">
        {/* Subtle top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-blue-500" />
        
        <div>
          {/* Header */}
          <div className="border-b border-[#0f172a]/10 pb-4 text-center">
            <h4 className="text-xl font-bold tracking-tight text-[#0F172A]">ARAVIND SHARMA</h4>
            <p className="text-xs text-[#0D9488] font-semibold tracking-wider mt-1">SENIOR PRODUCT MANAGER</p>
            <div className="mt-2.5 flex justify-center gap-3 text-[9px] text-[#64748B] font-medium">
              <span>aravind@arthak.com</span>
              <span>•</span>
              <span>+91 98765 43210</span>
              <span>•</span>
              <span>Bengaluru, India</span>
            </div>
          </div>

          {/* Body */}
          <div className="mt-5 space-y-4">
            {/* Experience */}
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#0D9488] border-b border-[#0D9488]/10 pb-1">EXPERIENCE</h5>
              <div className="mt-2.5 space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-[#0F172A]">
                    <span>Product Lead — Arthak</span>
                    <span className="text-[9px] font-semibold text-[#64748B]">2024 – Present</span>
                  </div>
                  <ul className="mt-1 list-disc list-outside pl-3.5 space-y-1 text-[9px] text-[#475569] leading-relaxed">
                    <li>Led the launch of Arthak AI Career Advisor, increasing monthly active users by 140%.</li>
                    <li>Designed ATS-friendly resume builder resulting in a 4.2x higher interview call rate for students.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-[#0F172A]">
                    <span>Associate PM — TechCorp</span>
                    <span className="text-[9px] font-semibold text-[#64748B]">2022 – 2024</span>
                  </div>
                  <ul className="mt-1 list-disc list-outside pl-3.5 space-y-1 text-[9px] text-[#475569] leading-relaxed">
                    <li>Collaborated on building a SaaS dashboard using React and Tailwind CSS.</li>
                    <li>Reduced product user onboarding churn by 22% using data-driven analytics.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#0D9488] border-b border-[#0D9488]/10 pb-1">EDUCATION</h5>
              <div className="mt-2 flex justify-between text-[10px] font-bold text-[#0F172A]">
                <span>B.Tech in Computer Science — BITS Pilani</span>
                <span className="text-[9px] font-semibold text-[#64748B]">GPA: 9.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Footer */}
        <div className="mt-4 pt-3 border-t border-[#0f172a]/10">
          <div className="flex flex-wrap gap-1">
            {["Product Roadmap", "UI/UX Strategy", "Agile", "User Analytics", "SaaS Growth"].map((s) => (
              <span key={s} className="text-[8px] font-semibold px-2 py-0.5 rounded-md bg-[#14B8A6]/8 text-[#0D9488] border border-[#14B8A6]/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "modern") {
    return (
      <div className="relative w-full aspect-[1/1.4] rounded-xl bg-white border border-[#0f172a]/10 shadow-[0_20px_45px_-15px_rgba(15,23,42,0.12)] p-6 flex flex-col justify-between text-left select-none overflow-hidden">
        {/* Left vertical color bar */}
        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-b from-indigo-500 to-purple-500" />
        
        <div className="pl-1">
          {/* Header */}
          <div>
            <h4 className="text-lg font-bold tracking-tight text-[#0F172A]">Rohan Verma</h4>
            <p className="text-xs text-indigo-600 font-semibold tracking-wide">Full Stack Developer</p>
            <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-[8px] text-[#64748B] font-medium">
              <span>rohan@arthak.com</span>
              <span>•</span>
              <span>+91 99988 77766</span>
              <span>•</span>
              <span>Delhi, India</span>
            </div>
          </div>

          {/* Body */}
          <div className="mt-5 space-y-4">
            {/* Experience */}
            <div>
              <h5 className="text-[9px] font-bold uppercase tracking-wider text-[#0F172A] border-b border-black/5 pb-1">EXPERIENCE</h5>
              <div className="mt-2.5 space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-[#0F172A]">
                    <span>Frontend Intern — WebStudio</span>
                    <span className="text-[8px] font-semibold text-[#64748B]">2025 – Present</span>
                  </div>
                  <ul className="mt-1 list-disc list-outside pl-3 space-y-0.5 text-[8.5px] text-[#475569] leading-relaxed">
                    <li>Developed responsive interface layouts for 12 client portfolios using React.</li>
                    <li>Improved core web vitals and overall page speed score by 35%.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div>
              <h5 className="text-[9px] font-bold uppercase tracking-wider text-[#0F172A] border-b border-black/5 pb-1">PROJECTS</h5>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] font-bold text-[#0F172A]">
                  <span>Arthak Resume Builder</span>
                  <span className="text-[8px] font-semibold text-indigo-600">TypeScript, Vite</span>
                </div>
                <p className="mt-1 text-[8.5px] text-[#475569] leading-relaxed">Built drag-and-drop template editor with PDF generation support.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Education */}
        <div className="pl-1 space-y-2 mt-2">
          <div className="flex flex-wrap gap-1">
            {["JavaScript", "React", "Node.js", "TypeScript", "Tailwind"].map((s) => (
              <span key={s} className="text-[8px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Type === "ai"
  return (
    <div className="relative w-full aspect-[1/1.4] rounded-xl bg-white border border-[#0f172a]/10 shadow-[0_20px_45px_-15px_rgba(15,23,42,0.12)] p-6 flex flex-col justify-between text-left select-none overflow-hidden">
      {/* Dynamic top corner tag */}
      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
        <div className="absolute top-4 right-[-32px] w-32 bg-emerald-500 text-white text-[7px] font-bold text-center py-1 rotate-[45deg] uppercase tracking-wider shadow-sm">
          99% ATS
        </div>
      </div>

      <div>
        {/* Header */}
        <div>
          <h4 className="text-lg font-bold tracking-tight text-[#0F172A]">Tanmay Sen</h4>
          <p className="text-xs text-emerald-600 font-semibold tracking-wide">AI Engineer</p>
          <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-[8px] text-[#64748B] font-medium">
            <span>tanmay@arthak.com</span>
            <span>•</span>
            <span>+91 90000 11122</span>
            <span>•</span>
            <span>Remote</span>
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-4">
          {/* Experience */}
          <div>
            <h5 className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 border-b border-emerald-100 pb-1">AI WORK EXPERIENCE</h5>
            <div className="mt-2.5 space-y-3">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-[#0F172A]">
                  <span>ML Intern — DeepBrain AI</span>
                  <span className="text-[8px] font-semibold text-[#64748B]">2025</span>
                </div>
                <ul className="mt-1 list-disc list-outside pl-3 space-y-0.5 text-[8.5px] text-[#475569] leading-relaxed">
                  <li>Fine-tuned Llama-3 models for specific customer support agents.</li>
                  <li>Deployed robust ML pipelines reducing GPU inference latency by 45ms.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h5 className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 border-b border-emerald-100 pb-1">EDUCATION</h5>
            <div className="mt-2 flex justify-between text-[10px] font-bold text-[#0F172A]">
              <span>B.Tech in Artificial Intelligence — IIT Bombay</span>
              <span className="text-[8px] font-semibold text-[#64748B]">CGPA: 9.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Skills */}
      <div className="space-y-2 mt-2">
        <div className="flex flex-wrap gap-1">
          {["Python", "PyTorch", "Hugging Face", "LLMs", "Docker"].map((s) => (
            <span key={s} className="text-[8px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Keeping the older component for bottom/cards compatibility or smaller preview wrapper
function SmallResumePreview({ accent, label, compact = false }: { accent: string; label: string; compact?: boolean }) {
  return (
    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-[0_15px_40px_-15px_rgba(15,23,42,0.15)] border border-[#0f172a]/5">
      <div className={`h-1/4 bg-gradient-to-br ${accent}`}>
        <div className="p-3">
          <div className="h-2 w-1/2 bg-white/80 rounded-full" />
          <div className="mt-2 h-1.5 w-1/3 bg-white/60 rounded-full" />
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="h-1.5 w-3/4 bg-slate-300 rounded-full" />
        <div className="h-1.5 w-2/3 bg-slate-200 rounded-full" />
        <div className="h-1.5 w-1/2 bg-slate-200 rounded-full" />
        <div className="mt-3 h-2 w-1/3 bg-slate-400 rounded-full" />
        <div className="h-1.5 w-full bg-slate-200 rounded-full" />
        <div className="h-1.5 w-5/6 bg-slate-200 rounded-full" />
        <div className="h-1.5 w-4/6 bg-slate-200 rounded-full" />
        <div className="mt-3 h-2 w-1/4 bg-slate-400 rounded-full" />
        <div className="grid grid-cols-3 gap-1">
          <div className="h-1.5 bg-slate-200 rounded-full" />
          <div className="h-1.5 bg-slate-200 rounded-full" />
          <div className="h-1.5 bg-slate-200 rounded-full" />
        </div>
      </div>
      <div className="absolute bottom-2 right-2 text-[9px] font-medium text-slate-400">{label}</div>
    </div>
  );
}

// High-fidelity fallback skeleton container for PNG images
function ResumeImageContainer({ src, label }: { src: string; label: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#FCFAF7] select-none rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#0f172a]/8">
      {/* Skeleton view while image loads */}
      <div className="absolute inset-0 bg-white p-5 flex flex-col justify-between text-left">
        <div className="space-y-3">
          {/* Header */}
          <div className="space-y-1.5 pb-3 border-b border-[#0f172a]/5">
            <div className="h-3 w-1/3 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-2 w-1/4 bg-slate-100 rounded-md animate-pulse" />
          </div>
          {/* Work Exp */}
          <div className="space-y-2 pt-1">
            <div className="h-2 w-1/5 bg-[#14B8A6]/20 rounded-md animate-pulse" />
            <div className="space-y-1.5 pl-2">
              <div className="h-1.5 w-3/4 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-1.5 w-5/6 bg-slate-100 rounded-md animate-pulse" />
            </div>
          </div>
          {/* Education */}
          <div className="space-y-2 pt-1">
            <div className="h-2 w-1/5 bg-slate-200 rounded-md" />
            <div className="h-1.5 w-2/3 bg-slate-100 rounded-md" />
          </div>
        </div>
        
        {/* Label Pill Overlay */}
        <div className="mt-4 flex items-center justify-between border-t border-[#0f172a]/5 pt-3">
          <div className="px-2 py-0.5 text-[8px] font-bold text-slate-500 bg-slate-100 rounded-md border border-slate-200 shadow-sm whitespace-nowrap">
            {label}
          </div>
          <div className="text-[7px] text-slate-400 font-medium">PNG Slot</div>
        </div>
      </div>

      {/* Real PNG Image (loads on top and fades in) */}
      <img 
        src={src} 
        alt={label} 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

// ─────────────────────── Page ───────────────────────
function ResumeBuilderPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesFilter = filter === "All" || t.category === filter;
      const q = query.toLowerCase().trim();
      const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.recommendedFor.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const featured = TEMPLATES.filter((t) => t.featured);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] antialiased">
      <style>{`
        .glass { background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.45)); border: 1px solid rgba(15, 23, 42, 0.08); backdrop-filter: blur(20px); }
        .glass-strong { background: rgba(255, 255, 255, 0.85); border: 1px solid rgba(15, 23, 42, 0.08); backdrop-filter: blur(24px); box-shadow: 0 4px 30px rgba(0,0,0,0.02); }
        .grid-bg { background-image: linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px); background-size: 56px 56px; }
        .glow-indigo { box-shadow: 0 10px 40px -10px rgba(20,184,166,0.3); }
        .glow-cyan { box-shadow: 0 10px 40px -10px rgba(59,130,246,0.3); }
      `}</style>

      <Header />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-70" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#99F0E4]/40 blur-[120px]" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-[#BFD7FF]/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-semibold text-[#0D9488] border-[#14B8A6]/25">
                <Sparkles className="h-3.5 w-3.5 text-[#14B8A6]" />
                <span>From Confusion to Career</span>
              </div>
              <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                Build a Resume That{" "}
                <span className="bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] bg-clip-text text-transparent">
                  Gets Interviews
                </span>
              </h1>
              <p className="mt-6 text-lg text-[#475569] max-w-xl leading-relaxed">
                Choose from professionally designed ATS-friendly templates built for students, freshers and professionals.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`/resume-editor?template=${"modern"}`} className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] hover:opacity-95 text-white font-semibold glow-indigo transition-all hover:scale-[1.02]"
                >
                  Create Resume
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-black/5 text-[#0F172A] border border-[#0f172a]/10 font-semibold transition-all shadow-sm">
                  <FileText className="h-4 w-4" />
                  Import Existing Resume
                </button>
              </div>
              <div className="mt-10 flex flex-wrap gap-2">
                {["ATS Optimized", "Career Focused", "AI Powered", "One Click Export"].map((b) => (
                  <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-[#334155] font-medium">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Floating resume stack */}
            <div className="relative h-[540px] hidden lg:flex items-center justify-center w-full max-w-[650px] mx-auto select-none">
              
              {/* Radial glow behind center image */}
              <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-[#3B82F6]/25 via-[#8B5CF6]/18 to-[#14B8A6]/20 blur-3xl pointer-events-none opacity-85 z-0 animate-pulse" />

              {/* LEFT RESUME */}
              <motion.div 
                initial={{ x: -110, y: 10, rotate: -12, scale: 0.9 }}
                animate={{ y: [10, 2, 10] }}
                whileHover={{ 
                  scale: 0.93, 
                  rotate: -16, 
                  y: 15,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                transition={{
                  y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                className="absolute w-[275px] aspect-[1/1.41] origin-bottom cursor-pointer"
                style={{ zIndex: 20 }}
              >
                <Link to="/resume-editor" search={{ template: "premium" }} className="w-full h-full block relative">
                  {/* Badge 1: ATS Score 98% (inherits the -12deg rotation and scale 0.9/0.93 from parent wrapper) */}
                  <div 
                    className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 z-40 glass-strong px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-bold text-[#0F172A] border-[#0f172a]/10 shadow-lg whitespace-nowrap"
                  >
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    ✓ ATS Score 98%
                  </div>

                  <div className="w-full h-full shadow-[0_4px_20px_rgba(15,23,42,0.05),0_20px_50px_-10px_rgba(59,130,246,0.18),0_10px_30px_-15px_rgba(139,92,246,0.22)] border border-[#0f172a]/6 rounded-xl bg-white overflow-hidden hover:shadow-[0_25px_60px_rgba(59,130,246,0.24)] transition-all duration-300">
                    <div className="relative w-full h-full group">
                      <ResumeImageContainer src="/gnxnjdj_page-0001.jpg" label="Modern Resume" />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#64748B] bg-white px-2 py-0.5 rounded-full border border-black/5 shadow-sm whitespace-nowrap z-30">
                        Modern Resume
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* RIGHT RESUME */}
              <motion.div 
                initial={{ x: 110, y: 10, rotate: 12, scale: 0.9 }}
                animate={{ y: [10, 2, 10] }}
                whileHover={{ 
                  scale: 0.93, 
                  rotate: 16, 
                  y: 15,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                transition={{
                  y: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }
                }}
                className="absolute w-[275px] aspect-[1/1.41] origin-bottom cursor-pointer"
                style={{ zIndex: 20 }}
              >
                <Link to="/resume-editor" search={{ template: "hybrid" }} className="w-full h-full block relative">
                  {/* Badge 3: AI Suggestions (inherits the 12deg rotation and scale 0.9/0.93 from parent wrapper) */}
                  <div 
                    className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 z-40 glass-strong px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-bold text-[#0D9488] border-[#14B8A6]/20 shadow-lg whitespace-nowrap bg-gradient-to-r from-white via-[#FAF7F2] to-white"
                  >
                    🤖 AI Suggestions
                  </div>

                  <div className="w-full h-full shadow-[0_4px_20px_rgba(15,23,42,0.05),0_20px_50px_-10px_rgba(59,130,246,0.18),0_10px_30px_-15px_rgba(139,92,246,0.22)] border border-[#0f172a]/6 rounded-xl bg-white overflow-hidden hover:shadow-[0_25px_60px_rgba(59,130,246,0.24)] transition-all duration-300">
                    <div className="relative w-full h-full group">
                      <ResumeImageContainer src="/djhdhdjhbjx_page-0001.jpg" label="AI Engineer Resume" />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#64748B] bg-white px-2 py-0.5 rounded-full border border-black/5 shadow-sm whitespace-nowrap z-30">
                        AI Engineer Resume
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* CENTER RESUME (largest, focused, highest z-index) */}
              <motion.div 
                initial={{ x: 0, y: 10, rotate: 0, scale: 1.0 }}
                animate={{ y: [10, 2, 10] }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                transition={{
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute w-[275px] aspect-[1/1.41] origin-bottom cursor-pointer"
                style={{ zIndex: 30 }}
              >
                <Link to="/resume-editor" search={{ template: "minimal" }} className="w-full h-full block relative">
                  {/* Badge 2: One Click Export (inherits 0deg rotation and scale 1.0/1.03 from parent wrapper) */}
                  <div 
                    className="absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 z-40 glass-strong px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-bold text-[#0F172A] border-[#0f172a]/10 shadow-lg whitespace-nowrap"
                  >
                    ⚡ One Click Export
                  </div>

                  <div className="w-full h-full shadow-[0_4px_25px_rgba(15,23,42,0.06),0_30px_70px_-10px_rgba(59,130,246,0.28),0_15px_40px_-12px_rgba(139,92,246,0.35)] border border-[#0f172a]/8 rounded-xl bg-white overflow-hidden hover:shadow-[0_35px_75px_rgba(59,130,246,0.33),0_18px_45px_rgba(139,92,246,0.4)] transition-all duration-300">
                    <div className="relative w-full h-full group">
                      <ResumeImageContainer src="/djbd_page-0001.jpg" label="Professional Resume" />
                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-[#0D9488] bg-white px-3 py-1 rounded-full border border-[#14B8A6]/20 shadow-md whitespace-nowrap flex items-center gap-1 z-30">
                        <Sparkles className="h-3 w-3 text-[#14B8A6]" />
                        Professional Resume
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* FLOATING BADGES */}

            </div>
          </div>
        </div>
      </section>

      {/* ─── SEARCH & FILTERS (sticky) ─── */}
      <section className="sticky top-16 z-30 backdrop-blur-xl bg-[#FAF7F2]/90 border-y border-[#0f172a]/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass md:w-80 shrink-0 border-[#0f172a]/10 bg-white">
              <Search className="h-4 w-4 text-[#94A3B8]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates..."
                className="bg-transparent outline-none text-sm w-full text-[#0F172A] placeholder:text-[#94A3B8]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? "bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] text-white shadow-[0_4px_20px_-4px_rgba(20,184,166,0.4)]"
                        : "glass text-[#475569] hover:text-[#0F172A] hover:bg-black/5"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED TEMPLATES ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading kicker="Hand-picked" title="Featured Templates" subtitle="The most loved templates by Arthak students." />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((t, i) => (
            <TemplateCard key={t.id} template={t} delay={i * 0.05} large />
          ))}
        </div>
      </section>

      {/* ─── ALL TEMPLATES ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading kicker={`${filtered.length} templates`} title="All Templates" subtitle="Filter by career or search by keyword." />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((t, i) => (
            <TemplateCard key={t.id} template={t} delay={i * 0.03} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-12 text-center text-[#64748B]">No templates match your search.</div>
        )}
      </section>

      {/* ─── CAREER SPECIFIC ─── */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[800px] rounded-full bg-[#99F0E4]/10 blur-[120px]" />
        </div>
        <SectionHeading kicker="Unique to Arthak" title="Templates Built For Your Career" subtitle="Every role has its own structure. Every structure has its own template." />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CAREER_CARDS.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group glass-strong p-5 rounded-2xl border-[#0f172a]/6 hover:border-[#14B8A6]/30 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#14B8A6]/10 to-[#3B82F6]/10 border border-[#14B8A6]/20 flex items-center justify-center">
                  <c.icon className="h-5 w-5 text-[#14B8A6]" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-55 text-emerald-700 border border-emerald-220">
                  {c.match}% match
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-[#0F172A]">{c.name}</h3>
              <div className="mt-1 text-xs text-[#64748B]">Avg salary {c.salary}</div>
              <div className="mt-3 flex flex-wrap gap-1">
                {c.skills.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 text-[#334155] border border-black/5">
                    {s
                  }</span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs text-[#64748B]">Template: <span className="text-[#334155] font-medium">{c.template}</span></span>
                <Link to="/roadmaps" className="text-xs text-[#14B8A6] font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Roadmap <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SUCCESS EXAMPLES ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading kicker="Real outcomes" title="Successful Resume Examples" subtitle="Resumes from Arthak students who landed top roles." />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUCCESS_EXAMPLES.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-strong rounded-2xl p-6 border-[#0f172a]/6 hover:border-[#14B8A6]/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <TrendingUp className="h-3.5 w-3.5" /> {s.company}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-[#0F172A]">{s.name} Resume</h3>
              <div className="mt-5 aspect-[3/2] rounded-xl bg-black/5 border border-black/5 flex items-center justify-center">
                <div className="w-32"><SmallResumePreview accent="from-indigo-500 to-cyan-500" label={s.template} compact /></div>
              </div>
              <div className="mt-5 flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg glass text-xs text-[#0F172A] border-[#0f172a]/10 hover:bg-black/5 font-semibold">
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                <a href={`/resume-editor?template=${s.template.toLowerCase()}`} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] text-xs text-white font-semibold"
                >
                  Use Similar
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── WHY ARTHAK ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading kicker="Why Arthak" title="Everything You Need, In One Place" subtitle="A resume builder powered by your career operating system." />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_ARTHAK.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative glass-strong bg-white/70 border-[#0f172a]/6 rounded-2xl p-6 overflow-hidden group shadow-sm"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#99F0E4]/10 blur-2xl group-hover:bg-[#99F0E4]/20 transition-colors" />
              <div className="relative">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#14B8A6]/10 to-[#3B82F6]/10 border border-[#14B8A6]/20 flex items-center justify-center">
                  <w.icon className="h-5 w-5 text-[#14B8A6]" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#0F172A]">{w.title}</h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">{w.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── ARTHAK ADVANTAGE ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading kicker="The Arthak Advantage" title="Traditional Builders vs Arthak" subtitle="See why students choose Arthak over generic resume tools." />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="glass bg-white/60 rounded-2xl p-6 border-[#0f172a]/6 shadow-sm">
            <div className="text-sm text-[#64748B] mb-1 font-medium">The Old Way</div>
            <h3 className="text-2xl font-bold text-[#475569]">Traditional Resume Builders</h3>
            <div className="mt-6 space-y-3">
              {COMPARE.map((c) => (
                <div key={c.feature} className="flex items-center gap-3 text-sm text-[#64748B]">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  {c.feature}
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl p-6 bg-gradient-to-br from-[#14B8A6]/15 via-white/40 to-[#3B82F6]/15 border border-[#14B8A6]/30 shadow-md shadow-teal-500/5">
            <div className="text-sm text-[#0D9488] mb-1 font-bold">The Arthak Way</div>
            <h3 className="text-2xl font-bold text-[#0F172A]">Arthak Resume Builder</h3>
            <div className="mt-6 space-y-3">
              {COMPARE.map((c) => (
                <div key={c.feature} className="flex items-center gap-3 text-sm text-[#334155] font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  {c.feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-[900px] rounded-full bg-[#99F0E4]/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s) => <StatItem key={s.label} stat={s} />)}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center bg-gradient-to-br from-[#14B8A6]/10 via-[#FAF7F2] to-[#3B82F6]/10 border border-[#14B8A6]/20 shadow-xl shadow-teal-500/5">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#99F0E4]/30 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#BFD7FF]/25 blur-[120px]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-[#475569] font-medium border-[#14B8A6]/10">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              Trusted by 1000+ students
            </div>
            <h2 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-[#0F172A]">
              Start Building Your{" "}
              <span className="bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] bg-clip-text text-transparent">
                Dream Career
              </span>{" "}
              Today
            </h2>
            <p className="mt-5 text-lg text-[#475569] max-w-2xl mx-auto">
              Create a professional resume and unlock career opportunities with Arthak.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a href={`/resume-editor?template=${"modern"}`} className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] hover:opacity-95 text-white font-semibold glow-indigo transition-all hover:scale-[1.02]"
              >
                Create Resume <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/roadmaps"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-black/5 text-[#0F172A] border border-[#0f172a]/10 font-semibold transition-all shadow-sm"
              >
                Explore Career Roadmaps
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 py-10 text-center text-xs text-[#64748B]">
        © Arthak — From Confusion to Career
      </footer>
    </div>
  );
}

function SectionHeading({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-wider text-[#0D9488] font-bold border-[#14B8A6]/20 bg-[#14B8A6]/5">
        {kicker}
      </div>
      <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A]">{title}</h2>
      <p className="mt-3 text-[#475569]">{subtitle}</p>
    </div>
  );
}

function TemplateCard({ template, delay = 0, large = false }: { template: Template; delay?: number; large?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <div className="relative glass-strong rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/40 hover:shadow-[0_20px_60px_-15px_rgba(20,184,166,0.2)] bg-white">
        <div className={`relative ${large ? "p-4" : "p-3"} rounded-xl bg-[#FDFCF9] border border-[#0f172a]/5 overflow-hidden`}>
          <div className="transform transition-transform duration-500 group-hover:scale-[1.03]">
            <SmallResumePreview accent={template.accent} label={template.name} />
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-end justify-center pb-4 gap-2 backdrop-blur-[2px]">
            <button className="px-3 py-1.5 rounded-lg bg-white text-[#0F172A] border border-[#0f172a]/10 text-xs font-semibold shadow-sm inline-flex items-center gap-1 hover:bg-slate-50">
              <Eye className="h-3 w-3" /> Preview
            </button>
            <a href={`/resume-editor?template=${template.id}`} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#14B8A6] to-[#3B82F6] text-xs font-semibold text-white inline-flex items-center gap-1 shadow-sm"
            >
              Use <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            <h3 className={`font-bold text-[#0F172A] ${large ? "text-lg" : "text-sm"}`}>{template.name}</h3>
            <div className="text-xs text-[#64748B] mt-0.5 font-medium">{template.recommendedFor}</div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              ATS {template.ats}
            </span>
            <span className="text-[10px] text-[#94A3B8] font-medium">{template.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}