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

  // Force dark theme colors to match the user's template image
  const C = {
    bg: "#080B11",
    surface: "#0E1320",
    card: "rgba(14, 19, 32, 0.8)",
    primary: "#14B8A6",
    secondary: "#6366F1",
    accent: "#14B8A6",
    highlight: "#10B981",
    text: "#FFFFFF",
    muted: "#94A3B8",
    border: "rgba(255, 255, 255, 0.06)",
    borderStrong: "rgba(255, 255, 255, 0.12)",
  };

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
          
          {/* Scoped CSS to override sticky header style for profile page only */}
          <style>{`
            header.sticky {
              background-color: rgba(8, 11, 17, 0.85) !important;
              border-color: rgba(255, 255, 255, 0.06) !important;
            }
            header.sticky a, header.sticky button {
              color: #E2E8F0 !important;
            }
            header.sticky a:hover, header.sticky button:hover {
              color: #FFFFFF !important;
            }
            header.sticky input {
              color: #FFFFFF !important;
            }
            header.sticky input::placeholder {
              color: #94A3B8 !important;
            }
            header.sticky div[style*="background-color: rgba(255, 255, 255, 0.7)"] {
              background-color: rgba(255, 255, 255, 0.05) !important;
              border-color: rgba(255, 255, 255, 0.1) !important;
            }
            body {
              background-color: #080B11 !important;
            }
          `}</style>

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
  "Achievements",
  "Documents",
] as const;

type Tab = (typeof tabs)[number];

function ProfilePageContent() {
  const [activeTab, setActiveTab] = useState<Tab>("About");

  return (
    <div className="min-h-screen text-[#FFFFFF] antialiased pt-2 flex flex-col gap-6">
      {/* Banner & User Meta Card at the top */}
      <ProfileHeaderCard />

      {/* Stats Row */}
      <StatsRow />

      {/* Tabs Bar */}
      <TabsBar activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <TabContent tab={activeTab} />
    </div>
  );
}

