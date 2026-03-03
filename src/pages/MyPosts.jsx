import { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import { getMyPosts } from "../api/projectApi";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  ArrowRight,
  PlusCircle,
  Search,
  Layers,
  Users,
} from "lucide-react";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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

  // Stats
  const totalPosts = posts.length;
  const openPosts = posts.filter((p) => p.freeSlot > 0).length;

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [posts, search]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4">
            <FolderKanban size={36} />
            <div>
              <h2 className="text-4xl font-bold">
                My Collaboration Posts
              </h2>
              <p className="opacity-90 mt-2">
                Manage your created projects and track team progress.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl">
            <p className="text-gray-400 text-sm">Total Posts</p>
            <p className="text-3xl font-bold text-white mt-2">
              {totalPosts}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl">
            <p className="text-gray-400 text-sm">Open Posts</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {openPosts}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Create New</p>
              <Link
                to="/create"
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2 mt-2"
              >
                <PlusCircle size={18} />
                New Post
              </Link>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-3.5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search your posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 pl-9 p-3 rounded-lg focus:border-indigo-500 outline-none transition"
          />
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

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="bg-slate-900 border border-slate-700 text-gray-300 p-12 rounded-2xl text-center shadow-xl">
            <p className="text-lg mb-6">
              No posts match your search.
            </p>

            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-lg font-semibold"
            >
              <PlusCircle size={18} />
              Create a Post
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const filled = post.teamSize - post.freeSlot;
            const percentage =
              (filled / post.teamSize) * 100;

            const isOpen = post.freeSlot > 0;

            return (
              <div
                key={post._id}
                className="group bg-slate-900 border border-slate-700 hover:border-indigo-500 transition duration-300 p-8 rounded-2xl shadow-xl hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {post.title}
                </h3>

                {/* Status Badge */}
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    isOpen
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {isOpen ? "OPEN" : "CLOSED"}
                </span>

                {/* Team Info */}
                <div className="mt-4 text-sm text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    Team Size: {post.teamSize}
                  </div>
                  <div>
                    Free Slots: {post.freeSlot}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-indigo-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {filled}/{post.teamSize} members joined
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-between items-center">
                  <Link
                    to={`/projects/${post._id}`}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    View Details
                  </Link>

                  <Link
                    to={`/post-requests/${post._id}`}
                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Manage
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}

export default MyPosts;