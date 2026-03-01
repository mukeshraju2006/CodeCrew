import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [skills, setSkills] = useState("");
  const [techStack, setTechStack] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [linkdn, setLinkdn] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        fullName,
        email,
        password,
        bio,
        experienceLevel,
        gitHub,
        linkdn,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
        techStack: techStack
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
      };

      await registerUser(payload);

      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-purple-600/30 blur-3xl rounded-full bottom-0 right-0"></div>

      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-2xl p-10 rounded-3xl shadow-2xl">

        <div className="flex items-center gap-3 mb-6">
          <UserPlus size={28} />
          <h2 className="text-3xl font-bold">
            Create Your Account
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="col-span-2 bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
          />

          <div className="relative col-span-2">
            <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none pl-9 p-3 rounded-lg transition"
            />
          </div>

          <div className="relative col-span-2">
            <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none pl-9 p-3 rounded-lg transition"
            />
          </div>

          <textarea
            placeholder="Short Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="col-span-2 bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
          />

          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="col-span-2 bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
          >
            <option value="">Select Experience Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <input
            type="text"
            placeholder="Skills (React, Python...)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
          />

          <input
            type="text"
            placeholder="Tech Stack (MERN, Django...)"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
          />

          <input
            type="text"
            placeholder="GitHub Profile (optional)"
            value={gitHub}
            onChange={(e) => setGitHub(e.target.value)}
            className="bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
          />

          <input
            type="text"
            placeholder="LinkedIn Profile (optional)"
            value={linkdn}
            onChange={(e) => setLinkdn(e.target.value)}
            className="bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;