function ProfileHeaderCard() {
  const { C } = useContext(ThemeContext);
  const { profile, onEditClick } = useContext(ProfileContext);
  const { user } = useAuth();

  const capitalizeName = (name: string) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const rawDisplayName = profile?.fullName || user?.fullName || "Utkarsh Verma";
  const displayName = capitalizeName(rawDisplayName);
  const displayRole = profile?.careerGoal || "Full Stack Developer";
  const displayLocation = profile?.location || "Bareilly, India";
  const displayEmail = user?.email || "utkarshv8957@gmail.com";

  // Load avatar and banner from localStorage
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const localAvatar = localStorage.getItem("arthak_profile_avatar");
      const localBanner = localStorage.getItem("arthak_profile_banner");
      if (localAvatar) {
        setAvatarImage(localAvatar);
      }
      if (localBanner) {
        setBannerImage(localBanner);
      }
    }
  }, [user]);

  // Handle avatar/banner change
  const handleBannerUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const urlStr = ev.target.result as string;
          setBannerImage(urlStr);
          localStorage.setItem("arthak_profile_banner", urlStr);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleAvatarUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const urlStr = ev.target.result as string;
          setAvatarImage(urlStr);
          localStorage.setItem("arthak_profile_avatar", urlStr);
          window.dispatchEvent(new Event("avatar_updated"));
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl overflow-hidden shadow-lg" style={{ borderColor: C.border }}>
      {/* Banner area */}
      <div 
        className="h-44 sm:h-52 w-full relative overflow-hidden bg-gradient-to-br from-[#050811] to-[#0E1626]"
        style={bannerImage ? { backgroundImage: `url(${bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
      >
        {/* SVG Mountain graphic if no user image banner is uploaded */}
        {!bannerImage && (
          <svg className="absolute right-0 bottom-0 h-full w-[60%] opacity-60 pointer-events-none" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 100 L 600 100" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <path d="M 0 150 L 600 150" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <path d="M 150 0 L 150 200" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <path d="M 300 0 L 300 200" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <path d="M 450 0 L 450 200" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <path d="M 150 200 L 250 120 L 350 200" fill="rgba(20,184,166,0.03)" />
            <path d="M 350 200 L 480 70 L 600 200" fill="rgba(99,102,241,0.04)" />
            <path d="M 250 200 L 450 30 L 600 200 Z" fill="url(#mountainGrad)" opacity="0.8" />
            <path d="M 260 200 Q 320 160 350 130 T 420 70 T 450 32" stroke="url(#pathGrad)" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="280" cy="188" r="3" fill="#14B8A6" filter="drop-shadow(0 0 4px #14B8A6)" />
            <circle cx="330" cy="150" r="3.5" fill="#14B8A6" filter="drop-shadow(0 0 4px #14B8A6)" />
            <circle cx="380" cy="105" r="3" fill="#14B8A6" filter="drop-shadow(0 0 4px #14B8A6)" />
            <circle cx="420" cy="70" r="3.5" fill="#14B8A6" filter="drop-shadow(0 0 4px #14B8A6)" />
            <line x1="450" y1="30" x2="450" y2="10" stroke="#14B8A6" strokeWidth="1.5" />
            <path d="M 450 10 L 475 16 L 450 22 Z" fill="#14B8A6" />
            <g transform="translate(438, 20)">
              <circle cx="5" cy="2" r="1.5" fill="#FFFFFF" />
              <line x1="5" y1="3.5" x2="5" y2="7" stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1="2" y1="4.5" x2="8" y2="4.5" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="5" y1="7" x2="3.5" y2="10" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="5" y1="7" x2="6.5" y2="10" stroke="#FFFFFF" strokeWidth="1" />
            </g>
            <defs>
              <linearGradient id="mountainGrad" x1="450" y1="30" x2="450" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0B1323" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#050811" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="pathGrad" x1="250" y1="200" x2="450" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Banner text */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-left">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white/90">From Confusion</h2>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#14B8A6] to-[#0D9488] mt-1">To Career</h2>
        </div>

        {/* Edit banner button */}
        <button 
          onClick={handleBannerUpload}
          className="absolute right-6 top-6 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md transition hover:bg-black/60 flex items-center gap-1.5"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          Edit Banner
        </button>
      </div>

      {/* Profile Info Row below banner */}
      <div className="px-6 sm:px-8 pb-6 relative pt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        {/* Avatar overlapping container */}
        <div className="absolute -top-16 left-6 sm:left-8 h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-[#080B11] bg-[#0E1320] overflow-hidden group shadow-lg">
          <div 
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: avatarImage ? `url(${avatarImage})` : undefined }}
          >
            {!avatarImage && (
              <div className="h-full w-full flex items-center justify-center bg-slate-800 text-white text-3xl font-bold">
                {displayName.charAt(0)}
              </div>
            )}
          </div>
          {/* Avatar edit overlay */}
          <button 
            onClick={handleAvatarUpload}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
          >
            <Pencil className="h-5 w-5 text-white" />
          </button>
          
          {/* Status green dot */}
          <span className="absolute bottom-1 right-2 flex h-3.5 w-3.5">
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#10B981] border-2 border-[#080B11]"></span>
          </span>
        </div>

        {/* Profile Info Details */}
        <div className="flex-1 text-left flex flex-col gap-1.5 md:pl-36">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{displayName}</h2>
            <svg className="h-5 w-5 text-[#10B981] fill-current" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-0.5 text-xs font-semibold text-[#10B981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] mr-1.5" />
              {displayRole}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{displayLocation}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              <span>{displayEmail}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              <span>linkedin.com/in/utkarshverma</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
          <button 
            onClick={onEditClick}
            className="h-10 px-4 rounded-xl border border-slate-700 bg-transparent text-[13px] font-semibold text-white transition hover:bg-white/5 flex items-center gap-1.5"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </button>
          <button 
            className="h-10 px-4 rounded-xl bg-[#14B8A6] text-[13px] font-semibold text-white transition hover:bg-[#0D9488] shadow-md flex items-center gap-1.5"
          >
            <Globe className="h-4 w-4" />
            View Public Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsRow() {
  const { C } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);

  const filledFields = profile ? Object.values(profile).filter(v => v !== undefined && (!Array.isArray(v) || v.length > 0)).length : 0;
  const completion = profile ? Math.min(100, Math.round(((filledFields + 2) / 11) * 100)) : 84;

  const size = 64;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (completion / 100) * circ;

  const cards = [
    {
      label: "Assessments",
      value: "12",
      sub: "3 this month",
      Icon: ClipboardCheck,
      color: "#3B82F6",
      tint: "bg-blue-500/10 text-blue-400",
    },
    {
      label: "Projects",
      value: "6",
      sub: "2 in progress",
      Icon: FolderKanban,
      color: "#8B5CF6",
      tint: "bg-purple-500/10 text-purple-400",
    },
    {
      label: "Certificates",
      value: "9",
      sub: "Earned",
      Icon: Award,
      color: "#F59E0B",
      tint: "bg-amber-500/10 text-amber-400",
    },
    {
      label: "Badges",
      value: "7",
      sub: "Unlocked",
      Icon: Trophy,
      color: "#10B981",
      tint: "bg-emerald-500/10 text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Profile Score Card (Takes 2 columns) */}
      <div 
        className="rounded-[20px] border bg-[#0E1320]/80 p-5 shadow-sm flex items-center justify-between col-span-1 sm:col-span-2 gap-4 text-left"
        style={{ borderColor: C.border }}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-wider text-slate-400">Profile Score</p>
            <p className="mt-2 text-[13px] text-slate-300 font-medium">Good going! Keep improving 🚀</p>
          </div>
          <button className="mt-3.5 h-8 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-bold text-white transition self-start border border-slate-800">
            Improve Now
          </button>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
          <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={stroke}
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#14B8A6"
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="text-center flex flex-col items-center justify-center absolute">
            <span className="text-[15px] font-extrabold leading-none text-white">{completion}</span>
            <span className="text-[9px] font-semibold text-slate-500 mt-0.5">/100</span>
          </div>
        </div>
      </div>

      {/* Other 4 Stats Cards */}
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-[20px] border bg-[#0E1320]/80 p-5 shadow-sm flex flex-col justify-between text-left"
          style={{ borderColor: C.border }}
        >
          <div className="flex items-center justify-between w-full">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.tint}`}>
              <c.Icon className="h-4.5 w-4.5" />
            </div>
            <span className="text-slate-500 hover:text-white transition cursor-pointer text-xs flex items-center gap-0.5 font-bold uppercase tracking-wider">
              <span className="hidden sm:inline">View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="mt-5">
            <p className="text-[11.5px] font-bold uppercase tracking-wider text-slate-500">{c.label}</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-white">{c.value}</span>
              <span className="text-[11px] font-semibold text-slate-400">{c.sub}</span>
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
    <div className="rounded-[18px] border bg-[#0E1320]/80 px-2 shadow-soft" style={{ borderColor: C.border }}>
      <div className="scrollbar-none flex items-center gap-1 overflow-x-auto whitespace-nowrap">
        {tabs.map((t) => {
          const active = t === activeTab;
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={
                "relative shrink-0 px-4 py-3.5 text-[13.5px] font-semibold transition " +
                (active
                  ? "text-white"
                  : "text-slate-400 hover:text-white")
              }
            >
              {t}
              {active && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#14B8A6]" />
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
    case "Achievements":
      return <AchievementsCard />;
    case "Documents":
      return <DocumentsCard />;
    case "Experience":
      return <EmptyCard title="Experience" description="Add internships, freelance and part-time work." icon={Briefcase} />;
  }
}

function SectionCard({
  title,
  icon: Icon,
  children,
  action,
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
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-soft" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-[#14B8A6]">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">{title}</h3>
        </div>
        {action && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-transparent px-3 py-1.5 text-[11.5px] font-semibold text-slate-300 transition hover:bg-white/5"
          >
            <Pencil className="h-3.5 w-3.5" />
            {action}
          </button>
        )}
      </header>
      <div className="px-6 py-6 text-left">{children}</div>
    </section>
  );
}

function AboutSection() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] items-start">
      {/* Left Column */}
      <div className="flex flex-col gap-6">
        <AboutMeCard />
        <EducationCard />
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        <TopSkillsCard />
        <InterestsCard />
      </div>
    </div>
  );
}

