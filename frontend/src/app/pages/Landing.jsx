import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <header className="header">
        <p className="logo">💸 FinanceFlow</p>

        <div className="headerbtns">
          <a href="#about" className="headbtn">
            About Us
          </a>
          <a href="#features" className="headbtn">
            Features
          </a>
          <a href="#contact" className="headbtn">
            Contact
          </a>

          <div className="login">
            <Link to="/login" className="loginbtn login-outline">
              Login
            </Link>
            <Link to="/signup" className="loginbtn login-fill">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <section className="aboutUs" id="about">
        <div className="heroContent">
          <div className="heroText">
            <span className="heroBadge">Smart budgeting made simple</span>
            <h1>Take Control of Your Finances. Start Planning Today.</h1>
            <p>
              FinanceFlow helps you track expenses, build realistic budgets, and
              move toward your financial goals with confidence.
            </p>

            <div className="heroActions">
              <Link to="/signup" className="primaryBtn">
                Get Started
              </Link>
              <Link to="/login" className="secondaryBtn">
                Log In
              </Link>
            </div>
          </div>

          <div className="heroPreview">
            <div className="previewCard">
              <p className="miniTitle">This Month</p>
              <h3>SAR 4,850</h3>
              <p className="miniMuted">Budget remaining</p>
            </div>

            <div className="previewCard">
              <p className="miniTitle">Savings Goal</p>
              <h3>68%</h3>
              <p className="miniMuted">Emergency fund progress</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featuresSection" id="features">
        <h2>How We Help You</h2>
        <p className="sectionIntro">
          Everything you need to organize spending, plan smarter, and stay
          focused on your goals.
        </p>

        <div className="features">
          <div className="feature">
            <div className="featureIcon">📊</div>
            <h3>Track Every Penny</h3>
            <p>
              Easily categorize and monitor your spending in real time so you
              always know where your money goes.
            </p>
          </div>

          <div className="feature">
            <div className="featureIcon">🎯</div>
            <h3>Create Realistic Budgets</h3>
            <p>
              Set practical spending limits and receive reminders to stay
              aligned with your financial plans.
            </p>
          </div>

          <div className="feature">
            <div className="featureIcon">💡</div>
            <h3>Achieve Your Goals</h3>
            <p>
              Define saving targets and clearly see your progress as you move
              closer to your goals.
            </p>
          </div>
        </div>
      </section>

      <footer className="contacts" id="contact">
        <h2>Contact Us</h2>
        <p>Email: support@financeflow.com</p>
        <p>Phone: +966 55 555 5555</p>
      </footer>
    </div>
  );
}