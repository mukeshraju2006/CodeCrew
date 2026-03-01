import { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout";
import { getAllPosts } from "../api/projectApi";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

function ExploreProjects() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPosts();
        setPosts(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      }
    };

    fetchPosts();
  }, []);

  // 🔥 Filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = statusFilter
        ? post.status === statusFilter
        : true;

      const matchesType = typeFilter
        ? post.type === typeFilter
        : true;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [posts, search, statusFilter, typeFilter]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6">
            Explore Projects
          </h2>

          {/* Filters Section */}
          <div className="grid md:grid-cols-3 gap-4">

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 pl-9 p-3 rounded-lg focus:border-indigo-500 outline-none transition"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 p-3 rounded-lg focus:border-indigo-500 outline-none transition"
            >
              <option value="">All Status</option>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 p-3 rounded-lg focus:border-indigo-500 outline-none transition"
            >
              <option value="">All Types</option>
              <option value="PROJECT">PROJECT</option>
              <option value="HACKATHON">HACKATHON</option>
            </select>

          </div>
        </div>

        {error && (
          <p className="text-red-400 text-center">{error}</p>
        )}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No projects match your filters.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-400 mb-2">
                  {post.type}
                </p>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    post.status === "OPEN"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {post.status}
                </span>

                <div className="mt-4">
                  <Link
                    to={`/projects/${post._id}`}
                    className="text-indigo-400 hover:text-indigo-300 text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}

export default ExploreProjects;