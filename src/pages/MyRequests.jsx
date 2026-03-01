import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getMyRequests } from "../api/requestApi";
import { Send, Clock, CheckCircle, XCircle } from "lucide-react";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl flex items-center gap-4">
          <Send size={36} />
          <div>
            <h2 className="text-4xl font-bold">My Requests</h2>
            <p className="opacity-90 mt-2">
              Track collaboration requests you’ve sent.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400 py-10">
            Loading your requests...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="bg-slate-900 border border-slate-700 text-gray-300 p-10 rounded-2xl text-center shadow-xl">
            You haven’t requested any projects yet.
          </div>
        )}

        {/* Requests Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {requests.map((req) => {
            const config = statusConfig(req.status);

            return (
              <div
                key={req._id}
                className="bg-slate-900 border border-slate-700 hover:border-indigo-500 transition duration-300 p-8 rounded-2xl shadow-xl hover:-translate-y-2"
              >
                <h3 className="text-xl font-semibold text-white mb-6">
                  {req.postId?.title || "Unknown Project"}
                </h3>

                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${config.color}`}
                >
                  {config.icon}
                  {req.status}
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </Layout>
  );
}

export default MyRequests;