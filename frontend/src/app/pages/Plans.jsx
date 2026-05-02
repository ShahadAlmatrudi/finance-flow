import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAppData, saveAppData } from "../utils/storage";
import { apiFetch } from "../utils/api";
import logo from "../assets/financeflow-logo.png";

export default function Plans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
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
          setPlans(data.plans);
        } else {
          const local = getAppData().plan;
          setPlans(local ? [local] : []);
        }
      } catch (err) {
        console.error("Could not load plans from server:", err.message);
        const local = getAppData().plan;
        setPlans(local ? [local] : []);
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

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      if (planId) {
        await apiFetch(`/api/plans/${planId}`, { method: "DELETE" });
      }
    } catch (err) {
      console.error("Could not delete plan from server:", err.message);
    }

    setPlans((prev) => prev.filter((p) => p._id !== planId));

    if (plans.length <= 1) {
      const data = getAppData();
      data.plan = null;
      saveAppData(data);
    }
  };

  const handleEditPlan = (plan) => {
    sessionStorage.setItem("editingPlan", JSON.stringify(plan));
    sessionStorage.setItem("editingPlanId", plan._id);
    navigate("/plan-setup");
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
              <h1 className="pageHeading">My Plans</h1>
              <p className="pageSubheading">View and manage your financial plans.</p>
            </div>
            <button
              type="button"
              className="primaryBtn"
              onClick={() => {
                sessionStorage.removeItem("editingPlan");
                sessionStorage.removeItem("editingPlanId");
                navigate("/plan-setup");
              }}
            >
              + Add New Plan
            </button>
          </header>

          {loading ? (
            <section className="dashboardPanel">
              <div className="emptyPanelState">Loading your plans...</div>
            </section>
          ) : plans.length === 0 ? (
            <section className="dashboardPanel">
              <div className="emptyPanelState">
                No plans created yet.
                <div style={{ marginTop: "16px" }}>
                  <Link to="/plan-setup" className="primaryBtn">Create Plan</Link>
                </div>
              </div>
            </section>
          ) : (
            plans.map((plan) => (
              <section className="dashboardPanel" key={plan._id} style={{ marginBottom: "24px" }}>
                <div className="panelHeader">
                  <h2>{plan.goalName || "Unnamed Plan"}</h2>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{plan.goalType}</span>
                </div>

                <div className="goalBox" style={{ marginBottom: "24px" }}>
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
                  <button
                    type="button"
                    className="primaryBtn"
                    onClick={() => handleEditPlan(plan)}
                  >
                    Edit Plan
                  </button>
                  <button
                    type="button"
                    className="secondaryBtn"
                    onClick={() => handleDeletePlan(plan._id)}
                  >
                    Delete Plan
                  </button>
                </div>
              </section>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
