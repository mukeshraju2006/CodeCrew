import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import client from "../api/client";
import { getCurrentUser } from "../api/authApi";
import { Users, Crown, Calendar, ChevronRight, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function TeamCard({ team, i, currentUserId }) {
  const [hovered, setHovered] = useState(false);
  const isLeader = team.leader === currentUserId || team.leader?._id === currentUserId;
  const color = isLeader ? "#f59e0b" : "#7c3aed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: i * 0.08, duration: 0.4 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
    >
      <Link
        to={`/team/${team.postId._id}`}
        className="relative block rounded-2xl p-6 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? color + "45" : "rgba(255,255,255,0.06)"}`,
          transition: "border-color 0.3s"
        }}
      >
        <motion.div animate={{ opacity: hovered ? 1 : 0 }} className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 10% 0%, ${color}0d 0%, transparent 65%)` }} />
        <motion.div animate={{ width: hovered ? "100%" : "0%" }} transition={{ duration: 0.35 }}
          className="absolute bottom-0 left-0 h-[1px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

        <div className="relative z-10">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
              {isLeader ? <Crown size={17} /> : <Shield size={17} />}
            </div>
            <motion.div animate={{ x: hovered ? 0 : 3, opacity: hovered ? 1 : 0.3 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={16} className="text-white/40 mt-1" />
            </motion.div>
          </div>

          <h3 className="text-base font-bold text-white leading-snug line-clamp-2 mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {team.postId.title}
          </h3>

          {/* Role badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
            {isLeader ? <><Crown size={11} /> Leader</> : <><Shield size={11} /> Member</>}
          </span>

          {/* Meta */}
          <div className="space-y-2.5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Users size={12} className="text-white/20" />
              {team.teamMemberId.length} member{team.teamMemberId.length !== 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Calendar size={12} className="text-white/20" />
              {new Date(team.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function MyTeams() {
  const [teams, setTeams]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [res, userRes] = await Promise.all([client.get("/team/allMyTeams"), getCurrentUser()]);
        setCurrentUserId(userRes.data.data._id);
        setTeams(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const leaderCount = teams.filter(t => t.leader === currentUserId || t.leader?._id === currentUserId).length;

  return (
    <Layout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>
      <div className="max-w-6xl mx-auto space-y-8 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">Crew</p>
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Teams</h1>
          <p className="text-white/30 text-sm mt-1">Projects where you collaborate with others.</p>
        </motion.div>

        {/* Stats */}
        {!loading && teams.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Teams",   value: teams.length,  color: "#7c3aed", icon: <Users size={14} />  },
              { label: "Leading",       value: leaderCount,   color: "#f59e0b", icon: <Crown size={14} />  },
              { label: "Member Of",     value: teams.length - leaderCount, color: "#10b981", icon: <Shield size={14} /> },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold tracking-widest uppercase text-white/25">{s.label}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}30`, color: s.color }}>{s.icon}</div>
                </div>
                <p className="text-3xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl h-52 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        )}

        {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

        {/* Empty state */}
        {!loading && !error && teams.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <Users size={22} className="text-violet-400" />
            </div>
            <p className="text-white/40 font-medium text-sm mb-1">No teams yet.</p>
            <p className="text-white/20 text-xs">Once your request is accepted, your teams will appear here.</p>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && !error && teams.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {teams.map((team, i) => <TeamCard key={team._id} team={team} i={i} currentUserId={currentUserId} />)}
            </div>
          </AnimatePresence>
        )}

      </div>
    </Layout>
  );
}

export default MyTeams;