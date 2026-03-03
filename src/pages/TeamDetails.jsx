import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import client from "../api/client";
import { Crown, Github, Linkedin } from "lucide-react";

function TeamDetails() {
  const { postId } = useParams();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await client.get(`/team/myTeam/${postId}`);
        const teamData = res.data.data[0];
        setTeam(teamData);
        setMembers(teamData.teamMemberId);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch team details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [postId]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">
            Team Members
          </h2>
          <p className="text-indigo-100 mt-3">
            Collaborators working on this project.
          </p>
        </div>

        {loading && <p className="text-gray-400">Loading team...</p>}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-indigo-500/10 hover:shadow-2xl transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
                  {member.fullName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {member.fullName}
                  </h3>

                  {team?.leader === member._id && (
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
                      <Crown size={14} />
                      Leader
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-2">
                <strong>Skills:</strong>{" "}
                {member.skills?.join(", ") || "Not specified"}
              </p>

              <p className="text-sm text-gray-400 mb-4">
                <strong>Tech Stack:</strong>{" "}
                {member.techStack?.join(", ") || "Not specified"}
              </p>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default TeamDetails;