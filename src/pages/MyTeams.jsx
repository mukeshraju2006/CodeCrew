import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import client from "../api/client";
import { Users, Crown, Calendar, ArrowRight } from "lucide-react";

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await client.get("/team/allMyTeams");
        setTeams(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-semibold text-white">
            My Teams
          </h2>
          <p className="text-indigo-100 mt-3">
            Projects where you collaborate with others.
          </p>
        </div>

        {loading && <p className="text-gray-400">Loading teams...</p>}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {!loading && teams.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 p-16 rounded-2xl text-center">
            <Users size={40} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Teams Yet
            </h3>
            <p className="text-gray-400">
              Once your request is accepted, your teams will appear here.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team._id}
              to={`/team/${team.postId._id}`}
              className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-indigo-500/10 hover:shadow-2xl transition duration-300"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">
                  {team.postId.title}
                </h3>
                <ArrowRight
                  size={18}
                  className="text-gray-500 group-hover:text-indigo-400 transition"
                />
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-400">

                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {team.teamMemberId.length} Members
                </div>

                <div className="flex items-center gap-2">
                  <Crown size={16} className="text-yellow-400" />
                  {team.leader === team.teamMemberId[0]
                    ? "You are Leader"
                    : "Team Leader Assigned"}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(team.createdAt).toLocaleDateString()}
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default MyTeams;