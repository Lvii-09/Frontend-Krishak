document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('farmerDetailsForm');
    const resetButton = document.getElementById('resetButton'); // Define the resetButton variable

    resetButton.addEventListener('click', () => form.reset());

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            submitFormData();
        } else {
            alert('Please fill out all fields correctly.');
        }
    });

    function validateForm() {
        const name = document.getElementById('farmerName').value;
        const address = document.getElementById('address').value;
        const phone_number = document.getElementById('mobileNumber').value;

        // Farmer's Name validation (Alphabetic)
        if (!/^[A-Za-z ]+$/.test(name)) {
            return false;
        }

        // Address validation (Alphanumeric)
        if (!/^[A-Za-z0-9 ]+$/.test(address)) {
            return false;
        }

        // Mobile Number validation (10-digit starting with 6-9)
        if (!/^[6-9]\d{9}$/.test(phone_number)) {
            return false;
        }

        return true; // If all validations pass
    }

    function submitFormData() {
        const userExternalId = localStorage.getItem('userExternalId');
        if (!userExternalId) {
            alert("Error: User ID is missing. Please log in again.");
            window.location.href = 'login.html'; // Redirect to login page
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("X-User-Id", userExternalId);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            name: document.getElementById('farmerName').value,
            address: document.getElementById('address').value,
            phone_number: document.getElementById('mobileNumber').value,
            status: "Registered" // Always set status to "Registered"
        });

        fetch('http://51.20.67.103:8080/sign-in', {
            method: 'POST',
            headers: myHeaders,
            body: raw
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((result) => {
                // Show success message
                alert("Farmer registered successfully!");
                // Redirect to cow.html after showing the message
                window.location.href = 'ka.html';
            })
            .catch((error) => {
                console.error(error);
                alert("Error: Data was not sent to backend.");
            });
    }

    // Reset form and status on page load or navigation back to this page
    window.addEventListener('load', function () {
        form.reset(); // Reset the form fields
        document.getElementById('status').textContent = ''; // Clear status message
    });
});
