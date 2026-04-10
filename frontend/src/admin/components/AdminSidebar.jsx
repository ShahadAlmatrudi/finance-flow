import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/admin.css";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const links = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Transactions", path: "#" },
    { label: "Categories", path: "#" },
    { label: "Reports", path: "#" },
    { label: "Settings", path: "#" },
  ];

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      {/* TOP */}
      <div>
        <div className="admin-sidebar-brand">
          <h2>FinanceFlow</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-sidebar-nav">
          {links.map((link) =>
            link.path === "#" ? (
              <div key={link.label} className="admin-sidebar-link disabled-link">
                {link.label}
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.path}
                className={`admin-sidebar-link ${
                  location.pathname === link.path ? "active-link" : ""
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="admin-sidebar-footer">
        <button
          className="admin-theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;