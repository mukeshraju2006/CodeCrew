import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getSinglePost } from "../api/projectApi";
import { sendRequest } from "../api/requestApi";
import { getCurrentUser } from "../api/authApi";
import { Code2, Users, Layers, ArrowRight } from "lucide-react";

function ProjectDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [contribution, setContribution] = useState("");
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setCurrentUser(res.data.data);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getSinglePost(id);
        setPost(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch post");
      }
    };
    fetchPost();
  }, [id]);

  const handleSendRequest = async () => {
    try {
      const res = await sendRequest(post._id, contribution);
      setMessage(res.data.message);
      setContribution("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Request failed"
      );
    }
  };

  if (error) return <Layout><p className="text-red-400">{error}</p></Layout>;
  if (!post) return <Layout><p className="text-gray-400">Loading...</p></Layout>;

  const isOwner =
    currentUser && post.createdBy?._id === currentUser._id;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-bold">{post.title}</h2>
          <p className="opacity-90 mt-2">
            {post.type} • Team Size: {post.teamSize}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 shadow-xl space-y-8">

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-3">
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {post.discription}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-3 flex items-center gap-2">
              <Code2 size={18} />
              Tech Stack
            </h3>

            <div className="flex flex-wrap gap-3">
              {post.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="bg-indigo-500/20 text-indigo-300 px-4 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Status + Type */}
          <div className="flex flex-wrap gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Layers size={16} />
              Status:{" "}
              <span
                className={`font-semibold ${
                  post.status === "OPEN"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {post.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={16} />
              Team Size: {post.teamSize}
            </div>
          </div>

          {/* Creator Info */}
          {post.createdBy && (
            <div className="border-t border-slate-700 pt-6 text-gray-300">
              <p className="text-sm text-gray-400 mb-1">
                Created By
              </p>
              <p className="font-semibold">
                {post.createdBy.fullName}
              </p>
              <p className="text-sm text-gray-500">
                {post.createdBy.email}
              </p>
            </div>
          )}

          {/* Action Section */}
          <div className="border-t border-slate-700 pt-8">

            {/* Owner View */}
            {isOwner && (
              <Link
                to={`/post-requests/${post._id}`}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-lg font-semibold"
              >
                View Requests
                <ArrowRight size={16} />
              </Link>
            )}

            {/* Non-owner View */}
            {!isOwner && (
              <div className="space-y-4">

                <textarea
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  placeholder="How can you contribute to this project?"
                  className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 outline-none p-4 rounded-lg transition text-gray-300"
                />

                <button
                  onClick={handleSendRequest}
                  className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-lg font-semibold"
                >
                  Send Join Request
                </button>

                {message && (
                  <p className="text-sm text-gray-400">
                    {message}
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default ProjectDetails;