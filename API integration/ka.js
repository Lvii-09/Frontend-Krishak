document.addEventListener('DOMContentLoaded', function () {
    const phoneNumberForm = document.getElementById('phoneNumberForm');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const statusElement = document.getElementById('status');

    // Add event listener to the form submission
    phoneNumberForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Clear previous status
        statusElement.textContent = '';

        // Get the phone number from the input field
        const phoneNumber = phoneNumberInput.value.trim();

        // Validate phone number
        if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
            alert("Please enter a valid 10-digit phone number");
            phoneNumberInput.value = ''; // Clear input field
            return;
        }

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        const url = `http://51.20.67.103:8080/info/user?phoneNumber=${phoneNumber}`;

        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Farmer is not registered');
                }
                return response.json();
            })
            .then(data => {
                const userExternalId = data.externalId;
                localStorage.setItem('userExternalId', userExternalId);

                if (data.status === 'Registered') {
                    window.location.href = 'cow.html';
                } else {
                    statusElement.textContent = `Farmer is ${data.status}`;
                }
            })
            .catch(error => {
                statusElement.textContent = error.message;
                console.error(error);
            });
    });

    // Reset form and status on page reload or navigation
    window.addEventListener('load', function () {
        phoneNumberInput.value = ''; // Clear input field
        statusElement.textContent = ''; // Clear status message
    });
});
