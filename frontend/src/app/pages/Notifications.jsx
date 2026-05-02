import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAppData, saveAppData } from "../utils/storage";
import logo from "../assets/financeflow-logo.png";

export default function Notifications() {
  const navigate = useNavigate();

  const [sidebarUserName, setSidebarUserName] = useState("User");
  const [sidebarAvatar, setSidebarAvatar] = useState("U");
  const [notifications, setNotifications] = useState([]);

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

    const storedNotifications = getStoredNotifications();
    setNotifications(storedNotifications);
  }, [navigate]);

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (shouldLogout) {
      localStorage.removeItem("financeFlowData");
      navigate("/signup");
    }
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((item) => ({
      ...item,
      read: true,
    }));

    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleToggleRead = (id) => {
    const updated = notifications.map((notification) =>
      notification.id === id
        ? { ...notification, read: !notification.read }
        : notification
    );

    setNotifications(updated);
    saveNotifications(updated);
  };

  const getStoredNotifications = () => {
    const data = getAppData();

    if (data.notifications && Array.isArray(data.notifications)) {
      return data.notifications;
    }

    const generatedNotifications = generateNotificationsFromData(data);
    data.notifications = generatedNotifications;
    saveAppData(data);
    return generatedNotifications;
  };

  const saveNotifications = (updatedNotifications) => {
    const data = getAppData();
    data.notifications = updatedNotifications;
    saveAppData(data);
  };

  const generateNotificationsFromData = (data) => {
    const generated = [];
    const plan = data.plan || {};
    const cards = data.cards || [];
    const cash = Number(data.cash || 0);
    const profile = data.profile || {};
    const questionnaire = data.questionnaire || {};

    if (plan.goalName) {
      generated.push({
        id: cryptoRandomId(),
        type: "goal",
        title: "Goal setup completed",
        message: `Your goal "${plan.goalName}" has been saved successfully.`,
        read: false,
      });
    }

    if (plan.monthlySaving) {
      generated.push({
        id: cryptoRandomId(),
        type: "goal",
        title: "Saving plan is active",
        message: `You are planning to save ${formatMoney(
          plan.monthlySaving
        )} each month.`,
        read: false,
      });
    }

    if (plan.categories && plan.categories.length > 0) {
      const highestCategory = [...plan.categories].sort(
        (a, b) => b.limit - a.limit
      )[0];

      generated.push({
        id: cryptoRandomId(),
        type: "budget",
        title: "Budget categories created",
        message: `${plan.categories.length} categories were added. Your highest limit is ${
          highestCategory.name
        } at ${formatMoney(highestCategory.limit)}.`,
        read: false,
      });

      if (highestCategory.limit > 0) {
        const nearLimitAmount = Math.round(highestCategory.limit * 0.82);

        generated.push({
          id: cryptoRandomId(),
          type: "budget",
          title: "You are close to a category limit",
          message: `${highestCategory.name} is estimated at ${formatMoney(
            nearLimitAmount
          )} out of ${formatMoney(highestCategory.limit)}.`,
          read: false,
        });
      }
    }

    if (cards.length > 0) {
      const primaryCard = cards.find((card) => card.primary) || cards[0];

      generated.push({
        id: cryptoRandomId(),
        type: "account",
        title: "Card added successfully",
        message: `${cards.length} saved card${
          cards.length > 1 ? "s are" : " is"
        } on your account. ${primaryCard.type} ending in ${primaryCard.number.slice(
          -4
        )} is ready to use.`,
        read: true,
      });
    }

    if (cash > 0) {
      generated.push({
        id: cryptoRandomId(),
        type: "account",
        title: "Cash balance saved",
        message: `Your current cash balance is ${formatMoney(cash)}.`,
        read: true,
      });
    }

    if (profile.obligationType && profile.obligationAmount >= 0) {
      generated.push({
        id: cryptoRandomId(),
        type: "reminder",
        title: "Financial obligation reminder",
        message: `${profile.obligationType} has been recorded with an amount of ${formatMoney(
          profile.obligationAmount
        )}.`,
        read: false,
      });
    }

    if (questionnaire.help) {
      generated.push({
        id: cryptoRandomId(),
        type: "insight",
        title: "Personalized support enabled",
        message: `FinanceFlow will focus on ${questionnaire.help.toLowerCase()} based on your answers.`,
        read: true,
      });
    }

    if (generated.length === 0) {
      generated.push({
        id: cryptoRandomId(),
        type: "info",
        title: "Welcome to FinanceFlow",
        message:
          "Complete your setup to start receiving useful financial alerts and updates.",
        read: false,
      });
    }

    return generated;
  };

  const getBadgeClass = (type) => {
    if (type === "goal") return "badgeGoal";
    if (type === "budget") return "badgeBudget";
    if (type === "account") return "badgeAccount";
    if (type === "reminder") return "badgeReminder";
    return "badgeInfo";
  };

  const formatMoney = (amount) => `$${Number(amount).toLocaleString()}`;

  const cryptoRandomId = () => Math.random().toString(36).slice(2, 11);

  const total = notifications.length;
  const unread = notifications.filter((item) => !item.read).length;
  const goalCount = notifications.filter((item) => item.type === "goal").length;
  const budgetCount = notifications.filter(
    (item) => item.type === "budget"
  ).length;

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
            <Link to="/analytics" className="navItem">
              Analytics
            </Link>
            <Link to="/cards" className="navItem">
              Cards
            </Link>
            <Link to="/notifications" className="navItem active">
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
          <header className="topBar notificationsTopBar">
            <div>
              <h1 className="pageHeading">Notifications</h1>
              <p className="pageSubheading">
                Helpful updates and reminders based on your financial setup.
              </p>
            </div>

            <div className="notificationsActions">
              <button
                type="button"
                className="secondaryBtn"
                onClick={handleMarkAllRead}
              >
                Mark All as Read
              </button>
            </div>
          </header>

          <section className="notificationsStats">
            <div className="miniStatCard">
              <span className="miniStatLabel">Total</span>
              <strong className="miniStatValue">{total}</strong>
            </div>

            <div className="miniStatCard">
              <span className="miniStatLabel">Unread</span>
              <strong className="miniStatValue">{unread}</strong>
            </div>

            <div className="miniStatCard">
              <span className="miniStatLabel">Goal Alerts</span>
              <strong className="miniStatValue">{goalCount}</strong>
            </div>

            <div className="miniStatCard">
              <span className="miniStatLabel">Budget Alerts</span>
              <strong className="miniStatValue">{budgetCount}</strong>
            </div>
          </section>

          <section className="dashboardPanel notificationsPanel">
            <div className="panelHeader">
              <h2>Recent Alerts</h2>
            </div>

            <div className="notificationsList">
              {notifications.length === 0 ? (
                <div className="emptyPanelState">No notifications yet.</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notificationItem ${
                      notification.read ? "read" : "unread"
                    }`}
                  >
                    <div className="notificationLeft">
                      <div
                        className={`notificationTypeBadge ${getBadgeClass(
                          notification.type
                        )}`}
                      >
                        {notification.type}
                      </div>

                      <div className="notificationContent">
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                      </div>
                    </div>

                    <div className="notificationRight">
                      {notification.read ? (
                        <span className="notificationStatus readStatus">
                          Read
                        </span>
                      ) : (
                        <span className="notificationStatus unreadStatus">
                          Unread
                        </span>
                      )}

                      <button
                        className="notificationActionBtn"
                        type="button"
                        onClick={() => handleToggleRead(notification.id)}
                      >
                        {notification.read ? "Mark Unread" : "Mark Read"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}