function AboutMeCard() {
  const { C } = useContext(ThemeContext);
  const { profile, onEditClick } = useContext(ProfileContext);

  const summary = profile?.aboutMe || 
    "I am a College Student focused on Master's. Currently preparing for a career as a Full Stack Developer with a daily study commit of 6+ hours. I love building projects and solving real-world problems.";

  return (
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-sm text-left overflow-hidden" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-[#14B8A6]">
            <UserRound className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">About Me</h3>
        </div>
        <button
          onClick={onEditClick}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-transparent px-3 py-1.5 text-[11.5px] font-semibold text-slate-300 transition hover:bg-white/5"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </header>
      
      <div className="px-6 py-6 flex flex-col gap-6">
        <p className="text-[13.5px] leading-relaxed text-slate-300">
          {summary}
        </p>

        {/* 2x2 Grid for Meta Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <MetaDetailCard icon={MapPin} label="Location" value={profile?.location || "Bareilly, India"} />
          <MetaDetailCard icon={Phone} label="Phone" value={profile?.phone || "+91 1234567890"} />
          <MetaDetailCard icon={Cake} label="Date of Birth" value={profile?.dob || "Not specified"} />
          <MetaDetailCard icon={UserRound} label="Gender" value={profile?.gender || "Not specified"} />
        </div>
      </div>
    </section>
  );
}

function MetaDetailCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl bg-[#161B26] p-3.5 border border-slate-800/40">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="text-left min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">{label}</p>
        <p className="text-[13px] font-medium text-white truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function EducationCard() {
  const { C } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);
  return (
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-sm text-left overflow-hidden" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <GraduationCap className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Education</h3>
        </div>
      </header>

      <div className="px-6 py-6">
        <ol className="relative space-y-6 border-l pl-6 border-slate-800">
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
      </div>
    </section>
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
  return (
    <li className="relative text-left">
      <span
        className={
          "absolute -left-[32px] top-1.5 h-3.5 w-3.5 rounded-full border-2 " +
          (current ? "border-[#14B8A6] bg-[#14B8A6]" : "border-slate-700 bg-[#0E1320]")
        }
      />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-[14px] font-bold text-white">{school}</h4>
          <p className="mt-0.5 text-[13px] text-slate-300">{degree}</p>
          <p className="mt-0.5 text-[11.5px] text-slate-500">{meta}</p>
        </div>
        <div className="text-right">
          <p className="text-[12.5px] font-bold text-[#14B8A6]">{score}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{period}</p>
        </div>
      </div>
    </li>
  );
}

function TopSkillsCard() {
  const { C } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);

  const skills = profile?.skills && profile.skills.length > 0 ? profile.skills : [
    "JavaScript",
    "React.js",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Tailwind CSS",
    "MongoDB",
    "Git & GitHub",
  ];

  return (
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-sm text-left overflow-hidden" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-[#14B8A6]">
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Top Skills</h3>
        </div>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-transparent px-3 py-1.5 text-[11.5px] font-semibold text-slate-300 transition hover:bg-white/5"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </header>

      <div className="px-6 py-6 flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span 
              key={s} 
              className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-[#161B26] px-3 py-1.5 text-[12.5px] font-medium text-slate-200 shadow-sm"
            >
              {s}
            </span>
          ))}
        </div>
        
        <button className="h-9 w-full rounded-xl border border-dashed border-slate-700 bg-transparent text-[12px] font-semibold text-slate-400 hover:text-white hover:border-slate-500 transition flex items-center justify-center gap-1">
          <Plus className="h-3.5 w-3.5" />
          Add Skill
        </button>
      </div>
    </section>
  );
}

function InterestsCard() {
  const { C } = useContext(ThemeContext);
  
  const interests = [
    "AI & ML",
    "Open Source",
    "Reading",
    "Gaming",
    "Fitness",
  ];

  return (
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-sm text-left overflow-hidden" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
            <Heart className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Interests</h3>
        </div>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-transparent px-3 py-1.5 text-[11.5px] font-semibold text-slate-300 transition hover:bg-white/5"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </header>

      <div className="px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {interests.map((i) => (
            <span 
              key={i} 
              className="inline-flex items-center rounded-lg border border-slate-800 bg-[#161B26] px-3 py-1.5 text-[12.5px] font-medium text-slate-300"
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillsCard() {
  const { C } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);
  const skills = profile?.skills || [];

  return (
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-sm text-left overflow-hidden" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-[#14B8A6]">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Skills</h3>
        </div>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-transparent px-3 py-1.5 text-[11.5px] font-semibold text-slate-300 transition hover:bg-white/5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Skill
        </button>
      </header>

      <div className="px-6 py-6 flex flex-wrap gap-2.5">
        {skills.map((s) => (
          <span 
            key={s} 
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#161B26] px-4 py-2 text-[13px] font-semibold text-slate-200 shadow-soft"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}

const projects = [
  {
    name: "LensLM — Vision QA Playground",
    desc: "Multimodal LLM chat with images, docs and screen regions. Built with PyTorch, FastAPI and Next.js.",
    stack: ["Python", "PyTorch", "FastAPI", "Next.js"],
    status: "Live",
  },
  {
    name: "Roadmap.ai",
    desc: "AI-generated personalised learning roadmaps for CS students with progress tracking.",
    stack: ["Next.js", "OpenAI", "Postgres"],
    status: "In progress",
  },
  {
    name: "Kirana Insights",
    desc: "Sales forecasting dashboard for grocery stores using XGBoost.",
    stack: ["Python", "XGBoost", "Streamlit"],
    status: "Live",
  },
];

function ProjectsCard() {
  const { C } = useContext(ThemeContext);
  return (
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-sm text-left overflow-hidden" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
            <FolderKanban className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Recent Projects</h3>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-transparent px-3 py-1.5 text-[11.5px] font-semibold text-slate-300 transition hover:bg-white/5">
          <Plus className="h-3.5 w-3.5" />
          Add Project
        </button>
      </header>

      <div className="px-6 py-6 space-y-4">
        {projects.map((p) => (
          <div
            key={p.name}
            className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#161B26]/40 p-5 transition hover:border-[#14B8A6]/20 md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-[14.5px] font-bold text-white">{p.name}</h4>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${p.status === "Live" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                  {p.status}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-slate-400">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-lg bg-slate-800 px-2.5 py-0.5 text-[11.5px] font-medium text-slate-300 border border-slate-700/50">{s}</span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-[#161B26] hover:bg-slate-800 transition text-slate-400 hover:text-white">
                <Github className="h-4.5 w-4.5" />
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#161B26] px-3 py-2 text-[12.5px] font-semibold transition hover:bg-slate-800 text-white">
                Live
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
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
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-sm text-left overflow-hidden" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-[#14B8A6]">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Documents & Links</h3>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-transparent px-3 py-1.5 text-[11.5px] font-semibold text-slate-300 transition hover:bg-white/5">
          <Plus className="h-3.5 w-3.5" />
          Upload
        </button>
      </header>

      <div className="px-6 py-6">
        <ul className="divide-y divide-slate-800/40">
          {docs.map((d) => (
            <li key={d.name} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#161B26] text-slate-400">
                  <d.Icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="truncate text-[13.5px] font-semibold text-white">{d.name}</p>
                  <p className="text-[11.5px] text-slate-500">{d.size}</p>
                </div>
              </div>
              <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-[#161B26] text-slate-400 hover:text-white transition">
                <Download className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const achievements = [
  { label: "Learning Streak", value: "42 days", Icon: Flame, tint: "bg-amber-500/10 text-amber-400" },
  { label: "Hackathons", value: "4 attended", Icon: Trophy, tint: "bg-blue-500/10 text-blue-400" },
  { label: "Internships", value: "1 completed", Icon: Briefcase, tint: "bg-purple-500/10 text-purple-400" },
  { label: "Certifications", value: "9 earned", Icon: Award, tint: "bg-emerald-500/10 text-emerald-400" },
];

function AchievementsCard() {
  const { C } = useContext(ThemeContext);
  return (
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-sm text-left overflow-hidden" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Trophy className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Achievements</h3>
        </div>
      </header>

      <div className="px-6 py-6 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {achievements.map((a) => (
            <div
              key={a.label}
              className="rounded-2xl border border-slate-800 bg-[#161B26]/30 p-4"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${a.tint}`}>
                <a.Icon className="h-4.5 w-4.5" />
              </div>
              <p className="mt-3 text-[12px] text-slate-500 font-medium">{a.label}</p>
              <p className="text-[15px] font-bold text-white mt-0.5">{a.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <h4 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-slate-400">
            Badges
          </h4>
          <div className="flex flex-wrap gap-2">
            {["Top 5% Assessments", "First Project Shipped", "AI Coach Regular", "Resume Ready", "Hackathon Finalist"].map(
              (b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#161B26] px-3 py-1.5 text-[12.5px] font-medium text-slate-200 shadow-sm"
                >
                  <BadgeCheck className="h-4 w-4 text-[#14B8A6]" />
                  {b}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
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
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
          <Plus className="h-5 w-5" />
        </div>
        <p className="text-[14px] font-semibold text-white">{title} is empty</p>
        <p className="max-w-sm text-[13px] text-slate-400">{description}</p>
      </div>
    </SectionCard>
  );
}

/* ============ DEDICATED UTILITIES & TIMELINES ============ */
function Divider() {
  const { C } = useContext(ThemeContext);
  return <div className="my-5 h-px w-full" style={{ background: C.border }} />;
}

function CareerGoalsCard() {
  const { C } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);
  return (
    <section className="rounded-[24px] border bg-[#0E1320]/80 backdrop-blur-xl shadow-sm text-left overflow-hidden" style={{ borderColor: C.border }}>
      <header className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Target className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-white">Career Goals</h3>
        </div>
      </header>

      <div className="px-6 py-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Preferred Roles">
          <div className="flex flex-wrap gap-2 mt-1.5">
            <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
              {profile?.careerGoal || "Full Stack Developer"}
            </span>
          </div>
        </Field>
        <Field label="Primary Objective" icon={Trophy}>
          <p className="text-[14px] font-semibold text-white mt-1">{profile?.goal || "Placement"}</p>
        </Field>
        <Field label="Preferred Locations">
          <div className="flex flex-wrap gap-2 mt-1.5">
            <span className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">Bangalore</span>
            <span className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">Delhi NCR</span>
            <span className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">Remote</span>
          </div>
        </Field>
        <Field label="Daily Study Commitment" icon={Clock}>
          <p className="text-[14px] font-semibold text-white mt-1">{profile?.studyTime || "6+ Hours"}</p>
        </Field>
        <Field label="Current Status" icon={UserRound}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 text-[12px] font-semibold text-blue-300 mt-1">
            {profile?.userType || "Student"}
          </span>
        </Field>
        <Field label="Expected Graduation" icon={GraduationCap}>
          <p className="text-[14px] font-semibold text-white mt-1">{profile?.currentYear || "Final Year"}</p>
        </Field>
      </div>
    </section>
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
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </div>
      {children}
    </div>
  );
}
