import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { viewRequester } from "../api/authApi";
import { changeStatus } from "../api/requestApi";
import {
  Github,
  Linkedin,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
} from "lucide-react";

function RequesterProfile() {
  const { requesterId, reqId } = useParams();
  const location = useLocation();

  const initialStatus = location.state?.status || null;

  const [profile, setProfile] = useState(null);
  const [requestStatus, setRequestStatus] = useState(initialStatus);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await viewRequester(requesterId);
        setProfile(res.data.data);
      } catch (err) {
        setError("Failed to load profile");
      }
    };

    fetchProfile();
  }, [requesterId]);

  const handleStatus = async (status) => {
    if (requestStatus !== "PENDING") return;

    try {
      setLoadingAction(true);
      await changeStatus(reqId, status);
      setRequestStatus(status);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update status"
      );
    } finally {
      setLoadingAction(false);
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

  if (error) return <Layout><p className="text-red-400">{error}</p></Layout>;
  if (!profile) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 rounded-3xl text-white shadow-xl">
          <h2 className="text-4xl font-bold">{profile.fullName}</h2>
          <p className="opacity-90 mt-2 flex items-center gap-2">
            <Briefcase size={16} />
            {profile.experienceLevel || "No experience level provided"}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 space-y-6">

          {requestStatus && (
            <div className="flex justify-end">
              <span
                className={`px-4 py-2 rounded-full text-sm border ${statusStyle(
                  requestStatus
                )}`}
              >
                {requestStatus === "PENDING" && <Clock size={14} className="inline mr-2" />}
                {requestStatus === "ACCEPTED" && <CheckCircle size={14} className="inline mr-2" />}
                {requestStatus === "REJECTED" && <XCircle size={14} className="inline mr-2" />}
                {requestStatus}
              </span>
            </div>
          )}

          <div>
            <h3 className="text-indigo-400 font-semibold mb-2">Bio</h3>
            <p className="text-gray-300">{profile.bio || "No bio provided."}</p>
          </div>

          <div>
            <h3 className="text-indigo-400 font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-3">
              {profile.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="bg-indigo-500/20 text-indigo-300 px-4 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {requestStatus === "PENDING" && (
            <div className="flex gap-4 mt-6">
              <button
                disabled={loadingAction}
                onClick={() => handleStatus("ACCEPTED")}
                className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                Accept
              </button>

              <button
                disabled={loadingAction}
                onClick={() => handleStatus("REJECTED")}
                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

export default RequesterProfile;