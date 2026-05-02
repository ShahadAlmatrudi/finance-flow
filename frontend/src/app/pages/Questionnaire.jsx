import { useState } from "react";
<<<<<<< HEAD
import { setQuestionnaire } from "../utils/storage";

export default function Questionnaire() {
=======
import { useNavigate } from "react-router-dom";
import { setQuestionnaire } from "../utils/storage";
import { apiFetch } from "../utils/api";

export default function Questionnaire() {
  const navigate = useNavigate();

>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  const [goal, setGoal] = useState("");
  const [tracking, setTracking] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [help, setHelp] = useState("");
  const [categories, setCategories] = useState([]);

  const [goalError, setGoalError] = useState("");
  const [trackingError, setTrackingError] = useState("");
  const [difficultyError, setDifficultyError] = useState("");
  const [helpError, setHelpError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");
<<<<<<< HEAD
=======
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67

  const clearErrors = () => {
    setGoalError("");
    setTrackingError("");
    setDifficultyError("");
    setHelpError("");
    setCategoriesError("");
<<<<<<< HEAD
=======
    setSubmitError("");
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  };

  const handleCategoryChange = (value) => {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    setCategoriesError("");
  };

<<<<<<< HEAD
  const handleSubmit = (event) => {
=======
  const handleSubmit = async (event) => {
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
    event.preventDefault();
    clearErrors();

    let isValid = true;

<<<<<<< HEAD
    if (!goal) {
      setGoalError("Please choose your main financial goal.");
      isValid = false;
    }

    if (!tracking) {
      setTrackingError("Please choose how often you track expenses.");
      isValid = false;
    }

    if (!difficulty) {
      setDifficultyError("Please choose what makes budgeting difficult.");
      isValid = false;
    }

    if (!help) {
      setHelpError("Please choose how FinanceFlow should help you.");
      isValid = false;
    }

    if (categories.length === 0) {
      setCategoriesError("Please choose at least one category.");
      isValid = false;
    }

    if (isValid) {
      const questionnaireData = {
        goal,
        tracking,
        difficulty,
        help,
        categories,
      };

      setQuestionnaire(questionnaireData);
      window.location.href = "/profile";
    }
=======
    if (!goal) { setGoalError("Please choose your main financial goal."); isValid = false; }
    if (!tracking) { setTrackingError("Please choose how often you track expenses."); isValid = false; }
    if (!difficulty) { setDifficultyError("Please choose what makes budgeting difficult."); isValid = false; }
    if (!help) { setHelpError("Please choose how FinanceFlow should help you."); isValid = false; }
    if (categories.length === 0) { setCategoriesError("Please choose at least one category."); isValid = false; }

    if (!isValid) return;

    const questionnaireData = { goal, tracking, difficulty, help, categories };

    // Save to localStorage as backup
    setQuestionnaire(questionnaireData);

    // Save to backend
    try {
      setLoading(true);
      await apiFetch("/api/questionnaire", {
        method: "POST",
        body: JSON.stringify(questionnaireData),
      });
    } catch (err) {
      console.error("Could not save questionnaire to server:", err.message);
      // Continue navigation even if API fails (localStorage is the fallback)
    } finally {
      setLoading(false);
    }

    navigate("/profile");
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  };

  return (
    <div className="flowPage">
      <main className="flowWrapper">
        <section className="wideCard questionnaireCard">
          <div className="stepHeader centerHeader">
            <span className="stepTag">Step 1 of 5</span>
            <h1 className="pageTitle">Help Us Personalize Your Experience</h1>
            <p className="pageSubtitle">
              Answer a few quick questions so FinanceFlow can build a smarter
              plan for you.
            </p>
          </div>

          <form
            className="twoColumnForm questionnaireForm"
            onSubmit={handleSubmit}
          >
            <div className="questionBlock questionCard">
              <h3>What is your main financial goal right now?</h3>

<<<<<<< HEAD
              <label className="optionLabel">
                <input
                  type="radio"
                  name="goal"
                  value="Save more money"
                  checked={goal === "Save more money"}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    setGoalError("");
                  }}
                />
                Save more money
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="goal"
                  value="Control my spending"
                  checked={goal === "Control my spending"}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    setGoalError("");
                  }}
                />
                Control my spending
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="goal"
                  value="Pay off debt"
                  checked={goal === "Pay off debt"}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    setGoalError("");
                  }}
                />
                Pay off debt
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="goal"
                  value="Build an emergency fund"
                  checked={goal === "Build an emergency fund"}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    setGoalError("");
                  }}
                />
                Build an emergency fund
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="goal"
                  value="Plan for a big purchase"
                  checked={goal === "Plan for a big purchase"}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    setGoalError("");
                  }}
                />
                Plan for a big purchase
              </label>
