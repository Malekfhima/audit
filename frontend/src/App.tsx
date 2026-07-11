import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Audits from "./pages/Audits";
import Norms from "./pages/Norms";
import Sites from "./pages/Sites";
import Processes from "./pages/Processes";
import Risks from "./pages/Risks";
import Legal from "./pages/Legal";
import NonConformities from "./pages/NonConformities";
import CorrectiveActions from "./pages/CorrectiveActions";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import NewAudit from "./pages/NewAudit";
import AuditDetail from "./pages/AuditDetail";
import NewNonConformity from "./pages/NewNonConformity";
import NewCorrectiveAction from "./pages/NewCorrectiveAction";
import NewRisk from "./pages/NewRisk";
import NewLegalRequirement from "./pages/NewLegalRequirement";
import NewReport from "./pages/NewReport";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <div className="min-h-screen bg-[#F7F5EF] flex">
      <Navigation />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audits"
            element={
              <ProtectedRoute>
                <Audits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/norms"
            element={
              <ProtectedRoute>
                <Norms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sites"
            element={
              <ProtectedRoute>
                <Sites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/processes"
            element={
              <ProtectedRoute>
                <Processes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risks"
            element={
              <ProtectedRoute>
                <Risks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/legal"
            element={
              <ProtectedRoute>
                <Legal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/non-conformities"
            element={
              <ProtectedRoute>
                <NonConformities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/corrective-actions"
            element={
              <ProtectedRoute>
                <CorrectiveActions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <Roles />
              </ProtectedRoute>
            }
          />
          {/* Creation & Detail Routes */}
          <Route
            path="/audits/new"
            element={
              <ProtectedRoute>
                <NewAudit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audits/:id"
            element={
              <ProtectedRoute>
                <AuditDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/non-conformities/new"
            element={
              <ProtectedRoute>
                <NewNonConformity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/corrective-actions/new"
            element={
              <ProtectedRoute>
                <NewCorrectiveAction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risks/new"
            element={
              <ProtectedRoute>
                <NewRisk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/legal/requirements/new"
            element={
              <ProtectedRoute>
                <NewLegalRequirement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/new"
            element={
              <ProtectedRoute>
                <NewReport />
              </ProtectedRoute>
            }
          />
          {/* Detail pages (redirect to list for now) */}
          <Route
            path="/non-conformities/:id"
            element={
              <ProtectedRoute>
                <NonConformities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/corrective-actions/:id"
            element={
              <ProtectedRoute>
                <CorrectiveActions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risks/:id"
            element={
              <ProtectedRoute>
                <Risks />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
