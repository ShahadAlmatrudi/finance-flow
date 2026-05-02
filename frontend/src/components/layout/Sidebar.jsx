import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineCreditCard,
} from "react-icons/hi2";
import { LuChartNoAxesColumnIncreasing, LuSlidersHorizontal } from "react-icons/lu";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo-row">
          <LuSlidersHorizontal className="logo-icon" />
          <h2 className="logo">FinanceFlow</h2>
        </div>

        <nav className="nav-menu">
          <NavLink to="/dashboard" className="nav-link">
            <span className="nav-link-left">
              <HiOutlineHome className="nav-icon" />
              <span>Dashboard</span>
            </span>
          </NavLink>

          <NavLink to="/settings" className="nav-link">
            <span className="nav-link-left">
              <HiOutlineUserCircle className="nav-icon" />
              <span>Account Settings</span>
            </span>
          </NavLink>

          <NavLink to="/budget" className="nav-link">
            <span className="nav-link-left">
              <HiOutlineCreditCard className="nav-icon" />
              <span>Budget</span>
            </span>
          </NavLink>

          <NavLink to="/analytics" className="nav-link">
            <span className="nav-link-left">
              <LuChartNoAxesColumnIncreasing className="nav-icon" />
              <span>Analytics</span>
            </span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">OE</div>

        <div className="user-details">
          <p className="user-name">Ola Essa</p>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </aside>
  );
}