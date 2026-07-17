import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Loader2, Sparkles } from "lucide-react";
import { authService } from "@/lib/auth/authService";
import { profileService, type OnboardingProfile } from "@/lib/auth/ProfileService";
import { useAuth } from "@/lib/auth/AuthContext";

type Step = {
  key: keyof OnboardingProfile;
  title: string;
  subtitle?: string;
  type: "single" | "multi";
  options: string[];
};

const STEPS: Step[] = [
  { key: "userType", title: "Who are you?", type: "single", options: ["School Student", "College Student", "Graduate", "Working Professional"] },
  { key: "education", title: "What's your education?", type: "single", options: ["High School", "Diploma", "Bachelor's", "Master's", "PhD"] },
  { key: "currentYear", title: "Current year of study", type: "single", options: ["1st Year", "2nd Year", "3rd Year", "Final Year", "Graduated"] },
  { key: "skills", title: "Pick your skills", subtitle: "Select all that apply", type: "multi", options: ["Python", "Java", "JavaScript", "SQL", "AI", "Machine Learning", "Cloud", "React", "Node.js", "Design"] },
  { key: "careerGoal", title: "What's your career goal?", type: "single", options: ["AI Engineer", "Data Scientist", "Full Stack Developer", "Cyber Security", "Cloud Engineer", "Product Manager", "UI/UX Designer", "DevOps"] },
  { key: "experience", title: "Current experience level", type: "single", options: ["Beginner", "Intermediate", "Advanced"] },
  { key: "goal", title: "Your primary goal", type: "single", options: ["Internship", "Placement", "Freelancing", "Startup", "Higher Studies", "Remote Job"] },
  { key: "studyTime", title: "Daily study time", type: "single", options: ["1 Hour", "2 Hours", "4 Hours", "6+ Hours"] },
];

export function OnboardingFlow({ displayName, onDone }: { displayName?: string; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>({});
  const [finalizing, setFinalizing] = useState(false);
  const step = STEPS[idx];
  const total = STEPS.length;
  const progress = ((idx + 1) / total) * 100;
  const { refresh } = useAuth();

  const currentValue = profile[step.key];
  const canNext =
    step.type === "multi"
      ? Array.isArray(currentValue) && currentValue.length > 0
      : !!currentValue;

  function select(option: string) {
    setProfile((p) => {
      if (step.type === "multi") {
        const arr = Array.isArray(p[step.key]) ? (p[step.key] as string[]) : [];
        const next = arr.includes(option) ? arr.filter((o) => o !== option) : [...arr, option];
        return { ...p, [step.key]: next };
      }
      return { ...p, [step.key]: option };
    });
  }

  async function next() {
    if (idx < total - 1) {
      setIdx(idx + 1);
    } else {
      setFinalizing(true);
      try {
        await profileService.save(profile);
        authService.markOnboarded();
        await refresh(); // Force refresh the Auth session to update isFirstLogin to false!
        await new Promise((r) => setTimeout(r, 2200));
        onDone();
      } catch (err) {
        console.error("Error saving profile:", err);
        setFinalizing(false);
      }
    }
  }

  if (finalizing) {
    return (
      <div className="relative p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl"
          style={{ background: "linear-gradient(135deg, #14B8A6, #3B82F6)" }}
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>
        <h3 className="mt-5 text-lg font-semibold" style={{ color: "#0F172A" }}>
          Preparing your personalized career roadmap…
        </h3>
        <p className="mt-1 text-xs" style={{ color: "#64748B" }}>
          Mixing your goals, skills, and ambitions into a plan only for you.
        </p>
        <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin" style={{ color: "#14B8A6" }} />
      </div>
    );
  }

  return (
    <div className="relative p-7">
      {/* Progress */}
      <div className="flex items-center justify-between text-[11px] font-medium" style={{ color: "#64748B" }}>
        <span>Step {idx + 1} of {total}</span>
        {displayName && <span>Hey {displayName.split(" ")[0]} 👋</span>}
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(15,23,42,0.06)" }}>
        <motion.div
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #14B8A6, #3B82F6)" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5"
        >
          <h3 className="text-xl font-semibold tracking-tight" style={{ color: "#0F172A" }}>{step.title}</h3>
          {step.subtitle && <p className="mt-1 text-xs" style={{ color: "#64748B" }}>{step.subtitle}</p>}

          <div className={step.type === "multi" ? "mt-4 flex flex-wrap gap-2" : "mt-4 grid grid-cols-2 gap-2"}>
            {step.options.map((opt) => {
              const selected = step.type === "multi"
                ? Array.isArray(currentValue) && currentValue.includes(opt)
                : currentValue === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => select(opt)}
                  className="group relative flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition"
                  style={{
                    borderColor: selected ? "#14B8A6" : "rgba(15,23,42,0.12)",
                    background: selected
                      ? "linear-gradient(135deg, rgba(20,184,166,0.12), rgba(59,130,246,0.06))"
                      : "rgba(255,255,255,0.6)",
                    color: "#0F172A",
                    boxShadow: selected ? "0 0 0 3px rgba(20,184,166,0.12)" : "none",
                  }}
                >
                  <span>{opt}</span>
                  {selected && <Check className="h-4 w-4" style={{ color: "#0F766E" }} />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-black/5 disabled:opacity-40"
          style={{ color: "#64748B" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!canNext}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #14B8A6, #3B82F6)" }}
        >
          {idx === total - 1 ? "Finish" : "Continue"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
