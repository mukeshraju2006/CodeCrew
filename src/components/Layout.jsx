import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/authApi";
import {
  LayoutDashboard,
  Search,
  Folder,
  Send,
  Plus,
  LogOut,
  Users
} from "lucide-react";

function Layout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout failed");
    } finally {
      logout();
      navigate("/");
    }
  };

  // Improved active logic to support nested routes
  const linkStyle = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      location.pathname.startsWith(path)
        ? "bg-indigo-600 text-white"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-white/10 p-6 hidden md:flex flex-col">

        <h1 className="text-2xl font-bold text-indigo-400 mb-10">
          CodeCrew
        </h1>

        <nav className="space-y-2 flex-1">

          <Link to="/dashboard" className={linkStyle("/dashboard")}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/explore" className={linkStyle("/explore")}>
            <Search size={18} />
            Explore
          </Link>

          <Link to="/myposts" className={linkStyle("/myposts")}>
            <Folder size={18} />
            My Posts
          </Link>

          <Link to="/my-requests" className={linkStyle("/my-requests")}>
            <Send size={18} />
            My Requests
          </Link>

          {/* NEW TEAMS LINK */}
          <Link to="/my-teams" className={linkStyle("/my-teams")}>
            <Users size={18} />
            My Teams
          </Link>

          <Link to="/create" className={linkStyle("/create")}>
            <Plus size={18} />
            Create
          </Link>

        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

export default Layout;