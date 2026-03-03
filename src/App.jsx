import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

// Immediate pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy loaded pages (better performance)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const ExploreProjects = lazy(() => import("./pages/ExploreProjects"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const CreateProject = lazy(() => import("./pages/CreateProject"));
const MyPosts = lazy(() => import("./pages/MyPosts"));
const MyRequests = lazy(() => import("./pages/MyRequests"));
const PostRequests = lazy(() => import("./pages/PostRequests"));
const RequesterProfile = lazy(() => import("./pages/RequesterProfile"));
const MyTeams = lazy(() => import("./pages/MyTeams"));
const TeamDetails = lazy(() => import("./pages/TeamDetails"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <ExploreProjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/myposts"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post-requests/:post_id"
            element={
              <ProtectedRoute>
                <PostRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requester/:requesterId/:reqId"
            element={
              <ProtectedRoute>
                <RequesterProfile />
              </ProtectedRoute>
            }
          />

          {/* NEW TEAM ROUTES */}

          <Route
            path="/my-teams"
            element={
              <ProtectedRoute>
                <MyTeams />
              </ProtectedRoute>
            }
          />

          <Route
            path="/team/:postId"
            element={
              <ProtectedRoute>
                <TeamDetails />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-950 text-slate-300">
      <h2 className="text-lg animate-pulse">Loading page...</h2>
    </div>
  );
}

export default App;