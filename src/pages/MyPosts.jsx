import { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import { getMyPosts } from "../api/projectApi";
import { Link } from "react-router-dom";
import { FolderKanban, ArrowRight, PlusCircle, Search, Users, Rocket, Zap, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function PostCard({ post, i }) {
  const [hovered, setHovered] = useState(false);
  const filled = post.teamSize - post.freeSlot;
  const pct = Math.round((filled / post.teamSize) * 100);
  const isOpen = post.freeSlot > 0;
  const isHackathon = post.type === "HACKATHON";
  const color = isHackathon ? "#f59e0b" : "#7c3aed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.07, duration: 0.4 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl p-6 flex flex-col overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${hovered ? color + "45" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.3s" }}
    >
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 10% 0%, ${color}0d 0%, transparent 65%)` }} />
      <motion.div animate={{ width: hovered ? "100%" : "0%" }} transition={{ duration: 0.35 }}
        className="absolute bottom-0 left-0 h-[1px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
            {isHackathon ? <Zap size={16} /> : <Rocket size={16} />}
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
            style={{
              background: isOpen ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${isOpen ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
              color: isOpen ? "#34d399" : "#f87171"
            }}>
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        <h3 className="text-base font-bold text-white mb-1 line-clamp-2 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {post.title}
        </h3>
        <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: `${color}90` }}>{post.type}</p>

        {/* Team info */}
        <div className="flex items-center gap-2 mb-3">
          <Users size={12} className="text-white/20" />
          <span className="text-xs text-white/30">{filled} / {post.teamSize} members joined</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.07 + 0.3, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-auto gap-3">
          <Link to={`/projects/${post._id}`}
            className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
            View <ChevronRight size={12} />
          </Link>
          <Link to={`/post-requests/${post._id}`}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all"
            style={{
              background: hovered ? `${color}20` : "rgba(255,255,255,0.04)",
              border: `1px solid ${hovered ? color + "40" : "rgba(255,255,255,0.07)"}`,
              color: hovered ? "#fff" : "rgba(255,255,255,0.4)"
            }}>
            Manage <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function MyPosts() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyPosts();
        setPosts(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch your posts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() =>
    posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase())), [posts, search]);

  const openCount = posts.filter(p => p.freeSlot > 0).length;

  return (
    <Layout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>
      <div className="max-w-6xl mx-auto space-y-8 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">My Work</p>
            <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Posts</h1>
            <p className="text-white/30 text-sm mt-1">Manage your projects and track team progress.</p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg shadow-violet-900/30 transition-all">
              <PlusCircle size={16} /> New Post
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Posts", value: loading ? "—" : posts.length, color: "#7c3aed", icon: <FolderKanban size={14} /> },
            { label: "Open Posts",  value: loading ? "—" : openCount,    color: "#10b981", icon: <Rocket size={14} /> },
            { label: "Free Slots",  value: loading ? "—" : posts.reduce((a, p) => a + p.freeSlot, 0), color: "#ec4899", icon: <Users size={14} /> },
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

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          animate2={{ borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
          className="relative max-w-md rounded-xl border overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)", transition: "border-color 0.2s" }}>
          <motion.div animate={{ opacity: focused ? 1 : 0 }} className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input type="text" placeholder="Search your posts…" value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="w-full bg-transparent pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/20 outline-none" />
        </motion.div>

        {/* Results count */}
        {!loading && <p className="text-xs text-white/20">{filtered.length} post{filtered.length !== 1 ? "s" : ""}</p>}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl h-56 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        )}

        {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <FolderKanban size={22} className="text-violet-400" />
            </div>
            <p className="text-white/40 font-medium text-sm mb-1">{search ? "No posts match your search." : "No posts yet."}</p>
            <p className="text-white/20 text-xs mb-6">Create your first collaboration post.</p>
            <Link to="/create" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-violet-900/30">
              <PlusCircle size={15} /> Create a Post
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((post, i) => <PostCard key={post._id} post={post} i={i} />)}
            </div>
          </AnimatePresence>
        )}

      </div>
    </Layout>
  );
}

export default MyPosts;