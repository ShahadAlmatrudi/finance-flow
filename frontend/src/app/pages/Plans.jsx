import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAppData, saveAppData } from "../utils/storage";
import { apiFetch } from "../utils/api";
import logo from "../assets/financeflow-logo.png";

export default function Plans() {
  const navigate = useNavigate();
  const [plan, setPlanState] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [loading, setLoading] = useState(true);

  const appData = getAppData();
  const user = appData.user || {};

  if (!user) {
    window.location.href = "/signup";
    return null;
  }

  const fullName = user.fullname || "User";
  const initials = fullName
    .split(" ").filter(Boolean)
    .map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await apiFetch("/api/plans");
        if (data.plans && data.plans.length > 0) {
          const latest = data.plans[0];
          setPlanState(latest);
          setPlanId(latest._id);
        } else {
          // Fall back to localStorage
          const local = getAppData().plan;
          setPlanState(local || null);
        }
      } catch (err) {
        console.error("Could not load plans from server:", err.message);
        const local = getAppData().plan;
        setPlanState(local || null);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("financeFlowData");
      window.location.href = "/signup";
    }
  };

  const handleDeletePlan = async () => {
    if (!window.confirm("Are you sure you want to delete your current plan?")) return;

    try {
      if (planId) {
        await apiFetch(`/api/plans/${planId}`, { method: "DELETE" });
      }
    } catch (err) {
      console.error("Could not delete plan from server:", err.message);
    }

    // Also clear localStorage
    const data = getAppData();
    data.plan = null;
    saveAppData(data);

    navigate("/dashboard");
  };

  const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString()}`;

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="appPageBody">
      <div className="appLayout">
        <aside className="sidebar">
          <div className="sidebarBrand">
            <Link to="/dashboard" className="sidebarLogo">
              <img src={logo} alt="FinanceFlow" className="sidebarLogoImg" />
              <span>FinanceFlow</span>
            </Link>
          </div>

          <nav className="sidebarNav">
            <Link to="/dashboard" className="navItem">Dashboard</Link>
            <Link to="/transactions" className="navItem">Transactions</Link>
            <Link to="/budget" className="navItem">Budget</Link>
            <Link to="/analytics" className="navItem">Analytics</Link>
            <Link to="/cards" className="navItem">Cards</Link>
            <Link to="/notifications" className="navItem">Notifications</Link>
            <Link to="/plans" className="navItem active">Plans</Link>
            <Link to="/profile-view" className="navItem">Account Settings</Link>
          </nav>

          <div className="sidebarUser">
            <div className="sidebarAvatar">{initials || "U"}</div>
            <div className="sidebarUserText">
              <p className="sidebarUserName">{fullName}</p>
              <button className="sidebarLogoutBtn" type="button" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </aside>

        <main className="mainContent">
          <header className="topBar">
            <div>
              <h1 className="pageHeading">My Plan</h1>
              <p className="pageSubheading">View and manage your current financial plan.</p>
            </div>
          </header>

          {loading ? (
            <section className="dashboardPanel">
              <div className="emptyPanelState">Loading your plan...</div>
            </section>
          ) : !plan || Object.keys(plan).length === 0 ? (
            <section className="dashboardPanel">
              <div className="emptyPanelState">
                No plan created yet.
                <div style={{ marginTop: "16px" }}>
                  <Link to="/plan-setup" className="primaryBtn">Create Plan</Link>
                </div>
              </div>
            </section>
          ) : (
            <section className="dashboardPanel">
              <div className="panelHeader">
                <h2>Current Plan</h2>
              </div>

              <div className="goalBox" style={{ marginBottom: "24px" }}>
                <p className="goalType">{plan.goalType || "No goal type"}</p>
                <h3 className="goalName">{plan.goalName || "No goal name"}</h3>
                <p className="goalMeta">Target amount: {formatMoney(plan.targetAmount)}</p>
                <p className="goalMeta">Target date: {formatDate(plan.targetDate)}</p>
                <p className="goalMeta">Monthly saving: {formatMoney(plan.monthlySaving)}</p>
                <p className="goalMeta">Saving account: {plan.savingAccount || "Not set"}</p>
                <p className="goalMeta">Auto transfer: {plan.autoTransfer ? "Enabled" : "Disabled"}</p>
                <p className="goalMeta">Emergency fund priority: {plan.emergencyFund ? "Enabled" : "Disabled"}</p>
              </div>

              <div className="panelHeader">
                <h2>Budget Categories</h2>
              </div>

              <div className="categoryList" style={{ marginBottom: "24px" }}>
                {!plan.categories || plan.categories.length === 0 ? (
                  <div className="emptyPanelState">No categories in this plan.</div>
                ) : (
                  plan.categories.map((category, index) => (
                    <div className="categoryItem" key={category._id || category.name || index}>
                      <div className="categoryTopRow">
                        <span className="categoryName">{category.name}</span>
                        <span className="categoryAmounts">
                          {formatMoney(category.spent || 0)} / {formatMoney(category.limit || 0)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="actionRow" style={{ justifyContent: "flex-start", gap: "12px" }}>
                <Link to="/plan-setup" className="primaryBtn">Edit Plan</Link>
                <button type="button" className="secondaryBtn" onClick={handleDeletePlan}>Delete Plan</button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
