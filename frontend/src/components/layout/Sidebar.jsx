import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h2 className="logo">FinanceFlow</h2>

        <nav>
          <NavLink to="/analytics" className="nav-link">
            Analytics
          </NavLink>

          <NavLink to="/budget" className="nav-link">
            Budget
          </NavLink>

          <NavLink to="/settings" className="nav-link">
            Account Settings
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">KI</div>

        <div className="user-details">
          <p className="user-name">Khaled Ibraheem</p>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </aside>
  );
}