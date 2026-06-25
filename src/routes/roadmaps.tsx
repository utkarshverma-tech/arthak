import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ChevronRight, Search, Sparkles, TrendingUp, Clock, Briefcase } from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { CATEGORIES, findCareer, findCategory } from "@/lib/roadmaps-data";

type RoadmapsSearch = {
  category?: string;
  career?: string;
};

export const Route = createFileRoute("/roadmaps")({
  validateSearch: (search: Record<string, unknown>): RoadmapsSearch => ({
    category: typeof search.category === "string" ? search.category : undefined,
    career: typeof search.career === "string" ? search.career : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Career Roadmaps — Arthak" },
      { name: "description", content: "Explore curated career roadmaps across AI, software, cloud, design, security and more. Choose a domain, pick a career, and start your personalized journey." },
      { property: "og:title", content: "Career Roadmaps — Arthak" },
      { property: "og:description", content: "From confusion to career. Browse premium career roadmaps designed for students." },
    ],
  }),
  component: RoadmapsPage,
});

function RoadmapsPage() {
  const { category, career } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const activeCategory = category ? findCategory(category) : undefined;
  const activeCareer = activeCategory && career ? findCareer(activeCategory.slug, career) : undefined;

  const step: "categories" | "careers" | "overview" = activeCareer
    ? "overview"
    : activeCategory
      ? "careers"
      : "categories";

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.careers.some((cr) => cr.name.toLowerCase().includes(q)),
    );
  }, [query]);

  const filteredCareers = useMemo(() => {
    if (!activeCategory) return [];
    const q = query.trim().toLowerCase();
    if (!q) return activeCategory.careers;
    return activeCategory.careers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q),
    );
  }, [activeCategory, query]);

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-[#FAF7F2] pb-32">
        {/* Decorative bg */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,#FFF7E2_0%,transparent_60%)]" />
          <div className="absolute left-[8%] top-40 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute right-[6%] top-[55%] h-80 w-80 rounded-full bg-[#F4EFE6] blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#1E1E1E_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-[#6B6B6B]">
            <Link to="/roadmaps" className="hover:text-[#1E1E1E]">Roadmaps</Link>
            {activeCategory && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link
                  to="/roadmaps"
                  search={{ category: activeCategory.slug }}
                  className="hover:text-[#1E1E1E]"
                >
                  {activeCategory.name}
                </Link>
              </>
            )}
            {activeCareer && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-[#1E1E1E]">{activeCareer.name}</span>
              </>
            )}
          </nav>

          <AnimatePresence mode="wait">
            {step === "categories" && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Header2
                  eyebrow="Career Roadmaps"
                  title={<>Choose your <span className="bg-gradient-to-r from-[#1E1E1E] via-[#8a6a18] to-[#D4AF37] bg-clip-text text-transparent">domain</span></>}
                  subtitle="Pick a technology domain and discover career paths designed for your future."
                />

                <SearchBar value={query} onChange={setQuery} placeholder="Search your dream career..." />

                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCategories.map((cat, i) => (
                    <motion.button
                      key={cat.slug}
                      type="button"
                      onClick={() => navigate({ to: "/roadmaps", search: { category: cat.slug } })}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.45, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="group relative flex flex-col gap-4 overflow-hidden rounded-[28px] border border-[#EBE2D0] bg-[#FFFDF8] p-6 text-left shadow-[0_1px_2px_rgba(30,30,30,0.04),0_14px_36px_-22px_rgba(30,30,30,0.18)] transition-shadow duration-500 hover:shadow-[0_2px_4px_rgba(30,30,30,0.06),0_30px_60px_-26px_rgba(212,175,55,0.5)]"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{ background: `linear-gradient(135deg, ${cat.accent}22, transparent 60%)` }}
                      />
                      {/* Illustration */}
                      <div className={`relative grid h-28 w-full place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient}`}>
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl" style={{ background: cat.accent }} />
                          <div className="absolute right-4 bottom-4 h-12 w-12 rounded-2xl bg-white/40 backdrop-blur" />
                          <div className="absolute left-6 bottom-6 h-2 w-2 rounded-full bg-white/70" />
                        </div>
                        <motion.span
                          className="relative select-none text-6xl drop-shadow-[0_8px_14px_rgba(30,30,30,0.2)]"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                        >
                          {cat.emoji}
                        </motion.span>
                      </div>

                      <div className="relative flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold tracking-tight text-[#1E1E1E]">{cat.name}</h3>
                        <span
                          className="shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                          style={{ color: cat.accent, borderColor: `${cat.accent}33`, background: `${cat.accent}10` }}
                        >
                          {cat.careers.length} Careers
                        </span>
                      </div>
                      <p className="relative text-[13.5px] leading-relaxed text-[#6B6B6B]">{cat.desc}</p>
                      <div className="relative mt-auto flex items-center justify-between pt-2">
                        <span className="text-[12px] font-medium text-[#1E1E1E]/70">Explore Careers</span>
                        <span className="grid h-9 w-9 place-items-center rounded-full border border-[#EBE2D0] bg-white text-[#1E1E1E] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {filteredCategories.length === 0 && (
                  <EmptyState query={query} />
                )}
              </motion.div>
            )}

            {step === "careers" && activeCategory && (
              <motion.div
                key={`careers-${activeCategory.slug}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <BackButton to="/roadmaps" label="All Categories" search={{}} />

                <Header2
                  eyebrow={`${activeCategory.short} • ${activeCategory.careers.length} Careers`}
                  title={<>{activeCategory.name}</>}
                  subtitle={activeCategory.desc}
                />

                <SearchBar value={query} onChange={setQuery} placeholder={`Search in ${activeCategory.name}...`} />

                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCareers.map((cr, i) => (
                    <motion.button
                      key={cr.slug}
                      type="button"
                      onClick={() =>
                        navigate({
                          to: "/roadmaps",
                          search: { category: activeCategory.slug, career: cr.slug },
                        })
                      }
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -6, scale: 1.015 }}
                      className="group relative flex flex-col gap-3 overflow-hidden rounded-[24px] border border-[#EBE2D0] bg-[#FFFDF8] p-5 text-left shadow-[0_1px_2px_rgba(30,30,30,0.04),0_12px_32px_-20px_rgba(30,30,30,0.18)] transition-shadow duration-500 hover:shadow-[0_2px_4px_rgba(30,30,30,0.05),0_28px_60px_-24px_rgba(212,175,55,0.45)]"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{ background: `linear-gradient(135deg, ${cr.accent}22, transparent 60%)` }}
                      />
                      <div className={`relative grid h-32 w-full place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${cr.gradient}`}>
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl" style={{ background: cr.accent }} />
                          <div className="absolute right-4 bottom-4 h-14 w-14 rounded-2xl bg-white/40 backdrop-blur" />
                        </div>
                        <motion.span
                          className="relative select-none text-[72px] drop-shadow-[0_10px_14px_rgba(30,30,30,0.2)]"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                        >
                          {cr.emoji}
                        </motion.span>
                      </div>
                      <h3 className="relative text-base font-semibold tracking-tight text-[#1E1E1E]">{cr.name}</h3>
                      <p className="relative text-[13px] leading-relaxed text-[#6B6B6B]">{cr.desc}</p>

                      <div className="relative flex flex-wrap items-center gap-1.5 pt-1">
                        <Pill color={cr.accent}>{cr.difficulty}</Pill>
                        <Pill color="#1E1E1E"><Clock className="mr-1 h-3 w-3" />{cr.duration}</Pill>
                        <Pill color="#1F8A57"><TrendingUp className="mr-1 h-3 w-3" />{cr.demand}</Pill>
                      </div>

                      <div className="relative mt-2 flex items-center justify-between">
                        <span className="text-[12px] font-medium text-[#1E1E1E]/70 transition-colors group-hover:text-[#1E1E1E]">Explore Roadmap</span>
                        <span className="grid h-8 w-8 place-items-center rounded-full border border-[#EBE2D0] bg-white text-[#1E1E1E] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {filteredCareers.length === 0 && <EmptyState query={query} />}
              </motion.div>
            )}

            {step === "overview" && activeCategory && activeCareer && (
              <motion.div
                key={`overview-${activeCareer.slug}`}
                initial={{ opacity: 0, scale: 0.98, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <BackButton
                  to="/roadmaps"
                  label={`Back to ${activeCategory.name}`}
                  search={{ category: activeCategory.slug }}
                />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
                  {/* Illustration */}
                  <div className={`relative grid min-h-[320px] place-items-center overflow-hidden rounded-[32px] bg-gradient-to-br ${activeCareer.gradient} p-8 shadow-[0_20px_60px_-20px_rgba(30,30,30,0.25)]`}>
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full opacity-40 blur-3xl" style={{ background: activeCareer.accent }} />
                      <div className="absolute right-6 bottom-6 h-24 w-24 rounded-3xl bg-white/40 backdrop-blur" />
                      <div className="absolute left-10 bottom-10 h-3 w-3 rounded-full bg-white/70" />
                      <div className="absolute right-20 top-12 h-2 w-2 rounded-full bg-white/80" />
                    </div>
                    <motion.span
                      className="relative select-none text-[140px] drop-shadow-[0_20px_30px_rgba(30,30,30,0.25)] sm:text-[180px]"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {activeCareer.emoji}
                    </motion.span>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#EBE2D0] bg-[#FFFDF8] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
                      <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                      {activeCategory.name}
                    </div>
                    <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#1E1E1E] sm:text-5xl">
                      {activeCareer.name}
                    </h1>
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#6B6B6B]">
                      {activeCareer.overview}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <Stat label="Demand" value={activeCareer.demand} icon={<TrendingUp className="h-3.5 w-3.5" />} />
                      <Stat label="Avg Salary" value={activeCareer.salary} icon={<Briefcase className="h-3.5 w-3.5" />} />
                      <Stat label="Learning" value={activeCareer.duration} icon={<Clock className="h-3.5 w-3.5" />} />
                      <Stat label="Difficulty" value={activeCareer.difficulty} icon={<Sparkles className="h-3.5 w-3.5" />} />
                    </div>

                    <div className="mt-6">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6B6B]">Required Skills</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {activeCareer.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-[#EBE2D0] bg-[#FFFDF8] px-3 py-1 text-[12px] text-[#1E1E1E]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <InfoCard title="Career Growth" body={activeCareer.growth} />
                      <InfoCard title="Future Opportunities" body={activeCareer.future} />
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#1E1E1E] px-6 py-3.5 text-sm font-medium text-[#FAF7F2] shadow-[0_10px_30px_-12px_rgba(30,30,30,0.5)] transition-all duration-300 hover:bg-[#2a2a2a] hover:shadow-[0_18px_40px_-12px_rgba(212,175,55,0.5)]"
                    >
                      Start Roadmap
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}

function Header2({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#EBE2D0] bg-[#FFFDF8] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B6B6B] shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
        {eyebrow}
      </div>
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-[#1E1E1E] sm:text-5xl md:text-[56px] md:leading-[1.05]">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-[#6B6B6B] sm:text-lg">
        {subtitle}
      </p>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="sticky top-20 z-30 mx-auto mt-8 max-w-2xl">
      <div className="flex items-center gap-3 rounded-2xl border border-[#EBE2D0] bg-[#FFFDF8]/90 px-4 py-3 shadow-[0_8px_24px_-12px_rgba(30,30,30,0.18)] backdrop-blur">
        <Search className="h-4 w-4 text-[#6B6B6B]" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-[#1E1E1E] outline-none placeholder:text-[#9A9A9A]"
          aria-label="Search careers"
        />
      </div>
    </div>
  );
}

function Pill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium"
      style={{ color, borderColor: `${color}33`, background: `${color}10` }}
    >
      {children}
    </span>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#EBE2D0] bg-[#FFFDF8] p-3.5">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#6B6B6B]">
        {icon} {label}
      </div>
      <div className="mt-1 text-[14px] font-semibold tracking-tight text-[#1E1E1E]">{value}</div>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[#EBE2D0] bg-[#FFFDF8] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6B6B]">{title}</div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[#1E1E1E]/80">{body}</p>
    </div>
  );
}

function BackButton({ to, label, search }: { to: "/roadmaps"; label: string; search: RoadmapsSearch }) {
  return (
    <Link
      to={to}
      search={search}
      className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#EBE2D0] bg-[#FFFDF8] px-3 py-1.5 text-[12.5px] font-medium text-[#1E1E1E]/80 transition hover:bg-white hover:text-[#1E1E1E]"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-[#EBE2D0] bg-[#FFFDF8] p-8 text-center">
      <div className="text-3xl">🔎</div>
      <h3 className="mt-3 text-base font-semibold text-[#1E1E1E]">No matches for "{query}"</h3>
      <p className="mt-1 text-sm text-[#6B6B6B]">Try keywords like AI, Frontend, Cyber, Cloud or Product.</p>
    </div>
  );
}

export default RoadmapsPage;