import { Link } from "react-router-dom";
import { Users, Rocket, GitPullRequest, User, ArrowRight, MessageSquare, UsersRound, ChevronDown, Zap, Code2, Globe } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Animated Mesh Gradient Canvas ───────────────────────────────────────────
function MeshGradient() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let t = 0;
    let raf;
    const orbs = [
      { x: 0.2, y: 0.2, r: 0.55, color: "138,43,226" },
      { x: 0.8, y: 0.15, r: 0.45, color: "236,72,153" },
      { x: 0.5, y: 0.7, r: 0.5, color: "6,182,212" },
      { x: 0.1, y: 0.8, r: 0.4, color: "124,58,237" },
      { x: 0.9, y: 0.75, r: 0.45, color: "16,185,129" },
    ];
    const draw = () => {
      t += 0.003;
      ctx.clearRect(0, 0, w, h);
      orbs.forEach((orb, i) => {
        const ox = (orb.x + Math.sin(t + i * 1.3) * 0.12) * w;
        const oy = (orb.y + Math.cos(t * 0.8 + i * 0.9) * 0.1) * h;
        const r = orb.r * Math.min(w, h);
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        grad.addColorStop(0, `rgba(${orb.color},0.18)`);
        grad.addColorStop(1, `rgba(${orb.color},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Floating Particles ───────────────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.4 + 0.1,
      color: ["139,92,246", "236,72,153", "6,182,212"][Math.floor(Math.random() * 3)]
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`; ctx.fill();
      });
      pts.forEach((a, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx*dx+dy*dy);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.06*(1-d/100)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx];
    let timeout;
    if (!deleting && text === word) timeout = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && text === "") { setDeleting(false); setIdx(i => (i + 1) % words.length); }
    else timeout = setTimeout(() => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)), deleting ? 40 : 85);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);
  return (
    <span>
      <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">{text}</span>
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="text-violet-400">|</motion.span>
    </span>
  );
}

