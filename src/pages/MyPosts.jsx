import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getMyPosts } from "../api/projectApi";
import { Link } from "react-router-dom";
import { FolderKanban, ArrowRight, PlusCircle } from "lucide-react";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getMyPosts();
        setPosts(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch your posts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4">
            <FolderKanban size={36} />
            <div>
              <h2 className="text-4xl font-bold">
                My Collaboration Posts
              </h2>
              <p className="opacity-90 mt-2">
                Manage your created projects and incoming requests.
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400 py-10">
            Loading your posts...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* No Posts */}
        {!loading && posts.length === 0 && (
          <div className="bg-slate-900 border border-slate-700 text-gray-300 p-10 rounded-2xl text-center shadow-xl">
            <p className="text-lg mb-6">
              You haven't created any posts yet.
            </p>

            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-lg font-semibold"
            >
              <PlusCircle size={18} />
              Create Your First Post
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {posts.map((post) => (
            <div
              key={post._id}
              className="group bg-slate-900 border border-slate-700 hover:border-indigo-500 transition duration-300 p-8 rounded-2xl shadow-xl hover:-translate-y-2"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                {post.title}
              </h3>

              <p className="text-gray-400 text-sm mb-6">
                Manage requests and view applicants for this project.
              </p>

              <Link
                to={`/post-requests/${post._id}`}
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Manage Requests
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}

        </div>

      </div>
    </Layout>
  );
}

export default MyPosts;