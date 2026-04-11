const profileForm = document.getElementById("profileForm");

const age = document.getElementById("age");
const country = document.getElementById("country");
const occupation = document.getElementById("occupation");
const salaryRange = document.getElementById("salary-range");
const incomeFrequency = document.getElementById("income-frequency");
const incomeSource = document.getElementById("income-source");
const obligationType = document.getElementById("obligation-type");
const obligationAmount = document.getElementById("obligation-amount");

const ageError = document.getElementById("ageError");
const countryError = document.getElementById("countryError");
const occupationError = document.getElementById("occupationError");
const salaryError = document.getElementById("salaryError");
const frequencyError = document.getElementById("frequencyError");
const sourceError = document.getElementById("sourceError");
const obligationTypeError = document.getElementById("obligationTypeError");
const obligationAmountError = document.getElementById("obligationAmountError");

profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    let isValid = true;

    if (age.value.trim() === "") {
        showError(age, ageError, "Age is required.");
        isValid = false;
    } else if (Number(age.value) < 16) {
        showError(age, ageError, "Age must be 16 or older.");
        isValid = false;
    }

    if (country.value === "") {
        showError(country, countryError, "Please select your country.");
        isValid = false;
    }

    if (occupation.value === "") {
        showError(occupation, occupationError, "Please select your occupation.");
        isValid = false;
    }

    if (salaryRange.value === "") {
        showError(salaryRange, salaryError, "Please select your income range.");
        isValid = false;
    }

    if (incomeFrequency.value === "") {
        showError(incomeFrequency, frequencyError, "Please select your income frequency.");
        isValid = false;
    }

    if (incomeSource.value === "") {
        showError(incomeSource, sourceError, "Please select your primary income source.");
        isValid = false;
    }

    if (obligationType.value === "") {
        showError(obligationType, obligationTypeError, "Please select your financial obligation.");
        isValid = false;
    }

    if (obligationAmount.value.trim() === "") {
        showError(obligationAmount, obligationAmountError, "Obligation amount is required.");
        isValid = false;
    } else if (Number(obligationAmount.value) < 0) {
        showError(obligationAmount, obligationAmountError, "Amount cannot be negative.");
        isValid = false;
    }

    if (isValid) {
        const profileData = {
            age: Number(age.value),
            country: country.value,
            occupation: occupation.value,
            salaryRange: salaryRange.value,
            incomeFrequency: incomeFrequency.value,
            incomeSource: incomeSource.value,
            obligationType: obligationType.value,
            obligationAmount: Number(obligationAmount.value)
        };

        setProfile(profileData);
        window.location.href = "plan-setup.html";
    }
});

function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add("inputError");
}

function clearErrors() {
    document.querySelectorAll(".errorMsg").forEach(error => {
        error.textContent = "";
    });

    document.querySelectorAll("input, select").forEach(field => {
        field.classList.remove("inputError");
    });
}

document.querySelectorAll("input, select").forEach(field => {
    field.addEventListener("input", function () {
        field.classList.remove("inputError");
        const error = field.parentElement.querySelector(".errorMsg");
        if (error) error.textContent = "";
    });

    field.addEventListener("change", function () {
        field.classList.remove("inputError");
        const error = field.parentElement.querySelector(".errorMsg");
        if (error) error.textContent = "";
    });
});