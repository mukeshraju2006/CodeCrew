import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getMyRequests } from "../api/requestApi";
import {
  Send,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar,
  Search,
  Filter,
} from "lucide-react";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getMyRequests();
        setRequests(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Stats
  const total = requests.length;
  const pending = requests.filter(r => r.status === "PENDING").length;
  const accepted = requests.filter(r => r.status === "ACCEPTED").length;
  const rejected = requests.filter(r => r.status === "REJECTED").length;

  // Filtered + Sorted
  const processedRequests = useMemo(() => {
    let filtered = [...requests];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (search) {
      filtered = filtered.filter(r =>
        r.postId?.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "NEWEST") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  }, [requests, search, statusFilter, sortBy]);

  const statusConfig = (status) => {
    if (status === "PENDING")
      return {
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        icon: <Clock size={14} />,
      };
    if (status === "ACCEPTED")
      return {
        color: "bg-green-500/20 text-green-400 border-green-500/30",
        icon: <CheckCircle size={14} />,
      };
    if (status === "REJECTED")
      return {
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: <XCircle size={14} />,
      };
    return {};
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl flex items-center gap-4">
          <Send size={36} />
          <div>
            <h2 className="text-4xl font-bold">My Requests</h2>
            <p className="opacity-90 mt-2">
              Track and monitor your collaboration requests.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard label="Total" value={total} />
          <StatCard label="Pending" value={pending} color="text-yellow-400" />
          <StatCard label="Accepted" value={accepted} color="text-green-400" />
          <StatCard label="Rejected" value={rejected} color="text-red-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">

          {/* Search */}
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 pl-9 p-3 rounded-lg focus:border-indigo-500 outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 p-3 rounded-lg"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 p-3 rounded-lg"
          >
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
          </select>

        </div>

        {loading && (
          <div className="text-center text-gray-400 py-10">
            Loading your requests...
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {!loading && processedRequests.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 p-16 rounded-2xl text-center shadow-xl">
            No matching requests found.
          </div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {processedRequests.map((req) => {
            const config = statusConfig(req.status);
            const isExpanded = expanded === req._id;

            return (
              <div
                key={req._id}
                className={`bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl transition duration-300 hover:-translate-y-1 ${
                  req.status === "REJECTED" ? "opacity-70" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-white">
                    {req.postId?.title || "Unknown Project"}
                  </h3>

                  <Link
                    to={`/projects/${req.postId?._id}`}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>

                <div className="mt-5">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${config.color}`}
                  >
                    {config.icon}
                    {req.status}
                  </span>
                </div>

                {req.createdAt && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    Sent on {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                )}

                {req.howCanYouContribute && (
                  <div className="mt-6 bg-slate-800 p-4 rounded-lg text-sm text-gray-300">
                    <p className="text-gray-400 mb-2">
                      Your Contribution:
                    </p>
                    <p>
                      {isExpanded
                        ? req.howCanYouContribute
                        : req.howCanYouContribute.slice(0, 120) + "..."}
                    </p>
                    {req.howCanYouContribute.length > 120 && (
                      <button
                        onClick={() =>
                          setExpanded(isExpanded ? null : req._id)
                        }
                        className="text-indigo-400 text-xs mt-2"
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </Layout>
  );
}

function StatCard({ label, value, color = "text-white" }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default MyRequests;