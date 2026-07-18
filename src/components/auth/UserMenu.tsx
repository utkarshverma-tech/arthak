import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { profileService, type OnboardingProfile } from "@/lib/auth/ProfileService";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Fetch backend profile data when open
  useEffect(() => {
    if (user && open) {
      profileService.get().then((p) => {
        if (p) {
          setProfile(p);
        }
      });
    }
  }, [user, open]);

  // Load avatar and banner from localStorage
  useEffect(() => {
    if (user) {
      const localAvatar = localStorage.getItem("arthak_profile_avatar");
      const localBanner = localStorage.getItem("arthak_profile_banner");
      if (localAvatar) {
        setAvatarImage(localAvatar);
      } else if (user.avatarUrl) {
        setAvatarImage(user.avatarUrl);
      } else {
        setAvatarImage(null);
      }

      if (localBanner) {
        setBannerImage(localBanner);
      } else {
        setBannerImage(null);
      }
    }
  }, [user]);

  if (!user) return null;

  const capitalizeName = (name: string) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const rawDisplayName = profile?.fullName || user.fullName || "Utkarsh Verma";
  const displayName = capitalizeName(rawDisplayName);
  const displayRole = profile?.careerGoal || "AI Engineer";

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const urlStr = ev.target.result as string;
        setBannerImage(urlStr);
        localStorage.setItem("arthak_profile_banner", urlStr);
        window.dispatchEvent(new Event("banner_updated"));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const urlStr = ev.target.result as string;
        setAvatarImage(urlStr);
        localStorage.setItem("arthak_profile_avatar", urlStr);
        
        // Dispatch an event to notify other avatar instances (like the TopBar trigger) to update
        window.dispatchEvent(new Event("avatar_updated"));
      }
    };
    reader.readAsDataURL(file);
  };

  // Sync avatar and banner changes back to trigger if changed elsewhere
  useEffect(() => {
    const handleAvatarUpdate = () => {
      const localAvatar = localStorage.getItem("arthak_profile_avatar");
      if (localAvatar) {
        setAvatarImage(localAvatar);
      }
    };
    const handleBannerUpdate = () => {
      const localBanner = localStorage.getItem("arthak_profile_banner");
      if (localBanner) {
        setBannerImage(localBanner);
      }
    };
    window.addEventListener("avatar_updated", handleAvatarUpdate);
    window.addEventListener("banner_updated", handleBannerUpdate);
    return () => {
      window.removeEventListener("avatar_updated", handleAvatarUpdate);
      window.removeEventListener("banner_updated", handleBannerUpdate);
    };
  }, []);

  return (
    <div className="user-menu-scoped-container relative" ref={ref}>
      <style>{`
        .user-menu-scoped-container .dropdown-wrap {
          --bg:#FFFFFF;
          --card:#FAFAFA;
          --primary:#FF5A1F;
          --primary-light:#FFF1EA;
          --text:#0A0A0A;
          --muted:#8A8F98;
          --border:#F0F0F1;
          --success:#3DAE6B;
          --radius-outer:20px;
          --radius-item:12px;

          position: absolute;
          top: 48px;
          right: 0;
          z-index: 10000;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: calc(100vw - 32px);
          pointer-events: none;
        }
        .user-menu-scoped-container .dropdown-wrap * {
          pointer-events: auto;
        }

        .user-menu-scoped-container .avatar-trigger {
          width:40px; height:40px; border-radius:12px;
          background:#ffffff;
          display:flex; align-items:center; justify-content:center;
          color:#000000; font-weight:700; font-size:14px; cursor:pointer;
          border:2px solid #fff;
          box-shadow:0 0 0 1px var(--border), 0 4px 10px rgba(10,10,10,.08);
          transition:transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease;
          outline: none;
        }
        .user-menu-scoped-container .avatar-trigger:hover{ transform:scale(1.08); }
        .user-menu-scoped-container .avatar-trigger.active{ box-shadow:0 0 0 3px rgba(138,143,152,.2), 0 4px 10px rgba(10,10,10,.1); }

        .user-menu-scoped-container .dropdown {
          width:410px;
          max-width: 100%;
          background:var(--bg);
          border-radius:var(--radius-outer);
          box-shadow:0 30px 70px rgba(10,10,10,.16), 0 4px 16px rgba(10,10,10,.06);
          padding:0 0 22px;
          max-height:calc(100vh - 100px);
          overflow-y:auto;
          overflow-x:hidden;
          text-align: left;
        }
        .user-menu-scoped-container .dropdown::-webkit-scrollbar{ width:6px; }
        .user-menu-scoped-container .dropdown::-webkit-scrollbar-thumb{ background:#EAEAEA; border-radius:10px; }

        @media (max-width: 480px) {
          .user-menu-scoped-container .dropdown-wrap {
            position: fixed;
            top: 64px;
            left: 16px;
            right: 16px;
            width: auto;
            max-width: none;
          }
          .user-menu-scoped-container .dropdown {
            width: 100%;
            max-width: none;
          }
        }

        /* stagger items only when open */
        .user-menu-scoped-container .stagger{ opacity:0; transform:translateY(6px); }
        .user-menu-scoped-container .dropdown.open .stagger{
          animation:itemIn 320ms cubic-bezier(.34,1.56,.64,1) forwards;
        }
        @keyframes itemIn{ to{ opacity:1; transform:translateY(0); } }

        .user-menu-scoped-container .dropdown-body{ padding:0 22px; }

        /* ---- Banner (LinkedIn style) ---- */
        .user-menu-scoped-container .profile-banner{
          width:100%; height:84px;
          border-radius:var(--radius-outer) var(--radius-outer) 0 0;
          position:relative;
          overflow:hidden;
          border-bottom:1px solid var(--border);
        }
        .user-menu-scoped-container .banner-edit-btn{
          position:absolute; top:10px; right:10px;
          width:30px; height:30px; border-radius:50%;
          background:#ffffff;
          display:flex; align-items:center; justify-content:center;
          color:var(--primary); cursor:pointer; border:none;
          box-shadow:0 2px 8px rgba(10,10,10,.12);
          transition:background .16s ease, transform .16s ease;
        }
        .user-menu-scoped-container .banner-edit-btn:hover{ background:#f5f5f5; transform:scale(1.06); }
        .user-menu-scoped-container .banner-edit-btn svg{ width:14px; height:14px; }

        /* ---- Header ---- */
        .user-menu-scoped-container .profile-header{
          padding:0 22px 16px;
          margin-top:-32px;
          display:flex;
          flex-direction:column;
          align-items: flex-start;
        }
        .user-menu-scoped-container .avatar-wrap{ position:relative; width:68px; height:68px; }
        .user-menu-scoped-container .header-avatar{
          width:68px; height:68px; border-radius:18px;
          background:#ffffff;
          background-size:cover; background-position:center;
          display:flex; align-items:center; justify-content:center;
          color:#000000; flex-shrink:0;
          box-shadow:0 8px 18px rgba(10,10,10,.05);
          border:4px solid var(--bg);
        }
        .user-menu-scoped-container .header-avatar svg{ width:32px; height:32px; }
        .user-menu-scoped-container .avatar-edit-btn{
          position:absolute; bottom:-3px; right:-3px;
          width:25px; height:25px; border-radius:50%;
          background:#ffffff; color:var(--primary);
          display:flex; align-items:center; justify-content:center;
          border:3px solid var(--bg); cursor:pointer;
          box-shadow:0 4px 10px rgba(10,10,10,.2);
          transition:transform .16s cubic-bezier(.34,1.56,.64,1), background .16s ease;
          z-index:2;
        }
        .user-menu-scoped-container .avatar-edit-btn:hover{ transform:scale(1.1); background:#f5f5f5; }
        .user-menu-scoped-container .avatar-edit-btn svg{ width:11px; height:11px; }
        .user-menu-scoped-container .header-name{ font-size:17px; font-weight:800; letter-spacing:-.01em; line-height:1.25; margin-top:10px; color: var(--text); }
        .user-menu-scoped-container .header-role-row{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:3px; width:100%; }
        .user-menu-scoped-container .header-role{ font-size:12.5px; color:var(--muted); font-weight:600; }
        .user-menu-scoped-container .otw-badge{
          background:linear-gradient(120deg, #3DAE6B, #2F9E5C);
          color:#fff; font-size:9px; font-weight:800;
          letter-spacing:.04em; text-transform:uppercase;
          padding:4px 10px; border-radius:6px;
          white-space:nowrap; flex-shrink:0;
          box-shadow:0 3px 8px rgba(61,174,107,.35);
        }

        /* ---- Menu groups ---- */
        .user-menu-scoped-container .group{ margin-top:14px; display: flex; flex-direction: column; gap: 2px; width: 100%; }
        .user-menu-scoped-container .group-label{
          font-size:10.5px; font-weight:700; color:var(--muted);
          text-transform:uppercase; letter-spacing:.07em;
          padding:0 8px 6px;
        }
        .user-menu-scoped-container .menu-item{
          display:flex; align-items:center; gap:11px;
          padding:9px 8px;
          border-radius:var(--radius-item);
          font-size:13.5px; font-weight:600; color:var(--text);
          cursor:pointer;
          transition:background .16s ease, transform .16s ease;
          width: 100%;
        }
        .user-menu-scoped-container .menu-item:hover{ background:var(--card); transform:translateX(2px); }
        .user-menu-scoped-container .menu-icon{
          width:28px; height:28px; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          color:var(--muted);
          background:transparent;
          flex-shrink:0;
          transition:background .16s ease, color .16s ease;
        }
        .user-menu-scoped-container .menu-icon svg{ width:14.5px; height:14.5px; }
        .user-menu-scoped-container .menu-item:hover .menu-icon{ background:var(--primary-light); color:var(--primary); }

        .user-menu-scoped-container .divider{ height:1px; background:var(--border); margin:14px 4px; }

        .user-menu-scoped-container .logout-item{
          display:flex; align-items:center; gap:11px;
          padding:10px 8px;
          margin-top:8px;
          border-radius:var(--radius-item);
          font-size:13.5px; font-weight:600; color:var(--muted);
          cursor:pointer;
          transition:background .16s ease, color .16s ease;
        }
        .user-menu-scoped-container .logout-item:hover{ background:#FEF2F2; color:#EF4444; }
        .user-menu-scoped-container .logout-item svg{ width:15px; height:15px; }
      `}</style>

      <button
        onClick={() => setOpen((v) => !v)}
        className={`avatar-trigger ${open ? "active" : ""}`}
        style={{
          backgroundImage: avatarImage ? `url(${avatarImage})` : undefined,
          backgroundSize: avatarImage ? "cover" : undefined,
          backgroundPosition: avatarImage ? "center" : undefined,
        }}
        aria-label="Account menu"
      >
        {!avatarImage && (
          <svg viewBox="0 0 24 24" fill="#000000" style={{ width: "20px", height: "20px", marginTop: "1px" }}>
            <circle cx="12" cy="8.2" r="4.5" />
            <path d="M12 14c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
          </svg>
        )}
      </button>

      <div className="dropdown-wrap">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.24, ease: [0.34, 1.56, 0.64, 1] }}
              className="dropdown open"
            >
              {/* Banner */}
              <div
                className="profile-banner"
                style={
                  bannerImage
                    ? {
                        backgroundImage: `url(${bannerImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        backgroundColor: "#FAF7F2",
                        backgroundImage:
                          "radial-gradient(circle at 15% 20%, rgba(255, 90, 31, 0.12) 0%, transparent 55%), radial-gradient(circle at 85% 15%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(20, 184, 166, 0.06) 0%, transparent 50%)",
                      }
                }
              >
                <button
                  className="banner-edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    bannerFileInputRef.current?.click();
                  }}
                  title="Change banner"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <input
                  type="file"
                  ref={bannerFileInputRef}
                  onChange={handleBannerChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>

              {/* Header (avatar overlaps banner) */}
              <div className="profile-header stagger" style={{ animationDelay: "20ms" }}>
                <div className="avatar-wrap">
                  <div
                    className="header-avatar"
                    style={{
                      backgroundImage: avatarImage ? `url(${avatarImage})` : undefined,
                      backgroundSize: avatarImage ? "cover" : undefined,
                      backgroundPosition: avatarImage ? "center" : undefined,
                    }}
                  >
                    {!avatarImage && (
                      <svg viewBox="0 0 24 24" fill="#000000" style={{ width: "36px", height: "36px" }}>
                        <circle cx="12" cy="8.2" r="4.5" />
                        <path d="M12 14c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
                      </svg>
                    )}
                  </div>
                  <button
                    className="avatar-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      avatarFileInputRef.current?.click();
                    }}
                    title="Change profile photo"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                  <input
                    type="file"
                    ref={avatarFileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
                <div className="header-name">{displayName}</div>
                <div className="header-role-row">
                  <div className="header-role">{displayRole}</div>
                  <span className="otw-badge">#OpenToWork</span>
                </div>
              </div>

              <div className="dropdown-body">
                <div className="divider stagger" style={{ animationDelay: "40ms" }}></div>

                {/* MENU */}
                <div className="group stagger" style={{ animationDelay: "60ms" }}>
                  <Link to="/profile" onClick={() => setOpen(false)} className="menu-item">
                    <div className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
                    </div>
                    My Profile
                  </Link>
                  <div className="menu-item" onClick={() => setOpen(false)}>
                    <div className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                    </div>
                    Account Settings
                  </div>
                  <div className="menu-item" onClick={() => setOpen(false)}>
                    <div className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="8" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></svg>
                    </div>
                    Badges
                  </div>
                  <div className="menu-item" onClick={() => setOpen(false)}>
                    <div className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M9 18v3m6-3v3"/></svg>
                    </div>
                    Certificates
                  </div>
                  <div className="menu-item" onClick={() => setOpen(false)}>
                    <div className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 2-3 4"/><path d="M12 17h.01"/></svg>
                    </div>
                    Help Center
                  </div>
                  <div className="menu-item" onClick={() => setOpen(false)}>
                    <div className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    Feedback
                  </div>
                  <div className="menu-item" onClick={() => setOpen(false)}>
                    <div className="menu-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    Contact Support
                  </div>
                </div>

                <div className="divider stagger" style={{ animationDelay: "80ms" }}></div>

                {/* Logout */}
                <div
                  className="logout-item stagger"
                  style={{ animationDelay: "100ms" }}
                  onClick={async () => {
                    setOpen(false);
                    await signOut();
                    window.location.href = "/";
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
                  Logout
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

