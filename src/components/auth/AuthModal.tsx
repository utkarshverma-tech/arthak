import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { LoadingWorkspace } from "./LoadingWorkspace";
import { OnboardingFlow } from "./OnboardingFlow";
import logoImg from "@/assets/logo.png";

type View = "login" | "signup" | "forgot";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden>
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.3-1.66 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.07-1.1-.15-1.5H12z"/>
    <path fill="#4285F4" d="M21.1 12.2c0-.6-.07-1.1-.15-1.5H12v3.9h5.5c-.24 1.3-1.66 3.8-5.5 3.8v-3.1h9.1z"/>
  </svg>
);

export function AuthModal() {
  const { modal, closeModal, openModal, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, user } = useAuth();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [stage, setStage] = useState<"form" | "syncing" | "onboarding">("form");

  useEffect(() => {
    if (modal) {
      setView(modal === "forgot" ? "forgot" : modal);
      setError(null);
      setInfo(null);
      if (user?.isFirstLogin) {
        setStage("onboarding");
      } else {
        setStage("form");
      }
    }
  }, [modal, user]);

  useEffect(() => {
    if (modal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  if (!modal) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (view === "login") {
        if (!email.includes("@")) throw new Error("Invalid Email: Please enter a valid email address");
        if (password.length < 6) throw new Error("Incorrect Password: Password must be at least 6 characters");
        const u = await signInWithEmail(email, password);
        await afterAuth(u.isFirstLogin);
      } else if (view === "signup") {
        if (!fullName.trim()) throw new Error("Full name is required");
        if (!email.includes("@")) throw new Error("Invalid Email: Please enter a valid email address");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        if (password !== confirm) throw new Error("Passwords do not match");
        if (!agree) throw new Error("Please accept Terms & Privacy Policy");
        const u = await signUpWithEmail(email, password, fullName);
        await afterAuth(u.isFirstLogin);
      } else {
        if (!email.includes("@")) throw new Error("Invalid Email: Please enter a valid email address");
        await resetPassword(email);
        setInfo("Reset link sent. Check your inbox.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network Error: Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  }

  async function afterAuth(isFirst: boolean) {
    setStage("syncing");
    await new Promise((r) => setTimeout(r, 2800));
    if (isFirst) {
      setStage("onboarding");
    } else {
      closeModal();
      window.location.href = "/dashboard";
    }
  }

  return (
    <AnimatePresence>
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        
        .auth-modal-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 24px 16px;
          width: 100vw;
          height: 100vh;
          overflow-y: auto;
        }

        .auth-modal-panel {
          display: flex;
          flex-direction: column;
          width: 420px;
          max-width: 90%;
          max-height: 90vh;
          overflow: hidden;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(17, 24, 39, 0.08);
          box-shadow: 0 30px 80px rgba(17,24,39,0.08), 0 10px 40px -10px rgba(20,184,166,0.04), inset 0 1px 0 rgba(255,255,255,0.7);
          position: relative;
        }

        .auth-right-panel {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 36px 32px;
          overflow-y: auto;
        }
      `}} />
      
      <div
        key="overlay"
        className="auth-modal-overlay no-scrollbar"
        onClick={() => stage === "form" && closeModal()}
      >
        {/* Soft Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.025]" 
          style={{
            backgroundImage: "radial-gradient(#111827 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        
        {/* Static Background Gradient Blobs (Zero lag performance optimization) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full blur-[90px]" 
            style={{ background: "radial-gradient(circle, rgba(20,184,166,0.06), transparent 70%)" }} 
          />
          <div 
            className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-[350px] w-[350px] rounded-full blur-[100px]" 
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05), transparent 70%)" }} 
          />
        </div>

        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 12, scale: 0.97, filter: "blur(3px)" }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="auth-modal-panel no-scrollbar"
        >
          {/* Close Button placed at panel level so it is always accessible */}
          <button
            onClick={closeModal}
            className="absolute right-5 top-5 rounded-full p-2 text-gray-400 hover:text-gray-900 transition-colors duration-200 hover:bg-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 z-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {stage === "syncing" ? (
            <LoadingWorkspace />
          ) : stage === "onboarding" ? (
            <OnboardingFlow
              displayName={user?.fullName || fullName}
              onDone={() => {
                closeModal();
                window.location.href = "/dashboard";
              }}
            />
          ) : (
            <div className="auth-right-panel no-scrollbar">
              <AnimatePresence mode="wait">
                {view === "login" && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}
                  >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-6 w-full">
                      {/* Logo Wrapper centered */}
                      <div className="relative w-36 h-12 overflow-hidden mb-2 flex items-center justify-center shrink-0">
                        <img
                          src={logoImg}
                          alt="ARTHAK Logo"
                          className="absolute left-[-42px] top-[calc(50%-6px)] -translate-y-1/2 h-52 w-auto max-w-none object-contain"
                        />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight text-gray-900">
                        Welcome Back 👋
                      </h2>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-gray-500 px-2">
                        Continue your personalized career journey. Access your roadmap, resume, AI mentor and career progress.
                      </p>
                    </div>

                    {/* Google Auth */}
                    <motion.button
                      whileHover={{ scale: 1.005, backgroundColor: "rgba(255,255,255,0.9)" }}
                      whileTap={{ scale: 0.995 }}
                      type="button"
                      onClick={handleGoogle}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2.5 rounded-2xl border bg-white/50 px-4 py-3 text-sm font-semibold text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                      style={{ borderColor: "rgba(17, 24, 39, 0.08)", height: "50px" }}
                    >
                      <GoogleIcon />
                      Continue with Google
                    </motion.button>

                    {/* Divider */}
                    <div className="my-5 flex items-center gap-3 w-full">
                      <div className="h-px flex-1 bg-gray-900/10" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Continue with Email</span>
                      <div className="h-px flex-1 bg-gray-900/10" />
                    </div>

                    {/* Credentials Form */}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "100%", gap: "14px" }}>
                      <FloatingInput
                        icon={<Mail className="h-4.5 w-4.5" />}
                        label="Email address"
                        value={email}
                        onChange={setEmail}
                        type="email"
                      />
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <FloatingInput
                          icon={<Lock className="h-4.5 w-4.5" />}
                          label="Password"
                          value={password}
                          onChange={setPassword}
                          type={showPw ? "text" : "password"}
                          rightAction={
                            <button
                              type="button"
                              onClick={() => setShowPw((v) => !v)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          }
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setView("forgot")}
                            className="text-xs font-semibold text-teal-700 hover:underline transition-all"
                          >
                            Forgot password?
                          </button>
                        </div>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 rounded-xl border border-red-200/50 bg-red-50/50 px-4 py-2.5 text-xs text-red-700 font-medium"
                        >
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <motion.button
                        whileHover={{ 
                          scale: 1.005, 
                          boxShadow: "0 8px 25px -5px rgba(59, 130, 246, 0.35), 0 4px 15px -3px rgba(20, 184, 166, 0.25)" 
                        }}
                        whileTap={{ scale: 0.995 }}
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-60 overflow-hidden"
                        style={{ 
                          background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
                          height: "50px"
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                            <span>Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <span>Login</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </motion.button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500">
                      New to ARTHAK?{" "}
                      <button
                        onClick={() => { setView("signup"); setError(null); setInfo(null); }}
                        className="font-bold text-teal-700 hover:underline"
                      >
                        Create your free account →
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === "signup" && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}
                  >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-6 w-full">
                      {/* Logo Wrapper centered */}
                      <div className="relative w-36 h-12 overflow-hidden mb-2 flex items-center justify-center shrink-0">
                        <img
                          src={logoImg}
                          alt="ARTHAK Logo"
                          className="absolute left-[-42px] top-[calc(50%-6px)] -translate-y-1/2 h-52 w-auto max-w-none object-contain"
                        />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight text-gray-900">
                        Create Your Career Workspace
                      </h2>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-gray-500 px-2">
                        Start your journey from confusion to career.
                      </p>
                    </div>

                    {/* Google Auth */}
                    <motion.button
                      whileHover={{ scale: 1.005, backgroundColor: "rgba(255,255,255,0.9)" }}
                      whileTap={{ scale: 0.995 }}
                      type="button"
                      onClick={handleGoogle}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2.5 rounded-2xl border bg-white/50 px-4 py-3 text-sm font-semibold text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                      style={{ borderColor: "rgba(17, 24, 39, 0.08)", height: "50px" }}
                    >
                      <GoogleIcon />
                      Continue with Google
                    </motion.button>

                    {/* Divider */}
                    <div className="my-5 flex items-center gap-3 w-full">
                      <div className="h-px flex-1 bg-gray-900/10" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">OR</span>
                      <div className="h-px flex-1 bg-gray-900/10" />
                    </div>

                    {/* Credentials Form */}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "100%", gap: "14px" }}>
                      <FloatingInput
                        icon={<UserIcon className="h-4.5 w-4.5" />}
                        label="Full name"
                        value={fullName}
                        onChange={setFullName}
                        type="text"
                      />

                      <FloatingInput
                        icon={<Mail className="h-4.5 w-4.5" />}
                        label="Email address"
                        value={email}
                        onChange={setEmail}
                        type="email"
                      />

                      <FloatingInput
                        icon={<Lock className="h-4.5 w-4.5" />}
                        label="Password"
                        value={password}
                        onChange={setPassword}
                        type={showPw ? "text" : "password"}
                        rightAction={
                          <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />

                      <FloatingInput
                        icon={<Lock className="h-4.5 w-4.5" />}
                        label="Confirm password"
                        value={confirm}
                        onChange={setConfirm}
                        type="password"
                      />

                      <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agree}
                          onChange={(e) => setAgree(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded-lg border-gray-900/10 focus:ring-blue-500/20 text-teal-600"
                        />
                        <span>
                          I agree to the{" "}
                          <a href="#" className="font-semibold text-teal-700 hover:underline">
                            Terms
                          </a>{" "}
                          &{" "}
                          <a href="#" className="font-semibold text-teal-700 hover:underline">
                            Privacy Policy
                          </a>
                          .
                        </span>
                      </label>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 rounded-xl border border-red-200/50 bg-red-50/50 px-4 py-2.5 text-xs text-red-700 font-medium"
                        >
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <motion.button
                        whileHover={{ 
                          scale: 1.005, 
                          boxShadow: "0 8px 25px -5px rgba(59, 130, 246, 0.35), 0 4px 15px -3px rgba(20, 184, 166, 0.25)" 
                        }}
                        whileTap={{ scale: 0.995 }}
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-60 overflow-hidden"
                        style={{ 
                          background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
                          height: "50px"
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </motion.button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500 font-semibold">
                      Already have an account?{" "}
                      <button
                        onClick={() => { setView("login"); setError(null); setInfo(null); }}
                        className="font-bold text-teal-700 hover:underline"
                      >
                        Login →
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === "forgot" && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}
                  >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-6 w-full">
                      {/* Logo Wrapper centered */}
                      <div className="relative w-36 h-12 overflow-hidden mb-2 flex items-center justify-center shrink-0">
                        <img
                          src={logoImg}
                          alt="ARTHAK Logo"
                          className="absolute left-[-42px] top-[calc(50%-6px)] -translate-y-1/2 h-52 w-auto max-w-none object-contain"
                        />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight text-gray-900">
                        Reset Your Password
                      </h2>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-gray-500 px-2">
                        Enter your email and we'll send you a recovery link.
                      </p>
                    </div>

                    {/* Credentials Form */}
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "100%", gap: "14px" }}>
                      <FloatingInput
                        icon={<Mail className="h-4.5 w-4.5" />}
                        label="Email address"
                        value={email}
                        onChange={setEmail}
                        type="email"
                      />

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 rounded-xl border border-red-200/50 bg-red-50/50 px-4 py-2.5 text-xs text-red-700 font-medium"
                        >
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      {info && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 rounded-xl border border-emerald-200/50 bg-emerald-50/50 px-4 py-2.5 text-xs text-emerald-800 font-medium"
                        >
                          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" style={{ color: "#10B981" }} />
                          <span>{info}</span>
                        </motion.div>
                      )}

                      <motion.button
                        whileHover={{ 
                          scale: 1.005, 
                          boxShadow: "0 8px 25px -5px rgba(59, 130, 246, 0.35), 0 4px 15px -3px rgba(20, 184, 166, 0.25)" 
                        }}
                        whileTap={{ scale: 0.995 }}
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-60 overflow-hidden"
                        style={{ 
                          background: "linear-gradient(135deg, #14B8A6, #3B82F6)",
                          height: "50px"
                        }}
                      >
                        {loading ? (
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                          <>
                            <span>Send Recovery Link</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </motion.button>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500">
                      <button
                        onClick={() => { setView("login"); setError(null); setInfo(null); }}
                        className="font-bold text-teal-700 hover:underline"
                      >
                        ← Back to login
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  // Helper to avoid unused warning
  void openModal;
}

function FloatingInput({
  icon,
  label,
  value,
  onChange,
  type,
  rightAction,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  rightAction?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div
      className="relative flex items-center rounded-2xl border bg-white/45 backdrop-blur-md px-4 py-3 transition-all duration-300 focus-within:border-[#3b82f6] focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.06)]"
      style={{
        borderColor: focused ? "#3b82f6" : "rgba(17, 24, 39, 0.08)",
        height: "52px",
      }}
    >
      <span className="text-gray-400 mr-2.5 shrink-0 transition-colors duration-300">
        {icon}
      </span>
      <div className="relative flex-1 h-full flex items-center">
        <label
          className={`absolute left-0 pointer-events-none transition-all duration-200 ease-out ${
            isFloating
              ? "text-[10px] font-bold text-[#3b82f6] -translate-y-[12px]"
              : "text-sm text-gray-400 translate-y-0"
          }`}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent text-sm font-semibold outline-none transition-all duration-200 ${
            isFloating ? "pt-3 text-gray-900" : "text-gray-900"
          }`}
          style={{ border: "none", boxShadow: "none" }}
          required
        />
      </div>
      {rightAction && <div className="ml-2 shrink-0">{rightAction}</div>}
    </div>
  );
}
