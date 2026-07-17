import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useContext, useEffect, createContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Pencil, Cake, Phone, Mail, Star, MapPin, UserRound, Rocket, Flame, Globe,
  ClipboardCheck, FolderKanban, Award, FileText, ArrowUpRight, Languages, Heart,
  BookOpen, Compass, IndianRupee, Home, Clock, CheckCircle2, Github, Linkedin,
  ExternalLink, Download, Plus, Trophy, BadgeCheck, Briefcase, Building2,
  ArrowLeft, Coffee, Sun, GraduationCap, Sparkles, Target, Loader2
} from "lucide-react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { Header } from "@/components/Header";
import avatarUrl from "@/assets/avatar-utkarsh.jpg";
import { profileService, type OnboardingProfile } from "@/lib/auth/ProfileService";

// Profile Data Context
export const ProfileContext = createContext<{
  profile: OnboardingProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  onEditClick?: () => void;
}>({
  profile: null,
  loading: true,
  refresh: async () => {},
});

// Import layout components from dashboard route
import {
  ThemeContext,
  getColors,
  MeshBackdrop,
  FloatingAI
} from "./dashboard";

export const Route = createFileRoute("/profile")({
  component: () => (
    <ProtectedRoute>
      <ProfileShell />
    </ProtectedRoute>
  ),
  head: () => ({
    meta: [
      { title: "Profile — ARTHAK" },
      {
        name: "description",
        content: "Manage your career profile on ARTHAK — skills, projects, education and preferences in one AI-powered workspace.",
      },
      { property: "og:title", content: "Profile — ARTHAK" },
      {
        property: "og:description",
        content: "Manage your career profile on ARTHAK — skills, projects, education and preferences in one AI-powered workspace.",
      },
    ],
  }),
});

function EditProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { C } = useContext(ThemeContext);
  const { profile, refresh } = useContext(ProfileContext);
  
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    location: profile?.location || "",
    gender: profile?.gender || "",
    dob: profile?.dob || "",
    phone: profile?.phone || "",
    languages: profile?.languages ? profile.languages.join(", ") : "",
    aboutMe: profile?.aboutMe || "",
    education: profile?.education || "",
    currentYear: profile?.currentYear || "",
    careerGoal: profile?.careerGoal || "",
    experience: profile?.experience || "",
    goal: profile?.goal || "",
    studyTime: profile?.studyTime || "",
  });

  const [saving, setSaving] = useState(false);

  // Sync state if profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        location: profile.location || "",
        gender: profile.gender || "",
        dob: profile.dob || "",
        phone: profile.phone || "",
        languages: profile.languages ? profile.languages.join(", ") : "",
        aboutMe: profile.aboutMe || "",
        education: profile.education || "",
        currentYear: profile.currentYear || "",
        careerGoal: profile.careerGoal || "",
        experience: profile.experience || "",
        goal: profile.goal || "",
        studyTime: profile.studyTime || "",
      });
    }
  }, [profile]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedLanguages = formData.languages
        ? formData.languages.split(",").map((l) => l.trim()).filter(Boolean)
        : [];
        
      await profileService.save({
        ...formData,
        languages: parsedLanguages,
      });
      await refresh();
      onClose();
    } catch (err) {
      console.error("Error saving profile details:", err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border bg-white/60 px-3.5 py-2 text-sm shadow-soft outline-none transition focus:border-primary focus:bg-white";
  const selectClass = "w-full rounded-xl border bg-white/60 px-3.5 py-2 text-sm shadow-soft outline-none transition focus:border-primary focus:bg-white";
  const labelClass = "text-[12.5px] font-semibold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[24px] border bg-white/95 backdrop-blur-2xl p-6 shadow-2xl"
        style={{ borderColor: C.border }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold" style={{ color: C.text }}>Edit Profile Details</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-slate-100 transition text-slate-400 hover:text-slate-600 text-lg"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6 text-left">
          {/* Group 1: General Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Full Name</label>
              <input 
                type="text" 
                className={inputClass} 
                style={{ borderColor: C.border }}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Location</label>
              <input 
                type="text" 
                placeholder="e.g. Bareilly, UP"
                className={inputClass} 
                style={{ borderColor: C.border }}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Gender</label>
              <select 
                className={selectClass} 
                style={{ borderColor: C.border }}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Date of Birth</label>
              <input 
                type="text" 
                placeholder="e.g. 20 April 2005"
                className={inputClass} 
                style={{ borderColor: C.border }}
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Phone Number</label>
              <input 
                type="tel" 
                placeholder="e.g. +91 89570 32763"
                className={inputClass} 
                style={{ borderColor: C.border }}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} style={{ color: C.muted }}>About Me (Professional Summary)</label>
            <textarea 
              rows={3}
              placeholder="Write a brief professional summary..."
              className="w-full rounded-xl border bg-white/60 px-3.5 py-2 text-sm shadow-soft outline-none transition focus:border-primary focus:bg-white resize-none"
              style={{ borderColor: C.border }}
              value={formData.aboutMe}
              onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass} style={{ color: C.muted }}>Languages (Comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. English, Hindi, Spanish"
              className={inputClass} 
              style={{ borderColor: C.border }}
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
            />
          </div>

          {/* Group 2: Academic Info */}
          <Divider />
          <h4 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>Academic & Career Goals</h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Education</label>
              <select
                className={selectClass}
                style={{ borderColor: C.border }}
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              >
                <option value="">Select Education Level</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Current Year of Study</label>
              <select
                className={selectClass}
                style={{ borderColor: C.border }}
                value={formData.currentYear}
                onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Career Goal</label>
              <select
                className={selectClass}
                style={{ borderColor: C.border }}
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              >
                <option value="">Select Career Path</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Experience Level</label>
              <select
                className={selectClass}
                style={{ borderColor: C.border }}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              >
                <option value="">Select Experience</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Primary Goal</label>
              <select
                className={selectClass}
                style={{ borderColor: C.border }}
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              >
                <option value="">Select Goal</option>
                <option value="Internship">Internship</option>
                <option value="Placement">Placement</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Startup">Startup</option>
                <option value="Higher Studies">Higher Studies</option>
                <option value="Remote Job">Remote Job</option>
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: C.muted }}>Daily Study Time</label>
              <select
                className={selectClass}
                style={{ borderColor: C.border }}
                value={formData.studyTime}
                onChange={(e) => setFormData({ ...formData, studyTime: e.target.value })}
              >
                <option value="">Select Commitment</option>
                <option value="1 Hour">1 Hour</option>
                <option value="2 Hours">2 Hours</option>
                <option value="4 Hours">4 Hours</option>
                <option value="6+ Hours">6+ Hours</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
              style={{ borderColor: C.borderStrong, color: C.text }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ProfileShell() {
  const [isWarm, setIsWarm] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [profileData, setProfileData] = useState<OnboardingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const C = getColors(isWarm);

  const refreshProfile = async () => {
    try {
      const data = await profileService.get();
      setProfileData(data);
    } catch (e) {
      console.error("Error refreshing profile:", e);
    }
  };

  useEffect(() => {
    let active = true;
    profileService.get().then((data) => {
      if (active) {
        setProfileData(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ isWarm, setIsWarm, C }}>
      <ProfileContext.Provider value={{ profile: profileData, loading, refresh: refreshProfile, onEditClick: () => setIsEditOpen(true) }}>
        <div className="min-h-screen font-sans antialiased transition-colors duration-300" style={{ background: C.bg, color: C.text }}>
          <MeshBackdrop />
          
          {/* Home Page Header */}
          <Header />

          {/* Full-width standalone layout container */}
          <main className="px-4 sm:px-6 lg:px-10 pb-24 pt-6 mx-auto max-w-[1240px] z-10 relative">
            <ProfilePageContent />
          </main>
          
          <FloatingAI open={aiOpen} setOpen={setAiOpen} />

          <AnimatePresence>
            {isEditOpen && (
              <EditProfileModal open={isEditOpen} onClose={() => setIsEditOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      </ProfileContext.Provider>
    </ThemeContext.Provider>
  );
}

/* ============== PROFILE PAGE CONTENT ============== */

const tabs = [
  "About",
  "Education",
  "Skills",
  "Experience",
  "Career Goals",
  "Projects",
  "Achievements",
  "Documents",
  "Settings",
] as const;

type Tab = (typeof tabs)[number];

function ProfilePageContent() {
  const [activeTab, setActiveTab] = useState<Tab>("About");

  return (
    <div className="min-h-screen text-foreground antialiased pt-2">
      <PageHeader />
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <ProfileCard />
        <div className="flex flex-col gap-6">
          <StatsRow />
          <TabsBar activeTab={activeTab} onChange={setActiveTab} />
          <TabContent tab={activeTab} />
        </div>
      </div>
    </div>
  );
}

function PageHeader() {
  const { C } = useContext(ThemeContext);
  const { onEditClick } = useContext(ProfileContext);
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight" style={{ color: C.text }}>
          My Profile
        </h1>
        <p className="mt-1 text-sm" style={{ color: C.muted }}>
          Manage your personal information, education and career preferences.
        </p>
      </div>
      <button 
        onClick={onEditClick}
        className="inline-flex items-center gap-2 rounded-xl border bg-white/80 px-4 py-2 text-sm font-medium shadow-soft transition hover:bg-slate-900/5" 
        style={{ borderColor: C.borderStrong, color: C.text }}
      >
        <Pencil className="h-4 w-4" style={{ color: C.muted }} />
        Edit Profile
      </button>
    </div>
  );
}

function ProfileCard() {
  const { C } = useContext(ThemeContext);
  const { profile, onEditClick } = useContext(ProfileContext);
  const { user } = useAuth();

  const filledFields = profile ? Object.values(profile).filter(v => v !== undefined && (!Array.isArray(v) || v.length > 0)).length : 0;
  const completion = profile ? Math.min(100, Math.round(((filledFields + 2) / 10) * 100)) : 20;

  const size = 132;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (completion / 100) * circ;

  return (
    <aside className="h-fit rounded-[24px] border bg-white/75 backdrop-blur-xl p-6 shadow-md xl:sticky xl:top-24" style={{ borderColor: C.border }}>
      {/* Avatar + ring */}
      <div className="flex flex-col items-center text-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--border)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--primary)"
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-[10px] overflow-hidden rounded-full ring-1 ring-border">
            <img
              src={avatarUrl}
              alt={user?.fullName || "User Avatar"}
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-tint-blue px-2.5 py-1 text-[11px] font-semibold text-primary">
          <Star className="h-3 w-3 fill-primary" />
          {completion}% Profile Complete
        </div>

        <h2 className="mt-4 text-[18px] font-semibold tracking-tight" style={{ color: C.text }}>{profile?.fullName || user?.fullName || "Student"}</h2>
        <p className="mt-1 text-[13px]" style={{ color: C.muted }}>
          {profile?.education || "Not specified"}{profile?.currentYear ? ` (${profile.currentYear})` : ""}
        </p>
        <p className="text-[13px]" style={{ color: C.muted }}>Future University</p>
      </div>

      <Divider />

      <ul className="space-y-3.5 text-[13.5px]">
        <MetaRow icon={MapPin} label="Location" value={profile?.location || "Not specified"} />
        <MetaRow icon={UserRound} label="Gender" value={profile?.gender || "Not specified"} />
        <MetaRow icon={Cake} label="Date of Birth" value={profile?.dob || "Not specified"} />
      </ul>

      <Divider />

      <ul className="space-y-3.5 text-[13.5px]">
        <MetaRow
          icon={Phone}
          label="Phone"
          value={profile?.phone || "Not specified"}
          verified={!!profile?.phone}
        />
        <MetaRow
          icon={Mail}
          label="Email"
          value={user?.email || "you@arthak.com"}
          verified
        />
      </ul>

      <Divider />

      <ul className="space-y-3.5 text-[13.5px]">
        <MetaRow icon={Rocket} label="Primary Career" value={profile?.careerGoal || "Not specified"} />
        <MetaRow icon={Flame} label="Current Level" value={profile?.experience || "Not specified"} />
      </ul>

      <div className="mt-6 flex flex-col gap-2">
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-90">
          <Globe className="h-4 w-4" />
          View Public Profile
        </button>
        <button 
          onClick={onEditClick}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50" 
          style={{ borderColor: C.borderStrong, color: C.text }}
        >
          <Pencil className="h-4 w-4" style={{ color: C.muted }} />
          Edit Profile
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[11.5px]" style={{ borderColor: C.border, color: C.muted }}>
        <span>Member since Jan 2024</span>
        <span>Updated 2d ago</span>
      </div>
    </aside>
  );
}

function Divider() {
  const { C } = useContext(ThemeContext);
  return <div className="my-5 h-px w-full" style={{ background: C.border }} />;
}

function MetaRow({
  icon: Icon,
  label,
  value,
  verified,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  verified?: boolean;
}) {
  const { C } = useContext(ThemeContext);
  return (
    <li className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5" style={{ color: C.muted }}>
        <Icon className="h-4 w-4 shrink-0" style={{ color: C.muted }} />
        <span className="text-[12.5px]">{label}</span>
      </div>
      <div className="flex min-w-0 items-center gap-1.5 text-right">
        <span className="truncate text-[13px] font-medium" style={{ color: C.text }}>{value}</span>
        {verified && (
          <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" />
        )}
      </div>
    </li>
  );
}

const stats = [
  {
    label: "Assessments",
    value: "12",
    sub: "3 this month",
    Icon: ClipboardCheck,
    tint: "bg-tint-blue text-primary",
  },
  {
    label: "Projects",
    value: "6",
    sub: "2 in progress",
    Icon: FolderKanban,
    tint: "bg-tint-violet text-indigo-700",
  },
  {
    label: "Certificates",
    value: "9",
    sub: "Earned",
    Icon: Award,
    tint: "bg-tint-amber text-amber-600",
  },
  {
    label: "Resume Score",
    value: "84",
    sub: "Out of 100",
    Icon: FileText,
    tint: "bg-tint-emerald text-emerald-600",
  },
];

function StatsRow() {
  const { C } = useContext(ThemeContext);
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-[18px] border bg-white/80 p-5 shadow-soft"
          style={{ borderColor: C.border }}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.tint}`}
            >
              <s.Icon className="h-4 w-4" />
            </div>
            <ArrowUpRight className="h-4 w-4" style={{ color: C.muted }} />
          </div>
          <div className="mt-4">
            <p className="text-[13px]" style={{ color: C.muted }}>{s.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[26px] font-semibold tracking-tight" style={{ color: C.text }}>{s.value}</span>
              <span className="text-[12px]" style={{ color: C.muted }}>{s.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabsBar({
  activeTab,
  onChange,
}: {
  activeTab: Tab;
  onChange: (t: Tab) => void;
}) {
  const { C } = useContext(ThemeContext);
  return (
    <div className="rounded-[18px] border bg-white/80 px-2 shadow-soft" style={{ borderColor: C.border }}>
      <div className="scrollbar-none flex items-center gap-1 overflow-x-auto whitespace-nowrap">
        {tabs.map((t) => {
          const active = t === activeTab;
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={
                "relative shrink-0 px-4 py-3.5 text-[13.5px] font-medium transition " +
                (active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground")
              }
              style={{ color: active ? C.text : C.muted }}
            >
              {t}
              {active && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "About":
      return <AboutSection />;
    case "Education":
      return <EducationCard />;
    case "Skills":
      return <SkillsCard />;
    case "Career Goals":
      return <CareerGoalsCard />;
    case "Projects":
      return <ProjectsCard />;
    case "Achievements":
      return <AchievementsCard />;
    case "Documents":
      return <DocumentsCard />;
    case "Experience":
      return <EmptyCard title="Experience" description="Add internships, freelance and part-time work." icon={Briefcase} />;
    case "Settings":
      return <EmptyCard title="Settings" description="Notifications, visibility and account preferences." icon={Compass} />;
  }
}

function SectionCard({
  title,
  icon: Icon,
  children,
  action = "Edit",
  onAction,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  const { C } = useContext(ThemeContext);
  return (
    <section className="rounded-[20px] border bg-white/75 backdrop-blur-xl shadow-soft" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tint-blue text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight" style={{ color: C.text }}>{title}</h3>
        </div>
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-[12.5px] font-medium transition hover:bg-slate-50"
          style={{ borderColor: C.borderStrong, color: C.muted }}
        >
          <Pencil className="h-3.5 w-3.5" />
          {action}
        </button>
      </header>
      <div className="border-t px-6 py-6" style={{ borderColor: C.border }}>{children}</div>
    </section>
  );
}

function AboutSection() {
  const { C } = useContext(ThemeContext);
  const { profile, onEditClick } = useContext(ProfileContext);

  const summary = profile?.aboutMe || (profile?.userType === "Working Professional"
    ? `I am a working professional focused on building career skills. Targeting roles in ${profile?.careerGoal || "Software development"}. Currently looking for ${profile?.goal || "placements / growth opportunities"}.`
    : `I am a ${profile?.userType || "student"} focused on ${profile?.education || "computer applications"}. Currently preparing for a career as a ${profile?.careerGoal || "Software Professional"} with a daily study commit of ${profile?.studyTime || "2+ hours"}.`);

  const skills = profile?.skills || [
    "Deep Learning",
    "LLM Systems",
    "Computer Vision",
    "Open Source",
    "Product Design"
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Professional Summary" icon={UserRound} onAction={onEditClick}>
        <p className="text-[14px] leading-6" style={{ color: C.text }}>
          {summary}
        </p>
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Interests" icon={Heart} onAction={onEditClick}>
          <div className="flex flex-wrap gap-2">
            {skills.map((i) => (
              <Chip key={i}>{i}</Chip>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Languages" icon={Languages} onAction={onEditClick}>
          <ul className="space-y-3 text-[14px]">
            {profile?.languages && profile.languages.length > 0 ? (
              profile.languages.map((l) => (
                <LangRow key={l} name={l} level="Conversational" pct={80} />
              ))
            ) : (
              <>
                <LangRow name="English" level="Professional" pct={90} />
                <LangRow name="Hindi" level="Native" pct={100} />
                <LangRow name="Sanskrit" level="Elementary" pct={30} />
              </>
            )}
          </ul>
        </SectionCard>

        <SectionCard title="Learning Style" icon={BookOpen} onAction={onEditClick}>
          <p className="text-[14px] leading-6" style={{ color: C.text }}>
            Project-first learner. Daily study time: {profile?.studyTime || "2+ Hours"}. Prefers hands-on practice, reading code, and shipping side projects.
          </p>
        </SectionCard>

        <SectionCard title="Career Vision" icon={Compass} onAction={onEditClick}>
          <p className="text-[14px] leading-6" style={{ color: C.text }}>
            Become a {profile?.careerGoal || "Software Professional"} specializing in tech, landing a {profile?.goal || "Internship / Remote Job"} to build modern web solutions.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}

function LangRow({ name, level, pct }: { name: string; level: string; pct: number }) {
  const { C } = useContext(ThemeContext);
  return (
    <li>
      <div className="flex items-center justify-between">
        <span className="font-semibold" style={{ color: C.text }}>{name}</span>
        <span className="text-[12.5px]" style={{ color: C.muted }}>{level}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}

function CareerGoalsCard() {
  const { C } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);
  return (
    <SectionCard title="Career Goals" icon={Target}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Preferred Roles">
          <div className="flex flex-wrap gap-2">
            <Chip>{profile?.careerGoal || "Software Professional"}</Chip>
          </div>
        </Field>
        <Field label="Primary Objective" icon={Trophy}>
          <p className="text-[14px] font-semibold" style={{ color: C.text }}>{profile?.goal || "Not specified"}</p>
        </Field>
        <Field label="Preferred Locations">
          <div className="flex flex-wrap gap-2">
            <Chip>Bangalore</Chip>
            <Chip>Delhi NCR</Chip>
            <Chip>Remote</Chip>
          </div>
        </Field>
        <Field label="Daily Study Time" icon={Clock}>
          <p className="text-[14px] font-semibold" style={{ color: C.text }}>{profile?.studyTime || "2 Hours"}</p>
        </Field>
        <Field label="Current Status" icon={UserRound}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-blue px-2.5 py-1 text-[12px] font-medium text-indigo-700">
            {profile?.userType || "Student"}
          </span>
        </Field>
        <Field label="Target Milestone">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-emerald px-2.5 py-1 text-[12px] font-medium text-emerald-700">
            {profile?.goal || "Career Readiness"}
          </span>
        </Field>
        <Field label="Dream Target Industry" icon={Building2}>
          <p className="text-[14px] font-semibold" style={{ color: C.text }}>AI, FinTech and SaaS startups</p>
        </Field>
        <Field label="Expected Graduation" icon={GraduationCap}>
          <p className="text-[14px] font-semibold" style={{ color: C.text }}>{profile?.currentYear || "Not specified"}</p>
        </Field>
      </div>
    </SectionCard>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const { C } = useContext(ThemeContext);
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide" style={{ color: C.muted }}>
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </div>
      {children}
    </div>
  );
}

function EducationCard() {
  const { profile } = useContext(ProfileContext);
  return (
    <SectionCard title="Education" icon={GraduationCap}>
      <ol className="relative space-y-6 border-l pl-6 border-slate-100">
        <EduItem
          school="Future University"
          degree={profile?.education || "Bachelor of Computer Applications (BCA)"}
          meta={profile?.currentYear ? `Status: Enrolled (${profile.currentYear})` : "Branch: Computer Science & IT"}
          score="Verified Student"
          period="Active Academic Path"
          current
        />
        <EduItem
          school="Delhi Public School"
          degree="Class 12 — Science (PCM + CS)"
          meta="CBSE Board"
          score="92.4%"
          period="2022 – 2023"
        />
        <EduItem
          school="Delhi Public School"
          degree="Class 10"
          meta="CBSE Board"
          score="94.2%"
          period="2020 – 2021"
        />
      </ol>
    </SectionCard>
  );
}

function EduItem({
  school,
  degree,
  meta,
  score,
  period,
  current,
}: {
  school: string;
  degree: string;
  meta: string;
  score: string;
  period: string;
  current?: boolean;
}) {
  const { C } = useContext(ThemeContext);
  return (
    <li className="relative">
      <span
        className={
          "absolute -left-[32px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-white " +
          (current ? "border-indigo-600 bg-indigo-600" : "border-slate-200")
        }
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-[15px] font-semibold" style={{ color: C.text }}>{school}</h4>
          <p className="mt-0.5 text-[13.5px]" style={{ color: C.text, opacity: 0.85 }}>{degree}</p>
          <p className="mt-0.5 text-[12.5px]" style={{ color: C.muted }}>{meta}</p>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-bold text-indigo-600">{score}</p>
          <p className="text-[12px]" style={{ color: C.muted }}>{period}</p>
        </div>
      </div>
    </li>
  );
}

const skillGroups = [
  {
    title: "AI / ML",
    items: [
      { name: "Python", level: 90 },
      { name: "PyTorch", level: 78 },
      { name: "TensorFlow", level: 70 },
      { name: "Machine Learning", level: 82 },
      { name: "Deep Learning", level: 74 },
      { name: "Computer Vision", level: 68 },
      { name: "NLP", level: 60 },
    ],
  },
  {
    title: "Engineering",
    items: [
      { name: "SQL", level: 85 },
      { name: "FastAPI", level: 72 },
      { name: "React", level: 68 },
      { name: "Node.js", level: 60 },
      { name: "Docker", level: 55 },
      { name: "Git", level: 88 },
    ],
  },
];

function SkillsCard() {
  const { C } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);
  const skills = profile?.skills || [];

  return (
    <SectionCard title="Skills" icon={Sparkles} action="Add Skill">
      <div className="space-y-8">
        <div>
          <h4 className="mb-3 text-[12.5px] font-bold uppercase tracking-wide" style={{ color: C.muted }}>
            My Professional Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((s) => (
                <SkillChip key={s} name={s} level={85} />
              ))
            ) : (
              ["Python", "React", "Node.js", "SQL", "Git"].map((s, idx) => (
                <SkillChip key={s} name={s} level={80 - idx * 5} />
              ))
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function SkillChip({ name, level }: { name: string; level: number }) {
  const { C } = useContext(ThemeContext);
  const tone =
    level >= 80
      ? "bg-tint-emerald text-emerald-700"
      : level >= 60
      ? "bg-tint-blue text-primary"
      : "bg-slate-100 text-slate-700";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[13px] font-semibold shadow-soft" style={{ borderColor: C.border }}>
      {name}
      <span className={`rounded-full px-1.5 py-0.5 text-[10.5px] font-bold ${tone}`}>
        {level}%
      </span>
    </span>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  const { C } = useContext(ThemeContext);
  return (
    <span className="inline-flex items-center rounded-full border bg-slate-50 px-2.5 py-1 text-[12.5px] font-semibold" style={{ borderColor: C.borderStrong, color: C.text }}>
      {children}
    </span>
  );
}

const projects = [
  {
    name: "LensLM — Vision QA Playground",
    desc: "Multimodal LLM chat with images, docs and screen regions. Built with PyTorch, FastAPI and Next.js.",
    stack: ["Python", "PyTorch", "FastAPI", "Next.js"],
    status: "Live",
    tone: "bg-tint-emerald text-emerald-700",
  },
  {
    name: "Roadmap.ai",
    desc: "AI-generated personalised learning roadmaps for CS students with progress tracking.",
    stack: ["Next.js", "OpenAI", "Postgres"],
    status: "In progress",
    tone: "bg-tint-amber text-amber-700",
  },
  {
    name: "Kirana Insights",
    desc: "Sales forecasting dashboard for grocery stores using XGBoost.",
    stack: ["Python", "XGBoost", "Streamlit"],
    status: "Live",
    tone: "bg-tint-emerald text-emerald-700",
  },
];

function ProjectsCard() {
  const { C } = useContext(ThemeContext);
  return (
    <SectionCard title="Recent Projects" icon={FolderKanban} action="Add Project">
      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p.name}
            className="group flex flex-col gap-3 rounded-2xl border p-5 transition hover:border-indigo-600/30 hover:bg-slate-50/20 md:flex-row md:items-center md:justify-between"
            style={{ borderColor: C.border }}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-[15px] font-semibold" style={{ color: C.text }}>{p.name}</h4>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${p.tone}`}
                >
                  {p.status}
                </span>
              </div>
              <p className="mt-1 text-[13.5px]" style={{ color: C.muted }}>{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-white transition hover:bg-slate-50" style={{ borderColor: C.borderStrong, color: C.muted }}>
                <Github className="h-4 w-4" />
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-[12.5px] font-semibold transition hover:bg-slate-50" style={{ borderColor: C.borderStrong, color: C.text }}>
                Live
                <ExternalLink className="h-3.5 w-3.5" style={{ color: C.muted }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

const docs = [
  { name: "Resume — Utkarsh Verma.pdf", size: "218 KB", Icon: FileText },
  { name: "Deep Learning Specialization.pdf", size: "1.2 MB", Icon: Award },
  { name: "Portfolio — utkarsh.dev", size: "Link", Icon: Globe },
  { name: "LinkedIn — /in/utkarshverma", size: "Link", Icon: Linkedin },
  { name: "GitHub — /utkarshv", size: "Link", Icon: Github },
];

function DocumentsCard() {
  const { C } = useContext(ThemeContext);
  return (
    <SectionCard title="Documents & Links" icon={FileText} action="Upload">
      <ul className="divide-y divide-slate-100">
        {docs.map((d) => (
          <li key={d.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tint-blue text-primary">
                <d.Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold" style={{ color: C.text }}>{d.name}</p>
                <p className="text-[12px]" style={{ color: C.muted }}>{d.size}</p>
              </div>
            </div>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-slate-500 transition hover:bg-slate-50" style={{ borderColor: C.borderStrong }}>
              <Download className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

const achievements = [
  { label: "Learning Streak", value: "42 days", Icon: Flame, tint: "bg-tint-amber text-amber-600" },
  { label: "Hackathons", value: "4 attended", Icon: Trophy, tint: "bg-tint-blue text-primary" },
  { label: "Internships", value: "1 completed", Icon: Briefcase, tint: "bg-tint-violet text-purple-700" },
  { label: "Certifications", value: "9 earned", Icon: Award, tint: "bg-tint-emerald text-emerald-600" },
];

function AchievementsCard() {
  const { C } = useContext(ThemeContext);
  return (
    <SectionCard title="Achievements" icon={Trophy}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {achievements.map((a) => (
          <div
            key={a.label}
            className="rounded-2xl border p-4 bg-white/50"
            style={{ borderColor: C.border }}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.tint}`}>
              <a.Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-[13px]" style={{ color: C.muted }}>{a.label}</p>
            <p className="text-[16px] font-semibold tracking-tight" style={{ color: C.text }}>{a.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="mb-3 text-[12.5px] font-bold uppercase tracking-wide" style={{ color: C.muted }}>
          Badges
        </h4>
        <div className="flex flex-wrap gap-2">
          {["Top 5% Assessments", "First Project Shipped", "AI Coach Regular", "Resume Ready", "Hackathon Finalist"].map(
            (b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-[12.5px] font-semibold shadow-soft"
                style={{ borderColor: C.borderStrong, color: C.text }}
              >
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                {b}
              </span>
            ),
          )}
        </div>
      </div>
    </SectionCard>
  );
}

function EmptyCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { C } = useContext(ThemeContext);
  return (
    <SectionCard title={title} icon={Icon} action="Add">
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tint-blue text-primary">
          <Plus className="h-5 w-5" />
        </div>
        <p className="text-[14px] font-semibold" style={{ color: C.text }}>{title} is empty</p>
        <p className="max-w-sm text-[13px]" style={{ color: C.muted }}>{description}</p>
      </div>
    </SectionCard>
  );
}
