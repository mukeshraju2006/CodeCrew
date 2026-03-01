import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getProfile,
  saveProfile,
} from "../api/profileApi";
import { User, Github, Pencil } from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    skills: "",
    techStack: "",
    experience: "Beginner",
    github: "",
    interests: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProfile();
      if (data) {
        setProfile(data);
        setForm(data);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const saved = await saveProfile(form);

    setProfile(saved);
    setEditMode(false);
    setMessage("Profile saved successfully");

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl flex items-center gap-4">
          <User size={36} />
          <div>
            <h2 className="text-4xl font-bold">My Profile</h2>
            <p className="opacity-90 mt-2">
              Showcase your skills and collaboration interests.
            </p>
          </div>
        </div>

        {message && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-xl text-center">
            {message}
          </div>
        )}

        {/* VIEW MODE */}
        {profile && !editMode && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 shadow-xl space-y-6">

            <div className="grid md:grid-cols-2 gap-6 text-gray-300">

              <div>
                <p className="text-gray-400 text-sm">Skills</p>
                <p className="text-lg font-semibold">
                  {profile.skills || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Tech Stack</p>
                <p className="text-lg font-semibold">
                  {profile.techStack || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Experience</p>
                <p className="text-lg font-semibold text-indigo-400">
                  {profile.experience}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Interests</p>
                <p className="text-lg font-semibold">
                  {profile.interests || "-"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-400 text-sm">GitHub</p>
                {profile.github ? (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <Github size={16} />
                    View Profile
                  </a>
                ) : (
                  <p>-</p>
                )}
              </div>

            </div>

            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-lg font-semibold"
            >
              <Pencil size={16} />
              Edit Profile
            </button>

          </div>
        )}

        {/* EDIT MODE */}
        {(!profile || editMode) && (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-10 shadow-xl space-y-6"
          >

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Skills
              </label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Python, ML..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Tech Stack
              </label>
              <input
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                placeholder="MERN, Django..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Experience
              </label>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                GitHub / Portfolio
              </label>
              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Interests
              </label>
              <input
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="AI, Web, Blockchain..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-3 rounded-lg transition"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg font-semibold"
              >
                Save Changes
              </button>

              {profile && (
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setForm(profile);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 transition px-6 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </Layout>
  );
}

export default Profile;