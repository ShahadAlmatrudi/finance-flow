import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const adminEmail = "admin@example.com";
    const adminPassword = "Admin123";

    if (
      formData.email === adminEmail &&
      formData.password === adminPassword
    ) {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("currentAdminEmail", adminEmail);
      navigate("/admin");
    } else {
      setErrors({
        general: "Invalid admin credentials",
      });
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin Login</h1>
        <p className="admin-login-subtitle">
          Sign in to access the FinanceFlow admin panel
        </p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {errors.general && (
            <p className="admin-error-message">{errors.general}</p>
          )}

          <div className="admin-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="admin-field-error">{errors.email}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="admin-field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="admin-login-btn">
            Login
          </button>
        </form>

        <div className="admin-login-note">
          <p>Demo credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: Admin123</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;