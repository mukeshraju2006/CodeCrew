import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import client from "../api/client";
import { Crown, Shield, Tag, Layers, Users, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MemberCard({ member, isLeader, i }) {
  const [hovered, setHovered] = useState(false);
  const color = isLeader ? "#f59e0b" : "#7c3aed";
  const initial = member.fullName?.charAt(0)?.toUpperCase() || "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: i * 0.08, duration: 0.4 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl p-6 overflow-hidden flex flex-col gap-5"
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

      {/* Avatar + name */}
      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          animate={{ scale: hovered ? 1.08 : 1 }} transition={{ type: "spring", stiffness: 300 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-extrabold shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}35`, color, fontFamily: "'Space Grotesk', sans-serif" }}>
          {initial}
        </motion.div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {member.fullName}
          </h3>
          <span className="inline-flex items-center gap-1 text-xs font-semibold mt-1"
            style={{ color }}>
            {isLeader ? <><Crown size={11} /> Leader</> : <><Shield size={11} /> Member</>}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
        <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-2.5 flex items-center gap-1.5">
          <Tag size={10} /> Skills
        </p>
        {member.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {member.skills.map((s, j) => (
              <span key={j} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
                {s}
              </span>
            ))}
          </div>
        ) : <p className="text-xs text-white/25">Not specified</p>}
      </div>

      {/* Tech Stack */}
      <div className="relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
        <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-2.5 flex items-center gap-1.5">
          <Layers size={10} /> Tech Stack
        </p>
        {member.techStack?.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {member.techStack.map((t, j) => (
              <span key={j} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.22)", color: "#67e8f9" }}>
                {t}
              </span>
            ))}
          </div>
        ) : <p className="text-xs text-white/25">Not specified</p>}
      </div>
    </motion.div>
  );
}

function TeamDetails() {
  const { postId } = useParams();
  const [team, setTeam]       = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get(`/team/myTeam/${postId}`);
        const teamData = res.data.data[0];
        setTeam(teamData);
        setMembers(teamData.teamMemberId);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch team details");
      } finally { setLoading(false); }
    })();
  }, [postId]);

  return (
    <Layout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>
      <div className="max-w-5xl mx-auto space-y-8 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-10"
          style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0f0a1e 50%, #0a0f2e 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="absolute top-0 left-1/3 w-[350px] h-[180px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)" }} />
          <div className="absolute top-0 left-12 right-12 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }} />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
            <Users size={150} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-3">Project</p>
            <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Team Members
            </h1>
            <p className="text-white/35 text-sm">Collaborators working on this project.</p>
          </div>
        </motion.div>

        {/* Stats chip */}
        {!loading && members.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
                <Users size={14} /> {members.length} member{members.length !== 1 ? "s" : ""}
              </div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to={`/team/${postId}/chat`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))", border: "1px solid rgba(124,58,237,0.4)", color: "#fff" }}>
                  <MessageSquare size={14} /> Team Chat
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">{error}</p>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl h-64 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && members.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <Users size={22} className="text-violet-400" />
            </div>
            <p className="text-white/40 font-medium text-sm">No members yet.</p>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && !error && members.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.map((member, i) => (
                <MemberCard
                  key={member._id} member={member} i={i}
                  isLeader={team?.leader === member._id || team?.leader?._id === member._id}
                />
              ))}
            </div>
          </AnimatePresence>
        )}

      </div>
    </Layout>
  );
}

export default TeamDetails;