=======
              {["Save more money", "Control my spending", "Pay off debt", "Build an emergency fund", "Plan for a big purchase"].map((option) => (
                <label className="optionLabel" key={option}>
                  <input
                    type="radio"
                    name="goal"
                    value={option}
                    checked={goal === option}
                    onChange={(e) => { setGoal(e.target.value); setGoalError(""); }}
                  />
                  {option}
                </label>
              ))}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67

              <small className="errorMsg">{goalError}</small>
            </div>

            <div className="questionBlock questionCard">
              <h3>How often do you track your expenses?</h3>

<<<<<<< HEAD
              <label className="optionLabel">
                <input
                  type="radio"
                  name="tracking"
                  value="Every day"
                  checked={tracking === "Every day"}
                  onChange={(e) => {
                    setTracking(e.target.value);
                    setTrackingError("");
                  }}
                />
                Every day
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="tracking"
                  value="A few times a week"
                  checked={tracking === "A few times a week"}
                  onChange={(e) => {
                    setTracking(e.target.value);
                    setTrackingError("");
                  }}
                />
                A few times a week
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="tracking"
                  value="Once a month"
                  checked={tracking === "Once a month"}
                  onChange={(e) => {
                    setTracking(e.target.value);
                    setTrackingError("");
                  }}
                />
                Once a month
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="tracking"
                  value="Rarely"
                  checked={tracking === "Rarely"}
                  onChange={(e) => {
                    setTracking(e.target.value);
                    setTrackingError("");
                  }}
                />
                Rarely
              </label>
=======
              {["Every day", "A few times a week", "Once a month", "Rarely"].map((option) => (
                <label className="optionLabel" key={option}>
                  <input
                    type="radio"
                    name="tracking"
                    value={option}
                    checked={tracking === option}
                    onChange={(e) => { setTracking(e.target.value); setTrackingError(""); }}
                  />
                  {option}
                </label>
              ))}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67

              <small className="errorMsg">{trackingError}</small>
            </div>

            <div className="questionBlock questionCard">
              <h3>What usually makes budgeting difficult for you?</h3>

<<<<<<< HEAD
              <label className="optionLabel">
                <input
                  type="radio"
                  name="difficulty"
                  value="I spend impulsively"
                  checked={difficulty === "I spend impulsively"}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    setDifficultyError("");
                  }}
                />
                I spend impulsively
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="difficulty"
                  value="I forget to track expenses"
                  checked={difficulty === "I forget to track expenses"}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    setDifficultyError("");
                  }}
                />
                I forget to track expenses
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="difficulty"
                  value="My income changes often"
                  checked={difficulty === "My income changes often"}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    setDifficultyError("");
                  }}
                />
                My income changes often
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="difficulty"
                  value="I do not follow a plan"
                  checked={difficulty === "I do not follow a plan"}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    setDifficultyError("");
                  }}
                />
                I do not follow a plan
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="difficulty"
                  value="I have too many expenses"
                  checked={difficulty === "I have too many expenses"}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    setDifficultyError("");
                  }}
                />
                I have too many expenses
              </label>
=======
              {["I spend impulsively", "I forget to track expenses", "My income changes often", "I do not follow a plan", "I have too many expenses"].map((option) => (
                <label className="optionLabel" key={option}>
                  <input
                    type="radio"
                    name="difficulty"
                    value={option}
                    checked={difficulty === option}
                    onChange={(e) => { setDifficulty(e.target.value); setDifficultyError(""); }}
                  />
                  {option}
                </label>
              ))}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67

              <small className="errorMsg">{difficultyError}</small>
            </div>

            <div className="questionBlock questionCard">
              <h3>How would you like FinanceFlow to help you most?</h3>

