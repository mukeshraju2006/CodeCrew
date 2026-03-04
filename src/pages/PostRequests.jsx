import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getRequestsOnPost, changeStatus } from "../api/requestApi";
import { User, CheckCircle2, XCircle, Clock, Users, ChevronRight } from "lucide-react";
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

function RequestCard({ r, i, onAction, actionLoading }) {
  const [hovered, setHovered] = useState(false);
  const s = STATUS[r.status] || STATUS.PENDING;
  const busy = actionLoading === r._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: i * 0.07, duration: 0.4 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl p-6 overflow-hidden flex flex-col gap-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? s.color + "40" : "rgba(255,255,255,0.06)"}`,
        transition: "border-color 0.3s"
      }}
    >
      <motion.div animate={{ opacity: hovered ? 1 : 0 }} className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${s.color}0c 0%, transparent 65%)` }} />
      <motion.div animate={{ width: hovered ? "100%" : "0%" }} transition={{ duration: 0.35 }}
        className="absolute bottom-0 left-0 h-[1px]" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />

      {/* Requester */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <Link to={`/requester/${r.requesterId._id}/${r._id}`} state={{ status: r.status }}
          className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
            <User size={15} className="text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {r.requesterId?.fullName}
            </p>
            <p className="text-xs text-white/25">View profile</p>
          </div>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={r.status} />
          <Link to={`/requester/${r.requesterId._id}/${r._id}`} state={{ status: r.status }}
            className="text-white/20 hover:text-violet-400 transition-colors">
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Contribution */}
      {r.howCanYouContribute && (
        <div className="relative z-10 rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-2">Contribution</p>
          <p className="text-xs text-white/45 leading-relaxed line-clamp-3">{r.howCanYouContribute}</p>
        </div>
      )}

      {/* Actions */}
      {r.status === "PENDING" && (
        <div className="relative z-10 flex gap-3 pt-1">
          <motion.button whileTap={{ scale: 0.97 }} disabled={busy}
            onClick={() => onAction(r._id, "ACCEPTED")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
            {busy ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                className="inline-block w-3.5 h-3.5 border-2 rounded-full" style={{ borderColor: "#34d39940", borderTopColor: "#34d399" }} />
            ) : <><CheckCircle2 size={13} /> Accept</>}
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} disabled={busy}
            onClick={() => onAction(r._id, "REJECTED")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)", color: "#f87171" }}>
            {busy ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                className="inline-block w-3.5 h-3.5 border-2 rounded-full" style={{ borderColor: "#f8717140", borderTopColor: "#f87171" }} />
            ) : <><XCircle size={13} /> Reject</>}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

function PostRequests() {
  const { post_id } = useParams();
  const [requests, setRequests]       = useState([]);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await getRequestsOnPost(post_id);
      setRequests(res.data.data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (reqId, status) => {
    try {
      setActionLoading(reqId);
      await changeStatus(reqId, status);
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const pending  = requests.filter(r => r.status === "PENDING").length;
  const accepted = requests.filter(r => r.status === "ACCEPTED").length;
  const rejected = requests.filter(r => r.status === "REJECTED").length;

  return (
    <Layout>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>
      <div className="max-w-5xl mx-auto space-y-8 px-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-2">Inbox</p>
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Manage Applications
          </h1>
          <p className="text-white/30 text-sm mt-1">Review and respond to collaboration requests.</p>
        </motion.div>

        {/* Stats */}
        {!loading && requests.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4">
            {[
              { label: "Pending",  value: pending,  color: "#f59e0b", icon: <Clock size={14} />        },
              { label: "Accepted", value: accepted, color: "#10b981", icon: <CheckCircle2 size={14} /> },
              { label: "Rejected", value: rejected, color: "#ef4444", icon: <XCircle size={14} />      },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold tracking-widest uppercase text-white/25">{s.label}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}30`, color: s.color }}>{s.icon}</div>
                </div>
                <p className="text-3xl font-extrabold" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
            <XCircle size={15} /> {error}
          </motion.p>
        )}

        {loading && (
          <div className="grid md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl h-48 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        )}

        {!loading && requests.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <Users size={22} className="text-violet-400" />
            </div>
            <p className="text-white/40 font-medium text-sm">No applications yet.</p>
            <p className="text-white/20 text-xs mt-1">Requests will appear here when developers apply.</p>
          </motion.div>
        )}

        {!loading && requests.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid md:grid-cols-2 gap-5">
              {requests.map((r, i) => (
                <RequestCard key={r._id} r={r} i={i} onAction={handleAction} actionLoading={actionLoading} />
              ))}
            </div>
          </AnimatePresence>
        )}

      </div>
    </Layout>
  );
}

export default PostRequests;