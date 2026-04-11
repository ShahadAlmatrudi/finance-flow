import { useEffect, useState } from "react";
import { getAppData, saveAppData } from "../utils/storage";

export default function ProfileView() {
  const [sidebarUserName, setSidebarUserName] = useState("User");
  const [sidebarAvatar, setSidebarAvatar] = useState("U");

  const [profileSummaryAvatar, setProfileSummaryAvatar] = useState("U");
  const [profileSummaryName, setProfileSummaryName] = useState("User Name");
  const [profileSummaryEmail, setProfileSummaryEmail] = useState("user@email.com");
  const [summaryOccupation, setSummaryOccupation] = useState("Not set");
  const [summaryIncomeRange, setSummaryIncomeRange] = useState("Not set");
  const [summaryCountry, setSummaryCountry] = useState("Not set");
  const [summary2FA, setSummary2FA] = useState("Disabled");

  const [editFullname, setEditFullname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");

  const [editAge, setEditAge] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editOccupation, setEditOccupation] = useState("");
  const [editSalaryRange, setEditSalaryRange] = useState("");
  const [editIncomeFrequency, setEditIncomeFrequency] = useState("");
  const [editIncomeSource, setEditIncomeSource] = useState("");
  const [editObligationType, setEditObligationType] = useState("");
  const [editObligationAmount, setEditObligationAmount] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const [editFullnameError, setEditFullnameError] = useState("");
  const [editEmailError, setEditEmailError] = useState("");
  const [editPasswordError, setEditPasswordError] = useState("");
  const [editConfirmPasswordError, setEditConfirmPasswordError] = useState("");

  const [editAgeError, setEditAgeError] = useState("");
  const [editCountryError, setEditCountryError] = useState("");
  const [editOccupationError, setEditOccupationError] = useState("");
  const [editSalaryRangeError, setEditSalaryRangeError] = useState("");
  const [editIncomeFrequencyError, setEditIncomeFrequencyError] = useState("");
  const [editIncomeSourceError, setEditIncomeSourceError] = useState("");
  const [editObligationTypeError, setEditObligationTypeError] = useState("");
  const [editObligationAmountError, setEditObligationAmountError] = useState("");

  const [accountSuccessMsg, setAccountSuccessMsg] = useState("");
  const [financialSuccessMsg, setFinancialSuccessMsg] = useState("");
  const [preferencesSuccessMsg, setPreferencesSuccessMsg] = useState("");

  useEffect(() => {
    const appData = getAppData();

    if (!appData.user) {
      window.location.href = "/signup";
      return;
    }

    loadPageData();
  }, []);

  const handleLogout = () => {
    const shouldLogout = window.confirm("Are you sure you want to log out?");

    if (shouldLogout) {
      localStorage.removeItem("financeFlowData");
      window.location.href = "/signup";
    }
  };

  const loadPageData = () => {
    const data = getAppData();
    const user = data.user || {};
    const profile = data.profile || {};
    const settings = data.settings || {
      emailNotifications: true,
      budgetAlerts: true,
      monthlySummary: false,
      twoFactorAuth: false,
    };

    setEditFullname(user.fullname || "");
    setEditEmail(user.email || "");
    setEditPassword(user.password || "");
    setEditConfirmPassword(user.password || "");

    setEditAge(profile.age || "");
    setEditCountry(profile.country || "");
    setEditOccupation(profile.occupation || "");
    setEditSalaryRange(profile.salaryRange || "");
    setEditIncomeFrequency(profile.incomeFrequency || "");
    setEditIncomeSource(profile.incomeSource || "");
    setEditObligationType(profile.obligationType || "");
    setEditObligationAmount(profile.obligationAmount ?? "");

    setEmailNotifications(!!settings.emailNotifications);
    setBudgetAlerts(!!settings.budgetAlerts);
    setMonthlySummary(!!settings.monthlySummary);
    setTwoFactorAuth(!!settings.twoFactorAuth);

    refreshSummary();
  };

  const refreshSummary = () => {
    const data = getAppData();
    const user = data.user || {};
    const profile = data.profile || {};
    const settings = data.settings || {};

    const fullName = user.fullname || "User";
    const initials = fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setSidebarUserName(fullName);
    setSidebarAvatar(initials || "U");

    setProfileSummaryAvatar(initials || "U");
    setProfileSummaryName(fullName);
    setProfileSummaryEmail(user.email || "No email saved");

    setSummaryOccupation(profile.occupation || "Not set");
    setSummaryIncomeRange(profile.salaryRange || "Not set");
    setSummaryCountry(profile.country || "Not set");
    setSummary2FA(settings.twoFactorAuth ? "Enabled" : "Disabled");
  };

  const clearAccountErrors = () => {
    setEditFullnameError("");
    setEditEmailError("");
    setEditPasswordError("");
    setEditConfirmPasswordError("");
  };

  const clearFinancialErrors = () => {
    setEditAgeError("");
    setEditCountryError("");
    setEditOccupationError("");
    setEditSalaryRangeError("");
    setEditIncomeFrequencyError("");
    setEditIncomeSourceError("");
    setEditObligationTypeError("");
    setEditObligationAmountError("");
  };

  const handleAccountSubmit = (event) => {
    event.preventDefault();
    clearAccountErrors();
    setAccountSuccessMsg("");

    let isValid = true;

    if (editFullname.trim() === "") {
      setEditFullnameError("Full name is required.");
      isValid = false;
    }

    if (editEmail.trim() === "") {
      setEditEmailError("Email is required.");
      isValid = false;
    } else if (!editEmail.includes("@")) {
      setEditEmailError("Email must contain '@'.");
      isValid = false;
    } else if (!editEmail.endsWith(".com")) {
      setEditEmailError("Email must end with '.com'.");
      isValid = false;
    }

    if (editPassword.trim() === "") {
      setEditPasswordError("Password is required.");
      isValid = false;
    } else if (editPassword.trim().length < 6) {
      setEditPasswordError("Password must be at least 6 characters.");
      isValid = false;
    }

    if (editConfirmPassword.trim() === "") {
      setEditConfirmPasswordError("Please confirm your password.");
      isValid = false;
    } else if (editPassword !== editConfirmPassword) {
      setEditConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    if (!isValid) return;

    const data = getAppData();
    data.user = {
      fullname: editFullname.trim(),
      email: editEmail.trim(),
      password: editPassword.trim(),
    };

    saveAppData(data);
    setAccountSuccessMsg("Account information saved successfully.");
    refreshSummary();
  };

  const handleFinancialSubmit = (event) => {
    event.preventDefault();
    clearFinancialErrors();
    setFinancialSuccessMsg("");

    let isValid = true;

    if (String(editAge).trim() === "") {
      setEditAgeError("Age is required.");
      isValid = false;
    } else if (Number(editAge) < 16) {
      setEditAgeError("Age must be 16 or older.");
      isValid = false;
    }

    if (editCountry === "") {
      setEditCountryError("Please select your country.");
      isValid = false;
    }

    if (editOccupation === "") {
      setEditOccupationError("Please select your occupation.");
      isValid = false;
    }

    if (editSalaryRange === "") {
      setEditSalaryRangeError("Please select your income range.");
      isValid = false;
    }

    if (editIncomeFrequency === "") {
      setEditIncomeFrequencyError("Please select your income frequency.");
      isValid = false;
    }

    if (editIncomeSource === "") {
      setEditIncomeSourceError("Please select your primary income source.");
      isValid = false;
    }

    if (editObligationType === "") {
      setEditObligationTypeError("Please select your financial obligation.");
      isValid = false;
    }

    if (String(editObligationAmount).trim() === "") {
      setEditObligationAmountError("Obligation amount is required.");
      isValid = false;
    } else if (Number(editObligationAmount) < 0) {
      setEditObligationAmountError("Amount cannot be negative.");
      isValid = false;
    }

    if (!isValid) return;

    const data = getAppData();
    data.profile = {
      age: Number(editAge),
      country: editCountry,
      occupation: editOccupation,
      salaryRange: editSalaryRange,
      incomeFrequency: editIncomeFrequency,
      incomeSource: editIncomeSource,
      obligationType: editObligationType,
      obligationAmount: Number(editObligationAmount),
    };

    saveAppData(data);
    setFinancialSuccessMsg("Financial profile saved successfully.");
    refreshSummary();
  };

  const handlePreferencesSubmit = (event) => {
    event.preventDefault();
    setPreferencesSuccessMsg("");

    const data = getAppData();
    data.settings = {
      emailNotifications,
      budgetAlerts,
      monthlySummary,
      twoFactorAuth,
    };

    saveAppData(data);
    setPreferencesSuccessMsg("Preferences saved successfully.");
    refreshSummary();
  };

  return (
    <div className="appPageBody">
      <div className="appLayout">
        <aside className="sidebar">
          <div className="sidebarBrand">
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
            <a href="/analytics" className="navItem">
              Analytics
            </a>
            <a href="/notifications" className="navItem">
              Notifications
            </a>
            <a href="/profile-view" className="navItem active">
              Account Settings
            </a>
          </nav>

          <div className="sidebarUser">
            <div className="sidebarAvatar">{sidebarAvatar}</div>
            <div className="sidebarUserText">
              <p className="sidebarUserName">{sidebarUserName}</p>
              <button className="sidebarLogoutBtn" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="mainContent">
          <header className="topBar">
            <div>
              <h1 className="pageHeading">Account Settings</h1>
              <p className="pageSubheading">
                Manage your personal details, financial profile, and preferences.
              </p>
            </div>
          </header>

          <section className="settingsTopGrid">
            <article className="dashboardPanel profileSummaryPanel">
              <div className="profileSummaryHeader">
                <div className="profileSummaryAvatar">{profileSummaryAvatar}</div>
                <div>
                  <h2>{profileSummaryName}</h2>
                  <p>{profileSummaryEmail}</p>
                </div>
              </div>

              <div className="profileSummaryStats">
                <div className="profileSummaryStat">
                  <span className="profileSummaryLabel">Occupation</span>
                  <strong>{summaryOccupation}</strong>
                </div>

                <div className="profileSummaryStat">
                  <span className="profileSummaryLabel">Income Range</span>
                  <strong>{summaryIncomeRange}</strong>
                </div>

                <div className="profileSummaryStat">
                  <span className="profileSummaryLabel">Country</span>
                  <strong>{summaryCountry}</strong>
                </div>

                <div className="profileSummaryStat">
                  <span className="profileSummaryLabel">2FA</span>
                  <strong>{summary2FA}</strong>
                </div>
              </div>
            </article>

            <article className="dashboardPanel preferencesPanel">
              <div className="panelHeader">
                <h2>Preferences</h2>
              </div>

              <form onSubmit={handlePreferencesSubmit} className="settingsForm">
                <div className="toggleSettingRow">
                  <div>
                    <h3>Email Notifications</h3>
                    <p>Receive updates and financial reminders by email.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggleSettingRow">
                  <div>
                    <h3>Budget Alerts</h3>
                    <p>Get alerts when spending approaches your category limits.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={budgetAlerts}
                      onChange={(e) => setBudgetAlerts(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggleSettingRow">
                  <div>
                    <h3>Monthly Summary</h3>
                    <p>Receive a monthly overview of your financial performance.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={monthlySummary}
                      onChange={(e) => setMonthlySummary(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggleSettingRow">
                  <div>
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of protection to your account.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="settingsActionRow">
                  <button type="submit" className="primaryBtn smallBtn">
                    Save Preferences
                  </button>
                </div>

                <p className="settingsSuccessMsg">{preferencesSuccessMsg}</p>
              </form>
            </article>
          </section>

          <section className="settingsBottomGrid">
            <article className="dashboardPanel">
              <div className="panelHeader">
                <h2>Account Information</h2>
              </div>

              <form onSubmit={handleAccountSubmit} className="settingsForm">
                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="editFullname">Full Name</label>
                    <input
                      type="text"
                      id="editFullname"
                      placeholder="Enter full name"
                      value={editFullname}
                      onChange={(e) => {
                        setEditFullname(e.target.value);
                        setEditFullnameError("");
                      }}
                      className={editFullnameError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{editFullnameError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="editEmail">Email</label>
                    <input
                      type="text"
                      id="editEmail"
                      placeholder="Enter email"
                      value={editEmail}
                      onChange={(e) => {
                        setEditEmail(e.target.value);
                        setEditEmailError("");
                      }}
                      className={editEmailError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{editEmailError}</small>
                  </div>
                </div>

                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="editPassword">Password</label>
                    <input
                      type="password"
                      id="editPassword"
                      placeholder="Enter password"
                      value={editPassword}
                      onChange={(e) => {
                        setEditPassword(e.target.value);
                        setEditPasswordError("");
                      }}
                      className={editPasswordError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{editPasswordError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="editConfirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="editConfirmPassword"
                      placeholder="Confirm password"
                      value={editConfirmPassword}
                      onChange={(e) => {
                        setEditConfirmPassword(e.target.value);
                        setEditConfirmPasswordError("");
                      }}
                      className={editConfirmPasswordError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{editConfirmPasswordError}</small>
                  </div>
                </div>

                <div className="settingsActionRow">
                  <button type="submit" className="primaryBtn smallBtn">
                    Save Account Info
                  </button>
                </div>

                <p className="settingsSuccessMsg">{accountSuccessMsg}</p>
              </form>
            </article>

            <article className="dashboardPanel">
              <div className="panelHeader">
                <h2>Financial Profile</h2>
              </div>

              <form onSubmit={handleFinancialSubmit} className="settingsForm">
                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="editAge">Age</label>
                    <input
                      type="number"
                      id="editAge"
                      placeholder="Enter age"
                      value={editAge}
                      onChange={(e) => {
                        setEditAge(e.target.value);
                        setEditAgeError("");
                      }}
                      className={editAgeError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{editAgeError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="editCountry">Country</label>
                    <select
                      id="editCountry"
                      value={editCountry}
                      onChange={(e) => {
                        setEditCountry(e.target.value);
                        setEditCountryError("");
                      }}
                      className={editCountryError ? "inputError" : ""}
                    >
                      <option value="">Select your country</option>
                      <option>Saudi Arabia</option>
                      <option>UAE</option>
                      <option>Kuwait</option>
                      <option>Qatar</option>
                      <option>Bahrain</option>
                      <option>Other</option>
                    </select>
                    <small className="errorMsg">{editCountryError}</small>
                  </div>
                </div>

                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="editOccupation">Occupation</label>
                    <select
                      id="editOccupation"
                      value={editOccupation}
                      onChange={(e) => {
                        setEditOccupation(e.target.value);
                        setEditOccupationError("");
                      }}
                      className={editOccupationError ? "inputError" : ""}
                    >
                      <option value="">Select your occupation</option>
                      <option>Student</option>
                      <option>Employed</option>
                      <option>Self-employed</option>
                      <option>Business Owner</option>
                      <option>Freelancer</option>
                      <option>Unemployed</option>
                      <option>Retired</option>
                    </select>
                    <small className="errorMsg">{editOccupationError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="editSalaryRange">Monthly Income Range</label>
                    <select
                      id="editSalaryRange"
                      value={editSalaryRange}
                      onChange={(e) => {
                        setEditSalaryRange(e.target.value);
                        setEditSalaryRangeError("");
                      }}
                      className={editSalaryRangeError ? "inputError" : ""}
                    >
                      <option value="">Select your income range</option>
                      <option>Less than $1,000</option>
                      <option>$1,000 - $3,000</option>
                      <option>$3,001 - $5,000</option>
                      <option>$5,001 - $10,000</option>
                      <option>$10,000+</option>
                    </select>
                    <small className="errorMsg">{editSalaryRangeError}</small>
                  </div>
                </div>

                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="editIncomeFrequency">Income Frequency</label>
                    <select
                      id="editIncomeFrequency"
                      value={editIncomeFrequency}
                      onChange={(e) => {
                        setEditIncomeFrequency(e.target.value);
                        setEditIncomeFrequencyError("");
                      }}
                      className={editIncomeFrequencyError ? "inputError" : ""}
                    >
                      <option value="">Select income frequency</option>
                      <option>Monthly</option>
                      <option>Weekly</option>
                      <option>Irregular</option>
                    </select>
                    <small className="errorMsg">{editIncomeFrequencyError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="editIncomeSource">Primary Income Source</label>
                    <select
                      id="editIncomeSource"
                      value={editIncomeSource}
                      onChange={(e) => {
                        setEditIncomeSource(e.target.value);
                        setEditIncomeSourceError("");
                      }}
                      className={editIncomeSourceError ? "inputError" : ""}
                    >
                      <option value="">Select primary income source</option>
                      <option>Salary</option>
                      <option>Business</option>
                      <option>Freelance</option>
                      <option>Allowance / Family Support</option>
                      <option>Investments</option>
                      <option>Other</option>
                    </select>
                    <small className="errorMsg">{editIncomeSourceError}</small>
                  </div>
                </div>

                <div className="settingsGrid">
                  <div className="inputGroup">
                    <label htmlFor="editObligationType">Main Financial Obligation</label>
                    <select
                      id="editObligationType"
                      value={editObligationType}
                      onChange={(e) => {
                        setEditObligationType(e.target.value);
                        setEditObligationTypeError("");
                      }}
                      className={editObligationTypeError ? "inputError" : ""}
                    >
                      <option value="">Select obligation type</option>
                      <option>Rent</option>
                      <option>Loan Payment</option>
                      <option>Credit Card Debt</option>
                      <option>Family Support</option>
                      <option>Utilities</option>
                      <option>Other</option>
                    </select>
                    <small className="errorMsg">{editObligationTypeError}</small>
                  </div>

                  <div className="inputGroup">
                    <label htmlFor="editObligationAmount">Obligation Amount</label>
                    <input
                      type="number"
                      id="editObligationAmount"
                      placeholder="Enter amount"
                      value={editObligationAmount}
                      onChange={(e) => {
                        setEditObligationAmount(e.target.value);
                        setEditObligationAmountError("");
                      }}
                      className={editObligationAmountError ? "inputError" : ""}
                    />
                    <small className="errorMsg">{editObligationAmountError}</small>
                  </div>
                </div>

                <div className="settingsActionRow">
                  <button type="submit" className="primaryBtn smallBtn">
                    Save Financial Profile
                  </button>
                </div>

                <p className="settingsSuccessMsg">{financialSuccessMsg}</p>
              </form>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}