import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { connectSocket, disconnectSocket, getSocket } from "../api/socket";
import { getCurrentUser } from "../api/authApi";
import { getSinglePost } from "../api/projectApi";
import { Send, Users, ArrowLeft, Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString())     return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

// Group messages by date
function groupByDate(messages) {
  const groups = [];
  let lastDate = null;
  messages.forEach(msg => {
    const d = new Date(msg.createdAt).toDateString();
    if (d !== lastDate) { groups.push({ type: "date", label: formatDate(msg.createdAt), id: d + msg._id }); lastDate = d; }
    groups.push({ type: "msg", ...msg });
  });
  return groups;
}

function TeamChat() {
  const { postId } = useParams();
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(true);
  const [postTitle, setPostTitle] = useState("");
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);

  // Fetch current user + post title, then connect socket
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [userRes, postRes] = await Promise.all([
          getCurrentUser(),
          getSinglePost(postId),
        ]);
        if (!mounted) return;
        setCurrentUser(userRes.data.data);
        setPostTitle(postRes.data.data?.title || "Team Chat");

        // Token is read from the accessToken cookie set by the backend on login
        const socket = connectSocket();

        socket.on("connect",       () => setConnected(true));
        socket.on("disconnect",    () => setConnected(false));
        socket.on("connect_error", (e) => { setError(e.message); setConnected(false); });
        socket.on("error",         (msg) => setError(msg));

        socket.on("chat-history", (msgs) => {
          if (!mounted) return;
          setMessages(msgs);
          setLoading(false);
        });

        socket.on("new-message", (msg) => {
          if (!mounted) return;
          setMessages(prev => [...prev, msg]);
        });

        socket.emit("join-room", postId);

      } catch (err) {
        if (mounted) { setError("Failed to connect to chat."); setLoading(false); }
      }
    })();

    return () => {
      mounted = false;
      const socket = getSocket();
      if (socket) {
        socket.off("connect"); socket.off("disconnect");
        socket.off("connect_error"); socket.off("error");
        socket.off("chat-history"); socket.off("new-message");
      }
    };
  }, [postId]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const content = input.trim();
    if (!content) return;
    const socket = getSocket();
    if (!socket?.connected) { setError("Not connected. Please refresh."); return; }
    socket.emit("send-message", { postId, content });
    setInput("");
    inputRef.current?.focus();
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const grouped = groupByDate(messages);

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 2px; }
      `}</style>

      <div className="max-w-4xl mx-auto px-2 flex flex-col" style={{ height: "calc(100vh - 80px)", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <Link to={`/team/${postId}`}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ArrowLeft size={16} className="text-white/40 hover:text-white transition-colors" />
            </Link>
            <div>
              <p className="text-xs text-white/30 font-medium">Team Chat</p>
              <h1 className="text-lg font-extrabold text-white leading-tight line-clamp-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{postTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              connected
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                : "text-white/30 bg-white/5 border border-white/10"
            }`}>
              {connected ? <><Wifi size={11} /> Live</> : <><WifiOff size={11} /> Offline</>}
            </span>
            <Link to={`/team/${postId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
              <Users size={13} /> Members
            </Link>
          </div>
        </motion.div>

        {/* ── ERROR ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl mb-3 shrink-0">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MESSAGES ── */}
        <div className="flex-1 overflow-y-auto chat-scroll rounded-2xl p-5 space-y-1 min-h-0"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>

          {loading && (
            <div className="flex items-center justify-center h-full">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white/10 border-t-violet-500 rounded-full" />
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <Send size={18} className="text-violet-400" />
              </div>
              <p className="text-white/30 text-sm font-medium">No messages yet.</p>
              <p className="text-white/15 text-xs mt-1">Be the first to say something!</p>
            </div>
          )}

          {!loading && grouped.map((item, i) => {
            if (item.type === "date") return (
              <div key={item.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                <span className="text-xs text-white/20 font-medium shrink-0">{item.label}</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
            );

            const isMe = item.sender?._id === currentUser?._id || item.sender === currentUser?._id;

            return (
              <motion.div key={item._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"} items-end`}>

                {/* Avatar */}
                {!isMe && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mb-0.5"
                    style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.sender?.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div className={`max-w-[72%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {/* Sender name — only for others */}
                  {!isMe && (
                    <span className="text-xs font-semibold text-white/35 px-1">
                      {item.sender?.fullName}
                    </span>
                  )}

                  {/* Bubble */}
                  <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={isMe ? {
                      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                      color: "#fff",
                      borderBottomRightRadius: "6px",
                    } : {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.8)",
                      borderBottomLeftRadius: "6px",
                    }}>
                    {item.content}
                  </div>

                  <span className="text-xs text-white/20 px-1">{formatTime(item.createdAt)}</span>
                </div>
              </motion.div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* ── INPUT ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 shrink-0 flex items-end gap-3">
          <div className="flex-1 rounded-2xl overflow-hidden flex items-end"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message… (Enter to send)"
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none resize-none"
              style={{ maxHeight: "120px", overflowY: "auto" }}
              onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
            />
          </div>
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
            onClick={sendMessage} disabled={!input.trim() || !connected}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-900/30"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
            <Send size={17} className="text-white" style={{ transform: "translateX(1px)" }} />
          </motion.button>
        </motion.div>

        <p className="text-center text-white/15 text-xs mt-2 shrink-0">
          Press <kbd className="px-1 py-0.5 rounded text-white/25" style={{ background: "rgba(255,255,255,0.06)", fontSize: "10px" }}>Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded text-white/25" style={{ background: "rgba(255,255,255,0.06)", fontSize: "10px" }}>Shift+Enter</kbd> for new line
        </p>

      </div>
    </Layout>
  );
}

export default TeamChat;