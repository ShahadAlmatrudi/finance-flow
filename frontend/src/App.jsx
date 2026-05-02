import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ⭐ Landing (FIRST PAGE)
import Landing from "./app/pages/Landing";

// User pages
import Login from "./app/pages/Login";
import Signup from "./app/pages/Signup";
import Onboarding from "./app/pages/Onboarding";
import Questionnaire from "./app/pages/Questionnaire";
import Profile from "./app/pages/Profile";
import PlanSetup from "./app/pages/PlanSetup";
import Cards from "./app/pages/Cards";
import Welcome from "./app/pages/Welcome";
import Dashboard from "./app/pages/Dashboard";
import Transactions from "./app/pages/Transactions";
import Budget from "./app/pages/Budget";
import Analytics from "./app/pages/Analytics";
import Notifications from "./app/pages/Notifications";
import ProfileView from "./app/pages/ProfileView";
import Plans from "./app/pages/Plans"; // ✅ IMPORTANT

// Admin pages
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminTransactions from "./admin/pages/AdminTransactions";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminReports from "./admin/pages/AdminReports";
import AdminSettings from "./admin/pages/AdminSettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ⭐ FIRST PAGE */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Setup flow */}
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plan-setup" element={<PlanSetup />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Main user app */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/plans" element={<Plans />} /> {/* ✅ NEW */}
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile-view" element={<ProfileView />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Default admin redirect */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}