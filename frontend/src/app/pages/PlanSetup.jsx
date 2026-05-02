import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setPlan } from "../utils/storage";
import { apiFetch } from "../utils/api";

export default function PlanSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read editing data from sessionStorage (more reliable than React Router state)
  const editingPlan = location.state?.plan ||
    (sessionStorage.getItem("editingPlan")
      ? JSON.parse(sessionStorage.getItem("editingPlan"))
      : null);
  const editingPlanId = location.state?.planId ||
    sessionStorage.getItem("editingPlanId") ||
    null;

  const categoryMap = [
    { key: "foodLimit", name: "Food & Dining" },
    { key: "shoppingLimit", name: "Shopping" },
    { key: "transportLimit", name: "Transportation" },
    { key: "entertainmentLimit", name: "Entertainment" },
    { key: "billsLimit", name: "Bills & Utilities" },
    { key: "subscriptionsLimit", name: "Subscriptions" },
  ];

  const existingCategories = editingPlan?.categories || [];

  const [goalType, setGoalType] = useState(editingPlan?.goalType || "");
  const [goalName, setGoalName] = useState(editingPlan?.goalName || "");
  const [targetAmount, setTargetAmount] = useState(editingPlan?.targetAmount || "");
  const [targetDate, setTargetDate] = useState(
    editingPlan?.targetDate ? editingPlan.targetDate.split("T")[0] : ""
  );
  const [monthlySaving, setMonthlySaving] = useState(editingPlan?.monthlySaving || "");
  const [savingAccount, setSavingAccount] = useState(editingPlan?.savingAccount || "");
  const [autoTransfer, setAutoTransfer] = useState(editingPlan?.autoTransfer || false);
  const [emergencyFund, setEmergencyFund] = useState(editingPlan?.emergencyFund || false);
  const [loading, setLoading] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState({
    foodLimit: existingCategories.some((c) => c.name === "Food & Dining"),
    shoppingLimit: existingCategories.some((c) => c.name === "Shopping"),
    transportLimit: existingCategories.some((c) => c.name === "Transportation"),
    entertainmentLimit: existingCategories.some((c) => c.name === "Entertainment"),
    billsLimit: existingCategories.some((c) => c.name === "Bills & Utilities"),
    subscriptionsLimit: existingCategories.some((c) => c.name === "Subscriptions"),
  });

  const [categoryLimits, setCategoryLimits] = useState({
    foodLimit: existingCategories.find((c) => c.name === "Food & Dining")?.limit || "",
    shoppingLimit: existingCategories.find((c) => c.name === "Shopping")?.limit || "",
    transportLimit: existingCategories.find((c) => c.name === "Transportation")?.limit || "",
    entertainmentLimit: existingCategories.find((c) => c.name === "Entertainment")?.limit || "",
    billsLimit: existingCategories.find((c) => c.name === "Bills & Utilities")?.limit || "",
    subscriptionsLimit: existingCategories.find((c) => c.name === "Subscriptions")?.limit || "",
  });

  const [goalTypeError, setGoalTypeError] = useState("");
  const [goalNameError, setGoalNameError] = useState("");
  const [targetAmountError, setTargetAmountError] = useState("");
  const [targetDateError, setTargetDateError] = useState("");
  const [monthlySavingError, setMonthlySavingError] = useState("");
  const [savingAccountError, setSavingAccountError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");

  const clearErrors = () => {
    setGoalTypeError(""); setGoalNameError(""); setTargetAmountError("");
    setTargetDateError(""); setMonthlySavingError(""); setSavingAccountError("");
    setCategoriesError("");
  };

  const handleCategoryToggle = (target) => {
    setSelectedCategories((prev) => ({ ...prev, [target]: !prev[target] }));
    if (selectedCategories[target]) {
      setCategoryLimits((prev) => ({ ...prev, [target]: "" }));
    }
    setCategoriesError("");
  };

  const handleLimitChange = (target, value) => {
    setCategoryLimits((prev) => ({ ...prev, [target]: value }));
    setCategoriesError("");
  };

  const getInputErrorClass = (target) => {
    if (!selectedCategories[target]) return "";
    const value = categoryLimits[target];
    if (categoriesError && (String(value).trim() === "" || Number(value) <= 0)) return "inputError";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearErrors();

    let isValid = true;

    if (!goalType) { setGoalTypeError("Please select a goal type."); isValid = false; }
    if (!goalName.trim()) { setGoalNameError("Goal name is required."); isValid = false; }
    if (!String(targetAmount).trim()) { setTargetAmountError("Target amount is required."); isValid = false; }
    else if (Number(targetAmount) <= 0) { setTargetAmountError("Target amount must be greater than 0."); isValid = false; }
    if (!targetDate) { setTargetDateError("Please choose a target date."); isValid = false; }
    if (!String(monthlySaving).trim()) { setMonthlySavingError("Monthly saving amount is required."); isValid = false; }
    else if (Number(monthlySaving) <= 0) { setMonthlySavingError("Monthly saving must be greater than 0."); isValid = false; }
    if (!savingAccount) { setSavingAccountError("Please select a saving account."); isValid = false; }

    const chosenCategories = categoryMap.filter((cat) => selectedCategories[cat.key]);
    const categoriesData = [];

    if (chosenCategories.length === 0) {
      setCategoriesError("Please select at least one spending category.");
      isValid = false;
    } else {
      chosenCategories.forEach((cat) => {
        const limitValue = categoryLimits[cat.key];
        if (!String(limitValue).trim() || Number(limitValue) <= 0) {
          isValid = false;
        } else {
          categoriesData.push({ name: cat.name, limit: Number(limitValue) });
        }
      });
      if (!isValid) setCategoriesError("Enter a valid monthly limit for each selected category.");
    }

    if (!isValid) return;

    const planData = {
      goalType, goalName: goalName.trim(),
      targetAmount: Number(targetAmount), targetDate,
      monthlySaving: Number(monthlySaving), savingAccount,
      autoTransfer, emergencyFund, categories: categoriesData,
    };

    setPlan(planData);

    try {
      setLoading(true);
      if (editingPlanId) {
        await apiFetch(`/api/plans/${editingPlanId}`, {
          method: "PUT",
          body: JSON.stringify(planData),
        });
        // Clear sessionStorage after successful save
        sessionStorage.removeItem("editingPlan");
        sessionStorage.removeItem("editingPlanId");
        navigate("/plans");
      } else {
        await apiFetch("/api/plans", {
          method: "POST",
          body: JSON.stringify(planData),
        });
        navigate("/cards");
      }
    } catch (err) {
      console.error("Could not save plan to server:", err.message);
      sessionStorage.removeItem("editingPlan");
      sessionStorage.removeItem("editingPlanId");
      navigate(editingPlanId ? "/plans" : "/cards");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flowPage">
      <main className="flowWrapper">
        <section className="formCard extraLargeCard planCard">
          <div className="stepHeader centerHeader">
            <span className="stepTag">{editingPlan ? "Edit Plan" : "Step 3 of 5"}</span>
            <h1 className="pageTitle">
              {editingPlan ? "Edit Your Financial Plan" : "Build Your Financial Plan"}
            </h1>
            <p className="pageSubtitle">
              Set your goal, create a saving habit, and define your spending limits.
            </p>
          </div>

          <form id="planForm" className="mainForm" onSubmit={handleSubmit}>
            <div className="cardSection">
              <h2 className="subSectionTitle">1. Main Financial Goal</h2>

              <div className="inputGroup">
                <label htmlFor="goal-type">Goal Type</label>
                <select id="goal-type" value={goalType}
                  onChange={(e) => { setGoalType(e.target.value); setGoalTypeError(""); }}
                  className={goalTypeError ? "inputError" : ""}>
                  <option value="">Select goal type</option>
                  {["Emergency Fund", "Big Purchase", "Travel", "Debt Repayment", "Investment", "Other"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <small className="errorMsg">{goalTypeError}</small>
              </div>

              <div className="inputGroup">
                <label htmlFor="goal-name">Goal Name</label>
                <input type="text" id="goal-name" placeholder="e.g. New Laptop or Emergency Fund"
                  value={goalName}
                  onChange={(e) => { setGoalName(e.target.value); setGoalNameError(""); }}
                  className={goalNameError ? "inputError" : ""} />
                <small className="errorMsg">{goalNameError}</small>
              </div>

              <div className="formRow">
                <div className="inputGroup">
                  <label htmlFor="target-amount">Target Amount</label>
                  <input type="number" id="target-amount" placeholder="Enter amount"
                    value={targetAmount}
                    onChange={(e) => { setTargetAmount(e.target.value); setTargetAmountError(""); }}
                    className={targetAmountError ? "inputError" : ""} />
                  <small className="errorMsg">{targetAmountError}</small>
                </div>
                <div className="inputGroup">
                  <label htmlFor="target-date">Target Date</label>
                  <input type="date" id="target-date" value={targetDate}
                    onChange={(e) => { setTargetDate(e.target.value); setTargetDateError(""); }}
                    className={targetDateError ? "inputError" : ""} />
                  <small className="errorMsg">{targetDateError}</small>
                </div>
              </div>
            </div>

            <div className="cardSection">
              <h2 className="subSectionTitle">2. Saving Plan</h2>

              <div className="formRow">
                <div className="inputGroup">
                  <label htmlFor="monthly-saving">Monthly Saving Amount</label>
                  <input type="number" id="monthly-saving" placeholder="Enter monthly amount"
                    value={monthlySaving}
                    onChange={(e) => { setMonthlySaving(e.target.value); setMonthlySavingError(""); }}
                    className={monthlySavingError ? "inputError" : ""} />
                  <small className="errorMsg">{monthlySavingError}</small>
                </div>
                <div className="inputGroup">
                  <label htmlFor="saving-account">Saving Account</label>
                  <select id="saving-account" value={savingAccount}
                    onChange={(e) => { setSavingAccount(e.target.value); setSavingAccountError(""); }}
                    className={savingAccountError ? "inputError" : ""}>
                    <option value="">Select account</option>
                    {["Main Account", "Savings Account", "Secondary Account"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <small className="errorMsg">{savingAccountError}</small>
                </div>
              </div>

              <label className="optionLabel checkboxOption">
                <input type="checkbox" checked={autoTransfer} onChange={(e) => setAutoTransfer(e.target.checked)} />
                Enable automatic monthly transfer
              </label>

              <label className="optionLabel checkboxOption">
                <input type="checkbox" checked={emergencyFund} onChange={(e) => setEmergencyFund(e.target.checked)} />
                Prioritize emergency fund contribution
              </label>
            </div>

            <div className="cardSection">
              <h2 className="subSectionTitle">3. Monthly Budget Categories</h2>
              <p className="sectionHelper">
                Select the categories you want FinanceFlow to track, then set a monthly limit for each one.
              </p>

              <div className="categoryGrid">
                {[
                  { key: "foodLimit", label: "Food & Dining" },
                  { key: "shoppingLimit", label: "Shopping" },
                  { key: "transportLimit", label: "Transportation" },
                  { key: "entertainmentLimit", label: "Entertainment" },
                  { key: "billsLimit", label: "Bills & Utilities" },
                  { key: "subscriptionsLimit", label: "Subscriptions" },
                ].map(({ key, label }) => (
                  <label className="categoryChoice" key={key}>
                    <input type="checkbox" className="categoryCheck"
                      checked={selectedCategories[key]}
                      onChange={() => handleCategoryToggle(key)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <small className="errorMsg">{categoriesError}</small>

              <div className="budgetInputs">
                {[
                  { key: "foodLimit", label: "Food & Dining Limit" },
                  { key: "shoppingLimit", label: "Shopping Limit" },
                  { key: "transportLimit", label: "Transportation Limit" },
                  { key: "entertainmentLimit", label: "Entertainment Limit" },
                  { key: "billsLimit", label: "Bills & Utilities Limit" },
                  { key: "subscriptionsLimit", label: "Subscriptions Limit" },
                ].map(({ key, label }) => (
                  <div className="inputGroup budgetInput" key={key}>
                    <label htmlFor={key}>{label}</label>
                    <input type="number" id={key} placeholder="Enter limit"
                      disabled={!selectedCategories[key]}
                      value={categoryLimits[key]}
                      onChange={(e) => handleLimitChange(key, e.target.value)}
                      className={getInputErrorClass(key)} />
                    <small className="errorMsg"></small>
                  </div>
                ))}
              </div>
            </div>

            <div className="actionRow dualButtons">
              <button type="button" className="secondaryBtn"
                onClick={() => {
                  sessionStorage.removeItem("editingPlan");
                  sessionStorage.removeItem("editingPlanId");
                  navigate(editingPlan ? "/plans" : "/profile");
                }}>
                ← Back
              </button>
              <button type="submit" className="primaryBtn" disabled={loading}>
                {loading ? "Saving..." : editingPlan ? "Save Changes" : "Next"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
