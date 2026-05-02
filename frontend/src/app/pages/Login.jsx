import { useState } from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
=======
<<<<<<< HEAD
import { getAppData, saveAppData } from "../utils/storage";

export default function Login() {
=======
import { useNavigate } from "react-router-dom";
>>>>>>> ola-student2-backend
import { getAppData, saveAppData } from "../utils/storage";
import logo from "../assets/financeflow-logo.png";


export default function Login() {
  const navigate = useNavigate();

>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://finance-flow-7fk1.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Incorrect email or password.");
        return;
      }

      // Save user + token to localStorage
      const appData = getAppData();
      appData.user = {
        ...data.user,
        token: data.token,
      };
      appData.isLoggedIn = true;
      saveAppData(appData);

<<<<<<< HEAD
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
=======
    if (email === savedUser.email && password === savedUser.password) {
      setError("");
      data.isLoggedIn = true;
      saveAppData(data);
<<<<<<< HEAD

      // later we replace this with React Router
      window.location.href = "/dashboard";
=======
      navigate("/dashboard");
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
    } else {
      setError("Incorrect email or password.");
>>>>>>> ola-student2-backend
    }
  };

  return (
    <div className="loginPage">
      <header className="topbar">
<<<<<<< HEAD
        <p className="logo">💸 FinanceFlow</p>
=======
        <p className="logo">
          <img src={logo} alt="FinanceFlow Logo" className="brandLogoImg" />
          <span>FinanceFlow</span>
        </p>
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
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

            <button type="submit" className="loginMainBtn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
<<<<<<< HEAD
=======

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
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
          </form>

          <p className="signupText">
            Don't have an account?{" "}
            <button
              type="button"
              className="textLink"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
