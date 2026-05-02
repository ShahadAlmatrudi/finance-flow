import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppData } from "../utils/storage";
import logo from "../assets/financeflow-logo.png";

export default function Onboarding() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const appData = getAppData();

    if (!appData.user) {
      navigate("/signup");
      return;
    }

    const fullName = appData.user?.fullname || "User";
    setUserName(fullName.split(" ")[0]);
  }, [navigate]);

  return (
    <div className="welcomePageBody">
      <main className="welcomePage">
        <section className="welcomeCard">

          <img
            src={logo}
            alt="FinanceFlow Logo"
            className="onboardingLogo"
          />

          <h1 className="welcomeTitle">
            Welcome, <span>{userName}</span>
          </h1>

          <p className="welcomeSubtitle">
            Let’s set up your financial data so FinanceFlow can track your
            spending and update your balance automatically.
          </p>

          <div className="welcomeActions">
            {/* ✅ FIXED HERE */}
            <button
              className="primaryBtn fullBtn"
              onClick={() => navigate("/questionnaire")}
            >
              Start Setup
            </button>

            <button
              className="secondaryBtn fullBtn"
              onClick={() => navigate("/dashboard")}
            >
              Set up later
            </button>
          </div>

        </section>
      </main>
    </div>
  );
}