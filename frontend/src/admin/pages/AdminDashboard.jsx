import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminStatCard from "../components/AdminStatCard";
import { defaultUsers, defaultActions } from "../data/adminData";
import "../styles/admin.css";

function formatTimeAgo(dateString) {
  const now = new Date();
  const actionDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - actionDate) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
}

function AdminDashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const users = JSON.parse(localStorage.getItem("adminUsers")) || defaultUsers;
  const actions =
    JSON.parse(localStorage.getItem("adminActions")) || defaultActions;

  const totalUsers = users.length;
  const pendingTransactions = 42;
  const averageSavingRate = "68%";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const filteredActions = useMemo(() => {
    const term = debouncedSearch.toLowerCase().trim();
    const source = actions.slice(0, 5);

    if (!term) return source;

    return source.filter((action) => {
      const titleMatch = action.title?.toLowerCase().includes(term);
      const timeText = action.createdAt
        ? formatTimeAgo(action.createdAt).toLowerCase()
        : (action.time || "").toLowerCase();

      return titleMatch || timeText.includes(term);
    });
  }, [actions, debouncedSearch]);

  const growthData = [20, 35, 28, 45, 38, 52];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="admin-page-subtitle">
              Monitor platform activity and admin operations
            </p>
          </div>

          <input
            type="text"
            placeholder="Search recent actions..."
            className="admin-search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <section className="admin-stats-grid">
          <AdminStatCard
            title="Total Users"
            value={totalUsers}
            note="12% since last month"
            trend="up"
          />
          <AdminStatCard
            title="Pending Transactions"
            value={pendingTransactions}
            note="5% since last week"
            trend="down"
          />
          <AdminStatCard
            title="Average Saving Rate"
            value={averageSavingRate}
            note="8% since last month"
            trend="up"
          />
        </section>

        <section className="admin-dashboard-grid dashboard-better-grid">
          <div className="admin-panel admin-chart-panel">
            <div className="admin-panel-header">
              <h2>User Growth Over Time</h2>
            </div>

            <div className="admin-chart-box">
              <div className="admin-chart-grid-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="admin-chart-placeholder compact-chart">
                {growthData.map((value, index) => (
                  <div key={months[index]} className="admin-bar-item">
                    <div
                      className="admin-bar"
                      style={{ height: `${value * 2.4}px` }}
                    ></div>
                    <span className="admin-bar-label">{months[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-panel admin-actions-panel">
            <div className="admin-panel-header">
              <h2>Recent Admin Actions</h2>
            </div>

            <ul className="admin-action-list">
              {filteredActions.length > 0 ? (
                filteredActions.map((action) => (
                  <li key={action.id} className="admin-action-item">
                    <span className="admin-action-dot"></span>
                    <div>
                      <strong>{action.title}</strong>
                      <p className="admin-action-time">
                        {action.createdAt
                          ? formatTimeAgo(action.createdAt)
                          : action.time}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="admin-empty">No matching actions found.</li>
              )}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;