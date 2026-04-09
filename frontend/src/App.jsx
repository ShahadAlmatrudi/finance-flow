import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AnalyticsPage from "./pages/AnalyticsPage";
import BudgetPage from "./pages/BudgetPage";
import SettingsPage from "./pages/SettingsPage";
import Sidebar from "./components/layout/Sidebar";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/analytics" />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}