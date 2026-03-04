import { useState, useRef, useEffect } from "react";
import { registerUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, FileText, Zap, Github, Linkedin, Layers, Tag, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

// ─── Particle Canvas ──────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight;
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.2 + 0.3, alpha: Math.random() * 0.3 + 0.08
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`; ctx.fill();
      });
      pts.forEach((a, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx*dx + dy*dy);
          if (d < 100) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.05*(1-d/100)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        }
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

// ─── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticBtn({ children, className, type, disabled }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 }), sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }}
      onMouseMove={e => { if (disabled) return; const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width/2) * 0.25); y.set((e.clientY - r.top - r.height/2) * 0.25); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}>
      <button type={type} disabled={disabled} className={className}>{children}</button>
    </motion.div>
  );
}

// ─── Focus Input ─────────────────────────────────────────────────────────────
function FInput({ label, icon, type = "text", placeholder, value, onChange, autoComplete, hint, rightEl, span2 }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={span2 ? "md:col-span-2" : ""}>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white/25">
          <span className="text-white/20">{icon}</span>{label}
        </label>
        {hint && <span className="text-xs text-white/20">{hint}</span>}
      </div>
      <motion.div animate={{ borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
        transition={{ duration: 0.2 }} className="relative flex items-center rounded-xl border overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}>
        <motion.div animate={{ opacity: focused ? 1 : 0 }} className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none" />
        {rightEl && <span className="pr-3">{rightEl}</span>}
      </motion.div>
    </div>
  );
}

// ─── Focus Textarea ───────────────────────────────────────────────────────────
function FTextarea({ label, icon, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="md:col-span-2">
      <label className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white/25 mb-2">
        <span className="text-white/20">{icon}</span>{label}
      </label>
      <motion.div animate={{ borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
        transition={{ duration: 0.2 }} className="relative rounded-xl border overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}>
        <motion.div animate={{ opacity: focused ? 1 : 0 }} className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
        <textarea placeholder={placeholder} value={value} onChange={onChange} rows={3}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none resize-none" />
      </motion.div>
    </div>
  );
}

// ─── Focus Select ─────────────────────────────────────────────────────────────
function FSelect({ label, icon, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="md:col-span-2">
      <label className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white/25 mb-2">
        <span className="text-white/20">{icon}</span>{label}
      </label>
      <motion.div animate={{ borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
        transition={{ duration: 0.2 }} className="relative rounded-xl border overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}>
        <motion.div animate={{ opacity: focused ? 1 : 0 }} className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }} />
        <select value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full bg-transparent px-4 py-3.5 text-sm text-white outline-none appearance-none cursor-pointer"
          style={{ background: "transparent" }}>
          {options.map(o => <option key={o.v} value={o.v} style={{ background: "#0d0d10" }}>{o.l}</option>)}
        </select>
      </motion.div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", bio: "", experienceLevel: "", skills: "", techStack: "", gitHub: "", linkdn: "" });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setError(""); setSuccess(""); setLoading(true);
    try {
      await registerUser({ ...form,
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        techStack: form.techStack.split(",").map(t => t.trim()).filter(Boolean),
      });
      setSuccess("Account created! Redirecting…");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: "#060608", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');`}</style>

      <ParticleField />

      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute w-[500px] h-[500px] rounded-full -left-40 -top-40" style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.09) 0%, transparent 70%)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full -right-32 -bottom-32" style={{ background: "radial-gradient(ellipse, rgba(236,72,153,0.07) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <Zap size={16} fill="white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CodeCrew</span>
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Create your account.</h1>
          <p className="text-white/30 text-sm">Join the crew. Start building.</p>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl mb-5">
              <CheckCircle2 size={14} /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          className="relative rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="absolute top-0 left-8 right-8 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">

            <FInput label="Full Name"  icon={<User size={12} />}    placeholder="Jane Smith"             value={form.fullName}       onChange={set("fullName")}       span2 />
            <FInput label="Email"      icon={<Mail size={12} />}    placeholder="you@example.com"        value={form.email}          onChange={set("email")}         type="email" autoComplete="email" span2 />
            <FInput label="Password"   icon={<Lock size={12} />}    placeholder="Create a password"      value={form.password}       onChange={set("password")}      type={showPw ? "text" : "password"} autoComplete="new-password" span2
              rightEl={<button type="button" onClick={() => setShowPw(v => !v)} className="text-white/20 hover:text-white/50 transition-colors">{showPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>} />

            <FTextarea label="Short Bio" icon={<FileText size={12} />} placeholder="Tell the crew about yourself…" value={form.bio} onChange={set("bio")} />

            <FSelect label="Experience Level" icon={<Zap size={12} />} value={form.experienceLevel} onChange={set("experienceLevel")}
              options={[{ v: "", l: "Select experience level" }, { v: "Beginner", l: "Beginner" }, { v: "Intermediate", l: "Intermediate" }, { v: "Advanced", l: "Advanced" }]} />

            <FInput label="Skills"     icon={<Tag size={12} />}    placeholder="React, Python, ML…"      value={form.skills}         onChange={set("skills")}    hint="Comma separated" />
            <FInput label="Tech Stack" icon={<Layers size={12} />} placeholder="MERN, Django, AWS…"      value={form.techStack}      onChange={set("techStack")} hint="Comma separated" />
            <FInput label="GitHub"     icon={<Github size={12} />} placeholder="https://github.com/…"    value={form.gitHub}         onChange={set("gitHub")} />
            <FInput label="LinkedIn"   icon={<Linkedin size={12} />} placeholder="https://linkedin.com/in/…" value={form.linkdn}    onChange={set("linkdn")} />

            {/* Submit */}
            <div className="md:col-span-2 pt-2">
              <MagneticBtn type="submit" disabled={loading}
                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-violet-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {loading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : null}
                <span>{loading ? "Creating Account…" : "Create Account"}</span>
                {!loading && <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowRight size={16} /></motion.span>}
              </MagneticBtn>
            </div>

          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <p className="text-center text-sm text-white/30">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center text-white/15 text-xs mt-6">
          © {new Date().getFullYear()} CodeCrew. Built for developers.
        </motion.p>

      </div>
    </div>
  );
}

export default Register;