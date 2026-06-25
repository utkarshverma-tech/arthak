import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Career = {
  title: string;
  desc: string;
  emoji: string;
  gradient: string;
  accent: string;
};

const CAREERS: Career[] = [
  { title: "AI Engineer", desc: "Build intelligent systems and neural networks.", emoji: "🤖", gradient: "from-[#FFF4D6] via-[#FBE6A2] to-[#F4D06F]", accent: "#C9971A" },
  { title: "Machine Learning Engineer", desc: "Train predictive models and AI pipelines.", emoji: "🧠", gradient: "from-[#F5ECFF] via-[#E2CCFF] to-[#C9A8FF]", accent: "#7B3FE4" },
  { title: "Generative AI Engineer", desc: "Craft LLM workflows and content systems.", emoji: "✨", gradient: "from-[#FFE9F1] via-[#FFC8DE] to-[#FF9DC0]", accent: "#D4377B" },
  { title: "LLM Engineer", desc: "Design prompts, assistants and language models.", emoji: "💬", gradient: "from-[#E6F4FF] via-[#BFE0FF] to-[#8FC8FF]", accent: "#1F6FD9" },
  { title: "Data Scientist", desc: "Turn data into insights and decisions.", emoji: "📊", gradient: "from-[#FFF0E4] via-[#FFD3B0] to-[#FFB37C]", accent: "#D26A1E" },
  { title: "Data Analyst", desc: "Build dashboards and business intelligence.", emoji: "📈", gradient: "from-[#E8FBF1] via-[#BEEFD3] to-[#86DDB0]", accent: "#1F8A57" },
  { title: "Data Engineer", desc: "Engineer pipelines and cloud data systems.", emoji: "🛢️", gradient: "from-[#EEF1FF] via-[#C8D1FF] to-[#9CADFF]", accent: "#3D52D5" },
  { title: "Full Stack Developer", desc: "Ship frontend and backend end-to-end.", emoji: "🧩", gradient: "from-[#FFF4D6] via-[#FBDA8C] to-[#F4BE45]", accent: "#B5841A" },
  { title: "Frontend Developer", desc: "Craft beautiful, fast user interfaces.", emoji: "🎨", gradient: "from-[#FFE9F1] via-[#FFC1D9] to-[#FF94B9]", accent: "#D43A77" },
  { title: "Backend Developer", desc: "Build APIs, servers and databases.", emoji: "⚙️", gradient: "from-[#F0F2F7] via-[#D6DCEA] to-[#B4BFD8]", accent: "#3B4A6B" },
  { title: "Software Engineer", desc: "Architect modern, scalable software.", emoji: "💻", gradient: "from-[#E6F4FF] via-[#B7DAFF] to-[#7FBAFF]", accent: "#1858B5" },
  { title: "Web Developer", desc: "Build responsive sites and web apps.", emoji: "🌐", gradient: "from-[#E8FBF1] via-[#B6E8CB] to-[#7FD2A6]", accent: "#1F7A4F" },
  { title: "Mobile App Developer", desc: "Ship native iOS and Android apps.", emoji: "📱", gradient: "from-[#F5ECFF] via-[#DCC3FF] to-[#B98EFF]", accent: "#6A2EDB" },
  { title: "DevOps Engineer", desc: "Automate CI/CD and cloud delivery.", emoji: "🚀", gradient: "from-[#FFF0E4] via-[#FFC79A] to-[#FF9F5C]", accent: "#C75A14" },
  { title: "Cloud Engineer", desc: "Design cloud infra and architecture.", emoji: "☁️", gradient: "from-[#E6F4FF] via-[#BFDFFB] to-[#8FC2F0]", accent: "#1F6FD9" },
  { title: "Site Reliability Engineer", desc: "Keep systems fast, scalable and alive.", emoji: "📡", gradient: "from-[#EEF1FF] via-[#C9D2FF] to-[#9AAAFF]", accent: "#3346BD" },
  { title: "Cybersecurity Analyst", desc: "Defend organizations from cyber threats.", emoji: "🛡️", gradient: "from-[#F0F2F7] via-[#CCD3E3] to-[#A4AFCE]", accent: "#2E3A5C" },
  { title: "Ethical Hacker", desc: "Pentest systems and find vulnerabilities.", emoji: "🕵️", gradient: "from-[#FFE9E9] via-[#FFBDBD] to-[#FF8C8C]", accent: "#C03030" },
  { title: "Security Engineer", desc: "Engineer secure networks and platforms.", emoji: "🔐", gradient: "from-[#FFF4D6] via-[#F4D88A] to-[#E4B948]", accent: "#9C7715" },
  { title: "UI Designer", desc: "Design clean, beautiful visual interfaces.", emoji: "🖌️", gradient: "from-[#FFE9F1] via-[#FFC4DD] to-[#FF94BF]", accent: "#C9357A" },
  { title: "UX Designer", desc: "Map user journeys and experiences.", emoji: "🧭", gradient: "from-[#F5ECFF] via-[#D9BCFF] to-[#B286FF]", accent: "#6A2EDB" },
  { title: "Product Designer", desc: "Shape products end-to-end with design.", emoji: "🪄", gradient: "from-[#FFF4D6] via-[#F8DC9A] to-[#EFC056]", accent: "#A8821A" },
  { title: "Product Manager", desc: "Lead roadmap, strategy and execution.", emoji: "📋", gradient: "from-[#E8FBF1] via-[#BFEAD3] to-[#86D2A8]", accent: "#1F7A4F" },
  { title: "QA Engineer", desc: "Catch bugs and ensure quality ships.", emoji: "🧪", gradient: "from-[#E6F4FF] via-[#BCDBFB] to-[#8DBEEF]", accent: "#1F5FB5" },
  { title: "Automation Test Engineer", desc: "Automate testing across pipelines.", emoji: "🤖", gradient: "from-[#EEF1FF] via-[#CAD2FF] to-[#9CAAFF]", accent: "#3346BD" },
  { title: "Blockchain Developer", desc: "Build smart contracts and Web3 apps.", emoji: "⛓️", gradient: "from-[#F0F2F7] via-[#D2D9EB] to-[#A8B4D6]", accent: "#3B4A6B" },
  { title: "Game Developer", desc: "Build immersive 3D games and worlds.", emoji: "🎮", gradient: "from-[#FFE9F1] via-[#FFBED8] to-[#FF8DB6]", accent: "#C9357A" },
  { title: "AR/VR Developer", desc: "Craft immersive virtual experiences.", emoji: "🥽", gradient: "from-[#F5ECFF] via-[#D8BAFF] to-[#AF82FF]", accent: "#6A2EDB" },
  { title: "Robotics Engineer", desc: "Engineer robots and automation systems.", emoji: "🦾", gradient: "from-[#FFF0E4] via-[#FFCCA0] to-[#FF9F5C]", accent: "#C75A14" },
  { title: "IoT Engineer", desc: "Connect devices into smart systems.", emoji: "📶", gradient: "from-[#E8FBF1] via-[#B8EBCC] to-[#80D5A7]", accent: "#1F7A4F" },
  { title: "Database Administrator", desc: "Optimize and protect data at scale.", emoji: "🗄️", gradient: "from-[#FFF4D6] via-[#F6DA90] to-[#EAB948]", accent: "#9C7715" },
  { title: "Network Engineer", desc: "Design and run resilient networks.", emoji: "🛰️", gradient: "from-[#E6F4FF] via-[#BBDAFB] to-[#88BBEF]", accent: "#1F5FB5" },
  { title: "Business Analyst", desc: "Translate business needs into solutions.", emoji: "📑", gradient: "from-[#EEF1FF] via-[#CDD4FF] to-[#A0AEFF]", accent: "#3346BD" },
  { title: "Salesforce Developer", desc: "Build on the world's #1 CRM platform.", emoji: "☁️", gradient: "from-[#E6F4FF] via-[#B5D6FA] to-[#7FB6EE]", accent: "#1858B5" },
  { title: "SAP Consultant", desc: "Implement enterprise SAP systems.", emoji: "🏢", gradient: "from-[#F0F2F7] via-[#CFD6E8] to-[#A6B2D2]", accent: "#2E3A5C" },
];

