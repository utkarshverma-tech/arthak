import { supabase } from "./supabaseClient";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  isFirstLogin: boolean;
  createdAt: string;
}

const ONBOARDING_KEY = "arthak.auth.onboarded";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

async function checkIsFirstLogin(accessToken: string | undefined): Promise<boolean> {
  if (!accessToken) return true;
  try {
    const response = await fetch(`${BACKEND_URL}/api/profiles/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.status === 404;
  } catch (err) {
    console.error("Error checking backend profile:", err);
    return true; // Fallback to onboarding if connection fails or error occurs
  }
}

export const authService = {
  async getSession(): Promise<AuthUser | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) return null;

      // Check if user has a profile in Express backend to determine isFirstLogin
      const isFirst = await checkIsFirstLogin(session.access_token);

      return {
        id: session.user.id,
        email: session.user.email || "",
        fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "",
        avatarUrl: session.user.user_metadata?.avatar_url || "",
        isFirstLogin: isFirst,
        createdAt: session.user.created_at,
      };
    } catch (e) {
      console.error("Error in getSession:", e);
      return null;
    }
  },

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user) throw new Error("Authentication failed");

    // Check if user has a profile in Express backend to determine isFirstLogin
    const isFirst = await checkIsFirstLogin(data.session?.access_token);

    return {
      id: data.user.id,
      email: data.user.email || "",
      fullName: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "",
      avatarUrl: data.user.user_metadata?.avatar_url || "",
      isFirstLogin: isFirst,
      createdAt: data.user.created_at,
    };
  },

  async signUpWithEmail(email: string, password: string, fullName: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    if (!data.user) throw new Error("Sign up failed");

    return {
      id: data.user.id,
      email: data.user.email || "",
      fullName,
      isFirstLogin: true, // A newly registered user needs onboarding
      createdAt: data.user.created_at,
    };
  },

  async signInWithGoogle(): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) throw error;
    // The browser will redirect to Google, so we won't return anything to the immediate caller.
    return null as any;
  },

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) throw error;
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ONBOARDING_KEY);
    }
  },

  markOnboarded() {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ONBOARDING_KEY, "1");
  },

  onAuthStateChange(cb: (user: AuthUser | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        cb(null);
        return;
      }

      // Check if user has a profile asynchronously on the backend
      checkIsFirstLogin(session.access_token)
        .then((isFirst) => {
          cb({
            id: session.user!.id,
            email: session.user!.email || "",
            fullName: session.user!.user_metadata?.full_name || session.user!.email?.split("@")[0] || "",
            avatarUrl: session.user!.user_metadata?.avatar_url || "",
            isFirstLogin: isFirst,
            createdAt: session.user!.created_at,
          });
        })
        .catch(() => {
          // If check fails, fallback to first login = true
          cb({
            id: session.user!.id,
            email: session.user!.email || "",
            fullName: session.user!.user_metadata?.full_name || session.user!.email?.split("@")[0] || "",
            avatarUrl: session.user!.user_metadata?.avatar_url || "",
            isFirstLogin: true,
            createdAt: session.user!.created_at,
          });
        });
    });

    return () => {
      subscription.unsubscribe();
    };
  },
};
