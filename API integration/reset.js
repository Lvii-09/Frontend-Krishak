// Function to fetch security question based on phone number
const fetchSecurityQuestion = async (phoneNumber) => {
    try {
        const response = await fetch(`http://51.20.67.103:8080/info/user?phoneNumber=${phoneNumber}`);
        if (!response.ok) {
            throw new Error("Failed to fetch security question. Please try again.");
        }
        const userInfo = await response.json();
        return userInfo.securityQuestion;
    } catch (error) {
        throw new Error("Failed to fetch security question. Please try again.");
    }
};

// Toggle visibility of password
const togglePasswordIcons = document.querySelectorAll(".toggle-password");
togglePasswordIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        const passwordInput = document.querySelector(`#${icon.getAttribute("toggle")}`);
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        icon.querySelector("i").classList.toggle("fa-eye-slash");
    });
});

// Phone number validation and fetch security question
document.getElementById("reset-phone").addEventListener("input", async function () {
    const phone = this.value;
    const phonePattern = /^[6789]\d{9}$/;
    const errorMessage = document.querySelector(".error-message");
    const securityQuestionInput = document.getElementById("reset-security-question");

    if (!phonePattern.test(phone)) {
        errorMessage.textContent = "Phone number must start with 9, 8, 7, or 6 and be 10 digits long.";
        securityQuestionInput.value = "";
        return;
    }

    errorMessage.textContent = "";

    try {
        const securityQuestion = await fetchSecurityQuestion(phone);
        securityQuestionInput.value = securityQuestion;
    } catch (error) {
        errorMessage.textContent = error.message;
        securityQuestionInput.value = "";
    }
});

// Handle form submission for password reset
const resetForm = document.querySelector("form.reset");
resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("reset-phone").value;
    const securityQuestion = document.getElementById("reset-security-question").value;
    const securityAnswer = document.getElementById("reset-security-answer").value;
    const newPassword = document.getElementById("reset-password").value;
    const confirmPassword = document.getElementById("reset-confirm-password").value;
    const errorMessage = document.querySelector(".error-message");

    const phonePattern = /^[6789]\d{9}$/;

    if (!phonePattern.test(phone)) {
        errorMessage.textContent = "Phone number must start with 9, 8, 7, or 6 and be 10 digits long.";
        return;
    }

    // Validate security answer against the retrieved security question
    if (!securityQuestion || !securityAnswer) {
        errorMessage.textContent = "Please enter both security question and answer.";
        return;
    }

    // Validate new password and confirm password match
    if (newPassword !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }

    const body = {
        phoneNumber: phone,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        newPassword: newPassword
    };

    try {
        const response = await fetch('http://51.20.67.103:8080/reset-password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Password reset successful! Please login.");
            console.log("Password reset successful:", data);
            // Redirect to the login page after successful password reset
            window.location.href = "login.html";
        } else {
            alert("Password reset failed. Please try again.");
            console.error("Password reset failed:", data);
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = "An unexpected error occurred. Please try again later.";
    }
});
