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
    { label: "Transactions", path: "/admin/transactions" },
    { label: "Categories", path: "/admin/categories" },
    { label: "Reports", path: "/admin/reports" },
    { label: "Settings", path: "/admin/settings" },
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
    localStorage.removeItem("currentAdminEmail");
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar-brand">
          <h2>FinanceFlow</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-sidebar-nav">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`admin-sidebar-link ${
                location.pathname === link.path ? "active-link" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;