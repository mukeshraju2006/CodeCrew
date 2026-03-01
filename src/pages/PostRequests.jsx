import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getRequestsOnPost,
  changeStatus,
} from "../api/requestApi";
import { User, CheckCircle, XCircle, Clock } from "lucide-react";

function PostRequests() {
  const { post_id } = useParams();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await getRequestsOnPost(post_id);
      setRequests(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (reqId, status) => {
    await changeStatus(reqId, status);
    fetchRequests();
  };

  const statusStyle = (status) => {
    if (status === "PENDING")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (status === "ACCEPTED")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (status === "REJECTED")
      return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-bold">
            Manage Applications
          </h2>
          <p className="opacity-90 mt-2">
            Review and approve collaboration requests.
          </p>
        </div>

        {loading && (
          <div className="text-center text-gray-400 py-10">
            Loading requests...
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="bg-slate-900 border border-slate-700 text-gray-300 p-10 rounded-2xl text-center shadow-xl">
            No requests yet for this post.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-slate-900 border border-slate-700 hover:border-indigo-500 transition duration-300 p-8 rounded-2xl shadow-xl hover:-translate-y-2"
            >
              {/* Requester Name */}
              <Link
                to={`/requester/${r.requesterId._id}/${r._id}`}
                className="flex items-center gap-3 text-indigo-400 hover:text-indigo-300 font-semibold text-lg"
              >
                <User size={20} />
                {r.requesterId?.fullName}
              </Link>

              {/* Status */}
              <div className="mt-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm border ${statusStyle(
                    r.status
                  )}`}
                >
                  {r.status === "PENDING" && <Clock size={14} className="inline mr-2" />}
                  {r.status === "ACCEPTED" && <CheckCircle size={14} className="inline mr-2" />}
                  {r.status === "REJECTED" && <XCircle size={14} className="inline mr-2" />}
                  {r.status}
                </span>
              </div>

              {/* Actions */}
              {r.status === "PENDING" && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() =>
                      handleStatusChange(r._id, "ACCEPTED")
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 transition py-2 rounded-lg font-semibold"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(r._id, "REJECTED")
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 transition py-2 rounded-lg font-semibold"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default PostRequests;