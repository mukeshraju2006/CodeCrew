import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { viewRequester } from "../api/authApi";
import { changeStatus } from "../api/requestApi";
import { Github, Linkedin, CheckCircle2, XCircle, Clock, Briefcase, Tag, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS = {
  PENDING:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  icon: <Clock size={12} />,        label: "Pending"  },
  ACCEPTED: { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)", icon: <CheckCircle2 size={12} />, label: "Accepted" },
  REJECTED: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",  icon: <XCircle size={12} />,      label: "Rejected" },
};

const EXP = {
  Beginner:     { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)"  },
  Intermediate: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)"  },
  Advanced:     { color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  border: "rgba(124,58,237,0.25)"  },
};

function RequesterProfile() {
  const { requesterId, reqId } = useParams();
  const location = useLocation();

  const [profile, setProfile]           = useState(null);
  const [requestStatus, setStatus]      = useState(location.state?.status || null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError]               = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await viewRequester(requesterId);
        setProfile(res.data.data);
      } catch { setError("Failed to load profile"); }
    })();
  }, [requesterId]);

  const handleStatus = async (status) => {
    if (requestStatus !== "PENDING") return;
    try {
      setLoadingAction(true);
      await changeStatus(reqId, status);
      setStatus(status);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally { setLoadingAction(false); }
  };

  if (error) return <Layout><p className="text-red-400 text-center mt-10">{error}</p></Layout>;

  if (!profile) return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-5 px-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl animate-pulse h-28"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
        ))}
      </div>
    </Layout>
  );

  const s   = STATUS[requestStatus];
  const exp = EXP[profile.experienceLevel] || EXP.Beginner;

  return (
    <Layout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>
      <div className="max-w-3xl mx-auto space-y-5 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ── HERO ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-10"
          style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0f0a1e 50%, #0a0f2e 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="absolute top-0 left-1/3 w-[350px] h-[180px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)" }} />
          <div className="absolute top-0 left-12 right-12 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }} />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
            <User size={140} />
          </div>
          <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-3">Applicant</p>
              <h1 className="text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {profile.fullName}
              </h1>
              {profile.experienceLevel && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ color: exp.color, background: exp.bg, border: `1px solid ${exp.border}` }}>
                  <Briefcase size={11} /> {profile.experienceLevel}
                </span>
              )}
            </div>
            {s && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 mt-1"
                style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
                {s.icon} {s.label}
              </span>
            )}
          </div>
        </motion.div>

        {/* ── PROFILE CARD ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="relative rounded-2xl p-8 space-y-7"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="absolute top-0 left-8 right-8 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />

          {/* Bio */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/25 mb-3">Bio</p>
            <p className="text-sm text-white/55 leading-relaxed">{profile.bio || "No bio provided."}</p>
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
              <p className="text-xs font-bold tracking-widest uppercase text-white/25 mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.28)", color: "#a78bfa" }}>
                    <Tag size={9} />{skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(profile.gitHub || profile.linkdn) && (
            <div className="flex gap-3 flex-wrap" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
              {profile.gitHub && (
                <a href={profile.gitHub} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all hover:border-violet-500/50"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                  <Github size={14} /> GitHub
                </a>
              )}
              {profile.linkdn && (
                <a href={profile.linkdn} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all hover:border-blue-500/50"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                  <Linkedin size={14} /> LinkedIn
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* ── ERROR ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ACTIONS ── */}
        <AnimatePresence>
          {requestStatus === "PENDING" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-bold tracking-widest uppercase text-white/25 mb-4">Decision</p>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} disabled={loadingAction}
                  onClick={() => handleStatus("ACCEPTED")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
                  {loadingAction
                    ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 rounded-full" style={{ borderColor: "#34d39940", borderTopColor: "#34d399" }} />
                    : <><CheckCircle2 size={15} /> Accept</>}
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} disabled={loadingAction}
                  onClick={() => handleStatus("REJECTED")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)", color: "#f87171" }}>
                  {loadingAction
                    ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 rounded-full" style={{ borderColor: "#f8717140", borderTopColor: "#f87171" }} />
                    : <><XCircle size={15} /> Reject</>}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}

export default RequesterProfile;