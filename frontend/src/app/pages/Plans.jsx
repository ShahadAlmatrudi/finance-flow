import { Link, useNavigate } from "react-router-dom";
import { getAppData, saveAppData } from "../utils/storage";

export default function Plans() {
  const navigate = useNavigate();
  const appData = getAppData();
  const plan = appData.plan || {};
  const user = appData.user || {};

  if (!user) {
    window.location.href = "/signup";
    return null;
  }

  const fullName = user.fullname || "User";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (shouldLogout) {
      localStorage.removeItem("financeFlowData");
      window.location.href = "/signup";
    }
  };

  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeletePlan = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your current plan?"
    );

    if (!confirmed) return;

    const data = getAppData();
    data.plan = null;
    saveAppData(data);
    navigate("/dashboard");
  };

  return (
    <div className="appPageBody">
      <div className="appLayout">
        <aside className="sidebar">
          <div className="sidebarBrand">
            <Link to="/dashboard" className="sidebarLogo">
              💸 FinanceFlow
            </Link>
          </div>

          <nav className="sidebarNav">
            <Link to="/dashboard" className="navItem">
              Dashboard
            </Link>
            <Link to="/transactions" className="navItem">
              Transactions
            </Link>
            <Link to="/budget" className="navItem">
              Budget
            </Link>
            <Link to="/analytics" className="navItem">
              Analytics
            </Link>
            <Link to="/cards" className="navItem">
              Cards
            </Link>
            <Link to="/notifications" className="navItem">
              Notifications
            </Link>
            <Link to="/plans" className="navItem active">
              Plans
            </Link>
            <Link to="/profile-view" className="navItem">
              Account Settings
            </Link>
          </nav>

          <div className="sidebarUser">
            <div className="sidebarAvatar">{initials || "U"}</div>
            <div className="sidebarUserText">
              <p className="sidebarUserName">{fullName}</p>
              <button
                className="sidebarLogoutBtn"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="mainContent">
          <header className="topBar">
            <div>
              <h1 className="pageHeading">My Plan</h1>
              <p className="pageSubheading">
                View and manage your current financial plan.
              </p>
            </div>
          </header>

          {!plan || Object.keys(plan).length === 0 ? (
            <section className="dashboardPanel">
              <div className="emptyPanelState">
                No plan created yet.
                <div style={{ marginTop: "16px" }}>
                  <Link to="/plan-setup" className="primaryBtn">
                    Create Plan
                  </Link>
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
                <p className="goalMeta">
                  Target amount: {formatMoney(plan.targetAmount)}
                </p>
                <p className="goalMeta">
                  Target date: {formatDate(plan.targetDate)}
                </p>
                <p className="goalMeta">
                  Monthly saving: {formatMoney(plan.monthlySaving)}
                </p>
                <p className="goalMeta">
                  Saving account: {plan.savingAccount || "Not set"}
                </p>
                <p className="goalMeta">
                  Auto transfer: {plan.autoTransfer ? "Enabled" : "Disabled"}
                </p>
                <p className="goalMeta">
                  Emergency fund priority:{" "}
                  {plan.emergencyFund ? "Enabled" : "Disabled"}
                </p>
              </div>

              <div className="panelHeader">
                <h2>Budget Categories</h2>
              </div>

              <div className="categoryList" style={{ marginBottom: "24px" }}>
                {!plan.categories || plan.categories.length === 0 ? (
                  <div className="emptyPanelState">No categories in this plan.</div>
                ) : (
                  plan.categories.map((category, index) => (
                    <div className="categoryItem" key={category.name || index}>
                      <div className="categoryTopRow">
                        <span className="categoryName">{category.name}</span>
                        <span className="categoryAmounts">
                          {formatMoney(category.spent || 0)} /{" "}
                          {formatMoney(category.limit || 0)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div
                className="actionRow"
                style={{ justifyContent: "flex-start", gap: "12px" }}
              >
                <Link to="/plan-setup" className="primaryBtn">
                  Edit Plan
                </Link>

                <button
                  type="button"
                  className="secondaryBtn"
                  onClick={handleDeletePlan}
                >
                  Delete Plan
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}