// ─── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ children, className = "", style = {}, hover = true }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => hover && setHovered(true)}
      onHoverEnd={() => hover && setHovered(false)}
      animate={{ y: hovered ? -6 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-3xl backdrop-blur-xl overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`,
        boxShadow: hovered
          ? "0 30px 80px rgba(139,92,246,0.25), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)"
          : "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        transition: "border-color 0.3s, box-shadow 0.3s",
        ...style
      }}>
      {/* Inner shimmer */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)"
      }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ─── Floating Glass Orb ───────────────────────────────────────────────────────
function FloatingOrb({ color, size, x, y, delay = 0 }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, left: x, top: y,
        background: `radial-gradient(circle at 30% 30%, ${color}60, ${color}20)`,
        backdropFilter: "blur(40px)",
        border: `1px solid ${color}30`,
        boxShadow: `0 0 60px ${color}30, inset 0 0 30px ${color}10`,
      }} />
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.6 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative rounded-3xl p-7 overflow-hidden cursor-default backdrop-blur-xl"
      style={{
        background: hovered ? `rgba(255,255,255,0.08)` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered ? `0 20px 60px ${color}20, inset 0 1px 0 rgba(255,255,255,0.12)` : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
      {/* Glow blob */}
      <motion.div animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
        transition={{ duration: 0.4 }} className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 20% 20%, ${color}15 0%, transparent 60%)` }} />
      {/* Shimmer */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
      {/* Bottom glow line */}
      <motion.div animate={{ width: hovered ? "100%" : "0%" }} transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div className="relative z-10">
        <motion.div animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 8 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: `${color}18`, border: `1px solid ${color}35`, boxShadow: `0 0 20px ${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </motion.div>
        <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "'Clash Display', 'Syne', sans-serif" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Scroll Bar ───────────────────────────────────────────────────────────────
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
      style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)" }} />
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    const onMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", onMouse);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);

  const features = [
    { icon: <Users size={22} />, title: "Find Developers", desc: "Discover skilled teammates ready to collaborate on anything from side projects to serious startups.", color: "#7c3aed", delay: 0 },
    { icon: <Rocket size={22} />, title: "Launch Projects", desc: "Turn raw ideas into real collaborative builds with structured project rooms and async tools.", color: "#ec4899", delay: 0.1 },
    { icon: <GitPullRequest size={22} />, title: "Send Requests", desc: "Apply to join projects and merge the right talent into your team.", color: "#06b6d4", delay: 0.2 },
    { icon: <User size={22} />, title: "Developer Profiles", desc: "Showcase your stack, GitHub activity, and past collabs in a profile that speaks for itself.", color: "#10b981", delay: 0.3 },
    { icon: <MessageSquare size={22} />, title: "Team Chat", desc: "Real-time messaging built in — discuss ideas and keep your team in sync.", color: "#f59e0b", delay: 0.4 },
    { icon: <UsersRound size={22} />, title: "Manage Teams", desc: "Organize your crew, assign roles, and keep every project running smoothly.", color: "#8b5cf6", delay: 0.5 },
  ];

  return (
    <div style={{ background: "#030308", color: "#fff", overflowX: "hidden", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #030308; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#7c3aed, #ec4899); border-radius: 2px; }
        ::selection { background: rgba(139,92,246,0.4); }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-30px) rotate(3deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(-4deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0)} 33%{transform:translateY(-15px)} 66%{transform:translateY(-25px)} }
        @keyframes shimmer { 0%{transform:translateX(-100%) skewX(-15deg)} 100%{transform:translateX(300%) skewX(-15deg)} }
        .glass-hero-card { animation: float1 7s ease-in-out infinite; }
        .glass-hero-card-2 { animation: float2 9s ease-in-out infinite 1s; }
        .glass-hero-card-3 { animation: float3 11s ease-in-out infinite 2s; }
        .btn-shimmer::after { content:''; position:absolute; top:0; left:0; width:40%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); animation:shimmer 2.5s infinite; }
      `}</style>

      <MeshGradient />
      <Particles />
      <ScrollBar />

      {/* Dynamic spotlight following mouse */}
      <div className="fixed pointer-events-none" style={{
        left: mousePos.x - 400, top: mousePos.y - 400, width: 800, height: 800, zIndex: 2,
        background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)",
        transition: "left 0.08s linear, top 0.08s linear",
      }} />

      {/* ── NAVBAR ── */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
        style={{ transition: "all 0.4s" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center rounded-2xl px-6 py-3"
            style={{
              background: navScrolled ? "rgba(3,3,8,0.7)" : "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: navScrolled ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" : "inset 0 1px 0 rgba(255,255,255,0.06)",
              transition: "all 0.4s",
            }}>
            <motion.div whileHover={{ scale: 1.04 }} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 16px rgba(124,58,237,0.5)" }}>
                <Zap size={15} fill="white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>CodeCrew</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {["Features", "How it Works", "Community"].map(item => (
                <motion.a key={item} href="#" whileHover={{ color: "#fff" }} className="transition-colors">{item}</motion.a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm px-4 py-2 rounded-xl transition-all"
                style={{ color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Link to="/register" className="relative overflow-hidden text-sm font-bold px-5 py-2.5 rounded-xl btn-shimmer"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 20px rgba(124,58,237,0.5)" }}>
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

        {/* Floating glass orbs */}
        <FloatingOrb color="#7c3aed" size={400} x="-10%" y="-5%" delay={0} />
        <FloatingOrb color="#ec4899" size={350} x="65%" y="-10%" delay={1.5} />
        <FloatingOrb color="#06b6d4" size={300} x="10%" y="55%" delay={3} />
        <FloatingOrb color="#10b981" size={250} x="75%" y="60%" delay={2} />

        {/* Floating mini glass cards in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
          <div className="glass-hero-card absolute rounded-2xl p-4 text-xs backdrop-blur-xl"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", top: "15%", right: "8%", width: 200,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">A</div>
              <div><div className="text-white font-semibold text-xs">Mukesh Raju</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>React · Node</div></div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {["React", "Go", "AWS"].map(t => <span key={t} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa", fontSize: 10 }}>{t}</span>)}
            </div>
            <div className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Open to collab ✓</div>
          </div>

          <div className="glass-hero-card-2 absolute rounded-2xl p-4 backdrop-blur-xl"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", bottom: "20%", left: "5%", width: 190,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
            <div className="text-xs font-bold text-white mb-2">AI Resume Builder</div>
            <div className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Looking for 2 developers</div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full" style={{ width: "60%", background: "linear-gradient(90deg, #7c3aed, #ec4899)" }} />
            </div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>3/5 members joined</div>
          </div>

          <div className="glass-hero-card-3 absolute rounded-2xl p-3 backdrop-blur-xl"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", top: "55%", right: "5%", width: 160,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white font-semibold">Request Accepted!</span>
            </div>
            <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>Welcome to the team 🎉</p>
          </div>
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity, zIndex: 10 }} className="relative text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 mb-10 text-xs backdrop-blur-xl"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span style={{ color: "rgba(255,255,255,0.6)" }}>The developer collaboration platform</span>
            <ArrowRight size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-none mb-6"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(52px, 10vw, 130px)", letterSpacing: "-0.03em" }}>
            <span style={{ background: "linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.5) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Build The
            </span>
            <br />
            <span style={{ background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Future
            </span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Syne', sans-serif" }}>
            With&nbsp;<Typewriter words={["The Right Team.", "Real Developers.", "Your People.", "Zero Friction."]} />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-base md:text-lg max-w-2xl mx-auto mb-14 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            CodeCrew connects developers who have common interests. Post a project, find your team, and start building — no fluff, just code.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="relative overflow-hidden inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-base btn-shimmer"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 8px 40px rgba(124,58,237,0.5), 0 0 0 1px rgba(255,255,255,0.1)" }}>
                Start Building
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/login" className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-medium text-base backdrop-blur-xl"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}>
                Explore Projects
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "rgba(255,255,255,0.25)", zIndex: 10 }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-6 py-36 grid md:grid-cols-2 gap-24 items-center" style={{ position: "relative", zIndex: 10 }}>
        <div>
          <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#a78bfa" }}>
            How It Works
          </motion.p>
          <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="font-black leading-tight mb-12"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 5vw, 56px)" }}>
            From idea to team<br />
            <span style={{ color: "rgba(255,255,255,0.25)" }}>in minutes.</span>
          </motion.h2>
          <div className="space-y-6">
            {[
              { num: "01", title: "Create Your Profile", desc: "List your skills, tech stack, and what you're looking to build.", color: "#7c3aed" },
              { num: "02", title: "Post or Discover", desc: "Share your project idea or explore what others are building right now.", color: "#ec4899" },
              { num: "03", title: "Connect & Build", desc: "Send a request, get matched, and start collaborating immediately.", color: "#06b6d4" },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="flex gap-5 group">
                <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold backdrop-blur-xl"
                  style={{ background: `${step.color}18`, border: `1px solid ${step.color}30`, color: step.color,
                    boxShadow: `0 4px 20px ${step.color}15`, fontFamily: "'Syne', sans-serif" }}>
                  {step.num}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Glass mockup card */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }} className="relative">
          <GlassCard style={{ padding: 32 }} hover={false}>
            <div className="flex items-center gap-3 mb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 20 }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold">S</div>
              <div>
                <div className="text-sm font-bold text-white">AI Code Reviewer</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>by Divyansh Giri · Open</div>
              </div>
              <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>Open</span>
            </div>
            <div className="space-y-3 mb-6">
              {[["Stack", "React, Python, OpenAI"], ["Team Size", "4 members"], ["Free Slots", "2 remaining"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {["React", "Python", "OpenAI", "FastAPI"].map(t => (
                <span key={t} className="text-xs px-3 py-1 rounded-full"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>{t}</span>
              ))}
            </div>
            <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Your contribution</p>
              <p className="text-sm text-white mt-1">I can build the frontend review interface and integrate the OpenAI API…</p>
            </div>
            <div className="w-full py-3 rounded-2xl text-sm font-bold text-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
              Send Join Request →
            </div>
          </GlassCard>
          {/* Glow behind card */}
          <div className="absolute -inset-10 pointer-events-none" style={{ zIndex: -1,
            background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 pb-36" style={{ position: "relative", zIndex: 10 }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#f472b6" }}>Capabilities</p>
            <h2 className="font-black mb-4" style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 5vw, 56px)" }}>
              Everything for a team.
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
              No fluff. Just the tools developers actually use to find their people and build real things.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden",
        background: "rgba(255,255,255,0.02)", position: "relative", zIndex: 10 }}>
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap py-5">
          {["React", "TypeScript", "Go", "Rust", "Python", "Next.js", "GraphQL", "PostgreSQL", "Docker", "Kubernetes", "Web3", "ML/AI",
            "React", "TypeScript", "Go", "Rust", "Python", "Next.js", "GraphQL", "PostgreSQL", "Docker", "Kubernetes", "Web3", "ML/AI"].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 text-sm font-medium tracking-widest"
              style={{ color: "rgba(255,255,255,0.2)" }}>
              {t} <span style={{ color: "rgba(255,255,255,0.08)" }}>·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── CTA ── */}
      <section className="px-6 py-36" style={{ position: "relative", zIndex: 10 }}>
        <div className="max-w-4xl mx-auto">
          <GlassCard style={{ padding: "80px 48px", textAlign: "center" }} hover={false}>
            {/* Glow inside */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)" }} />
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "#a78bfa" }}>
              Ready to build?
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }} className="font-black mb-6 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 6vw, 64px)" }}>
              Your next teammate<br />
              <span style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                is one click away.
              </span>
            </motion.h2>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }} className="flex gap-4 justify-center flex-wrap mt-10">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="relative overflow-hidden inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold btn-shimmer"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 8px 40px rgba(124,58,237,0.5)" }}>
                  Create Account <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-medium backdrop-blur-xl"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
                  Login
                </Link>
              </motion.div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", zIndex: 10 }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
              <Zap size={14} fill="white" />
            </div>
            <span className="font-bold text-sm text-white" style={{ fontFamily: "'Syne', sans-serif" }}>CodeCrew</span>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} CodeCrew. Built for developers, by developers.
          </p>
          <div className="flex gap-6 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            {["Privacy", "Terms", "GitHub"].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}