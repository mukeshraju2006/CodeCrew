import { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import { getAllPosts } from "../api/projectApi";
import { Link } from "react-router-dom";
import { Search, Rocket, Zap, Users, ChevronRight, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = {
  status: [{ v: "", l: "All Status" }, { v: "OPEN", l: "Open" }, { v: "CLOSED", l: "Closed" }],
  type:   [{ v: "", l: "All Types" }, { v: "PROJECT", l: "Project" }, { v: "HACKATHON", l: "Hackathon" }],
};

function FilterPill({ options, value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)}
          className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: value === o.v ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${value === o.v ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.07)"}`,
            color: value === o.v ? "#a78bfa" : "rgba(255,255,255,0.35)",
          }}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function ProjectCard({ post, i }) {
  const [hovered, setHovered] = useState(false);
  const isOpen = post.status === "OPEN";
  const isHackathon = post.type === "HACKATHON";
  const color = isHackathon ? "#f59e0b" : "#7c3aed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: i * 0.06, duration: 0.4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl p-6 flex flex-col overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? color + "40" : "rgba(255,255,255,0.06)"}`,
        transition: "border-color 0.3s"
      }}
    >
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 10% 0%, ${color}0e 0%, transparent 65%)` }} />
      <motion.div animate={{ width: hovered ? "100%" : "0%" }} transition={{ duration: 0.35 }}
        className="absolute bottom-0 left-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
            {isHackathon ? <Zap size={16} /> : <Rocket size={16} />}
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: isOpen ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${isOpen ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                color: isOpen ? "#34d399" : "#f87171"
              }}>
              {isOpen ? "Open" : "Closed"}
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-white mb-1 leading-snug line-clamp-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {post.title}
        </h3>

        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: `${color}99` }}>
          {post.type}
        </p>

        <div className="flex items-center gap-2 mt-auto mb-5">
          <Users size={13} className="text-white/20" />
          {post.freeSlot === 0 ? (
            <span className="text-xs text-red-400 font-medium">Team Full</span>
          ) : (
            <span className="text-xs text-white/30">{post.freeSlot} slot{post.freeSlot !== 1 ? "s" : ""} open</span>
          )}
        </div>

        <Link to={`/projects/${post._id}`}
          className="flex items-center justify-between text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
          style={{
            background: hovered ? `${color}20` : "rgba(255,255,255,0.04)",
            border: `1px solid ${hovered ? color + "40" : "rgba(255,255,255,0.07)"}`,
            color: hovered ? "#fff" : "rgba(255,255,255,0.4)"
          }}>
          View Details <ChevronRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

function ExploreProjects() {
  const [posts, setPosts]           = useState([]);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("");
  const [typeFilter, setType]       = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getAllPosts({ status: statusFilter || undefined });
        setPosts(res.data.data || []);
        setError("");
      } catch (err) {
        err.response?.status === 400 ? setPosts([]) : setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [statusFilter]);

  const filtered = useMemo(() => posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) && (typeFilter ? p.type === typeFilter : true)
  ), [posts, search, typeFilter]);

  return (
    <Layout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>
      <div className="max-w-6xl mx-auto space-y-8 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">Discover</p>
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Explore Projects
          </h1>
          <p className="text-white/30 text-sm mt-1">Find your next collaboration.</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-2xl p-6 space-y-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>

          <div className="flex items-center gap-2 text-white/30 text-xs font-semibold uppercase tracking-widest">
            <SlidersHorizontal size={13} /> Filters
          </div>

          {/* Search */}
          <motion.div animate={{ borderColor: searchFocused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
            className="relative rounded-xl border overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <motion.div animate={{ opacity: searchFocused ? 1 : 0 }}
              className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input type="text" placeholder="Search by title…" value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              className="w-full bg-transparent pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/20 outline-none" />
          </motion.div>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-white/25 mb-2 font-medium">Status</p>
              <FilterPill options={FILTERS.status} value={statusFilter} onChange={setStatus} />
            </div>
            <div>
              <p className="text-xs text-white/25 mb-2 font-medium">Type</p>
              <FilterPill options={FILTERS.type} value={typeFilter} onChange={setType} />
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        {!loading && !error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-white/25">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
          </motion.p>
        )}

        {/* States */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 h-52 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-400 text-sm">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <Search size={22} className="text-violet-400" />
            </div>
            <p className="text-white/40 font-medium text-sm">No projects match your filters.</p>
            <p className="text-white/20 text-xs mt-1">Try adjusting your search or filters.</p>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((post, i) => <ProjectCard key={post._id} post={post} i={i} />)}
            </div>
          </AnimatePresence>
        )}

      </div>
    </Layout>
  );
}

export default ExploreProjects;