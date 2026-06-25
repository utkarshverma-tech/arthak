import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CATEGORIES, allCareers } from "@/lib/roadmaps-data";

export function RoadmapsMegaMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filteredCareers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allCareers()
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.categoryName.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mega"
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-[#1E1E1E]/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, scale: 0.98, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-4 max-h-[calc(100vh-2rem)] w-[min(1200px,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-[#EBE2D0] bg-[#FAF7F2]/95 shadow-[0_30px_80px_-20px_rgba(30,30,30,0.35)] backdrop-blur-xl"
          >
            {/* Decorative bg */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,#FFF7E2_0%,transparent_60%)]" />
              <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-[#F4EFE6] blur-3xl" />
            </div>

            <div className="relative max-h-[calc(100vh-2rem)] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-10 sm:pt-10">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#EBE2D0] bg-[#FFFDF8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                    Roadmaps
                  </div>
                  <h2 className="text-balance text-2xl font-semibold tracking-tight text-[#1E1E1E] sm:text-4xl">
                    Explore Career Roadmaps
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6B6B6B] sm:text-base">
                    Choose a technology domain and discover career paths designed for your future.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#EBE2D0] bg-[#FFFDF8] text-[#1E1E1E] transition hover:bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search */}
              <div className="px-6 pt-6 sm:px-10">
                <div className="flex items-center gap-3 rounded-2xl border border-[#EBE2D0] bg-[#FFFDF8] px-4 py-3 shadow-[0_1px_2px_rgba(30,30,30,0.04)]">
                  <Search className="h-4 w-4 text-[#6B6B6B]" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your dream career..."
                    className="w-full bg-transparent text-sm text-[#1E1E1E] outline-none placeholder:text-[#9A9A9A]"
                  />
                </div>

                {/* Live results */}
                <AnimatePresence>
                  {query && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-3 overflow-hidden rounded-2xl border border-[#EBE2D0] bg-[#FFFDF8]"
                    >
                      {filteredCareers.length === 0 ? (
                        <div className="px-4 py-4 text-sm text-[#6B6B6B]">
                          No careers match "{query}". Try AI, Frontend, Cyber…
                        </div>
                      ) : (
                        <ul className="divide-y divide-[#EBE2D0]/70">
                          {filteredCareers.map((c) => (
                            <li key={c.slug}>
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  navigate({
                                    to: "/roadmaps",
                                    search: { category: c.categorySlug, career: c.slug },
                                  });
                                }}
                                className="group flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-[#FAF7F2]"
                              >
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#FFF4D6] to-[#F4D06F] text-xl">
                                  {c.emoji}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-semibold text-[#1E1E1E]">{c.name}</div>
                                  <div className="truncate text-xs text-[#6B6B6B]">{c.categoryName}</div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-[#6B6B6B] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1E1E1E]" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Categories grid */}
              <div className="grid grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
                {CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={cat.slug}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.06 + i * 0.035, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => {
                      onClose();
                      navigate({ to: "/roadmaps", search: { category: cat.slug } });
                    }}
                    className="group relative flex flex-col gap-3 overflow-hidden rounded-[24px] border border-[#EBE2D0] bg-[#FFFDF8] p-5 text-left shadow-[0_1px_2px_rgba(30,30,30,0.04),0_10px_28px_-18px_rgba(30,30,30,0.18)] transition-shadow duration-500 hover:shadow-[0_2px_4px_rgba(30,30,30,0.05),0_24px_50px_-24px_rgba(212,175,55,0.45)]"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `linear-gradient(135deg, ${cat.accent}18, transparent 60%)` }}
                    />
                    <div className={`relative grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-inner`}>
                      <span className="text-4xl drop-shadow-[0_6px_10px_rgba(30,30,30,0.18)] transition-transform duration-500 group-hover:scale-110">
                        {cat.emoji}
                      </span>
                    </div>
                    <div className="relative flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold tracking-tight text-[#1E1E1E]">
                        {cat.name}
                      </h3>
                      <span
                        className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide"
                        style={{ color: cat.accent, borderColor: `${cat.accent}33`, background: `${cat.accent}10` }}
                      >
                        {cat.careers.length} Careers
                      </span>
                    </div>
                    <p className="relative text-[13px] leading-relaxed text-[#6B6B6B]">{cat.desc}</p>
                    <div className="relative mt-auto flex items-center gap-2 pt-2 text-[12px] font-medium text-[#1E1E1E]/70">
                      Explore Roadmaps
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RoadmapsMegaMenu;