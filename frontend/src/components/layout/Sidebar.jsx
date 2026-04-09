import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
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
    </aside>
  );
}