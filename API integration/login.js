document.addEventListener("DOMContentLoaded", function () {
    const loginText = document.querySelector(".title-text .login");
    const loginForm = document.querySelector("form.login");
    const loginBtn = document.querySelector("label.login");
    const signupBtn = document.querySelector("label.signup");
    const signupLink = document.querySelector("form .signup-link a");
    const errorMessage = document.querySelector(".error-message");
    const sliderTab = document.querySelector(".slider-tab");

    // Define displayErrorMessage function
    const displayErrorMessage = (message) => {
        errorMessage.textContent = message;
    };

    // Validate phone number
    const validatePhoneNumber = (phoneNumber) => {
        if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
            alert("Please enter a valid 10-digit phone number");
            return false;
        }
        return true;
    };

    // Function to handle signup link click
    const handleSignupLinkClick = (event) => {
        event.preventDefault(); // Prevent the default behavior of the link
        console.log("Signup link clicked"); // Debugging
        moveSliderToSignup();
        errorMessage.textContent = ""; // Clear any previous error messages
    };

    // Attach event listener to the signup link
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
        console.log("Password field ID:", passwordFieldId);
        const passwordField = document.getElementById(passwordFieldId);
        console.log("Password field:", passwordField);
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

    // Attach event listeners to toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(item => {
        item.addEventListener('click', event => {
            console.log("Eye icon clicked"); // Debugging
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
            return; // Return if phone number is invalid
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

        fetch('http://localhost:8080/sign-up', {
            method: 'POST',
            headers: myHeaders,
            body: raw
        })
            .then((response) => {
                if (response.status === 200) {
                    displayErrorMessage("User is now registered!");
                } else if (response.status === 500) {
                    displayErrorMessage("Phone number already exists. Please login instead.");
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
        event.preventDefault(); // Prevent default form submission
        const phoneNumber = document.getElementById("login-phone").value;
        const password = document.getElementById("login-password").value;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "phone_number": phoneNumber,
            "password": password
        });

        fetch('http://localhost:8080/log-in', {
            method: 'POST',
            headers: myHeaders,
            body: raw
        })
            .then((response) => {
                if (response.status === 200) {
                    // Redirect the user to ka.html if login is successful
                    window.location.href = "ka.html";
                } else if (response.status === 500) {
                    // Handle authentication failure
                    alert("Invalid phone number or password.");
                } else {
                    // Handle other errors
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


    // Event listener for signup submit button
    document.getElementById("signup-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission
        handleSignup(); // Call the handleSignup function
    });

    // Event listener for login submit button
    document.getElementById("login-submit").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission
        handleLogin(event); // Call the handleLogin function and pass the event object
    });
});
