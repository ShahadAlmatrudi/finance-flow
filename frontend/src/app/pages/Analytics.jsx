import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAppData } from "../utils/storage";
import { apiFetch } from "../utils/api";
import logo from "../assets/financeflow-logo.png";

export default function Analytics() {
  const navigate = useNavigate();

  const [sidebarUserName, setSidebarUserName] = useState("User");
  const [sidebarAvatar, setSidebarAvatar] = useState("U");

  const [totalSpending, setTotalSpending] = useState(0);
  const [topCategory, setTopCategory] = useState(null);
  const [goalProgress, setGoalProgress] = useState(0);
  const [goalName, setGoalName] = useState("No goal set");
  const [savingPlan, setSavingPlan] = useState(0);

  const [categoryList, setCategoryList] = useState([]);
  const [insightsList, setInsightsList] = useState([]);
  const [snapshotList, setSnapshotList] = useState([]);

  const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString()}`;

  useEffect(() => {
    const appData = getAppData();

    if (!appData.user) {
      navigate("/signup");
      return;
    }

    const fullName = appData.user?.fullname || "User";
    const initials = fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setSidebarUserName(fullName);
    setSidebarAvatar(initials || "U");

    const loadAnalytics = async () => {
      try {
        const data = await apiFetch("/api/analytics/summary");

        setTotalSpending(data.totalSpending || 0);
        setTopCategory(data.topCategory || null);
        setGoalProgress(data.goalProgress || 0);
        setGoalName(data.goalName || "No goal set");
        setSavingPlan(data.monthlySaving || 0);
        setCategoryList(data.categories || []);
        setInsightsList(data.insights || []);

        const profile = appData.profile || {};
        const cards = appData.cards || [];
        const cash = Number(appData.cash || 0);

        setSnapshotList([
          { label: "Cash Balance", value: formatMoney(cash) },
          { label: "Saved Cards", value: `${cards.length}` },
          { label: "Income Range", value: profile.salaryRange || "Not set" },
          {
            label: "Income Frequency",
            value: profile.incomeFrequency || "Not set",
          },
          {
            label: "Estimated Spending",
            value: formatMoney(data.totalSpending || 0),
          },
        ]);
      } catch (err) {
        console.error("Could not load analytics from server:", err.message);

        const local = getAppData();
        const categories = local.plan?.categories || [];
        const plan = local.plan || {};
        const profile = local.profile || {};
        const cards = local.cards || [];
        const cash = Number(local.cash || 0);

        const total = categories.reduce(
          (sum, category) => sum + Number(category.spent || 0),
          0
        );

        const highest = categories.length
          ? [...categories].sort(
              (a, b) => Number(b.spent || 0) - Number(a.spent || 0)
            )[0]
          : null;

        const savedAmount = Number(plan.savedAmount || plan.currentSaving || 0);
        const targetAmount = Number(plan.targetAmount || plan.goalAmount || 0);
        const progress =
          targetAmount > 0
            ? Math.min(Math.round((savedAmount / targetAmount) * 100), 100)
            : 0;

        const localInsights = [];

        if (highest) {
          localInsights.push({
            title: "Top Spending Area",
            text: `${highest.name} is currently your highest spending category.`,
          });
        }

        if (progress > 0) {
          localInsights.push({
            title: "Goal Progress",
            text: `You have completed ${progress}% of your saving goal.`,
          });
        }

        if (!localInsights.length) {
          localInsights.push({
            title: "Setup Needed",
            text: "Add more budget and transaction data to generate stronger insights.",
          });
        }

        setTotalSpending(total);
        setTopCategory(
          highest
            ? {
                name: highest.name,
                spent: Number(highest.spent || 0),
              }
            : null
        );
        setGoalProgress(progress);
        setGoalName(plan.goalName || "No goal set");
        setSavingPlan(Number(plan.monthlySaving || 0));
        setCategoryList(categories);
        setInsightsList(localInsights);

        setSnapshotList([
          { label: "Cash Balance", value: formatMoney(cash) },
          { label: "Saved Cards", value: `${cards.length}` },
          { label: "Income Range", value: profile.salaryRange || "Not set" },
          {
            label: "Income Frequency",
            value: profile.incomeFrequency || "Not set",
          },
          { label: "Estimated Spending", value: formatMoney(total) },
        ]);
      }
    };

    loadAnalytics();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("financeFlowData");
      navigate("/signup");
    }
  };

  const getCategoryStatus = (percent) => {
    if (percent >= 90) return "Critical";
    if (percent >= 75) return "Warning";
    if (percent >= 50) return "Moderate";
    return "Healthy";
  };

  const getPerformanceMessage = (percent) => {
    if (percent >= 90) return "This category is very close to the limit.";
    if (percent >= 75) return "This category needs close monitoring.";
    if (percent >= 50) return "This category is within a moderate range.";
    return "This category is performing well.";
  };

  const getPerformanceClass = (percent) => {
    if (percent >= 90) return "performanceCritical";
    if (percent >= 75) return "performanceWarning";
    if (percent >= 50) return "performanceModerate";
    return "performanceHealthy";
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
            <Link to="/dashboard" className="navItem">
              Dashboard
            </Link>
            <Link to="/transactions" className="navItem">
              Transactions
            </Link>
            <Link to="/budget" className="navItem">
              Budget
            </Link>
            <Link to="/analytics" className="navItem active">
              Analytics
            </Link>
            <Link to="/cards" className="navItem">
              Cards
            </Link>
            <Link to="/notifications" className="navItem">
              Notifications
            </Link>
            <Link to="/plans" className="navItem">
              Plans
            </Link>
            <Link to="/profile-view" className="navItem">
              Account Settings
            </Link>
          </nav>

          <div className="sidebarUser">
            <div className="sidebarAvatar">{sidebarAvatar}</div>
            <div className="sidebarUserText">
              <p className="sidebarUserName">{sidebarUserName}</p>
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
              <h1 className="pageHeading">Analytics</h1>
              <p className="pageSubheading">
                Track your financial patterns, category usage, and goal progress.
              </p>
            </div>
          </header>

          <section className="analyticsTopCards">
            <article className="analyticsStatCard">
              <span className="analyticsStatLabel">
                Estimated Total Spending
              </span>
              <h2 className="analyticsStatValue">
                {formatMoney(totalSpending)}
              </h2>
              <p className="analyticsStatNote">
                Based on your current category usage
              </p>
            </article>

            <article className="analyticsStatCard">
              <span className="analyticsStatLabel">
                Highest Spending Category
              </span>
              <h2 className="analyticsStatValue">
                {topCategory ? topCategory.name : "None"}
              </h2>
              <p className="analyticsStatNote">
                {topCategory ? `${formatMoney(topCategory.spent)} used` : "$0 used"}
              </p>
            </article>

            <article className="analyticsStatCard">
              <span className="analyticsStatLabel">Goal Progress</span>
              <h2 className="analyticsStatValue">{goalProgress}%</h2>
              <p className="analyticsStatNote">{goalName}</p>
            </article>

            <article className="analyticsStatCard">
              <span className="analyticsStatLabel">Monthly Saving Plan</span>
              <h2 className="analyticsStatValue">{formatMoney(savingPlan)}</h2>
              <p className="analyticsStatNote">Planned amount each month</p>
            </article>
          </section>

          <section className="analyticsGrid">
            <article className="dashboardPanel analyticsPanelLarge">
              <div className="panelHeader">
                <h2>Category Spending Breakdown</h2>
              </div>

              <div className="analyticsCategoryList">
                {!categoryList.length ? (
                  <div className="emptyPanelState">
                    No category data yet. Add categories in your budget setup first.
                  </div>
                ) : (
                  categoryList.map((category, index) => {
                    const spent = Number(category.spent || 0);
                    const limit = Number(category.limit || 0);
                    const percent =
                      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                    const remaining = Math.max(limit - spent, 0);

                    return (
                      <div
                        className="analyticsCategoryItem"
                        key={category._id || category.name || index}
                      >
                        <div className="analyticsCategoryTop">
                          <div>
                            <h3>{category.name}</h3>
                            <p>
                              {formatMoney(spent)} spent out of{" "}
                              {formatMoney(limit)}
                            </p>
                          </div>

                          <div className="analyticsCategoryPercent">
                            {Math.round(percent)}%
                          </div>
                        </div>

                        <div className="analyticsBar">
                          <div
                            className="analyticsBarFill"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>

                        <div className="analyticsCategoryBottom">
                          <span>{formatMoney(remaining)} remaining</span>
                          <span>{getCategoryStatus(percent)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </article>

            <article className="dashboardPanel analyticsPanelSmall">
              <div className="panelHeader">
                <h2>Insights</h2>
              </div>

              <div className="analyticsInsightsList">
                {!insightsList.length ? (
                  <div className="emptyPanelState">
                    No insights yet. Complete more setup steps to unlock analytics.
                  </div>
                ) : (
                  insightsList.map((insight, index) => (
                    <div className="analyticsInsightItem" key={index}>
                      <h3>{insight.title}</h3>
                      <p>{insight.text}</p>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="dashboardPanel analyticsPanelLarge">
              <div className="panelHeader">
                <h2>Budget Performance</h2>
              </div>

              <div className="analyticsPerformanceList">
                {!categoryList.length ? (
                  <div className="emptyPanelState">
                    No performance data available yet.
                  </div>
                ) : (
                  categoryList.map((category, index) => {
                    const spent = Number(category.spent || 0);
                    const limit = Number(category.limit || 0);
                    const percent =
                      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

                    return (
                      <div
                        className="analyticsPerformanceItem"
                        key={category._id || category.name || index}
                      >
                        <div className="analyticsPerformanceLeft">
                          <h3>{category.name}</h3>
                          <p>{getPerformanceMessage(percent)}</p>
                        </div>

                        <div
                          className={`analyticsPerformanceRight ${getPerformanceClass(
                            percent
                          )}`}
                        >
                          {Math.round(percent)}%
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </article>

            <article className="dashboardPanel analyticsPanelSmall">
              <div className="panelHeader">
                <h2>Financial Snapshot</h2>
              </div>

              <div className="analyticsSnapshotList">
                {snapshotList.map((item, index) => (
                  <div className="analyticsSnapshotItem" key={index}>
                    <span className="analyticsSnapshotLabel">{item.label}</span>
                    <strong className="analyticsSnapshotValue">
                      {item.value}
                    </strong>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}