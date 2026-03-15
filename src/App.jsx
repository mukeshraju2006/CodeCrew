import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

// Immediate pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy loaded pages
const Dashboard        = lazy(() => import("./pages/Dashboard"));
const Profile          = lazy(() => import("./pages/Profile"));
const ExploreProjects  = lazy(() => import("./pages/ExploreProjects"));
const ProjectDetails   = lazy(() => import("./pages/ProjectDetails"));
const CreateProject    = lazy(() => import("./pages/CreateProject"));
const MyPosts          = lazy(() => import("./pages/MyPosts"));
const MyRequests       = lazy(() => import("./pages/MyRequests"));
const PostRequests     = lazy(() => import("./pages/PostRequests"));
const RequesterProfile = lazy(() => import("./pages/RequesterProfile"));
const MyTeams          = lazy(() => import("./pages/MyTeams"));
const TeamDetails      = lazy(() => import("./pages/TeamDetails"));
const TeamChat         = lazy(() => import("./pages/TeamChat")); // ← new

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>

          {/* Public Routes */}
          <Route path="/"          element={<Landing />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create"         element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
          <Route path="/explore"        element={<ProtectedRoute><ExploreProjects /></ProtectedRoute>} />
          <Route path="/projects/:id"   element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/myposts"        element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
          <Route path="/my-requests"    element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
          <Route path="/post-requests/:post_id" element={<ProtectedRoute><PostRequests /></ProtectedRoute>} />
          <Route path="/requester/:requesterId/:reqId" element={<ProtectedRoute><RequesterProfile /></ProtectedRoute>} />
          <Route path="/my-teams"       element={<ProtectedRoute><MyTeams /></ProtectedRoute>} />
          <Route path="/team/:postId"   element={<ProtectedRoute><TeamDetails /></ProtectedRoute>} />
          <Route path="/team/:postId/chat" element={<ProtectedRoute><TeamChat /></ProtectedRoute>} /> {/* ← new */}

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center"
      style={{ background: "#060608", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-900/40">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div className="w-5 h-5 border-2 border-white/10 border-t-violet-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default App;