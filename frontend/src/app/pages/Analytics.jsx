import { useEffect, useState } from "react";
<<<<<<< HEAD
import { getAppData } from "../utils/storage";
=======
import { getAppData, saveAppData } from "../utils/storage";
<<<<<<< HEAD
=======
>>>>>>> ola-student2-backend
import { apiFetch } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/financeflow-logo.png";
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67

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
<<<<<<< HEAD
  const [performanceList, setPerformanceList] = useState([]);
=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  const [snapshotList, setSnapshotList] = useState([]);

  const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString()}`;

  useEffect(() => {
    const appData = getAppData();
<<<<<<< HEAD

    if (!appData.user) {
      navigate("/signup");
      return;
    }
=======
<<<<<<< HEAD

    if (!appData.user) {
      window.location.href = "/signup";
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

    initializeAnalyticsData();
    renderAnalyticsPage();
  }, []);

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (shouldLogout) {
=======
    if (!appData.user) { window.location.href = "/signup"; return; }
>>>>>>> ola-student2-backend

    const fullName = appData.user?.fullname || "User";
    const initials = fullName
      .split(" ")
      .map((p) => p[0])
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
          { label: "Income Frequency", value: profile.incomeFrequency || "Not set" },
          { label: "Estimated Spending", value: formatMoney(data.totalSpending || 0) },
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
          (s, c) => s + Number(c.spent || 0),
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
          { label: "Income Frequency", value: profile.incomeFrequency || "Not set" },
          { label: "Estimated Spending", value: formatMoney(total) },
        ]);
      }
    };

    loadAnalytics();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
      localStorage.removeItem("financeFlowData");
      navigate("/signup");
    }
  };

<<<<<<< HEAD
  const initializeAnalyticsData = () => {
    const data = getAppData();

    if (data.plan?.categories?.length) {
      let changed = false;

      data.plan.categories = data.plan.categories.map((category) => {
        if (typeof category.spent !== "number") {
          changed = true;
          return {
            ...category,
            spent: generateDemoSpent(category.limit),
          };
        }

        return category;
      });

      if (changed) {
        saveAppData(data);
      }
    }
  };

  const renderAnalyticsPage = () => {
    const data = getAppData();
    const plan = data.plan || {};
    const profile = data.profile || {};
    const cards = data.cards || [];
    const cash = Number(data.cash || 0);
    const categories = plan.categories || [];

    const total = categories.reduce(
      (sum, category) => sum + Number(category.spent || 0),
      0
    );
    const highestCategory = getHighestCategory(categories);
    const goalProgressPercent = getGoalProgress(plan);

    setTotalSpending(total);
    setTopCategory(highestCategory);
    setGoalProgress(goalProgressPercent);
    setGoalName(plan.goalName || "No goal set");
    setSavingPlan(Number(plan.monthlySaving || 0));

    setCategoryList(categories);
    setInsightsList(buildInsights(categories, plan, profile, cards, cash));
    setPerformanceList(categories);
    setSnapshotList([
      {
        label: "Cash Balance",
        value: formatMoney(cash),
      },
      {
        label: "Saved Cards",
        value: `${cards.length}`,
      },
      {
        label: "Income Range",
        value: profile.salaryRange || "Not set",
      },
      {
        label: "Income Frequency",
        value: profile.incomeFrequency || "Not set",
      },
      {
        label: "Goal Type",
        value: plan.goalType || "Not set",
      },
      {
        label: "Estimated Spending",
        value: formatMoney(total),
      },
    ]);
  };

  const buildInsights = (categories, plan, profile, cards, cash) => {
    const insights = [];

    if (categories.length > 0) {
      const highestCategory = getHighestCategory(categories);
      const lowestCategory = getLowestCategory(categories);

      if (highestCategory) {
        insights.push({
          title: "Highest spending area",
          text: `${highestCategory.name} is currently your highest spending category.`,
        });
      }

      if (lowestCategory) {
        insights.push({
          title: "Most controlled category",
          text: `${lowestCategory.name} currently has the lowest spending level.`,
        });
      }

      const nearLimitCategories = categories.filter((category) => {
        const spent = Number(category.spent || 0);
        const limit = Number(category.limit || 0);
        return limit > 0 && spent / limit >= 0.8;
      });

      if (nearLimitCategories.length > 0) {
        insights.push({
          title: "Limit warning",
          text: `${nearLimitCategories[0].name} is close to reaching its budget limit.`,
        });
      }
    }

    if (plan.monthlySaving) {
      insights.push({
        title: "Saving commitment",
        text: `You are planning to save ${formatMoney(
          plan.monthlySaving
        )} every month.`,
      });
    }

    if (cards.length > 0) {
      insights.push({
        title: "Payment setup",
        text: `You have ${cards.length} saved card${
          cards.length > 1 ? "s" : ""
        } connected to your account.`,
      });
    }

    if (cash > 0) {
      insights.push({
        title: "Cash availability",
        text: `Your current cash balance gives you ${formatMoney(
          cash
        )} in flexible spending power.`,
      });
    }

    if (profile.salaryRange) {
      insights.push({
        title: "Income profile",
        text: `Your selected income range is ${profile.salaryRange}.`,
      });
    }

    return insights.slice(0, 5);
  };

  const getHighestCategory = (categories) => {
    if (!categories.length) return null;

    return [...categories].sort(
      (a, b) => Number(b.spent || 0) - Number(a.spent || 0)
    )[0];
  };

  const getLowestCategory = (categories) => {
    if (!categories.length) return null;

    return [...categories].sort(
      (a, b) => Number(a.spent || 0) - Number(b.spent || 0)
    )[0];
  };

  const getGoalProgress = (plan) => {
    const targetAmount = Number(plan.targetAmount || 0);
    const monthlySaving = Number(plan.monthlySaving || 0);

    if (targetAmount <= 0 || monthlySaving <= 0) {
      return 0;
    }

    return Math.min(Math.round((monthlySaving / targetAmount) * 100), 100);
  };

=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
  const generateDemoSpent = (limit) => {
    const min = limit * 0.35;
    const max = limit * 0.85;
    return Math.round(Math.random() * (max - min) + min);
  };

  const formatMoney = (amount) => {
    return `$${Number(amount).toLocaleString()}`;
  };
=======
  const formatMoney = (amount) => `$${Number(amount).toLocaleString()}`;
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67

>>>>>>> ola-student2-backend
  return (
    <div className="appPageBody">
      <div className="appLayout">
        <aside className="sidebar">
          <div className="sidebarBrand">
<<<<<<< HEAD
            <a href="/dashboard" className="sidebarLogo">
              💸 FinanceFlow
            </a>
          </div>

          <nav className="sidebarNav">
            <a href="/dashboard" className="navItem">
              Dashboard
            </a>
            <a href="/transactions" className="navItem">
              Transactions
            </a>
            <a href="/budget" className="navItem">
              Budget
            </a>
            <a href="/analytics" className="navItem active">
              Analytics
            </a>
            <a href="/cards" className="navItem">
              Cards
            </a>
            <a href="/notifications" className="navItem">
              Notifications
            </a>
            <a href="/profile-view" className="navItem">
              Account Settings
            </a>
          </nav>

=======
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
<<<<<<< HEAD

=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
          <div className="sidebarUser">
            <div className="sidebarAvatar">{sidebarAvatar}</div>
            <div className="sidebarUserText">
              <p className="sidebarUserName">{sidebarUserName}</p>
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
              <button
                className="sidebarLogoutBtn"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
<<<<<<< HEAD
=======
=======
              <button className="sidebarLogoutBtn" type="button" onClick={handleLogout}>Logout</button>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
            </div>
          </div>
        </aside>

        <main className="mainContent">
          <header className="topBar">
            <div>
              <h1 className="pageHeading">Analytics</h1>
<<<<<<< HEAD
              <p className="pageSubheading">
                Track your financial patterns, category usage, and goal progress.
              </p>
=======
<<<<<<< HEAD
              <p className="pageSubheading">
                Track your financial patterns, category usage, and goal progress.
              </p>
=======
              <p className="pageSubheading">Track your financial patterns, category usage, and goal progress.</p>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
            </div>
          </header>

          <section className="analyticsTopCards">
            <article className="analyticsStatCard">
<<<<<<< HEAD
              <span className="analyticsStatLabel">
                Estimated Total Spending
              </span>
              <h2 className="analyticsStatValue">
                {formatMoney(totalSpending)}
              </h2>
              <p className="analyticsStatNote">
                Based on your current category usage
              </p>
=======
<<<<<<< HEAD
              <span className="analyticsStatLabel">
                Estimated Total Spending
              </span>
              <h2 className="analyticsStatValue">{formatMoney(totalSpending)}</h2>
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
                {topCategory
                  ? `${formatMoney(topCategory.spent)} used`
                  : "$0 used"}
              </p>
            </article>

=======
              <span className="analyticsStatLabel">Estimated Total Spending</span>
              <h2 className="analyticsStatValue">{formatMoney(totalSpending)}</h2>
              <p className="analyticsStatNote">Based on your current category usage</p>
>>>>>>> ola-student2-backend
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
<<<<<<< HEAD

=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
            <article className="analyticsStatCard">
              <span className="analyticsStatLabel">Goal Progress</span>
              <h2 className="analyticsStatValue">{goalProgress}%</h2>
              <p className="analyticsStatNote">{goalName}</p>
            </article>
<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
            <article className="analyticsStatCard">
              <span className="analyticsStatLabel">Monthly Saving Plan</span>
              <h2 className="analyticsStatValue">{formatMoney(savingPlan)}</h2>
              <p className="analyticsStatNote">Planned amount each month</p>
            </article>
          </section>

          <section className="analyticsGrid">
            <article className="dashboardPanel analyticsPanelLarge">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
              <div className="panelHeader">
                <h2>Category Spending Breakdown</h2>
              </div>

<<<<<<< HEAD
              <div className="analyticsCategoryList">
                {!categoryList.length ? (
                  <div className="emptyPanelState">
                    No category data yet. Add categories in your budget setup first.
                  </div>
=======
              <div className="analyticsCategoryList">
                {!categoryList.length ? (
                  <div className="emptyPanelState">
                    No category data yet. Add categories in your budget setup
                    first.
                  </div>
=======
              <div className="panelHeader"><h2>Category Spending Breakdown</h2></div>
              <div className="analyticsCategoryList">
                {!categoryList.length ? (
                  <div className="emptyPanelState">No category data yet. Add categories in your budget setup first.</div>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                ) : (
                  categoryList.map((category, index) => {
                    const spent = Number(category.spent || 0);
                    const limit = Number(category.limit || 0);
<<<<<<< HEAD
                    const percent =
                      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                    const remaining = Math.max(limit - spent, 0);

=======
<<<<<<< HEAD
                    const percent =
                      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

                    return (
                      <div className="analyticsCategoryItem" key={index}>
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

=======
                    const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
>>>>>>> ola-student2-backend
                    return (
                      <div
                        className="analyticsCategoryItem"
                        key={category._id || index}
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
<<<<<<< HEAD

=======
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
              <div className="panelHeader">
                <h2>Insights</h2>
              </div>

<<<<<<< HEAD
              <div className="analyticsInsightsList">
                {!insightsList.length ? (
                  <div className="emptyPanelState">
                    No insights yet. Complete more setup steps to unlock analytics.
                  </div>
=======
              <div className="analyticsInsightsList">
                {!insightsList.length ? (
                  <div className="emptyPanelState">
                    No insights yet. Complete more setup steps to unlock
                    analytics.
                  </div>
=======
              <div className="panelHeader"><h2>Insights</h2></div>
              <div className="analyticsInsightsList">
                {!insightsList.length ? (
                  <div className="emptyPanelState">No insights yet. Complete more setup steps to unlock analytics.</div>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
              <div className="panelHeader">
                <h2>Budget Performance</h2>
              </div>

<<<<<<< HEAD
=======
              <div className="analyticsPerformanceList">
                {!performanceList.length ? (
                  <div className="emptyPanelState">
                    No performance data available yet.
                  </div>
                ) : (
                  performanceList.map((category, index) => {
                    const spent = Number(category.spent || 0);
                    const limit = Number(category.limit || 0);
                    const percent =
                      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

                    return (
                      <div className="analyticsPerformanceItem" key={index}>
=======
              <div className="panelHeader"><h2>Budget Performance</h2></div>
>>>>>>> ola-student2-backend
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
<<<<<<< HEAD
                      <div
                        className="analyticsPerformanceItem"
                        key={category._id || index}
                      >
=======
                      <div className="analyticsPerformanceItem" key={category._id || index}>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                        <div className="analyticsPerformanceLeft">
                          <h3>{category.name}</h3>
                          <p>{getPerformanceMessage(percent)}</p>
                        </div>
<<<<<<< HEAD

=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
                        <div
                          className={`analyticsPerformanceRight ${getPerformanceClass(
                            percent
                          )}`}
                        >
<<<<<<< HEAD
=======
=======
                        <div className={`analyticsPerformanceRight ${getPerformanceClass(percent)}`}>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                          {Math.round(percent)}%
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </article>

            <article className="dashboardPanel analyticsPanelSmall">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> ola-student2-backend
              <div className="panelHeader">
                <h2>Financial Snapshot</h2>
              </div>

<<<<<<< HEAD
=======
=======
              <div className="panelHeader"><h2>Financial Snapshot</h2></div>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
              <div className="analyticsSnapshotList">
                {snapshotList.map((item, index) => (
                  <div className="analyticsSnapshotItem" key={index}>
                    <span className="analyticsSnapshotLabel">{item.label}</span>
<<<<<<< HEAD
                    <strong className="analyticsSnapshotValue">
                      {item.value}
                    </strong>
=======
<<<<<<< HEAD
                    <strong className="analyticsSnapshotValue">
                      {item.value}
                    </strong>
=======
                    <strong className="analyticsSnapshotValue">{item.value}</strong>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
                  </div>
                ))}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
<<<<<<< HEAD
}
=======
}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
>>>>>>> ola-student2-backend
