import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setQuestionnaire } from "../utils/storage";
import { apiFetch } from "../utils/api";

export default function Questionnaire() {
  const navigate = useNavigate();

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
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearErrors = () => {
    setGoalError("");
    setTrackingError("");
    setDifficultyError("");
    setHelpError("");
    setCategoriesError("");
    setSubmitError("");
  };

  const handleCategoryChange = (value) => {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    setCategoriesError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearErrors();

    let isValid = true;

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

              <small className="errorMsg">{goalError}</small>
            </div>

            <div className="questionBlock questionCard">
              <h3>How often do you track your expenses?</h3>

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

              <small className="errorMsg">{trackingError}</small>
            </div>

            <div className="questionBlock questionCard">
              <h3>What usually makes budgeting difficult for you?</h3>

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

              <small className="errorMsg">{difficultyError}</small>
            </div>

            <div className="questionBlock questionCard">
              <h3>How would you like FinanceFlow to help you most?</h3>

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

              <small className="errorMsg">{helpError}</small>
            </div>

            <div className="questionBlock questionCard fullWidth">
              <h3>Which spending categories affect your budget the most?</h3>

              <div className="checkboxGrid">
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
              </div>

              <small className="errorMsg">{categoriesError}</small>
            </div>

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
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
