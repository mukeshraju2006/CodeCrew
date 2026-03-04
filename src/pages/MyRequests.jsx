import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getMyRequests } from "../api/requestApi";
import { Send, Clock, CheckCircle2, XCircle, ChevronRight, Calendar, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS = {
  PENDING:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  icon: <Clock size={12} />,        label: "Pending"  },
  ACCEPTED: { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)", icon: <CheckCircle2 size={12} />, label: "Accepted" },
  REJECTED: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",  icon: <XCircle size={12} />,      label: "Rejected" },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.PENDING;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {s.icon} {s.label}
    </span>
  );
}

function FilterPill({ options, value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: value === o.v ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${value === o.v ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.07)"}`,
            color: value === o.v ? "#a78bfa" : "rgba(255,255,255,0.35)",
          }}>{o.l}
        </button>
      ))}
    </div>
  );
}

function RequestCard({ req, i }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const s = STATUS[req.status] || STATUS.PENDING;
  const contrib = req.howCanYouContribute;
  const isLong = contrib?.length > 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: i * 0.07, duration: 0.4 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl p-6 overflow-hidden flex flex-col gap-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? s.color + "40" : "rgba(255,255,255,0.06)"}`,
        opacity: req.status === "REJECTED" ? 0.65 : 1,
        transition: "border-color 0.3s, opacity 0.3s"
      }}
    >
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${s.color}0c 0%, transparent 65%)` }} />
      <motion.div animate={{ width: hovered ? "100%" : "0%" }} transition={{ duration: 0.35 }}
        className="absolute bottom-0 left-0 h-[1px]" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate leading-snug mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {req.postId?.title || "Unknown Project"}
          </h3>
          <StatusBadge status={req.status} />
        </div>
        <Link to={`/projects/${req.postId?._id}`}
          className="flex items-center gap-1 text-xs text-white/25 hover:text-violet-400 transition-colors shrink-0 mt-1">
          View <ChevronRight size={13} />
        </Link>
      </div>

      {req.createdAt && (
        <div className="relative z-10 flex items-center gap-1.5 text-xs text-white/20">
          <Calendar size={12} />
          {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      )}

      {contrib && (
        <div className="relative z-10 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-2">Your Contribution</p>
          <p className="text-xs text-white/50 leading-relaxed">
            {isLong && !expanded ? contrib.slice(0, 120) + "…" : contrib}
          </p>
          {isLong && (
            <button onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 mt-2 transition-colors">
              {expanded ? "Show less" : "Read more"}
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={12} />
              </motion.span>
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatus] = useState("ALL");
  const [sortBy, setSort]       = useState("NEWEST");
  const [focused, setFocused]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyRequests();
        setRequests(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const processed = useMemo(() => {
    let r = [...requests];
    if (statusFilter !== "ALL") r = r.filter(x => x.status === statusFilter);
    if (search) r = r.filter(x => x.postId?.title?.toLowerCase().includes(search.toLowerCase()));
    r.sort((a, b) => sortBy === "NEWEST" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt));
    return r;
  }, [requests, search, statusFilter, sortBy]);

  const stats = [
    { label: "Total",    value: requests.length,                                   color: "#7c3aed" },
    { label: "Pending",  value: requests.filter(r => r.status === "PENDING").length,  color: "#f59e0b" },
    { label: "Accepted", value: requests.filter(r => r.status === "ACCEPTED").length, color: "#10b981" },
    { label: "Rejected", value: requests.filter(r => r.status === "REJECTED").length, color: "#ef4444" },
  ];

  return (
    <Layout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>
      <div className="max-w-5xl mx-auto space-y-8 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">Outbox</p>
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Requests</h1>
          <p className="text-white/30 text-sm mt-1">Track your collaboration requests.</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>{s.label}</p>
              <p className="text-3xl font-extrabold" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                {loading ? "—" : s.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>

          {/* Search */}
          <div className="relative rounded-xl border overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)", transition: "border-color 0.2s" }}>
            <motion.div animate={{ opacity: focused ? 1 : 0 }} className="absolute left-0 top-0 bottom-0 w-[2px]"
              style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input type="text" placeholder="Search by project…" value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              className="w-full bg-transparent pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/20 outline-none" />
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-white/25 mb-2 font-medium">Status</p>
              <FilterPill value={statusFilter} onChange={setStatus}
                options={[{ v: "ALL", l: "All" }, { v: "PENDING", l: "Pending" }, { v: "ACCEPTED", l: "Accepted" }, { v: "REJECTED", l: "Rejected" }]} />
            </div>
            <div>
              <p className="text-xs text-white/25 mb-2 font-medium">Sort</p>
              <FilterPill value={sortBy} onChange={setSort}
                options={[{ v: "NEWEST", l: "Newest" }, { v: "OLDEST", l: "Oldest" }]} />
            </div>
          </div>
        </motion.div>

        {!loading && !error && <p className="text-xs text-white/20">{processed.length} request{processed.length !== 1 ? "s" : ""}</p>}

        {loading && (
          <div className="grid md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl h-44 animate-pulse" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        )}

        {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

        {!loading && !error && processed.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <Send size={22} className="text-violet-400" />
            </div>
            <p className="text-white/40 font-medium text-sm">No requests found.</p>
            <p className="text-white/20 text-xs mt-1">Try adjusting your filters.</p>
          </motion.div>
        )}

        {!loading && !error && processed.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 gap-5">
              {processed.map((req, i) => <RequestCard key={req._id} req={req} i={i} />)}
            </div>
          </AnimatePresence>
        )}

      </div>
    </Layout>
  );
}

export default MyRequests;