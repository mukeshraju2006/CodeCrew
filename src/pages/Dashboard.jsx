import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Rocket, Search, User, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";
function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.data);
      } catch (err) {
        console.log("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4">
            <Rocket size={36} />
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome{user?.fullName ? `, ${user.fullName}` : ""} 👋
              </h2>
              <p className="opacity-90 mt-2">
                Build teams. Launch ideas. Create impact.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Explore */}
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

          {/* Create */}
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

          {/* Profile */}
          <Link
            to="/profile"
            className="group bg-slate-900 border border-slate-700 hover:border-purple-500 transition duration-300 p-8 rounded-2xl shadow-xl hover:-translate-y-2"
          >
            <User className="text-purple-400 mb-4 group-hover:scale-110 transition" size={30} />
            <h3 className="text-xl font-semibold text-white mb-2">
              View Profile
            </h3>
            <p className="text-gray-400 text-sm">
              Update your skills, experience, and showcase your expertise.
            </p>
          </Link>

        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;