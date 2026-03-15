import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getCurrentUser } from "../api/authApi";
import { User, Mail, Github, Linkedin, Tag, Layers, Zap, FileText, Briefcase, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const EXP = {
  Beginner:     { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)" },
  Intermediate: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)" },
  Advanced:     { color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  border: "rgba(124,58,237,0.25)" },
};

function InfoCard({ label, icon, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.4 }}
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white/25 mb-3">
        <span className="text-white/20">{icon}</span>{label}
      </p>
      {children}
    </motion.div>
  );
}

function TagPills({ items, color = "#a78bfa", bg = "rgba(124,58,237,0.12)", border = "rgba(124,58,237,0.28)" }) {
  if (!items?.length) return <p className="text-sm text-white/25">—</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t, i) => (
        <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04 }}
          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ color, background: bg, border: `1px solid ${border}` }}>
          <Tag size={9} />{t}
        </motion.span>
      ))}
    </div>
  );
}

function Profile() {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally { setLoading(false); }
    })();
  }, []);

  const exp = EXP[user?.experienceLevel];

  return (
    <Layout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>
      <div className="max-w-3xl mx-auto space-y-6 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Skeleton */}
        {loading && (
          <div className="space-y-5">
            <div className="rounded-3xl h-56 animate-pulse" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl h-28 animate-pulse" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {!loading && !error && user && (
          <>
            {/* ── HERO ── */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden p-8"
              style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0f0a1e 50%, #0a0f2e 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Orb */}
              <div className="absolute top-0 left-1/3 w-[350px] h-[200px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)" }} />
              <div className="absolute top-0 left-12 right-12 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }} />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar: real pic from Cloudinary */}
                {user.pic ? (
                  <img src={user.pic} alt={user.fullName}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    style={{ border: "2px solid rgba(124,58,237,0.4)", boxShadow: "0 0 24px rgba(124,58,237,0.2)" }} />
                ) : (
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-extrabold"
                    style={{ background: "rgba(124,58,237,0.18)", border: "2px solid rgba(124,58,237,0.35)", color: "#a78bfa", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {user.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-1">My Profile</p>
                  <h1 className="text-3xl font-extrabold text-white leading-tight truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {user.fullName}
                  </h1>
                  <p className="flex items-center gap-1.5 text-sm text-white/35 mt-1">
                    <Mail size={12} /> {user.email}
                  </p>
                  {exp && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mt-3"
                      style={{ color: exp.color, background: exp.bg, border: `1px solid ${exp.border}` }}>
                      <Briefcase size={11} /> {user.experienceLevel}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── BIO ── */}
            {user.bio && (
              <InfoCard label="Bio" icon={<FileText size={12} />} delay={0.05}>
                <p className="text-sm text-white/55 leading-relaxed">{user.bio}</p>
              </InfoCard>
            )}

            {/* ── SKILLS + TECH STACK ── */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoCard label="Skills" icon={<Tag size={12} />} delay={0.1}>
                <TagPills items={user.skills} />
              </InfoCard>
              <InfoCard label="Tech Stack" icon={<Layers size={12} />} delay={0.15}>
                <TagPills
                  items={user.techStack}
                  color="#67e8f9"
                  bg="rgba(6,182,212,0.1)"
                  border="rgba(6,182,212,0.22)"
                />
              </InfoCard>
            </div>

            {/* ── LINKS ── */}
            {(user.gitHub || user.linkdn) && (
              <InfoCard label="Links" icon={<Zap size={12} />} delay={0.2}>
                <div className="flex flex-wrap gap-3">
                  {user.gitHub && (
                    <a href={user.gitHub} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:border-violet-500/50"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                      <Github size={15} /> GitHub
                    </a>
                  )}
                  {user.linkdn && (
                    <a href={user.linkdn} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:border-blue-500/50"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                      <Linkedin size={15} /> LinkedIn
                    </a>
                  )}
                </div>
              </InfoCard>
            )}
          </>
        )}

      </div>
    </Layout>
  );
}

export default Profile;