function CareerCard({ career, index }: { career: Career; index: number }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#EBE2D0] bg-[#FFFDF8]/90 text-left shadow-[0_1px_2px_rgba(30,30,30,0.04),0_12px_32px_-20px_rgba(30,30,30,0.18)] backdrop-blur-sm transition-shadow duration-500 hover:shadow-[0_2px_4px_rgba(30,30,30,0.05),0_28px_60px_-24px_rgba(212,175,55,0.45)]"
    >
      {/* Gradient border glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${career.accent}22, transparent 60%)`,
        }}
      />

      {/* Illustration top area (~60%) */}
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${career.gradient}`}>
        {/* Floating decorative shapes */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl"
            style={{ background: career.accent }}
          />
          <div className="absolute right-4 bottom-4 h-16 w-16 rounded-2xl bg-white/40 backdrop-blur-md" />
          <div className="absolute left-6 bottom-6 h-3 w-3 rounded-full bg-white/70" />
          <div className="absolute right-10 top-6 h-2 w-2 rounded-full bg-white/80" />
          <div className="absolute right-20 top-12 h-1.5 w-1.5 rounded-full bg-white/60" />
        </div>

        {/* Big emoji as "3D" illustration */}
        <motion.div
          className="relative flex h-full items-center justify-center"
          initial={false}
        >
          <motion.span
            className="select-none text-[88px] leading-none drop-shadow-[0_12px_18px_rgba(30,30,30,0.18)]"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "saturate(1.05)" }}
          >
            {career.emoji}
          </motion.span>
        </motion.div>

        {/* Subtle bottom fade into card */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#FFFDF8]" />
      </div>

      {/* Bottom content */}
      <div className="relative flex flex-1 flex-col gap-2 px-5 pb-5 pt-4">
        <h3 className="text-[15px] font-semibold tracking-tight text-[#1E1E1E]">
          {career.title}
        </h3>
        <p className="text-[13px] leading-relaxed text-[#6B6B6B]">{career.desc}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] font-medium text-[#1E1E1E]/70 transition-colors duration-300 group-hover:text-[#1E1E1E]">
            View Roadmap
          </span>
          <span
            className="grid h-8 w-8 place-items-center rounded-full border border-[#EBE2D0] bg-white text-[#1E1E1E] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-transparent group-hover:text-white"
            style={{ background: undefined }}
          >
            <span
              className="absolute inset-0 -z-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: career.accent }}
            />
            <ArrowUpRight className="relative h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export function CareerPathsSection() {
  return (
    <section
      id="careers"
      className="relative overflow-hidden bg-[#FAF7F2] py-24 sm:py-32"
    >
      {/* Cream gradient + floating particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,#FFF7E2_0%,transparent_60%)]" />
        <div className="absolute left-[8%] top-40 h-72 w-72 rounded-full bg-[#D4AF37]/8 blur-3xl" />
        <div className="absolute right-[6%] top-[60%] h-80 w-80 rounded-full bg-[#F4EFE6] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#1E1E1E_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#EBE2D0] bg-[#FFFDF8] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B6B6B] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            Career Paths
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-[#1E1E1E] sm:text-5xl md:text-[56px] md:leading-[1.05]">
            Explore Your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#1E1E1E] via-[#8a6a18] to-[#D4AF37] bg-clip-text text-transparent">
                Future Career
              </span>
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-[#6B6B6B] sm:text-lg">
            Choose a career path and see the journey ahead. Discover skills,
            projects, opportunities, and roadmaps tailored to your future.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {CAREERS.map((career, i) => (
            <CareerCard key={career.title + i} career={career} index={i} />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 flex flex-col items-center gap-3 text-center"
        >
          <p className="text-sm text-[#6B6B6B]">
            Don&apos;t see your path? We&apos;re adding new careers every month.
          </p>
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-full bg-[#1E1E1E] px-6 py-3 text-sm font-medium text-[#FAF7F2] shadow-[0_10px_30px_-12px_rgba(30,30,30,0.5)] transition-all duration-300 hover:bg-[#2a2a2a] hover:shadow-[0_18px_40px_-12px_rgba(212,175,55,0.45)]"
          >
            Take the Career Assessment
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default CareerPathsSection;