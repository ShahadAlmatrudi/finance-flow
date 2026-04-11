const planForm = document.getElementById("planForm");

const goalType = document.getElementById("goal-type");
const goalName = document.getElementById("goal-name");
const targetAmount = document.getElementById("target-amount");
const targetDate = document.getElementById("target-date");
const monthlySaving = document.getElementById("monthly-saving");
const savingAccount = document.getElementById("saving-account");
const autoTransfer = document.getElementById("auto-transfer");
const emergencyFund = document.getElementById("emergency-fund");

const goalTypeError = document.getElementById("goalTypeError");
const goalNameError = document.getElementById("goalNameError");
const targetAmountError = document.getElementById("targetAmountError");
const targetDateError = document.getElementById("targetDateError");
const monthlySavingError = document.getElementById("monthlySavingError");
const savingAccountError = document.getElementById("savingAccountError");
const categoriesError = document.getElementById("categoriesError");

const categoryChecks = document.querySelectorAll(".categoryCheck");

categoryChecks.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
        const targetId = checkbox.dataset.target;
        const input = document.getElementById(targetId);

        if (checkbox.checked) {
            input.disabled = false;
        } else {
            input.disabled = true;
            input.value = "";
            input.classList.remove("inputError");
        }

        categoriesError.textContent = "";
    });
});

planForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    let isValid = true;

    if (goalType.value === "") {
        showError(goalType, goalTypeError, "Please select a goal type.");
        isValid = false;
    }

    if (goalName.value.trim() === "") {
        showError(goalName, goalNameError, "Goal name is required.");
        isValid = false;
    }

    if (targetAmount.value.trim() === "") {
        showError(targetAmount, targetAmountError, "Target amount is required.");
        isValid = false;
    } else if (Number(targetAmount.value) <= 0) {
        showError(targetAmount, targetAmountError, "Target amount must be greater than 0.");
        isValid = false;
    }

    if (targetDate.value === "") {
        showError(targetDate, targetDateError, "Please choose a target date.");
        isValid = false;
    }

    if (monthlySaving.value.trim() === "") {
        showError(monthlySaving, monthlySavingError, "Monthly saving amount is required.");
        isValid = false;
    } else if (Number(monthlySaving.value) <= 0) {
        showError(monthlySaving, monthlySavingError, "Monthly saving must be greater than 0.");
        isValid = false;
    }

    if (savingAccount.value === "") {
        showError(savingAccount, savingAccountError, "Please select a saving account.");
        isValid = false;
    }

    const checkedCategories = document.querySelectorAll(".categoryCheck:checked");
    const categoriesData = [];

    if (checkedCategories.length === 0) {
        categoriesError.textContent = "Please select at least one spending category.";
        isValid = false;
    } else {
        checkedCategories.forEach((checkbox) => {
            const targetId = checkbox.dataset.target;
            const categoryName = checkbox.dataset.name;
            const input = document.getElementById(targetId);

            if (input.value.trim() === "") {
                input.classList.add("inputError");
                isValid = false;
            } else if (Number(input.value) <= 0) {
                input.classList.add("inputError");
                isValid = false;
            } else {
                categoriesData.push({
                    name: categoryName,
                    limit: Number(input.value)
                });
            }
        });

        if (!isValid && categoriesError.textContent === "") {
            categoriesError.textContent = "Enter a valid monthly limit for each selected category.";
        }
    }

    if (isValid) {
        const planData = {
            goalType: goalType.value,
            goalName: goalName.value.trim(),
            targetAmount: Number(targetAmount.value),
            targetDate: targetDate.value,
            monthlySaving: Number(monthlySaving.value),
            savingAccount: savingAccount.value,
            autoTransfer: autoTransfer.checked,
            emergencyFund: emergencyFund.checked,
            categories: categoriesData
        };

        setPlan(planData);
        window.location.href = "cards-setup.html";
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
        categoriesError.textContent = "";
    });

    field.addEventListener("change", function () {
        field.classList.remove("inputError");
        const error = field.parentElement.querySelector(".errorMsg");
        if (error) error.textContent = "";
        categoriesError.textContent = "";
    });
});