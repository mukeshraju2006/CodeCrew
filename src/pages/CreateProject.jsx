import { useState } from "react";
import Layout from "../components/Layout";
import { createPost } from "../api/projectApi";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: form.title,
        discription: form.discription,
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        teamSize: Number(form.teamSize),
        status: form.status,
        type: form.type,
      };

      await createPost(payload);

      setMsg("Project posted successfully");
      setError("");

      setForm({
        title: "",
        discription: "",
        techStack: "",
        teamSize: "",
        status: "OPEN",
        type: "PROJECT",
      });

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">

        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-2xl transition duration-300">

          <h2 className="text-3xl font-bold text-indigo-400 mb-2">
            Create Collaboration Post
          </h2>

          <p className="text-gray-400 mb-8">
            Share your project idea and start building your team.
          </p>

          {msg && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl mb-6">
              {msg}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Project Title
              </label>
              <input
                name="title"
                placeholder="AI Powered Resume Analyzer"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Project Description
              </label>
              <textarea
                name="discription"
                placeholder="Explain your idea in detail..."
                value={form.discription}
                onChange={handleChange}
                rows="4"
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Tech Stack
              </label>
              <input
                name="techStack"
                placeholder="React, Node, MongoDB"
                value={form.techStack}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Team Size
              </label>
              <input
                name="teamSize"
                type="number"
                placeholder="4"
                value={form.teamSize}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Status + Type Row */}
            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="PROJECT">PROJECT</option>
                  <option value="HACKATHON">HACKATHON</option>
                </select>
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-indigo-500/30"
            >
              Publish Project
            </button>

          </form>

        </div>

      </div>
    </Layout>
  );
}

export default CreateProject;