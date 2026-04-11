import { useState } from "react";
import { getAppData, saveAppData } from "../utils/storage";

export default function Login() {
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

      // later we replace this with React Router
      window.location.href = "/dashboard";
    } else {
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className="loginPage">
      <header className="topbar">
        <p className="logo">💸 FinanceFlow</p>
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
          </form>

          <p className="signupText">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </section>
      </main>
    </div>
  );
}