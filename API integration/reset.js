const togglePasswordIcons = document.querySelectorAll(".toggle-password");

// Toggle visibility of password
togglePasswordIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        const passwordInput = document.querySelector(`#${icon.getAttribute("toggle")}`);
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        icon.querySelector("i").classList.toggle("fa-eye-slash");
    });
});

// Phone number validation
document.getElementById("reset-phone").addEventListener("input", function () {
    const phone = this.value;
    const phonePattern = /^[6789]\d{9}$/;
    const errorMessage = document.querySelector(".error-message");

    if (!phonePattern.test(phone)) {
        errorMessage.textContent = "Enter a valid phone number";
    } else {
        errorMessage.textContent = "";
    }
});

// Check if passwords match
const passwordInput = document.getElementById("reset-password");
const confirmPasswordInput = document.getElementById("reset-confirm-password");
const matchMessage = document.createElement("div");
matchMessage.className = "match-message";
confirmPasswordInput.parentElement.appendChild(matchMessage);

confirmPasswordInput.addEventListener("input", function () {
    if (passwordInput.value === confirmPasswordInput.value) {
        matchMessage.textContent = "Passwords match.";
        matchMessage.style.color = "green";
    } else {
        matchMessage.textContent = "Passwords do not match.";
        matchMessage.style.color = "red";
    }
});

// Handle form submission for reset
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

    if (newPassword !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return;
    }

    const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ phoneNumber: phone, securityQuestion: securityQuestion, securityAnswer: securityAnswer, newPassword: newPassword })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Password reset successful! Please login.");
        console.log("Password reset successful:", data);
        // Redirect to the login page after successful password reset
        window.location.href = "index.html";
    } else {
        alert("Password reset failed. Please try again.");
        console.error("Password reset failed:", data);
    }
});
