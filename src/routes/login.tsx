'use client';

import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/AuthContext';
import { LoadingWorkspace } from '@/components/auth/LoadingWorkspace';
import { OnboardingFlow } from '@/components/auth/OnboardingFlow';

/* ------------------------------------------------------------------ */
/*  Arthak — Login / Signup                                            */
/*  Fully Integrated with AuthContext and custom layout               */
/* ------------------------------------------------------------------ */

type Tab = 'login' | 'signup' | 'forgot';

interface FieldErrors {
  loginEmail?: string;
  loginPassword?: string;
  signupName?: string;
  signupEmail?: string;
  signupPassword?: string;
  signupConfirm?: string;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function scorePassword(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthColors = ['#E4574C', '#E8A33D', '#3B82F6', '#12A38C'];

function LoginSignup() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v === 'signup' || v === 'forgot' || v === 'login') {
        return v as Tab;
      }
    }
    return 'login';
  });

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [remember, setRemember] = useState(false);

  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  // Auth States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'form' | 'syncing' | 'onboarding'>('form');
  const [userName, setUserName] = useState('');

  const [errors, setErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<{ show: boolean; text: string }>({
    show: false,
    text: '',
  });

  // Trust badge animation states
  const [studentCount, setStudentCount] = useState(1);
  const [isCounting, setIsCounting] = useState(false);
  const [starPulse, setStarPulse] = useState(false);

  const startAnimation = () => {
    if (isCounting) return;
    setIsCounting(true);
    let start = 1;
    const end = 1000;
    const duration = 1500; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress); // Ease out quad
      const current = Math.max(1, Math.floor(easeProgress * (end - start) + start));
      
      setStudentCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsCounting(false);
        setStarPulse(true);
        setTimeout(() => setStarPulse(false), 500);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    startAnimation();

    // Clean up url parameters to keep the URL clean (/login)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('view')) {
        url.searchParams.delete('view');
        window.history.replaceState({}, '', url.pathname);
      }
    }
  }, []);

  const handleCounterClick = () => {
    startAnimation();
  };

  function fireToast(text: string) {
    setToast({ show: true, text });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800);
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: FieldErrors = {};
    let ok = true;

    if (!loginEmail.trim()) {
      newErrors.loginEmail = 'Email is required';
      ok = false;
    } else if (!emailRe.test(loginEmail.trim())) {
      newErrors.loginEmail = 'Enter a valid email';
      ok = false;
    }

    if (!loginPassword) {
      newErrors.loginPassword = 'Password is required';
      ok = false;
    }

    setErrors((prev) => ({
      ...prev,
      loginEmail: newErrors.loginEmail,
      loginPassword: newErrors.loginPassword,
    }));

    if (!ok) return;

    setError(null);
    setLoading(true);
    try {
      const u = await signInWithEmail(loginEmail, loginPassword);
      setUserName(u.fullName || (u as any).name || '');
      await afterAuth(u.isFirstLogin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: FieldErrors = {};
    let ok = true;

    if (!signupName.trim()) {
      newErrors.signupName = 'Full name is required';
      ok = false;
    }

    if (!signupEmail.trim()) {
      newErrors.signupEmail = 'Email is required';
      ok = false;
    } else if (!emailRe.test(signupEmail.trim())) {
      newErrors.signupEmail = 'Enter a valid email';
      ok = false;
    }

    if (!signupPassword) {
      newErrors.signupPassword = 'Password is required';
      ok = false;
    } else if (signupPassword.length < 6) {
      newErrors.signupPassword = 'Minimum 6 characters';
      ok = false;
    }

    if (!signupConfirm || signupConfirm !== signupPassword) {
      newErrors.signupConfirm = 'Passwords do not match';
      ok = false;
    }

    setErrors((prev) => ({
      ...prev,
      signupName: newErrors.signupName,
      signupEmail: newErrors.signupEmail,
      signupPassword: newErrors.signupPassword,
      signupConfirm: newErrors.signupConfirm,
    }));

    if (!termsChecked) {
      fireToast('Please accept the Terms to continue');
      return;
    }

    if (!ok) return;

    setError(null);
    setLoading(true);
    try {
      const u = await signUpWithEmail(signupEmail, signupPassword, signupName);
      setUserName(signupName);
      await afterAuth(u.isFirstLogin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: FieldErrors = {};
    let ok = true;

    if (!loginEmail.trim()) {
      newErrors.loginEmail = 'Email is required';
      ok = false;
    } else if (!emailRe.test(loginEmail.trim())) {
      newErrors.loginEmail = 'Enter a valid email';
      ok = false;
    }

    setErrors((prev) => ({
      ...prev,
      loginEmail: newErrors.loginEmail,
    }));

    if (!ok) return;

    setError(null);
    setToast({ show: false, text: '' });
    setLoading(true);
    try {
      await resetPassword(loginEmail);
      fireToast('Reset link sent! Please check your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const u = await signInWithGoogle();
      if (u) {
        setUserName(u.fullName || (u as any).name || '');
        await afterAuth(u.isFirstLogin);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      setLoading(false);
    }
  }

  async function afterAuth(isFirst: boolean) {
    setStage('syncing');
    await new Promise((r) => setTimeout(r, 2800));
    if (isFirst) {
      setStage('onboarding');
    } else {
      navigate({ to: '/dashboard' });
    }
  }

  const strength = scorePassword(signupPassword);

  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} width="18" height="18">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="arrow-icon">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );

  if (stage === 'syncing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#FAF7F2_0%,#F5EFEB_100%)] p-4">
        <div className="w-[450px] max-w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl">
          <LoadingWorkspace />
        </div>
      </div>
    );
  }

  if (stage === 'onboarding') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#FAF7F2_0%,#F5EFEB_100%)] p-4">
        <div className="w-[500px] max-w-full bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
          <OnboardingFlow 
            displayName={userName} 
            onDone={() => navigate({ to: '/dashboard' })} 
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root{
          --cream: #FAF7F0;
          --cream-soft: #F4EFE3;
          --card: #FCFAF6;
          --border: #E8E2D2;
          --text: #0E1E1B;
          --muted: #6B706E;
          --teal: #0A4F44;
          --teal-dark: #073830;
          --teal-tint: #F3ECE0;
          --danger: #E4574C;
          --font-display: 'Sora', sans-serif;
          --font-body: 'Inter', sans-serif;
        }
        .arthak-body{
          font-family: var(--font-body);
          background-image: url("/images/ChatGPT Image Jul 15, 2026, 12_16_46 AM.png");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          color: var(--text);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .shell{
          width: 100%;
          max-width: 1200px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .auth-panel{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .auth-card{
          position: relative;
          width: 100%;
          max-width: 680px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 26px 24px;
          box-shadow: 0 20px 50px rgba(10, 79, 68, 0.08);
          display: flex;
          gap: 24px;
          transition: max-width 0.2s ease;
        }
        .auth-card.forgot-view {
          max-width: 380px !important;
        }
        .auth-card.forgot-view .divider-vertical {
          display: none !important;
        }
        .auth-card.forgot-view .right-col {
          display: none !important;
        }
        .auth-card.forgot-view .left-col {
          flex: 1 !important;
        }
        
        .left-col {
          flex: 1.2;
          display: flex;
          flex-direction: column;
        }
        
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--muted);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-bottom: 16px;
          align-self: flex-start;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .back-btn:hover {
          color: var(--teal);
          transform: translateX(-3px);
        }
        .back-btn svg {
          transition: transform 0.2s ease;
        }
        
        .right-col {
          flex: 0.8;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 8px;
        }
        
        .divider-vertical {
          width: 1px;
          background-color: var(--border);
          align-self: stretch;
        }

        .form-heading{ margin-bottom: 14px; }
        .form-heading h2{ 
          font-family: var(--font-display); 
          font-size: 22px; 
          font-weight: 700; 
          color: var(--teal); 
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }
        .form-heading p{ margin: 0; color: var(--muted); font-size: 13.5px; font-weight: 500; }

        .tabs{
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--cream-soft);
          border-radius: 999px;
          padding: 4px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 280px;
        }
        .tab-indicator{
          position: absolute; top: 4px; left: 4px;
          width: calc(50% - 4px); height: calc(100% - 8px);
          background: var(--teal); border-radius: 999px;
          transition: transform 0.3s cubic-bezier(.65,0,.35,1);
          z-index: 0;
        }
        .tabs.signup .tab-indicator{ transform: translateX(100%); }
        .tab-btn{
          position: relative; z-index: 1;
          background: none; border: none; padding: 10px 0;
          font-family: var(--font-body); font-weight: 700; font-size: 14px;
          color: var(--muted); cursor: pointer; border-radius: 999px;
          transition: color 0.25s ease;
        }
        .tab-btn.active{ color: #fff; }

        .field{ margin-bottom: 12px; }
        .field label{ display: block; font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .input-wrap{ position: relative; }
        .input-wrap input{
          width: 100%; background: var(--cream-soft); border: 1.5px solid var(--border);
          border-radius: 12px; padding: 10px 12px; color: var(--text);
          font-family: var(--font-body); font-size: 14px; outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .input-wrap input::placeholder{ color: #A7A08D; }
        .input-wrap input:focus{ border-color: var(--teal); background: #fff; box-shadow: 0 0 0 3px rgba(10, 79, 68, 0.08); }
        .input-wrap input.err{ border-color: var(--danger); }

        .toggle-eye{
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--muted);
          display: flex; align-items: center; padding: 2px;
        }
        .toggle-eye:hover{ color: var(--text); }

        .err-msg{ font-size: 11px; color: var(--danger); margin-top: 4px; min-height: 12px; }

        .row-between{ display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; font-size: 13px; }
        .remember{ display: flex; align-items: center; gap: 8px; color: var(--muted); font-weight: 500; cursor: pointer; }
        .remember input{ accent-color: var(--teal); width: 14px; height: 14px; cursor: pointer; }
        .link{ color: var(--teal); text-decoration: none; font-weight: 700; cursor: pointer; }
        .link:hover{ text-decoration: underline; }

        .terms{ display: flex; align-items: flex-start; gap: 9px; margin-bottom: 16px; font-size: 12.5px; color: var(--muted); line-height: 1.5; }
        .terms input{ margin-top: 3px; accent-color: var(--teal); }

        .submit-btn{
          width: 100%; padding: 11px 0; border-radius: 12px; border: none;
          background: var(--teal);
          color: #fff; font-family: var(--font-body); font-weight: 700; font-size: 14.5px;
          cursor: pointer; transition: transform 0.15s ease, background-color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover{ background-color: var(--teal-dark); }
        .submit-btn:active{ transform: translateY(1px); }
        .submit-btn:disabled{ opacity: 0.7; cursor: not-allowed; }

        .right-divider{ display: flex; align-items: center; gap: 12px; margin-bottom: 16px; color: var(--muted); font-size: 12.5px; font-weight: 500; }
        .right-divider::before, .right-divider::after{ content: ""; flex: 1; height: 1px; background: var(--border); }

        .oauth-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .oauth-btn{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1.5px solid var(--border);
          background: #fff;
          color: var(--text);
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
        }
        .oauth-btn:hover{
          border-color: var(--teal);
          background-color: var(--card);
          box-shadow: 0 4px 12px rgba(10, 79, 68, 0.04);
        }
        .oauth-btn:disabled{ opacity: 0.7; cursor: not-allowed; }
        .oauth-btn-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .oauth-btn svg.brand-icon { width: 20px; height: 20px; }
        .oauth-btn .arrow-icon { color: var(--text); opacity: 0.6; transition: transform 0.2s ease; }
        .oauth-btn:hover .arrow-icon { transform: translateX(2px); opacity: 1; }

        .switch-line{ text-align: center; margin-top: 24px; font-size: 14px; color: var(--muted); }
        .switch-line button{ background: none; border: none; color: var(--teal); font-weight: 700; cursor: pointer; font-size: 14px; padding: 0 0 0 4px; }
        .switch-line button:hover{ text-decoration: underline; }

        .form-pane{ animation: fadeSlide 0.4s ease; }
        @keyframes fadeSlide{ from{ opacity: 0; transform: translateY(6px); } to{ opacity: 1; transform: translateY(0); } }

        .strength-bar{ display: flex; gap: 4px; margin-top: 8px; }
        .strength-bar span{ height: 3px; flex: 1; border-radius: 2px; background: var(--border); transition: background 0.25s ease; }
        
        .toast{
          position: fixed; bottom: 26px; left: 50%;
          transform: translateX(-50%) translateY(20px);
          background: #fff; border: 1px solid var(--teal); color: var(--text);
          padding: 12px 20px; border-radius: 12px; font-size: 13.5px;
          opacity: 0; pointer-events: none; transition: all 0.3s ease;
          display: flex; align-items: center; gap: 8px; z-index: 50;
          box-shadow: 0 12px 30px rgba(10,79,68,0.12);
        }
        .toast.show{ opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
        .toast .dot{ width: 8px; height: 8px; border-radius: 10px; background: var(--teal); }

        .error-banner {
          background: #FFF0F0;
          border: 1px solid var(--danger);
          color: var(--danger);
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: left;
        }

        .trust-section {
          margin-top: 24px;
          padding-top: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px dashed var(--border);
          width: 100%;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s ease;
        }
        .trust-section:hover {
          transform: translateY(-1px);
        }
        .avatar-group {
          display: flex;
          align-items: center;
        }
        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #fff;
          margin-left: -8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .avatar:first-child {
          margin-left: 0;
        }
        .avatar-more {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #fff;
          margin-left: -8px;
          background: #E8E2D2;
          color: #6B706E;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .trust-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }
        .trust-rating {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .trust-stars {
          font-size: 11px;
          letter-spacing: 1px;
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .trust-stars.pulse {
          animation: starPulse 0.5s ease;
        }
        @keyframes starPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .rating-num {
          font-size: 11px;
          font-weight: 700;
          color: #E29B12;
          background: #FFF9EB;
          padding: 1px 5px;
          border-radius: 4px;
          border: 1px solid #FFE7B3;
        }
        .trust-text {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--muted);
        }
        .highlight-count {
          color: var(--teal);
          font-weight: 800;
        }

        .mobile-only { display: none !important; }
        .mobile-only-heading { display: none !important; }
        .mobile-only-subheading { display: none !important; }
        .desktop-only { display: block !important; }
        .desktop-flex { display: flex !important; }
        .desktop-inline-flex { display: inline-flex !important; }

        @media (max-width: 768px){
          .mobile-only { display: block !important; }
          .mobile-only-heading {
            display: block !important;
            color: var(--teal) !important;
            font-weight: 700;
            font-size: 20px !important;
            text-align: center;
            margin: 0 0 16px !important;
            font-family: var(--font-display);
          }
          .mobile-only-subheading {
            display: block !important;
            color: var(--muted) !important;
            font-size: 13.5px !important;
            font-weight: 500;
            text-align: center;
            margin: 0 0 12px !important;
          }
          .desktop-only { display: none !important; }
          .desktop-flex { display: none !important; }
          .desktop-inline-flex { display: none !important; }
          
          .auth-card {
            flex-direction: column;
            gap: 20px;
            padding: 30px 24px;
            max-width: 440px;
          }
          .divider-vertical {
            display: none !important;
          }
          .right-col {
            padding-left: 0;
            margin-top: 0px;
          }
          .oauth-list {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .oauth-btn {
            justify-content: center !important;
            padding: 10px 16px !important;
            background-color: var(--cream-soft) !important;
            border-color: var(--border) !important;
          }
          .oauth-btn .arrow-icon {
            display: none !important;
          }
          .right-divider {
            margin-bottom: 20px !important;
          }
          .form-heading h2 {
            font-size: 20px !important;
            text-align: center;
          }
          .form-heading p {
            text-align: center;
          }
          .tabs {
            margin-left: auto;
            margin-right: auto;
          }
        }
        button:focus-visible, input:focus-visible, a:focus-visible{ outline: 2px solid var(--teal); outline-offset: 2px; }
      `}</style>

      <div className="arthak-body">
        <div className="shell">
          <div className="auth-panel">
            <div className={`auth-card${tab === 'forgot' ? ' forgot-view' : ''}`}>
              
              {/* Left Column (Main Form) */}
              <div className="left-col">
                <button className="back-btn" onClick={() => tab === 'forgot' ? setTab('login') : window.history.back()} title="Go back" disabled={loading}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Back</span>
                </button>

                {tab === 'login' && (
                  <div className="form-pane">
                    <div className="form-heading">
                      <h2 className="desktop-only">Welcome back 👋</h2>
                      <p className="desktop-only">Continue your career journey.</p>
                      <h2 className="mobile-only-heading">Start your career journey</h2>
                      <p className="mobile-only-subheading">Log in to pick up your career journey.</p>
                    </div>

                    <div className="tabs">
                      <div className="tab-indicator" />
                      <button type="button" className="tab-btn active" onClick={() => setTab('login')} disabled={loading}>Log in</button>
                      <button type="button" className="tab-btn" onClick={() => setTab('signup')} disabled={loading}>Sign up</button>
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    <form onSubmit={handleLoginSubmit} noValidate>
                      <div className="field">
                        <label htmlFor="loginEmail">Email</label>
                        <div className="input-wrap">
                          <input 
                            type="email" 
                            id="loginEmail" 
                            placeholder="you@example.com" 
                            autoComplete="email" 
                            className={errors.loginEmail ? 'err' : ''} 
                            value={loginEmail} 
                            onChange={(e) => setLoginEmail(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        <div className="err-msg">{errors.loginEmail}</div>
                      </div>

                      <div className="field">
                        <label htmlFor="loginPassword">Password</label>
                        <div className="input-wrap">
                          <input 
                            type={showLoginPass ? 'text' : 'password'} 
                            id="loginPassword" 
                            placeholder="Enter your password" 
                            autoComplete="current-password" 
                            className={errors.loginPassword ? 'err' : ''} 
                            value={loginPassword} 
                            onChange={(e) => setLoginPassword(e.target.value)}
                            disabled={loading}
                          />
                          <button type="button" className="toggle-eye" aria-label={showLoginPass ? 'Hide password' : 'Show password'} onClick={() => setShowLoginPass((s) => !s)} disabled={loading}><EyeIcon /></button>
                        </div>
                        <div className="err-msg">{errors.loginPassword}</div>
                      </div>

                      <div className="row-between">
                        <label className="remember">
                          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} disabled={loading} />
                          Remember me
                        </label>
                        <span className="link" onClick={() => setTab('forgot')}>Forgot password?</span>
                      </div>

                      <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log in'}
                      </button>
                    </form>
                    <div className="switch-line desktop-only">Don&apos;t have an account? <button type="button" onClick={() => setTab('signup')} disabled={loading}>Sign up</button></div>
                  </div>
                )}
                {tab === 'signup' && (
                  <div className="form-pane">
                    <div className="form-heading">
                      <h2 className="desktop-only">Create your Arthak account</h2>
                      <p className="desktop-only">Build your roadmap in under one minute.</p>
                      <h2 className="mobile-only-heading">Create your account</h2>
                      <p className="mobile-only-subheading">Start your career roadmap in under a minute.</p>
                    </div>

                    <div className="tabs signup">
                      <div className="tab-indicator" />
                      <button type="button" className="tab-btn" onClick={() => setTab('login')} disabled={loading}>Log in</button>
                      <button type="button" className="tab-btn active" onClick={() => setTab('signup')} disabled={loading}>Sign up</button>
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    <form onSubmit={handleSignupSubmit} noValidate>
                      <div className="field">
                        <label htmlFor="signupName">Full name</label>
                        <div className="input-wrap">
                          <input 
                            type="text" 
                            id="signupName" 
                            placeholder="Ananya Sharma" 
                            autoComplete="name" 
                            className={errors.signupName ? 'err' : ''} 
                            value={signupName} 
                            onChange={(e) => setSignupName(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        <div className="err-msg">{errors.signupName}</div>
                      </div>

                      <div className="field">
                        <label htmlFor="signupEmail">Email</label>
                        <div className="input-wrap">
                          <input 
                            type="email" 
                            id="signupEmail" 
                            placeholder="you@example.com" 
                            autoComplete="email" 
                            className={errors.signupEmail ? 'err' : ''} 
                            value={signupEmail} 
                            onChange={(e) => setSignupEmail(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        <div className="err-msg">{errors.signupEmail}</div>
                      </div>

                      <div className="field">
                        <label htmlFor="signupPassword">Password</label>
                        <div className="input-wrap">
                          <input 
                            type={showSignupPass ? 'text' : 'password'} 
                            id="signupPassword" 
                            placeholder="Create a password" 
                            autoComplete="new-password" 
                            className={errors.signupPassword ? 'err' : ''} 
                            value={signupPassword} 
                            onChange={(e) => setSignupPassword(e.target.value)}
                            disabled={loading}
                          />
                          <button type="button" className="toggle-eye" aria-label={showSignupPass ? 'Hide password' : 'Show password'} onClick={() => setShowSignupPass((s) => !s)} disabled={loading}><EyeIcon /></button>
                        </div>
                        <div className="strength-bar">
                          {[0, 1, 2, 3].map((i) => (
                            <span key={i} style={{ background: i < strength ? strengthColors[Math.max(strength - 1, 0)] : undefined }} />
                          ))}
                        </div>
                        <div className="err-msg">{errors.signupPassword}</div>
                      </div>

                      <div className="field">
                        <label htmlFor="signupConfirm">Confirm password</label>
                        <div className="input-wrap">
                          <input 
                            type={showSignupConfirm ? 'text' : 'password'} 
                            id="signupConfirm" 
                            placeholder="Re-enter your password" 
                            autoComplete="new-password" 
                            className={errors.signupConfirm ? 'err' : ''} 
                            value={signupConfirm} 
                            onChange={(e) => setSignupConfirm(e.target.value)}
                            disabled={loading}
                          />
                          <button type="button" className="toggle-eye" aria-label={showSignupConfirm ? 'Hide password' : 'Show password'} onClick={() => setShowSignupConfirm((s) => !s)} disabled={loading}><EyeIcon /></button>
                        </div>
                        <div className="err-msg">{errors.signupConfirm}</div>
                      </div>

                      <div className="terms">
                        <input type="checkbox" id="termsCheck" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} disabled={loading} />
                        <label htmlFor="termsCheck">I agree to the <span className="link">Terms of Service</span> and <span className="link">Privacy Policy</span>.</label>
                      </div>

                      <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                      </button>
                    </form>
                    <div className="switch-line desktop-only">Already have an account? <button type="button" onClick={() => setTab('login')} disabled={loading}>Log in</button></div>
                  </div>
                )}

                {tab === 'forgot' && (
                  <div className="form-pane">
                    <div className="form-heading">
                      <h2>Reset your password</h2>
                      <p>We&apos;ll send you a link to reset your password.</p>
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    <form onSubmit={handleForgotSubmit} noValidate>
                      <div className="field">
                        <label htmlFor="forgotEmail">Email</label>
                        <div className="input-wrap">
                          <input 
                            type="email" 
                            id="forgotEmail" 
                            placeholder="you@example.com" 
                            autoComplete="email" 
                            className={errors.loginEmail ? 'err' : ''} 
                            value={loginEmail} 
                            onChange={(e) => setLoginEmail(e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        <div className="err-msg">{errors.loginEmail}</div>
                      </div>

                      <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Sending link...' : 'Send reset link'}
                      </button>
                    </form>
                    
                    <div className="switch-line">
                      Remember your password? <button type="button" onClick={() => setTab('login')} disabled={loading}>Log in</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Vertical Divider */}
              <div className="divider-vertical" />

              {/* Right Column (OAuth Buttons) */}
              <div className="right-col">
                <div className="right-divider">or continue with</div>
                <div className="oauth-list">
                  <button className="oauth-btn" type="button" onClick={handleGoogle} disabled={loading}>
                    <div className="oauth-btn-left">
                      <svg viewBox="0 0 24 24" className="brand-icon">
                        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.25 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.15.8 3.9 1.5l2.65-2.55C16.9 3.05 14.7 2 12 2 6.9 2 2.75 6.1 2.75 11.2S6.9 20.4 12 20.4c6.9 0 9.4-4.85 9.4-7.35 0-.5-.05-.85-.12-1.2H12z" />
                      </svg>
                      <span>Google</span>
                    </div>
                    <ArrowIcon />
                  </button>

                  <button className="oauth-btn" type="button" onClick={() => fireToast('GitHub sign-in is not configured. Please use Google.')} disabled={loading}>
                    <div className="oauth-btn-left">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="brand-icon">
                        <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 015 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.2 2.4.11 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.35 4.68-4.58 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0012 2z" />
                      </svg>
                      <span>GitHub</span>
                    </div>
                    <ArrowIcon />
                  </button>
                </div>

                  {tab === 'login' && (
                    <div className="switch-line mobile-only">
                      Don&apos;t have an account? <button type="button" onClick={() => setTab('signup')} disabled={loading}>Sign up</button>
                    </div>
                  )}
                  {tab === 'signup' && (
                    <div className="switch-line mobile-only">
                      Already have an account? <button type="button" onClick={() => setTab('login')} disabled={loading}>Log in</button>
                    </div>
                  )}


                <div className="trust-section desktop-flex" onClick={handleCounterClick} title="Click to recount!">
                  <div className="avatar-group">
                    <div className="avatar" style={{ background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)' }}>A</div>
                    <div className="avatar" style={{ background: 'linear-gradient(135deg, #FEE140 0%, #FA709A 100%)' }}>S</div>
                    <div className="avatar" style={{ background: 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)' }}>K</div>
                    <div className="avatar-more">+</div>
                  </div>
                  <div className="trust-info">
                    <div className="trust-rating">
                      <span className={`trust-stars${starPulse ? ' pulse' : ''}`}>⭐⭐⭐⭐⭐</span>
                      <span className="rating-num">5.0</span>
                    </div>
                    <div className="trust-text">
                      Trusted by <span className="highlight-count">{studentCount}+</span> Students
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className={`toast${toast.show ? ' show' : ''}`}><span className="dot" /><span>{toast.text}</span></div>
    </>
  );
}

export const Route = createFileRoute('/login')({
  component: LoginSignup,
});
