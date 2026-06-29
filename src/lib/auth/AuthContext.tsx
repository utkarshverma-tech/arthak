import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService, type AuthUser } from "./authService";

type AuthModalView = "login" | "signup" | "forgot" | null;

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  modal: AuthModalView;
  openModal: (view?: Exclude<AuthModalView, null>) => void;
  closeModal: () => void;
  signInWithEmail: (email: string, password: string) => Promise<AuthUser>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<AuthUser>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<AuthModalView>(null);

  useEffect(() => {
    let mounted = true;
    authService.getSession().then((u) => {
      if (!mounted) return;
      setUser(u);
      setLoading(false);
    });
    const unsub = authService.onAuthStateChange((u) => mounted && setUser(u));
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      modal,
      openModal: (view = "login") => setModal(view),
      closeModal: () => setModal(null),
      async signInWithEmail(email, password) {
        const u = await authService.signInWithEmail(email, password);
        setUser(u);
        return u;
      },
      async signUpWithEmail(email, password, fullName) {
        const u = await authService.signUpWithEmail(email, password, fullName);
        setUser(u);
        return u;
      },
      async signInWithGoogle() {
        const u = await authService.signInWithGoogle();
        setUser(u);
        return u;
      },
      async resetPassword(email) {
        await authService.resetPassword(email);
      },
      async signOut() {
        await authService.signOut();
        setUser(null);
      },
      async refresh() {
        setUser(await authService.getSession());
      },
    }),
    [user, loading, modal],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
