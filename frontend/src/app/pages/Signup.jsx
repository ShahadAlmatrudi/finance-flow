const signupForm = document.getElementById("signupForm");

const fullname = document.getElementById("fullname");
const email = document.getElementById("signup-email");
const password = document.getElementById("signup-password");
const confirmPassword = document.getElementById("confirm-password");

const fullnameError = document.getElementById("fullnameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

signupForm.addEventListener("submit", function (event) {
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