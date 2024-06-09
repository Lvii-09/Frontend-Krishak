document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cowDetailsForm');

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
        const tagId = document.getElementById('tagId').value;
        const farmerName = document.getElementById('farmerName').value;
        const address = document.getElementById('address').value;
        const mobileNumber = document.getElementById('mobileNumber').value;
        const species = document.getElementById('species').value;
        const deworming = document.querySelector('input[name="deworming"]:checked');

        // Tag ID validation (Alphanumeric)
        if (!/^[A-Za-z0-9 ]+$/.test(tagId)) {
            return false;
        }

        // Farmer's Name validation (Alphabetic)
        if (!/^[A-Za-z ]+$/.test(farmerName)) {
            return false;
        }

        // Address validation (Alphanumeric)
        if (!/^[A-Za-z0-9 ]+$/.test(address)) {
            return false;
        }

        // Mobile Number validation (10-digit starting with 6-9)
        if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            return false;
        }

        // Species validation (Not empty)
        if (species === '') {
            return false;
        }

        // Deworming validation (At least one option selected)
        if (!deworming) {
            return false;
        }

        // Optional: Days in Milk validation (Integer and non-negative)
        const daysInMilk = document.getElementById('daysInMilk').value;
        if (daysInMilk !== '' && (!Number.isInteger(Number(daysInMilk)) || Number(daysInMilk) < 0)) {
            return false;
        }

        return true; // If all validations pass
    }

    function submitFormData() {
        const userExternalId = localStorage.getItem('userExternalId');
        if (!userExternalId) {
            alert("Error: User ID is missing.");
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("X-User-Id", userExternalId);
        myHeaders.append("Content-Type", "application/json");

        const dewormingValue = document.querySelector('input[name="deworming"]:checked').value;
        const dewormingBoolean = dewormingValue === "Yes"; // Convert "Yes" to true, otherwise false

        const raw = JSON.stringify({
            tagId: document.getElementById('tagId').value,
            species: document.getElementById('species').value,
            deworming: dewormingBoolean, // Use the converted boolean value
            daysInMilk: document.getElementById('daysInMilk').value,
            farmerName: document.getElementById('farmerName').value,
            address: document.getElementById('address').value,
            phoneNumber: document.getElementById('mobileNumber').value
        });

        fetch('http://localhost:8080/info/cattle', {
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
                // Redirect to ka.html after showing the message
                window.location.href = 'ka.html';
            })
            .catch((error) => {
                console.error(error);
                alert("Error: Data was not sent to backend.");
            });
    }
});
