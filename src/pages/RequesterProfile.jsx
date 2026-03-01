import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { viewRequester } from "../api/authApi";
import { changeStatus } from "../api/requestApi";
import { Github, Linkedin, CheckCircle, XCircle } from "lucide-react";

function RequesterProfile() {
  const { requesterId, reqId } = useParams();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await viewRequester(requesterId);
        setProfile(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load profile"
        );
      }
    };

    fetchProfile();
  }, [requesterId]);

  const handleStatus = async (status) => {
    try {
      await changeStatus(reqId, status);
      setMessage(`Request ${status.toLowerCase()} successfully.`);
    } catch {
      setMessage("Failed to update status.");
    }
  };

  if (error) return <Layout><p className="text-red-400">{error}</p></Layout>;
  if (!profile) return <Layout><p className="text-gray-400">Loading...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 rounded-3xl shadow-2xl text-white">
          <h2 className="text-4xl font-bold">
            {profile.fullName}
          </h2>
          <p className="opacity-90 mt-2">
            {profile.experienceLevel || "No experience level provided"}
          </p>
        </div>

        {/* Profile Info */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 shadow-xl space-y-8">

          {/* Bio */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">
              Bio
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {profile.bio || "No bio provided."}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">
              Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.skills?.length ? (
                profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-500/20 text-indigo-300 px-4 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No skills listed.</span>
              )}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.techStack?.length ? (
                profile.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-purple-500/20 text-purple-300 px-4 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No tech stack listed.</span>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            {profile.gitHub && (
              <a
                href={profile.gitHub}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                <Github size={18} />
                GitHub
              </a>
            )}

            {profile.linkdn && (
              <a
                href={profile.linkdn}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
            )}
          </div>

          {/* Status Actions */}
          <div className="border-t border-slate-700 pt-6 space-y-4">

            {message && (
              <p className="text-sm text-gray-400">
                {message}
              </p>
            )}

            <div className="flex gap-4">

              <button
                onClick={() => handleStatus("ACCEPTED")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg font-semibold"
              >
                <CheckCircle size={18} />
                Accept
              </button>

              <button
                onClick={() => handleStatus("REJECTED")}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg font-semibold"
              >
                <XCircle size={18} />
                Reject
              </button>

            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default RequesterProfile;