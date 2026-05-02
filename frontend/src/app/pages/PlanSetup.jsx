import { useState } from "react";
<<<<<<< HEAD
import { setPlan } from "../utils/storage";

export default function PlanSetup() {
=======
import { useNavigate } from "react-router-dom";
import { setPlan } from "../utils/storage";
import { apiFetch } from "../utils/api";

export default function PlanSetup() {
  const navigate = useNavigate();

>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  const [goalType, setGoalType] = useState("");
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [monthlySaving, setMonthlySaving] = useState("");
  const [savingAccount, setSavingAccount] = useState("");
  const [autoTransfer, setAutoTransfer] = useState(false);
  const [emergencyFund, setEmergencyFund] = useState(false);
<<<<<<< HEAD

  const [selectedCategories, setSelectedCategories] = useState({
    foodLimit: false,
    shoppingLimit: false,
    transportLimit: false,
    entertainmentLimit: false,
    billsLimit: false,
    subscriptionsLimit: false,
  });

  const [categoryLimits, setCategoryLimits] = useState({
    foodLimit: "",
    shoppingLimit: "",
    transportLimit: "",
    entertainmentLimit: "",
    billsLimit: "",
    subscriptionsLimit: "",
=======
  const [loading, setLoading] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState({
    foodLimit: false, shoppingLimit: false, transportLimit: false,
    entertainmentLimit: false, billsLimit: false, subscriptionsLimit: false,
  });

  const [categoryLimits, setCategoryLimits] = useState({
    foodLimit: "", shoppingLimit: "", transportLimit: "",
    entertainmentLimit: "", billsLimit: "", subscriptionsLimit: "",
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  });

  const [goalTypeError, setGoalTypeError] = useState("");
  const [goalNameError, setGoalNameError] = useState("");
  const [targetAmountError, setTargetAmountError] = useState("");
  const [targetDateError, setTargetDateError] = useState("");
  const [monthlySavingError, setMonthlySavingError] = useState("");
  const [savingAccountError, setSavingAccountError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");

  const clearErrors = () => {
<<<<<<< HEAD
    setGoalTypeError("");
    setGoalNameError("");
    setTargetAmountError("");
    setTargetDateError("");
    setMonthlySavingError("");
    setSavingAccountError("");
=======
    setGoalTypeError(""); setGoalNameError(""); setTargetAmountError("");
    setTargetDateError(""); setMonthlySavingError(""); setSavingAccountError("");
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
    setCategoriesError("");
  };

  const handleCategoryToggle = (target) => {
<<<<<<< HEAD
    setSelectedCategories((prev) => ({
      ...prev,
      [target]: !prev[target],
    }));

    if (selectedCategories[target]) {
      setCategoryLimits((prev) => ({
        ...prev,
        [target]: "",
      }));
    }

=======
    setSelectedCategories((prev) => ({ ...prev, [target]: !prev[target] }));
    if (selectedCategories[target]) {
      setCategoryLimits((prev) => ({ ...prev, [target]: "" }));
    }
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
    setCategoriesError("");
  };

  const handleLimitChange = (target, value) => {
<<<<<<< HEAD
    setCategoryLimits((prev) => ({
      ...prev,
      [target]: value,
    }));
=======
    setCategoryLimits((prev) => ({ ...prev, [target]: value }));
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
    setCategoriesError("");
  };

  const getInputErrorClass = (target) => {
    if (!selectedCategories[target]) return "";
    const value = categoryLimits[target];
<<<<<<< HEAD
    if (categoriesError && (value.trim() === "" || Number(value) <= 0)) {
      return "inputError";
    }
    return "";
  };

  const handleSubmit = (event) => {
=======
    if (categoriesError && (value.trim() === "" || Number(value) <= 0)) return "inputError";
    return "";
  };

  const handleSubmit = async (event) => {
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
    event.preventDefault();
    clearErrors();

    let isValid = true;

<<<<<<< HEAD
    if (goalType === "") {
      setGoalTypeError("Please select a goal type.");
      isValid = false;
    }

    if (goalName.trim() === "") {
      setGoalNameError("Goal name is required.");
      isValid = false;
    }

    if (targetAmount.trim() === "") {
      setTargetAmountError("Target amount is required.");
      isValid = false;
    } else if (Number(targetAmount) <= 0) {
      setTargetAmountError("Target amount must be greater than 0.");
      isValid = false;
    }

    if (targetDate === "") {
      setTargetDateError("Please choose a target date.");
      isValid = false;
    }

    if (monthlySaving.trim() === "") {
      setMonthlySavingError("Monthly saving amount is required.");
      isValid = false;
    } else if (Number(monthlySaving) <= 0) {
      setMonthlySavingError("Monthly saving must be greater than 0.");
      isValid = false;
    }

    if (savingAccount === "") {
      setSavingAccountError("Please select a saving account.");
      isValid = false;
    }
=======
    if (!goalType) { setGoalTypeError("Please select a goal type."); isValid = false; }
    if (!goalName.trim()) { setGoalNameError("Goal name is required."); isValid = false; }
    if (!targetAmount.trim()) { setTargetAmountError("Target amount is required."); isValid = false; }
    else if (Number(targetAmount) <= 0) { setTargetAmountError("Target amount must be greater than 0."); isValid = false; }
    if (!targetDate) { setTargetDateError("Please choose a target date."); isValid = false; }
    if (!monthlySaving.trim()) { setMonthlySavingError("Monthly saving amount is required."); isValid = false; }
    else if (Number(monthlySaving) <= 0) { setMonthlySavingError("Monthly saving must be greater than 0."); isValid = false; }
    if (!savingAccount) { setSavingAccountError("Please select a saving account."); isValid = false; }
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67

    const categoryMap = [
      { key: "foodLimit", name: "Food & Dining" },
      { key: "shoppingLimit", name: "Shopping" },
      { key: "transportLimit", name: "Transportation" },
      { key: "entertainmentLimit", name: "Entertainment" },
      { key: "billsLimit", name: "Bills & Utilities" },
      { key: "subscriptionsLimit", name: "Subscriptions" },
    ];

<<<<<<< HEAD
    const chosenCategories = categoryMap.filter(
      (category) => selectedCategories[category.key]
    );

=======
    const chosenCategories = categoryMap.filter((cat) => selectedCategories[cat.key]);
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
    const categoriesData = [];

    if (chosenCategories.length === 0) {
      setCategoriesError("Please select at least one spending category.");
      isValid = false;
    } else {
<<<<<<< HEAD
      chosenCategories.forEach((category) => {
        const limitValue = categoryLimits[category.key];

        if (limitValue.trim() === "" || Number(limitValue) <= 0) {
          isValid = false;
        } else {
          categoriesData.push({
            name: category.name,
            limit: Number(limitValue),
          });
        }
      });

      if (!isValid) {
        setCategoriesError(
          "Enter a valid monthly limit for each selected category."
        );
      }
    }

    if (isValid) {
      const planData = {
        goalType,
        goalName: goalName.trim(),
        targetAmount: Number(targetAmount),
        targetDate,
        monthlySaving: Number(monthlySaving),
        savingAccount,
        autoTransfer,
        emergencyFund,
        categories: categoriesData,
      };

      setPlan(planData);
      window.location.href = "/cards-setup";
    }
=======
      chosenCategories.forEach((cat) => {
        const limitValue = categoryLimits[cat.key];
        if (!limitValue.trim() || Number(limitValue) <= 0) {
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

    // Save to localStorage
    setPlan(planData);

    // Save to backend
    try {
      setLoading(true);
      await apiFetch("/api/plans", {
        method: "POST",
        body: JSON.stringify(planData),
      });
    } catch (err) {
      console.error("Could not save plan to server:", err.message);
    } finally {
      setLoading(false);
    }

    navigate("/cards");
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  };

  return (
    <div className="flowPage">
      <main className="flowWrapper">
        <section className="formCard extraLargeCard planCard">
          <div className="stepHeader centerHeader">
            <span className="stepTag">Step 3 of 5</span>
            <h1 className="pageTitle">Build Your Financial Plan</h1>
            <p className="pageSubtitle">
<<<<<<< HEAD
              Set your first goal, create a saving habit, and define your
              spending limits.
=======
              Set your first goal, create a saving habit, and define your spending limits.
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
            </p>
          </div>

          <form id="planForm" className="mainForm" onSubmit={handleSubmit}>
            <div className="cardSection">
              <h2 className="subSectionTitle">1. Main Financial Goal</h2>

              <div className="inputGroup">
                <label htmlFor="goal-type">Goal Type</label>
<<<<<<< HEAD
                <select
                  id="goal-type"
                  name="goal-type"
                  value={goalType}
                  onChange={(e) => {
                    setGoalType(e.target.value);
                    setGoalTypeError("");
                  }}
                  className={goalTypeError ? "inputError" : ""}
                >
                  <option value="">Select goal type</option>
                  <option>Emergency Fund</option>
                  <option>Big Purchase</option>
                  <option>Travel</option>
                  <option>Debt Repayment</option>
                  <option>Investment</option>
                  <option>Other</option>
=======
                <select id="goal-type" value={goalType}
                  onChange={(e) => { setGoalType(e.target.value); setGoalTypeError(""); }}
                  className={goalTypeError ? "inputError" : ""}>
                  <option value="">Select goal type</option>
                  {["Emergency Fund", "Big Purchase", "Travel", "Debt Repayment", "Investment", "Other"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
                </select>
                <small className="errorMsg">{goalTypeError}</small>
              </div>

              <div className="inputGroup">
                <label htmlFor="goal-name">Goal Name</label>
<<<<<<< HEAD
                <input
                  type="text"
                  id="goal-name"
                  name="goal-name"
                  placeholder="e.g. New Laptop or Emergency Fund"
                  value={goalName}
                  onChange={(e) => {
                    setGoalName(e.target.value);
                    setGoalNameError("");
                  }}
                  className={goalNameError ? "inputError" : ""}
                />
=======
                <input type="text" id="goal-name" placeholder="e.g. New Laptop or Emergency Fund"
                  value={goalName}
                  onChange={(e) => { setGoalName(e.target.value); setGoalNameError(""); }}
                  className={goalNameError ? "inputError" : ""} />
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
                <small className="errorMsg">{goalNameError}</small>
              </div>

              <div className="formRow">
                <div className="inputGroup">
                  <label htmlFor="target-amount">Target Amount</label>
<<<<<<< HEAD
                  <input
                    type="number"
                    id="target-amount"
                    name="target-amount"
                    placeholder="Enter amount"
                    value={targetAmount}
                    onChange={(e) => {
                      setTargetAmount(e.target.value);
                      setTargetAmountError("");
                    }}
                    className={targetAmountError ? "inputError" : ""}
                  />
                  <small className="errorMsg">{targetAmountError}</small>
                </div>

                <div className="inputGroup">
                  <label htmlFor="target-date">Target Date</label>
                  <input
                    type="date"
                    id="target-date"
                    name="target-date"
                    value={targetDate}
                    onChange={(e) => {
                      setTargetDate(e.target.value);
                      setTargetDateError("");
                    }}
                    className={targetDateError ? "inputError" : ""}
                  />
=======
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
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
                  <small className="errorMsg">{targetDateError}</small>
                </div>
              </div>
            </div>

            <div className="cardSection">
              <h2 className="subSectionTitle">2. Saving Plan</h2>

              <div className="formRow">
                <div className="inputGroup">
                  <label htmlFor="monthly-saving">Monthly Saving Amount</label>
<<<<<<< HEAD
                  <input
                    type="number"
                    id="monthly-saving"
                    name="monthly-saving"
                    placeholder="Enter monthly amount"
                    value={monthlySaving}
                    onChange={(e) => {
                      setMonthlySaving(e.target.value);
                      setMonthlySavingError("");
                    }}
                    className={monthlySavingError ? "inputError" : ""}
                  />
                  <small className="errorMsg">{monthlySavingError}</small>
                </div>

                <div className="inputGroup">
                  <label htmlFor="saving-account">Saving Account</label>
                  <select
                    id="saving-account"
                    name="saving-account"
                    value={savingAccount}
                    onChange={(e) => {
                      setSavingAccount(e.target.value);
                      setSavingAccountError("");
                    }}
                    className={savingAccountError ? "inputError" : ""}
                  >
                    <option value="">Select account</option>
                    <option>Main Account</option>
                    <option>Savings Account</option>
                    <option>Secondary Account</option>
=======
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
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
                  </select>
                  <small className="errorMsg">{savingAccountError}</small>
                </div>
              </div>

              <label className="optionLabel checkboxOption">
<<<<<<< HEAD
                <input
                  type="checkbox"
                  id="auto-transfer"
                  name="auto-transfer"
                  checked={autoTransfer}
                  onChange={(e) => setAutoTransfer(e.target.checked)}
                />
=======
                <input type="checkbox" checked={autoTransfer} onChange={(e) => setAutoTransfer(e.target.checked)} />
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
                Enable automatic monthly transfer
              </label>

              <label className="optionLabel checkboxOption">
<<<<<<< HEAD
                <input
                  type="checkbox"
                  id="emergency-fund"
                  name="emergency-fund"
                  checked={emergencyFund}
                  onChange={(e) => setEmergencyFund(e.target.checked)}
                />
=======
                <input type="checkbox" checked={emergencyFund} onChange={(e) => setEmergencyFund(e.target.checked)} />
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
                Prioritize emergency fund contribution
              </label>
            </div>

            <div className="cardSection">
              <h2 className="subSectionTitle">3. Monthly Budget Categories</h2>
              <p className="sectionHelper">
<<<<<<< HEAD
                Select the categories you want FinanceFlow to track first, then
                set a monthly limit for each one.
              </p>

              <div className="categoryGrid">
                <label className="categoryChoice">
                  <input
                    type="checkbox"
                    className="categoryCheck"
                    checked={selectedCategories.foodLimit}
                    onChange={() => handleCategoryToggle("foodLimit")}
                  />
                  <span>Food & Dining</span>
                </label>

                <label className="categoryChoice">
                  <input
                    type="checkbox"
                    className="categoryCheck"
                    checked={selectedCategories.shoppingLimit}
                    onChange={() => handleCategoryToggle("shoppingLimit")}
                  />
                  <span>Shopping</span>
                </label>

                <label className="categoryChoice">
                  <input
                    type="checkbox"
                    className="categoryCheck"
                    checked={selectedCategories.transportLimit}
                    onChange={() => handleCategoryToggle("transportLimit")}
                  />
                  <span>Transportation</span>
                </label>

                <label className="categoryChoice">
                  <input
                    type="checkbox"
                    className="categoryCheck"
                    checked={selectedCategories.entertainmentLimit}
                    onChange={() => handleCategoryToggle("entertainmentLimit")}
                  />
                  <span>Entertainment</span>
                </label>

                <label className="categoryChoice">
                  <input
                    type="checkbox"
                    className="categoryCheck"
                    checked={selectedCategories.billsLimit}
                    onChange={() => handleCategoryToggle("billsLimit")}
                  />
                  <span>Bills & Utilities</span>
                </label>

                <label className="categoryChoice">
                  <input
                    type="checkbox"
                    className="categoryCheck"
                    checked={selectedCategories.subscriptionsLimit}
                    onChange={() => handleCategoryToggle("subscriptionsLimit")}
                  />
                  <span>Subscriptions</span>
                </label>
=======
                Select the categories you want FinanceFlow to track first, then set a monthly limit for each one.
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
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
              </div>

              <small className="errorMsg">{categoriesError}</small>

              <div className="budgetInputs">
<<<<<<< HEAD
                <div className="inputGroup budgetInput">
                  <label htmlFor="foodLimit">Food & Dining Limit</label>
                  <input
                    type="number"
                    id="foodLimit"
                    placeholder="Enter limit"
                    disabled={!selectedCategories.foodLimit}
                    value={categoryLimits.foodLimit}
                    onChange={(e) =>
                      handleLimitChange("foodLimit", e.target.value)
                    }
                    className={getInputErrorClass("foodLimit")}
                  />
                  <small className="errorMsg"></small>
                </div>

                <div className="inputGroup budgetInput">
                  <label htmlFor="shoppingLimit">Shopping Limit</label>
                  <input
                    type="number"
                    id="shoppingLimit"
                    placeholder="Enter limit"
                    disabled={!selectedCategories.shoppingLimit}
                    value={categoryLimits.shoppingLimit}
                    onChange={(e) =>
                      handleLimitChange("shoppingLimit", e.target.value)
                    }
                    className={getInputErrorClass("shoppingLimit")}
                  />
                  <small className="errorMsg"></small>
                </div>

                <div className="inputGroup budgetInput">
                  <label htmlFor="transportLimit">Transportation Limit</label>
                  <input
                    type="number"
                    id="transportLimit"
                    placeholder="Enter limit"
                    disabled={!selectedCategories.transportLimit}
                    value={categoryLimits.transportLimit}
                    onChange={(e) =>
                      handleLimitChange("transportLimit", e.target.value)
                    }
                    className={getInputErrorClass("transportLimit")}
                  />
                  <small className="errorMsg"></small>
                </div>

                <div className="inputGroup budgetInput">
                  <label htmlFor="entertainmentLimit">Entertainment Limit</label>
                  <input
                    type="number"
                    id="entertainmentLimit"
                    placeholder="Enter limit"
                    disabled={!selectedCategories.entertainmentLimit}
                    value={categoryLimits.entertainmentLimit}
                    onChange={(e) =>
                      handleLimitChange("entertainmentLimit", e.target.value)
                    }
                    className={getInputErrorClass("entertainmentLimit")}
                  />
                  <small className="errorMsg"></small>
                </div>

                <div className="inputGroup budgetInput">
                  <label htmlFor="billsLimit">Bills & Utilities Limit</label>
                  <input
                    type="number"
                    id="billsLimit"
                    placeholder="Enter limit"
                    disabled={!selectedCategories.billsLimit}
                    value={categoryLimits.billsLimit}
                    onChange={(e) =>
                      handleLimitChange("billsLimit", e.target.value)
                    }
                    className={getInputErrorClass("billsLimit")}
                  />
                  <small className="errorMsg"></small>
                </div>

                <div className="inputGroup budgetInput">
                  <label htmlFor="subscriptionsLimit">Subscriptions Limit</label>
                  <input
                    type="number"
                    id="subscriptionsLimit"
                    placeholder="Enter limit"
                    disabled={!selectedCategories.subscriptionsLimit}
                    value={categoryLimits.subscriptionsLimit}
                    onChange={(e) =>
                      handleLimitChange("subscriptionsLimit", e.target.value)
                    }
                    className={getInputErrorClass("subscriptionsLimit")}
                  />
                  <small className="errorMsg"></small>
                </div>
              </div>
            </div>

            <div className="actionRow">
              <button type="submit" className="primaryBtn">
                Next
=======
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
              <button type="button" className="secondaryBtn" onClick={() => navigate("/profile")}>
                ← Back
              </button>
              <button type="submit" className="primaryBtn" disabled={loading}>
                {loading ? "Saving..." : "Next"}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
