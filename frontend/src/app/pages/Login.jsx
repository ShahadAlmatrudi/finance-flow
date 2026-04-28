import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppData, saveAppData } from "../utils/storage";
import logo from "../assets/financeflow-logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = getAppData();
    const savedUser = data.user;

    if (!savedUser) {
      setError("No account found. Please sign up first.");
      return;
    }

    if (email === savedUser.email && password === savedUser.password) {
      setError("");
      data.isLoggedIn = true;
      saveAppData(data);
      navigate("/dashboard");
    } else {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className="loginPage">
      <header className="topbar">
        <p className="logo">
          <img src={logo} alt="FinanceFlow Logo" className="brandLogoImg" />
          <span>FinanceFlow</span>
        </p>
      </header>

      <main className="loginContainer">
        <section className="loginCard">
          <h1>Welcome Back</h1>
          <p className="subtitle">
            Sign in to continue managing your finances with confidence.
          </p>

          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="inputGroup">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="formOptions">
              <label className="rememberMe">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgotPassword">
                Forgot password?
              </a>
            </div>

            <p className="errorMsg">{error}</p>

            <button type="submit" className="loginMainBtn">
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "14px",
                borderRadius: "25px",
                border: "none",
                background: "transparent",
                color: "#3b5bdb",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              Login as Admin
            </button>
          </form>

          <p className="signupText">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </section>
      </main>
    </div>
  );
}