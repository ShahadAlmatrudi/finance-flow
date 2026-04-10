import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/admin.css";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Transactions", path: "#" },
    { label: "Categories", path: "#" },
    { label: "Reports", path: "#" },
    { label: "Settings", path: "#" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
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

      <button className="admin-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;