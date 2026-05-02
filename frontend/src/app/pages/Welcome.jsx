import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAppData } from "../utils/storage";

export default function Welcome() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");
  const [goal, setGoal] = useState("Not set");
  const [monthlySaving, setMonthlySaving] = useState("$0");
  const [savedCards, setSavedCards] = useState("0");
  const [cash, setCash] = useState("$0");

  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toLocaleString()}`;
  };

  useEffect(() => {
    const appData = getAppData();

    if (!appData.user) {
      navigate("/signup");
      return;
    }

    const fullName = appData.user?.fullname || "User";
    const firstName = fullName.split(" ")[0];
    setUserName(firstName);

    if (appData.plan?.goalName) {
      setGoal(appData.plan.goalName);
    }

    if (appData.plan?.monthlySaving) {
      setMonthlySaving(formatMoney(appData.plan.monthlySaving));
    }

    if (appData.cards) {
      setSavedCards(String(appData.cards.length));
    }

    if (typeof appData.cash === "number") {
      setCash(formatMoney(appData.cash));
    }
  }, [navigate]);

  const handleSignOut = () => {
    const shouldSignOut = window.confirm("Are you sure you want to sign out?");

    if (shouldSignOut) {
      localStorage.removeItem("financeFlowData");
      navigate("/signup");
    }
  };

  return (
    <div className="welcomePageBody">
      <main className="welcomePage">
        <section className="welcomeCard">
          <div className="welcomeIconWrap">
            <span className="welcomeEmoji">👋</span>
          </div>

          <h1 className="welcomeTitle">
            Welcome, <span>{userName}</span>
          </h1>

          <p className="welcomeSubtitle">
            Your account is ready and your financial setup has been saved
            successfully.
          </p>

          <div className="welcomeSummary">
            <div className="welcomeSummaryItem">
              <span className="summaryLabel">Goal</span>
              <span className="summaryValue">{goal}</span>
            </div>

            <div className="welcomeSummaryItem">
              <span className="summaryLabel">Monthly Saving</span>
              <span className="summaryValue">{monthlySaving}</span>
            </div>

            <div className="welcomeSummaryItem">
              <span className="summaryLabel">Saved Cards</span>
              <span className="summaryValue">{savedCards}</span>
            </div>

            <div className="welcomeSummaryItem">
              <span className="summaryLabel">Cash</span>
              <span className="summaryValue">{cash}</span>
            </div>
          </div>

          <div className="welcomeActions">
            <Link to="/dashboard" className="primaryBtn fullBtn welcomeMainBtn">
              Go to Dashboard →
            </Link>

            <button
              type="button"
              className="secondaryBtn fullBtn welcomeSecondaryBtn"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <p className="welcomeHelpText">
            Need help?{" "}
            <Link to="/notifications" className="textLink">
              Contact Support
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}