import { useState } from "react";
<<<<<<< HEAD
import { setProfile } from "../utils/storage";

export default function Profile() {
=======
import { useNavigate } from "react-router-dom";
import { setProfile } from "../utils/storage";

export default function Profile() {
  const navigate = useNavigate();

>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [occupation, setOccupation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [incomeFrequency, setIncomeFrequency] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [obligationType, setObligationType] = useState("");
  const [obligationAmount, setObligationAmount] = useState("");

  const [ageError, setAgeError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [occupationError, setOccupationError] = useState("");
  const [salaryError, setSalaryError] = useState("");
  const [frequencyError, setFrequencyError] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [obligationTypeError, setObligationTypeError] = useState("");
  const [obligationAmountError, setObligationAmountError] = useState("");

  const clearErrors = () => {
    setAgeError("");
    setCountryError("");
    setOccupationError("");
    setSalaryError("");
    setFrequencyError("");
    setSourceError("");
    setObligationTypeError("");
    setObligationAmountError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearErrors();

    let isValid = true;

    if (age.trim() === "") {
      setAgeError("Age is required.");
      isValid = false;
    } else if (Number(age) < 16) {
      setAgeError("Age must be 16 or older.");
      isValid = false;
    }

    if (country === "") {
      setCountryError("Please select your country.");
      isValid = false;
    }

    if (occupation === "") {
      setOccupationError("Please select your occupation.");
      isValid = false;
    }

    if (salaryRange === "") {
      setSalaryError("Please select your income range.");
      isValid = false;
    }

    if (incomeFrequency === "") {
      setFrequencyError("Please select your income frequency.");
      isValid = false;
    }

    if (incomeSource === "") {
      setSourceError("Please select your primary income source.");
      isValid = false;
    }

    if (obligationType === "") {
      setObligationTypeError("Please select your financial obligation.");
      isValid = false;
    }

    if (obligationAmount.trim() === "") {
      setObligationAmountError("Obligation amount is required.");
      isValid = false;
    } else if (Number(obligationAmount) < 0) {
      setObligationAmountError("Amount cannot be negative.");
      isValid = false;
    }

    if (isValid) {
      const profileData = {
        age: Number(age),
        country,
        occupation,
        salaryRange,
        incomeFrequency,
        incomeSource,
        obligationType,
        obligationAmount: Number(obligationAmount),
      };

      setProfile(profileData);
<<<<<<< HEAD
      window.location.href = "/plan-setup";
=======
      navigate("/plan-setup");
>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
    }
  };

  return (
    <div className="flowPage">
      <main className="flowWrapper">
        <section className="formCard largeCard profileCard">
          <div className="stepHeader centerHeader">
            <span className="stepTag">Step 2 of 5</span>
            <h1 className="pageTitle">Your Financial Profile</h1>
            <p className="pageSubtitle">
              Tell us a little about your background so FinanceFlow can build a
              more personalized setup.
            </p>
          </div>

          <form className="mainForm profileForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setAgeError("");
                }}
                className={ageError ? "inputError" : ""}
              />
              <small className="errorMsg">{ageError}</small>
            </div>

            <div className="inputGroup">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCountryError("");
                }}
                className={countryError ? "inputError" : ""}
              >
                <option value="">Select your country</option>
                <option>Saudi Arabia</option>
                <option>UAE</option>
                <option>Kuwait</option>
                <option>Qatar</option>
                <option>Bahrain</option>
                <option>Other</option>
              </select>
              <small className="errorMsg">{countryError}</small>
            </div>

            <div className="inputGroup">
              <label htmlFor="occupation">Occupation</label>
              <select
                id="occupation"
                name="occupation"
                value={occupation}
                onChange={(e) => {
                  setOccupation(e.target.value);
                  setOccupationError("");
                }}
                className={occupationError ? "inputError" : ""}
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
              <small className="errorMsg">{occupationError}</small>
            </div>

            <div className="inputGroup">
              <label htmlFor="salary-range">Monthly Income Range</label>
              <select
                id="salary-range"
                name="salary-range"
                value={salaryRange}
                onChange={(e) => {
                  setSalaryRange(e.target.value);
                  setSalaryError("");
                }}
                className={salaryError ? "inputError" : ""}
              >
                <option value="">Select your income range</option>
                <option>Less than $1,000</option>
                <option>$1,000 - $3,000</option>
                <option>$3,001 - $5,000</option>
                <option>$5,001 - $10,000</option>
                <option>$10,000+</option>
              </select>
              <small className="errorMsg">{salaryError}</small>
            </div>

            <div className="inputGroup">
              <label htmlFor="income-frequency">Income Frequency</label>
              <select
                id="income-frequency"
                name="income-frequency"
                value={incomeFrequency}
                onChange={(e) => {
                  setIncomeFrequency(e.target.value);
                  setFrequencyError("");
                }}
                className={frequencyError ? "inputError" : ""}
              >
                <option value="">Select income frequency</option>
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Irregular</option>
              </select>
              <small className="errorMsg">{frequencyError}</small>
            </div>

            <div className="inputGroup">
              <label htmlFor="income-source">Primary Income Source</label>
              <select
                id="income-source"
                name="income-source"
                value={incomeSource}
                onChange={(e) => {
                  setIncomeSource(e.target.value);
                  setSourceError("");
                }}
                className={sourceError ? "inputError" : ""}
              >
                <option value="">Select primary income source</option>
                <option>Salary</option>
                <option>Business</option>
                <option>Freelance</option>
                <option>Allowance / Family Support</option>
                <option>Investments</option>
                <option>Other</option>
              </select>
              <small className="errorMsg">{sourceError}</small>
            </div>

            <div className="inputGroup">
              <label htmlFor="obligation-type">Main Financial Obligation</label>
              <select
                id="obligation-type"
                name="obligation-type"
                value={obligationType}
                onChange={(e) => {
                  setObligationType(e.target.value);
                  setObligationTypeError("");
                }}
                className={obligationTypeError ? "inputError" : ""}
              >
                <option value="">Select obligation type</option>
                <option>Rent</option>
                <option>Loan Payment</option>
                <option>Credit Card Debt</option>
                <option>Family Support</option>
                <option>Utilities</option>
                <option>Other</option>
              </select>
              <small className="errorMsg">{obligationTypeError}</small>
            </div>

            <div className="inputGroup">
              <label htmlFor="obligation-amount">Obligation Amount</label>
              <input
                type="number"
                id="obligation-amount"
                name="obligation-amount"
                placeholder="Enter amount"
                value={obligationAmount}
                onChange={(e) => {
                  setObligationAmount(e.target.value);
                  setObligationAmountError("");
                }}
                className={obligationAmountError ? "inputError" : ""}
              />
              <small className="errorMsg">{obligationAmountError}</small>
            </div>

<<<<<<< HEAD
            <div className="actionRow">
=======
            <div className="actionRow dualButtons">
              <button
                type="button"
                className="secondaryBtn"
                onClick={() => navigate("/questionnaire")}
              >
                ← Back
              </button>

>>>>>>> 92a676f6264e54ecb3852a022cfed519409f8c67
              <button type="submit" className="primaryBtn">
                Next
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}