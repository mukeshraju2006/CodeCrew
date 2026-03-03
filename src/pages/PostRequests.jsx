import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getRequestsOnPost,
  changeStatus,
} from "../api/requestApi";
import {
  User,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";

function PostRequests() {
  const { post_id } = useParams();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await getRequestsOnPost(post_id);
      setRequests(res.data.data);
      setError("");
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
    try {
      setActionLoading(reqId);
      await changeStatus(reqId, status);
      await fetchRequests();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const statusStyle = (status) => {
    if (status === "PENDING")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (status === "ACCEPTED")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (status === "REJECTED")
      return "bg-red-500/20 text-red-400 border-red-500/30";
    return "";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-bold">
            Manage Applications
          </h2>
          <p className="opacity-90 mt-2">
            Review collaboration requests.
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
            <Users size={40} className="mx-auto mb-4 text-gray-500" />
            No requests yet.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-xl"
            >
              {/* Requester Link */}
              <Link
                to={`/requester/${r.requesterId._id}/${r._id}`}
                state={{ status: r.status }}
                className="flex items-center gap-3 text-indigo-400 font-semibold text-lg"
              >
                <User size={20} />
                {r.requesterId?.fullName}
              </Link>

              {/* Contribution */}
              {r.howCanYouContribute && (
                <p className="mt-4 text-gray-400 text-sm">
                  {r.howCanYouContribute}
                </p>
              )}

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
                    disabled={actionLoading === r._id}
                    onClick={() =>
                      handleStatusChange(r._id, "ACCEPTED")
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold disabled:opacity-50"
                  >
                    Accept
                  </button>

                  <button
                    disabled={actionLoading === r._id}
                    onClick={() =>
                      handleStatusChange(r._id, "REJECTED")
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold disabled:opacity-50"
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