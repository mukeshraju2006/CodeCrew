import { useState } from "react";
import { loginUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock } from "lucide-react";
import LoginAnimals from "../components/landing/LoginAnimals";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser({ email, password });
      login();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">

      <LoginAnimals />

      <div className="absolute w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-purple-600/30 blur-3xl rounded-full bottom-0 right-0"></div>

      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md p-10 rounded-3xl shadow-2xl z-10 pointer-events-none">

        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome!!
        </h2>

        <p className="text-gray-400 text-center mb-8 text-sm">
          Sign in to continue building amazing teams.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pointer-events-auto">

          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none pl-10 p-3 rounded-lg transition"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none pl-10 p-3 rounded-lg transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="mt-8 text-center text-sm text-gray-400 pointer-events-auto">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;