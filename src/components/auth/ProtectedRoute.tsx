import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading, openModal, user } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      openModal("login");
    } else if (!loading && isAuthenticated && user?.isFirstLogin) {
      openModal("signup");
    }
  }, [loading, isAuthenticated, openModal, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#FAF7F2" }}>
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#14B8A6" }} />
      </div>
    );
  }

  if (!isAuthenticated || user?.isFirstLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center" style={{ background: "#FAF7F2" }}>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: "#0F172A" }}>
            {!isAuthenticated ? "Sign in required" : "Onboarding required"}
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: "#64748B" }}>
            {!isAuthenticated 
              ? "This page is part of your Career Operating System." 
              : "Please complete your career profile setup to continue."}
          </p>
          <button
            onClick={() => openModal(user ? "signup" : "login")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #14B8A6, #3B82F6)" }}
          >
            {user ? "Setup Profile" : "Sign in to continue"}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
