import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getSinglePost } from "../api/projectApi";
import { sendRequest } from "../api/requestApi";
import { getCurrentUser } from "../api/authApi";
import { Code2, Users, Layers, ArrowRight, Lock, Rocket, Zap, Tag, User, Mail, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function TechBadge({ tech, i }) {
  return (
    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
      className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full"
      style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.28)", color: "#a78bfa" }}>
      <Tag size={9} />{tech}
    </motion.span>
  );
}

function InfoChip({ icon, label, value, valueColor }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <span className="text-white/25">{icon}</span>
      <div>
        <p className="text-xs text-white/25 font-medium">{label}</p>
        <p className="text-sm font-bold" style={{ color: valueColor || "#fff" }}>{value}</p>
      </div>
    </div>
  );
}

function FocusTextarea({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div animate={{ borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
      transition={{ duration: 0.2 }} className="relative rounded-xl border overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)" }}>
      <motion.div animate={{ opacity: focused ? 1 : 0 }} className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none resize-none" />
    </motion.div>
  );
}

function ProjectDetails() {
  const { id } = useParams();
  const [post, setPost]               = useState(null);
  const [error, setError]             = useState("");
  const [contribution, setContrib]    = useState("");
  const [message, setMessage]         = useState({ text: "", type: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [sending, setSending]         = useState(false);

  useEffect(() => {
    (async () => {
      try { const r = await getCurrentUser(); setCurrentUser(r.data.data); } catch { setCurrentUser(null); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try { const r = await getSinglePost(id); setPost(r.data.data); }
      catch (err) { setError(err.response?.data?.message || "Failed to fetch post"); }
    })();
  }, [id]);

  const handleSendRequest = async () => {
    if (!contribution.trim()) { setMessage({ text: "Please describe your contribution.", type: "error" }); return; }
    try {
      setSending(true);
      const res = await sendRequest(post._id, contribution);
      setMessage({ text: res.data.message, type: "success" });
      setContrib("");
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Request failed", type: "error" });
    } finally { setSending(false); }
  };

  if (error) return <Layout><p className="text-red-400 text-center mt-10">{error}</p></Layout>;
  if (!post)  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6 px-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl animate-pulse h-24"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
        ))}
      </div>
    </Layout>
  );

  const isOwner    = currentUser && post.createdBy?._id === currentUser._id;
  const isClosed   = post.status === "CLOSED";
  const isHackathon = post.type === "HACKATHON";
  const accentColor = isHackathon ? "#f59e0b" : "#7c3aed";
  const filled      = post.teamSize - post.freeSlot;
  const pct         = Math.round((filled / post.teamSize) * 100);

  return (
    <Layout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>
      <div className="max-w-5xl mx-auto space-y-6 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ── HERO CARD ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-10"
          style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0f0a1e 50%, #0a0f2e 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="absolute top-0 left-1/3 w-[400px] h-[200px] pointer-events-none"
            style={{ background: `radial-gradient(ellipse, ${accentColor}20 0%, transparent 70%)` }} />
          <div className="absolute top-0 left-12 right-12 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)` }} />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
            {isHackathon ? <Zap size={160} /> : <Rocket size={160} />}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}35`, color: accentColor }}>
                {isHackathon ? <Zap size={15} /> : <Rocket size={15} />}
              </div>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: accentColor }}>{post.type}</span>
              <span className="text-white/20 text-xs mx-1">·</span>
              <span className={`text-xs font-bold tracking-widest uppercase ${isClosed ? "text-red-400" : "text-emerald-400"}`}>
                {post.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{post.title}</h1>
            <p className="text-white/35 text-sm">{filled} of {post.teamSize} members · {post.freeSlot} slot{post.freeSlot !== 1 ? "s" : ""} remaining</p>
          </div>
        </motion.div>

        {/* ── INFO CHIPS ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoChip icon={<Layers size={14} />}  label="Type"      value={post.type}      valueColor={accentColor} />
          <InfoChip icon={<Users size={14} />}   label="Team Size" value={post.teamSize}  />
          <InfoChip icon={<Users size={14} />}   label="Free Slots" value={post.freeSlot} valueColor={isClosed ? "#f87171" : "#34d399"} />
          <InfoChip icon={<Code2 size={14} />}   label="Stack"     value={`${post.techStack.length} tech${post.techStack.length !== 1 ? "s" : ""}`} />
        </motion.div>

        {/* ── MAIN CARD ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="relative rounded-2xl p-8 space-y-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="absolute top-0 left-8 right-8 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />

          {/* Description */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/25 mb-3">Description</p>
            <p className="text-white/60 text-sm leading-relaxed">{post.discription}</p>
          </div>

          {/* Tech Stack */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-white/25 mb-3">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {post.techStack.map((t, i) => <TechBadge key={i} tech={t} i={i} />)}
            </div>
          </div>

          {/* Team progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold tracking-widest uppercase text-white/25">Team Progress</p>
              <span className="text-xs text-white/30">{filled}/{post.teamSize}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}70)` }} />
            </div>
          </div>

          {/* Creator */}
          {post.createdBy && (
            <div className="flex items-center gap-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
                <User size={16} className="text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-white/25 mb-0.5">Created by</p>
                <p className="text-sm font-bold text-white">{post.createdBy.fullName}</p>
                <p className="text-xs text-white/30 flex items-center gap-1"><Mail size={10} />{post.createdBy.email}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── ACTIONS ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="relative rounded-2xl p-8 space-y-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>

          {isOwner ? (
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-widest uppercase text-white/25">Manage Your Project</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { to: `/post-requests/${post._id}`, label: "View Requests", color: "#7c3aed" },
                  { to: `/team/${post._id}`,          label: "View Team",     color: "#10b981" },
                ].map(btn => (
                  <motion.div key={btn.to} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link to={btn.to}
                      className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all"
                      style={{ background: `${btn.color}18`, border: `1px solid ${btn.color}35`, color: btn.color }}>
                      {btn.label} <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-xs font-bold tracking-widest uppercase text-white/25">Join This Project</p>

              {isClosed ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <Lock size={14} /> This project is closed to new members.
                </div>
              ) : (
                <>
                  <FocusTextarea value={contribution} onChange={e => setContrib(e.target.value)}
                    placeholder="How can you contribute to this project? Describe your skills and what you'd bring to the team…" />
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleSendRequest} disabled={sending}
                    className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-xl disabled:opacity-50 transition-all"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 24px rgba(124,58,237,0.3)" }}>
                    {sending ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : null}
                    {sending ? "Sending…" : "Send Join Request"}
                    {!sending && <ArrowRight size={15} />}
                  </motion.button>
                </>
              )}

              <AnimatePresence>
                {message.text && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
                    style={{
                      color:      message.type === "success" ? "#34d399" : "#f87171",
                      background: message.type === "success" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                      border:     `1px solid ${message.type === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}>
                    {message.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <Link to={`/team/${post._id}`}
                className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-violet-400 transition-colors">
                View current team <ChevronRight size={12} />
              </Link>
            </div>
          )}
        </motion.div>

      </div>
    </Layout>
  );
}

export default ProjectDetails;