<<<<<<< HEAD
              <label className="optionLabel">
                <input
                  type="radio"
                  name="help"
                  value="Budget reminders"
                  checked={help === "Budget reminders"}
                  onChange={(e) => {
                    setHelp(e.target.value);
                    setHelpError("");
                  }}
                />
                Budget reminders
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="help"
                  value="Spending insights"
                  checked={help === "Spending insights"}
                  onChange={(e) => {
                    setHelp(e.target.value);
                    setHelpError("");
                  }}
                />
                Spending insights
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="help"
                  value="Saving recommendations"
                  checked={help === "Saving recommendations"}
                  onChange={(e) => {
                    setHelp(e.target.value);
                    setHelpError("");
                  }}
                />
                Saving recommendations
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="help"
                  value="Goal tracking"
                  checked={help === "Goal tracking"}
                  onChange={(e) => {
                    setHelp(e.target.value);
                    setHelpError("");
                  }}
                />
                Goal tracking
              </label>

              <label className="optionLabel">
                <input
                  type="radio"
                  name="help"
                  value="Monthly summaries"
                  checked={help === "Monthly summaries"}
                  onChange={(e) => {
                    setHelp(e.target.value);
                    setHelpError("");
                  }}
                />
                Monthly summaries
              </label>
=======
              {["Budget reminders", "Spending insights", "Saving recommendations", "Goal tracking", "Monthly summaries"].map((option) => (
                <label className="optionLabel" key={option}>
                  <input
                    type="radio"
                    name="help"
                    value={option}
                    checked={help === option}
                    onChange={(e) => { setHelp(e.target.value); setHelpError(""); }}
                  />
                  {option}
                </label>
              ))}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67

              <small className="errorMsg">{helpError}</small>
            </div>

            <div className="questionBlock questionCard fullWidth">
              <h3>Which spending categories affect your budget the most?</h3>

              <div className="checkboxGrid">
<<<<<<< HEAD
                <label className="optionLabel">
                  <input
                    type="checkbox"
                    value="Food & Dining"
                    checked={categories.includes("Food & Dining")}
                    onChange={() => handleCategoryChange("Food & Dining")}
                  />
                  Food & Dining
                </label>

                <label className="optionLabel">
                  <input
                    type="checkbox"
                    value="Shopping"
                    checked={categories.includes("Shopping")}
                    onChange={() => handleCategoryChange("Shopping")}
                  />
                  Shopping
                </label>

                <label className="optionLabel">
                  <input
                    type="checkbox"
                    value="Transportation"
                    checked={categories.includes("Transportation")}
                    onChange={() => handleCategoryChange("Transportation")}
                  />
                  Transportation
                </label>

                <label className="optionLabel">
                  <input
                    type="checkbox"
                    value="Entertainment"
                    checked={categories.includes("Entertainment")}
                    onChange={() => handleCategoryChange("Entertainment")}
                  />
                  Entertainment
                </label>

                <label className="optionLabel">
                  <input
                    type="checkbox"
                    value="Bills & Utilities"
                    checked={categories.includes("Bills & Utilities")}
                    onChange={() => handleCategoryChange("Bills & Utilities")}
                  />
                  Bills & Utilities
                </label>

                <label className="optionLabel">
                  <input
                    type="checkbox"
                    value="Subscriptions"
                    checked={categories.includes("Subscriptions")}
                    onChange={() => handleCategoryChange("Subscriptions")}
                  />
                  Subscriptions
                </label>
=======
                {["Food & Dining", "Shopping", "Transportation", "Entertainment", "Bills & Utilities", "Subscriptions"].map((option) => (
                  <label className="optionLabel" key={option}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={categories.includes(option)}
                      onChange={() => handleCategoryChange(option)}
                    />
                    {option}
                  </label>
                ))}
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
              </div>

              <small className="errorMsg">{categoriesError}</small>
            </div>

<<<<<<< HEAD
            <div className="actionRow fullWidth questionnaireActions">
              <button type="submit" className="primaryBtn">
                Next
=======
            {submitError && <small className="errorMsg fullWidth">{submitError}</small>}

            <div className="actionRow dualButtons fullWidth questionnaireActions">
              <button
                type="button"
                className="secondaryBtn"
                onClick={() => navigate("/onboarding")}
              >
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
