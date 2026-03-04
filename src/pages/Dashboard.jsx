import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Rocket, Search, User, PlusCircle, Users,
  FolderKanban, Send, TrendingUp, ArrowRight,
  Clock, CheckCircle2, XCircle, ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";
import { getMyPosts } from "../api/projectApi";
import { getMyRequests } from "../api/requestApi";
import { motion, AnimatePresence } from "framer-motion";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl p-6 overflow-hidden cursor-default"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)"
      }}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${color}15 0%, transparent 70%)` }}
      />
      <motion.div
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
            {label}
          </span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
            {icon}
          </div>
        </div>
        <p className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Action Card ─────────────────────────────────────────────────────────────
function ActionCard({ to, icon, title, desc, color, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        to={to}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative block rounded-2xl p-7 overflow-hidden h-full"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? color + "50" : "rgba(255,255,255,0.06)"}`,
          transition: "border-color 0.3s"
        }}
      >
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 10% 10%, ${color}10 0%, transparent 65%)` }}
        />
        <motion.div
          animate={{ width: hovered ? "100%" : "0%" }}
          transition={{ duration: 0.35 }}
          className="absolute bottom-0 left-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
        <div className="relative z-10">
          <motion.div
            animate={{ scale: hovered ? 1.12 : 1, rotate: hovered ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}
          >
            {icon}
          </motion.div>
          <h3 className="text-base font-bold text-white mb-1.5">{title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{desc}</p>
          <motion.div
            animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 text-xs font-semibold mt-4"
            style={{ color }}
          >
            Go <ArrowRight size={12} />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    PENDING:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  icon: <Clock size={11} />,        label: "Pending"  },
    ACCEPTED: { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)", icon: <CheckCircle2 size={11} />, label: "Accepted" },
    REJECTED: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",  icon: <XCircle size={11} />,      label: "Rejected" },
  };
  const s = map[status] || map.PENDING;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {s.icon} {s.label}
    </span>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
function Dashboard() {
  const [user, setUser]       = useState(null);
  const [posts, setPosts]     = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postRes, reqRes] = await Promise.all([
          getCurrentUser(), getMyPosts(), getMyRequests()
        ]);
        setUser(userRes.data.data);
        setPosts(postRes.data.data || []);
        setRequests(reqRes.data.data || []);
      } catch {
        console.log("Dashboard data load failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pending  = requests.filter(r => r.status === "PENDING").length;
  const accepted = requests.filter(r => r.status === "ACCEPTED").length;

  const firstName = user?.fullName?.split(" ")[0] || null;

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto space-y-10 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-10"
          style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0f0a1e 50%, #0a0f2e 100%)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* orb */}
          <div className="absolute top-0 left-1/4 w-[400px] h-[200px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%)" }} />
          {/* shimmer */}
          <div className="absolute top-0 left-12 right-12 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }} />
          {/* bg icon */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
            <Rocket size={180} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-3">Dashboard</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {firstName ? (
                  <>Hey, {firstName} <span className="inline-block animate-wave">👋</span></>
                ) : (
                  <>Welcome back <span className="inline-block">👋</span></>
                )}
              </h1>
              <p className="text-white/40 mt-2 text-base">Build teams. Launch ideas. Create impact.</p>
            </div>

            {/* pending alert */}
            <AnimatePresence>
              {pending > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-300 text-sm font-semibold">
                    {pending} pending request{pending > 1 ? "s" : ""}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Your Posts"      value={loading ? "—" : posts.length}    icon={<FolderKanban size={15} />} color="#7c3aed" delay={0.05} />
          <StatCard label="Total Requests"  value={loading ? "—" : requests.length} icon={<Send size={15} />}         color="#ec4899" delay={0.1}  />
          <StatCard label="Accepted"        value={loading ? "—" : accepted}        icon={<Users size={15} />}        color="#10b981" delay={0.15} />
          <StatCard label="Pending"         value={loading ? "—" : pending}         icon={<Clock size={15} />}        color="#f59e0b" delay={0.2}  />
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Quick Actions
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard to="/explore" icon={<Search size={20} />}    title="Explore Projects" desc="Discover open collaboration posts and join innovative teams."    color="#7c3aed" delay={0.3}  />
            <ActionCard to="/create"  icon={<PlusCircle size={20} />} title="Create a Post"   desc="Start your own project and build the perfect crew around it."    color="#10b981" delay={0.35} />
            <ActionCard to="/profile" icon={<User size={20} />}       title="View Profile"    desc="Update your skills and showcase your expertise to the community." color="#ec4899" delay={0.4}  />
          </div>
        </div>

        {/* ── RECENT ACTIVITY ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Recent Activity
            </h2>
            {requests.length > 3 && (
              <Link to="/requests" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                View all <ChevronRight size={13} />
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* top shimmer */}
            <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />

            {requests.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <TrendingUp size={20} className="text-violet-400" />
                </div>
                <p className="text-white/50 text-sm font-medium">No activity yet.</p>
                <p className="text-white/20 text-xs mt-1">Go build something legendary.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {requests.slice(0, 5).map((req, i) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.07 }}
                    className="flex items-center justify-between px-6 py-5 group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                        <FolderKanban size={15} className="text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {req.postId?.title || "Unknown Project"}
                        </p>
                        <p className="text-xs text-white/25 mt-0.5">Collaboration request</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 ml-4">
                      <StatusBadge status={req.status} />
                      <Link
                        to={`/projects/${req.postId?._id}`}
                        className="flex items-center gap-1 text-xs text-white/25 hover:text-violet-400 transition-colors"
                      >
                        View <ChevronRight size={13} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;