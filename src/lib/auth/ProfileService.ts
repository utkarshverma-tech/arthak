import { supabase } from "./supabaseClient";

export interface OnboardingProfile {
  userType?: string;
  education?: string;
  currentYear?: string;
  skills?: string[];
  careerGoal?: string;
  experience?: string;
  goal?: string;
  studyTime?: string;
  fullName?: string;
  
  // New user editable fields
  location?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  languages?: string[];
  aboutMe?: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const profileService = {
  async get(): Promise<OnboardingProfile | null> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user || !session?.access_token) return null;

      const response = await fetch(`${BACKEND_URL}/api/profiles/me`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        userType: data.userType,
        education: data.education,
        currentYear: data.currentYear,
        skills: data.skills,
        careerGoal: data.careerGoal,
        experience: data.experience,
        goal: data.goal,
        studyTime: data.studyTime,
        fullName: data.fullName,
        location: data.location,
        gender: data.gender,
        dob: data.dob,
        phone: data.phone,
        languages: data.languages,
        aboutMe: data.aboutMe,
      };
    } catch (e) {
      console.error("Error fetching profile:", e);
      return null;
    }
  },

  async save(profile: OnboardingProfile): Promise<void> {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user || !session?.access_token) {
      throw new Error("No active session");
    }

    const fullName = profile.fullName || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "";

    const response = await fetch(`${BACKEND_URL}/api/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        fullName,
        userType: profile.userType,
        education: profile.education,
        currentYear: profile.currentYear,
        skills: profile.skills,
        careerGoal: profile.careerGoal,
        experience: profile.experience,
        goal: profile.goal,
        studyTime: profile.studyTime,
        location: profile.location,
        gender: profile.gender,
        dob: profile.dob,
        phone: profile.phone,
        languages: profile.languages,
        aboutMe: profile.aboutMe,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save profile on backend: ${response.statusText}`);
    }
  },
};
