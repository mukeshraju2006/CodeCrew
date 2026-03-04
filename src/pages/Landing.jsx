import { Link } from "react-router-dom";
import { Users, Rocket, GitPullRequest, User, ArrowRight, Zap, Terminal, ChevronDown, MessageSquare, UsersRound } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ─── Particle Canvas ────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.5 + 0.1
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
      });
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
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
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Magnetic Button ────────────────────────────────────────────────────────
function MagneticBtn({ children, className, to }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <Link to={to} className={className}>{children}</Link>
    </motion.div>
  );
}

// ─── Typewriter ─────────────────────────────────────────────────────────────
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx];
    let timeout;
    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIdx(i => (i + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }, deleting ? 45 : 80);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);
  return (
    <span className="relative inline-block">
      <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
        {text}
      </span>
      <span className="animate-pulse text-violet-400">|</span>
    </span>
  );
}

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
      style={{
        scaleX: scrollYProgress,
        background: "linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)"
      }}
    />
  );
}

// ─── Code Snippet Widget ─────────────────────────────────────────────────────
function CodeCard() {
  const lines = [
    { indent: 0, text: "// Connect with your dream team", color: "#6b7280" },
    { indent: 0, text: "const team = await CodeCrew", color: "#e2e8f0" },
    { indent: 1, text: ".findDevelopers({", color: "#e2e8f0" },
    { indent: 2, text: 'skills: ["React", "Go", "Rust"],', color: "#34d399" },
    { indent: 2, text: 'available: true,', color: "#34d399" },
    { indent: 2, text: 'vibe: "ship fast 🚀"', color: "#f59e0b" },
    { indent: 1, text: "});", color: "#e2e8f0" },
    { indent: 0, text: "", color: "" },
    { indent: 0, text: "team.forEach(dev => dev.collaborate());", color: "#a78bfa" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, rotateY: -15 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative"
      style={{ perspective: 1000 }}
    >
      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/30 font-mono text-sm">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="text-[#6b7280] text-xs ml-3 flex items-center gap-1"><Terminal size={11} /> devcollab.js</span>
        </div>
        <div className="p-5 space-y-1">
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex"
            >
              <span className="text-[#6b7280] w-6 select-none text-right mr-4 shrink-0">{l.text ? i + 1 : ""}</span>
              <span style={{ paddingLeft: l.indent * 16, color: l.color }}>{l.text}</span>
            </motion.div>
          ))}
        </div>
        {/* Glow line at bottom */}
        <div className="h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />
      </div>
    </motion.div>
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group cursor-default overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-8 backdrop-blur-sm"
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}18 0%, transparent 70%)` }}
      />
      <div className="relative z-10">
        <motion.div
          animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? 5 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          <span style={{ color }}>{icon}</span>
        </motion.div>
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
      </div>
      <motion.div
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </motion.div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    { icon: <Users size={22} />, title: "Find Developers", desc: "Discover skilled teammates ready to collaborate on anything from side projects to serious startups.", color: "#7c3aed", delay: 0 },
    { icon: <Rocket size={22} />, title: "Launch Projects", desc: "Turn raw ideas into real collaborative builds with structured project rooms and async tools.", color: "#ec4899", delay: 0.1 },
    { icon: <GitPullRequest size={22} />, title: "Send Requests", desc: "Apply to join projects, review contributors, and merge the right talent into your team.", color: "#06b6d4", delay: 0.2 },
    { icon: <User size={22} />, title: "Developer Profiles", desc: "Showcase your stack, GitHub activity, and past collabs in a profile that speaks for itself.", color: "#10b981", delay: 0.3 },
    { icon: <MessageSquare size={22} />, title: "Chat with Teammates", desc: "Real-time messaging built in — discuss ideas, share updates, and keep your team in sync without leaving the platform.", color: "#f59e0b", delay: 0.4 },
    { icon: <UsersRound size={22} />, title: "Manage Teams", desc: "Organize your crew, assign roles, track contributions, and keep every project running smoothly from one place.", color: "#8b5cf6", delay: 0.5 },
  ];

  const steps = [
    { num: "01", title: "Create Your Profile", desc: "List your skills, tech stack, and what you're looking to build." },
    { num: "02", title: "Post or Discover", desc: "Share your project idea or explore what others are building right now." },
    { num: "03", title: "Connect & Build", desc: "Send a request, get matched, and start collaborating immediately." },
  ];

  return (
    <div className="bg-[#060608] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060608; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 2px; }
        .grain::after {
          content: "";
          position: fixed;
          inset: -50%;
          width: 200%;
          height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.5s steps(2) infinite;
        }
        @keyframes grain { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-2%,-2%)} 50%{transform:translate(2%,-2%)} 75%{transform:translate(-2%,2%)} }
        .glow-text {
          text-shadow: 0 0 80px rgba(139,92,246,0.4);
        }
        @keyframes rotateGrad {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        .rotating-grad {
          animation: rotateGrad 20s linear infinite;
        }
      `}</style>

      <div className="grain" />
      <ScrollBar />

      {/* ── NAVBAR ── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${navScrolled ? "bg-[#060608]/80 backdrop-blur-xl border-b border-white/5" : ""}`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap size={14} fill="white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CodeCrew</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            {["Features", "How it Works", "Community"].map(item => (
              <motion.a key={item} href="#" whileHover={{ color: "#fff" }} className="transition-colors">{item}</motion.a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2">Login</Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/30">
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

        <ParticleField />

        {/* Rotating orb background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
          <div className="w-[900px] h-[900px] relative">
            <div className="rotating-grad absolute inset-0 rounded-full"
              style={{ background: "conic-gradient(from 0deg, transparent 0deg, #7c3aed33 60deg, transparent 120deg, #ec489933 180deg, transparent 240deg, #06b6d433 300deg, transparent 360deg)" }} />
          </div>
          <div className="absolute w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(ellipse, #7c3aed12 0%, transparent 70%)" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="glow-text text-6xl md:text-8xl font-extrabold leading-[1.0] tracking-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Build The Future
            <br />
            <span className="inline-block mt-2">
              With&nbsp;
              <Typewriter words={["The Right Team.", "Real Developers.", "Your People.", "Zero Friction."]} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-14"
          >
            CodeCrew connects developers who want to ship real things. Post a project, find your team, and start building — no fluff, just code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <MagneticBtn
              to="/register"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-9 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-violet-900/40 hover:shadow-violet-700/50 transition-all overflow-hidden"
            >
              <span className="relative z-10">Start Building</span>
              <motion.span
                className="relative z-10"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.span>
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </MagneticBtn>
            <MagneticBtn
              to="/login"
              className="inline-flex items-center gap-2 border border-white/10 px-9 py-4 rounded-2xl font-medium text-base text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm"
            >
              View Projects
            </MagneticBtn>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── SPLIT: CODE + COPY ── */}
      <section className="max-w-7xl mx-auto px-6 py-36 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-4"
          >
            How It Works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            From idea to team
            <br />
            <span className="text-white/30">in minutes.</span>
          </motion.h2>
          <div className="space-y-8 mt-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-5"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-violet-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <CodeCard />
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="px-6 pb-36">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-xs font-bold tracking-widest text-fuchsia-400 uppercase mb-4">Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Everything you need to ship.
            </h2>
            <p className="text-white/30 mt-4 max-w-lg mx-auto text-base">No fluff. Just the tools developers actually use to find their people and build real things.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL TICKER ── */}
      <div className="border-y border-white/5 py-5 overflow-hidden bg-white/[0.02] mb-0">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {["React", "TypeScript", "Go", "Rust", "Python", "Next.js", "GraphQL", "PostgreSQL", "Docker", "Kubernetes", "Web3", "ML/AI",
            "React", "TypeScript", "Go", "Rust", "Python", "Next.js", "GraphQL", "PostgreSQL", "Docker", "Kubernetes", "Web3", "ML/AI"].map((t, i) => (
              <span key={i} className="text-white/20 text-sm font-medium tracking-widest uppercase">
                {t}
                <span className="mx-6 text-white/10">·</span>
              </span>
            ))}
        </motion.div>
      </div>

      {/* ── CTA ── */}
      <section className="px-6 pb-36">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden text-center py-24 px-8"
          style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0f0a1e 50%, #0a0f2e 100%)" }}
        >
          {/* inner glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full" style={{ background: "radial-gradient(ellipse, #7c3aed30 0%, transparent 70%)" }} />
          </div>
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-6"
            >
              Ready to build?
            </motion.p>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Your next teammate<br />is one click away.
            </h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-violet-900/50 hover:shadow-violet-700/60 transition-all">
                  Create Account <ArrowRight size={18} />
                </Link>
              </motion.div>
              <Link to="/login" className="inline-flex items-center gap-2 border border-white/10 px-10 py-4 rounded-2xl font-medium text-white/50 hover:text-white hover:border-white/20 transition-all">
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Zap size={12} fill="white" />
            </div>
            <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CodeCrew</span>
          </div>
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} CodeCrew. Built for developers, by developers.</p>
          <div className="flex gap-6 text-white/20 text-xs">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/50 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}