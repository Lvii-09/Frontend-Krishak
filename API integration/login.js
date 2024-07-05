document.addEventListener("DOMContentLoaded", function () {
    const loginText = document.querySelector(".title-text .login");
    const loginForm = document.querySelector("form.login");
    const loginBtn = document.querySelector("label.login");
    const signupBtn = document.querySelector("label.signup");
    const signupLink = document.querySelector("form .signup-link a");
    const errorMessage = document.querySelector(".error-message");
    const sliderTab = document.querySelector(".slider-tab");

    const displayErrorMessage = (message) => {
        errorMessage.textContent = message;
    };

    const validatePhoneNumber = (phoneNumber) => {
        if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
            alert("Please enter a valid 10-digit phone number");
            return false;
        }
        return true;
    };

    const handleSignupLinkClick = (event) => {
        event.preventDefault();
        moveSliderToSignup();
        errorMessage.textContent = "";
    };

    signupLink.addEventListener("click", handleSignupLinkClick);

    const moveSliderToLogin = () => {
        loginForm.style.marginLeft = "0%";
        loginText.style.marginLeft = "0%";
        sliderTab.style.transform = "translateX(0%)";
    };

    const moveSliderToSignup = () => {
        loginForm.style.marginLeft = "-50%";
        loginText.style.marginLeft = "-50%";
        sliderTab.style.transform = "translateX(100%)";
    };

    const togglePasswordVisibility = (passwordFieldId, eyeIcon) => {
        const passwordField = document.getElementById(passwordFieldId);
        if (!passwordField) {
            console.error("Password field not found!");
            return;
        }

        if (passwordField.type === "password") {
            passwordField.type = "text";
            eyeIcon.classList.remove("fa-eye");
            eyeIcon.classList.add("fa-eye-slash");
        } else {
            passwordField.type = "password";
            eyeIcon.classList.remove("fa-eye-slash");
            eyeIcon.classList.add("fa-eye");
        }
    };

    document.querySelectorAll('.toggle-password').forEach(item => {
        item.addEventListener('click', event => {
            const passwordFieldId = item.getAttribute('toggle');
            const eyeIcon = item.querySelector('i');
            togglePasswordVisibility(passwordFieldId, eyeIcon);
        });
    });

    const handleSignup = () => {
        const phoneNumber = document.getElementById("signup-phone").value;
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;

        if (!validatePhoneNumber(phoneNumber)) {
            return;
        }

        if (!confirmPassword) {
            displayErrorMessage("Please confirm your password.");
            return;
        }

        if (password !== confirmPassword) {
            displayErrorMessage("Passwords do not match.");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "phone_number": phoneNumber,
            "password": password,
            "confirm_password": confirmPassword
        });

        fetch('http://51.20.67.103:8080/sign-up', {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        })
            .then((response) => {
                if (response.status === 200) {
                    displayErrorMessage("User is now registered!");
                } else if (response.status === 500) {
                    displayErrorMessage("Internal Server Error");
                } else {
                    displayErrorMessage("An unexpected error occurred. Please try again later.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                displayErrorMessage("An unexpected error occurred. Please try again later.");
            });
    };

    signupBtn.onclick = () => {
        moveSliderToSignup();
        errorMessage.textContent = "";
    };

    const handleLogin = (event) => {
        event.preventDefault();
        const phoneNumber = document.getElementById("login-phone").value;
        const password = document.getElementById("login-password").value;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "phone_number": phoneNumber,
            "password": password
        });

        fetch('http://51.20.67.103:8080/log-in', {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            // credentials: 'include'
        })
            .then((response) => {
                if (response.status === 200) {
                    window.location.href = "ka.html";
                } else if (response.status === 500) {
                    alert("Invalid phone number or password.");
                } else {
                    alert("An unexpected error occurred. Please try again later.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An unexpected error occurred. Please try again later.");
            });
    };

    loginBtn.onclick = (event) => {
        moveSliderToLogin();
        errorMessage.textContent = "";
    };

    document.getElementById("signup-submit").addEventListener("click", function (event) {
        event.preventDefault();
        handleSignup();
    });

    document.getElementById("login-submit").addEventListener("click", function (event) {
        event.preventDefault();
        handleLogin(event);
    });

    const resetPage = () => {
        loginForm.style.marginLeft = "0%";
        loginText.style.marginLeft = "0%";
        sliderTab.style.transform = "translateX(0%)";
        errorMessage.textContent = "";
        loginForm.reset();
    };

    window.onload = resetPage;
});
