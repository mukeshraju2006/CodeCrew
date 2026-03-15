import { useState, useRef } from "react";
import Layout from "../components/Layout";
import { createPost } from "../api/projectApi";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  FileText, AlignLeft, Layers, Users, Tag, Rocket,
  ArrowRight, CheckCircle2, AlertCircle, ChevronDown, Zap
} from "lucide-react";

// ─── Magnetic Button ─────────────────────────────────────────────────────────
function MagneticBtn({ children, className, type, disabled }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e) => {
    if (disabled) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.25);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <button type={type} disabled={disabled} className={className}>{children}</button>
    </motion.div>
  );
}

// ─── Animated Input ───────────────────────────────────────────────────────────
function Field({ label, icon, hint, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-xs font-semibold tracking-widest text-white/30 uppercase">
          <span className="text-white/20">{icon}</span>
          {label}
        </label>
        {hint && <span className="text-white/20 text-xs">{hint}</span>}
      </div>
      {children}
    </motion.div>
  );
}

function TextInput({ name, placeholder, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      animate={{ borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl border overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <motion.div
        animate={{ opacity: focused ? 1 : 0 }}
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }}
      />
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none"
      />
    </motion.div>
  );
}

function TextArea({ name, placeholder, value, onChange, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      animate={{ borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl border overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <motion.div
        animate={{ opacity: focused ? 1 : 0 }}
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }}
      />
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none resize-none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </motion.div>
  );
}

function SelectInput({ name, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      animate={{ borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl border overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <motion.div
        animate={{ opacity: focused ? 1 : 0 }}
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }}
      />
      <select
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent px-4 py-3.5 text-sm text-white outline-none appearance-none cursor-pointer"
        style={{ background: "transparent" }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: "#0d0d10", color: "#fff" }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
    </motion.div>
  );
}

// ─── Tech Stack Tag Input ─────────────────────────────────────────────────────
function TagInput({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  const tags = value ? value.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-3">
      <motion.div
        animate={{ borderColor: focused ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.06)" }}
        transition={{ duration: 0.2 }}
        className="relative rounded-xl border overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <motion.div
          animate={{ opacity: focused ? 1 : 0 }}
          className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: "linear-gradient(180deg, #7c3aed, #ec4899)" }}
        />
        <input
          name="techStack"
          placeholder="React, Node.js, PostgreSQL, Docker…"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none"
        />
      </motion.div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border"
              style={{
                background: "rgba(124,58,237,0.12)",
                borderColor: "rgba(124,58,237,0.3)",
                color: "#a78bfa"
              }}
            >
              <Tag size={10} />
              {tag}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Type Selector ────────────────────────────────────────────────────────────
function TypeSelector({ value, onChange }) {
  const options = [
    { value: "PROJECT", label: "Project", icon: <Rocket size={16} />, desc: "Build something meaningful" },
    { value: "HACKATHON", label: "Hackathon", icon: <Zap size={16} />, desc: "Fast-paced team sprint" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(opt => (
        <motion.button
          key={opt.value}
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange({ target: { name: "type", value: opt.value } })}
          className="relative rounded-xl border p-4 text-left transition-all"
          style={{
            background: value === opt.value ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
            borderColor: value === opt.value ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.06)",
          }}
        >
          {value === opt.value && (
            <motion.div
              layoutId="typeIndicator"
              className="absolute inset-0 rounded-xl"
              style={{ background: "rgba(124,58,237,0.08)" }}
            />
          )}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: value === opt.value ? "#a78bfa" : "rgba(255,255,255,0.3)" }}>
                {opt.icon}
              </span>
              {value === opt.value && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 size={14} className="text-violet-400" />
                </motion.span>
              )}
            </div>
            <div className={`text-sm font-semibold ${value === opt.value ? "text-white" : "text-white/40"}`}>
              {opt.label}
            </div>
            <div className="text-xs text-white/20 mt-0.5">{opt.desc}</div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
function CreateProject() {
  const [form, setForm] = useState({
    title: "",
    discription: "",
    techStack: "",
    teamSize: "",
    status: "OPEN",
    type: "PROJECT",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(""); setError("");
    try {
      const payload = {
        title: form.title,
        discription: form.discription,
        techStack: form.techStack.split(",").map(t => t.trim()).filter(Boolean),
        teamSize: Number(form.teamSize),
        status: form.status,
        type: form.type,
      };
      await createPost(payload);
      setMsg("Project posted successfully!");
      setForm({ title: "", discription: "", techStack: "", teamSize: "", status: "OPEN", type: "PROJECT" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@700;800&display=swap');
        select option { background: #0d0d10; }
      `}</style>

      <div className="max-w-2xl mx-auto px-4 py-8" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-3">New Post</p>
          <h1 className="text-4xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Create a<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Collaboration Post
            </span>
          </h1>
          <p className="text-white/30 text-sm mt-3">Share your idea and start assembling your crew.</p>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-4 rounded-xl mb-6"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              {msg}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative rounded-2xl p-8 backdrop-blur-sm"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          {/* top shimmer */}
          <div className="absolute top-0 left-8 right-8 h-px rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />

          <form onSubmit={handleSubmit} className="space-y-7">

            <Field label="Project Title" icon={<FileText size={13} />}>
              <TextInput
                name="title"
                placeholder="Name your project"
                value={form.title}
                onChange={handleChange}
              />
            </Field>

            <Field label="Description" icon={<AlignLeft size={13} />} hint="Be specific">
              <TextArea
                name="discription"
                placeholder="Describe your idea, the problem it solves, and what kind of teammates you're looking for…"
                value={form.discription}
                onChange={handleChange}
                rows={5}
              />
            </Field>

            <Field label="Tech Stack" icon={<Layers size={13} />} hint="Comma separated">
              <TagInput value={form.techStack} onChange={handleChange} />
            </Field>

            <div className="grid grid-cols-2 gap-5">
              <Field label="Team Size" icon={<Users size={13} />}>
                <TextInput
                  name="teamSize"
                  type="number"
                  placeholder="4"
                  value={form.teamSize}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Status" icon={<CheckCircle2 size={13} />}>
                <SelectInput
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={[
                    { value: "OPEN", label: "Open" },
                    { value: "CLOSED", label: "Closed" },
                  ]}
                />
              </Field>
            </div>

            <Field label="Post Type" icon={<Rocket size={13} />}>
              <TypeSelector value={form.type} onChange={handleChange} />
            </Field>

            {/* Divider */}
            <div className="h-px bg-white/5" />

            <MagneticBtn
              type="submit"
              disabled={loading}
              className="group w-full relative flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-violet-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Publishing…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Publish Project
                  <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight size={16} />
                  </motion.span>
                </span>
              )}
            </MagneticBtn>

          </form>
        </motion.div>
      </div>
    </Layout>
  );
}

export default CreateProject;