import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Rocket,
  Search,
  User,
  PlusCircle,
  Users,
  FolderKanban,
  Send,
  TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";
import { getMyPosts } from "../api/projectApi";
import { getMyRequests } from "../api/requestApi";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        setUser(userRes.data.data);

        const postRes = await getMyPosts();
        setPosts(postRes.data.data || []);

        const reqRes = await getMyRequests();
        setRequests(reqRes.data.data || []);
      } catch {
        console.log("Dashboard data load failed");
      }
    };

    fetchData();
  }, []);

  const pending = requests.filter(r => r.status === "PENDING").length;
  const accepted = requests.filter(r => r.status === "ACCEPTED").length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 text-[200px]">
            <Rocket />
          </div>

          <h2 className="text-4xl font-bold">
            Welcome{user?.fullName ? `, ${user.fullName}` : ""} 👋
          </h2>
          <p className="opacity-90 mt-3 text-lg">
            Build teams. Launch ideas. Create impact.
          </p>

          {pending > 0 && (
            <div className="mt-6 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 px-4 py-3 rounded-xl inline-block">
              You have {pending} pending request{pending > 1 ? "s" : ""}.
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard
            label="Your Posts"
            value={posts.length}
            icon={<FolderKanban size={18} />}
          />
          <StatCard
            label="Total Requests"
            value={requests.length}
            icon={<Send size={18} />}
          />
          <StatCard
            label="Accepted"
            value={accepted}
            icon={<Users size={18} />}
            color="text-green-400"
          />
          <StatCard
            label="Growth"
            value="∞"
            icon={<TrendingUp size={18} />}
            color="text-indigo-400"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-6">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <Link
              to="/explore"
              className="group bg-slate-900 border border-slate-700 hover:border-indigo-500 transition duration-300 p-8 rounded-2xl shadow-xl hover:-translate-y-2"
            >
              <Search className="text-indigo-400 mb-4 group-hover:scale-110 transition" size={30} />
              <h3 className="text-xl font-semibold text-white mb-2">
                Explore Projects
              </h3>
              <p className="text-gray-400 text-sm">
                Discover open collaboration posts and join innovative teams.
              </p>
            </Link>

            <Link
              to="/create"
              className="group bg-slate-900 border border-slate-700 hover:border-green-500 transition duration-300 p-8 rounded-2xl shadow-xl hover:-translate-y-2"
            >
              <PlusCircle className="text-green-400 mb-4 group-hover:scale-110 transition" size={30} />
              <h3 className="text-xl font-semibold text-white mb-2">
                Create a Post
              </h3>
              <p className="text-gray-400 text-sm">
                Start your own project and build the perfect team.
              </p>
            </Link>

            <Link
              to="/profile"
              className="group bg-slate-900 border border-slate-700 hover:border-purple-500 transition duration-300 p-8 rounded-2xl shadow-xl hover:-translate-y-2"
            >
              <User className="text-purple-400 mb-4 group-hover:scale-110 transition" size={30} />
              <h3 className="text-xl font-semibold text-white mb-2">
                View Profile
              </h3>
              <p className="text-gray-400 text-sm">
                Update your skills and showcase your expertise.
              </p>
            </Link>

          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-6">
            Recent Activity
          </h3>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">

            {requests.slice(0, 3).map((req) => (
              <div key={req._id} className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <p className="text-white font-medium">
                    {req.postId?.title || "Unknown Project"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Status: {req.status}
                  </p>
                </div>

                <Link
                  to={`/projects/${req.postId?._id}`}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  View →
                </Link>
              </div>
            ))}

            {requests.length === 0 && (
              <p className="text-gray-400">
                No activity yet. Go build something legendary.
              </p>
            )}

          </div>
        </div>

      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon, color = "text-white" }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{label}</p>
        <div className="text-gray-500">{icon}</div>
      </div>
      <p className={`text-3xl font-bold mt-3 ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default Dashboard;