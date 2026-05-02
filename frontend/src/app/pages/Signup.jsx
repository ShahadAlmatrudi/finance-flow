<<<<<<< HEAD
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAppData, saveAppData } from "../utils/storage";
import logo from "../assets/financeflow-logo.png";
=======
const signupForm = document.getElementById("signupForm");
>>>>>>> ola-student2-backend

const fullname = document.getElementById("fullname");
const email = document.getElementById("signup-email");
const password = document.getElementById("signup-password");
const confirmPassword = document.getElementById("confirm-password");

const fullnameError = document.getElementById("fullnameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

<<<<<<< HEAD
  const [fullnameError, setFullnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const clearErrors = () => {
    setFullnameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const handleSubmit = async (event) => {
=======
signupForm.addEventListener("submit", function (event) {
>>>>>>> ola-student2-backend
    event.preventDefault();

    clearErrors();

    let isValid = true;

    if (fullname.value.trim() === "") {
        showError(fullname, fullnameError, "Full name is required.");
        isValid = false;
    }

    if (email.value.trim() === "") {
        showError(email, emailError, "Email is required.");
        isValid = false;
    } else if (!email.value.includes("@")) {
        showError(email, emailError, "Email must contain '@'.");
        isValid = false;
    } else if (!email.value.endsWith(".com")) {
        showError(email, emailError, "Email must end with '.com'.");
        isValid = false;
    }

    if (password.value.trim() === "") {
        showError(password, passwordError, "Password is required.");
        isValid = false;
    } else if (password.value.trim().length < 6) {
        showError(password, passwordError, "Password must be at least 6 characters.");
        isValid = false;
    }

    if (confirmPassword.value.trim() === "") {
        showError(confirmPassword, confirmPasswordError, "Please confirm your password.");
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        showError(confirmPassword, confirmPasswordError, "Passwords do not match.");
        isValid = false;
    }

<<<<<<< HEAD
    if (!isValid) return;

    try {
      const res = await fetch(
        "https://finance-flow-7fk1.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: fullname.trim(),
            email: email.trim(),
            password: password.trim(),
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setEmailError(result.message || "Signup failed. Please try again.");
        return;
      }

      const data = getAppData();

      data.user = {
        fullname: result.user?.fullname || fullname.trim(),
        email: result.user?.email || email.trim(),
        token: result.token,
      };

      data.isLoggedIn = true;

      saveAppData(data);

      navigate("/onboarding");
    } catch (error) {
      setEmailError("Cannot connect to the server. Please try again.");
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
          <h1>Create Your Account</h1>
          <p className="subtitle">
            Start your finance journey by creating a new account.
          </p>

          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
              <p className="errorMsg">{fullnameError}</p>
            </div>

            <div className="inputGroup">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="errorMsg">{emailError}</p>
            </div>

            <div className="inputGroup">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="errorMsg">{passwordError}</p>
            </div>

            <div className="inputGroup">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <p className="errorMsg">{confirmPasswordError}</p>
            </div>

            <button type="submit" className="loginMainBtn">
              Sign Up
            </button>
          </form>

          <p className="signupText">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
=======
    if (isValid) {
        const userData = {
            fullname: fullname.value.trim(),
            email: email.value.trim(),
            password: password.value.trim()
        };

        setUser(userData);
        window.location.href = "questionnaire.html";
    }
});

function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add("inputError");
}

function clearErrors() {
    document.querySelectorAll(".errorMsg").forEach(el => {
        el.textContent = "";
    });

    document.querySelectorAll("input").forEach(input => {
        input.classList.remove("inputError");
    });
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", function () {
        input.classList.remove("inputError");
        const errorElement = input.parentElement.querySelector(".errorMsg");
        if (errorElement) {
            errorElement.textContent = "";
        }
    });
});
>>>>>>> ola-student2-backend
