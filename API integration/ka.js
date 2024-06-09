document.addEventListener('DOMContentLoaded', function () {
document.getElementById('phoneNumberForm').addEventListener('submit', function (event) {
event.preventDefault(); // Prevent default form submission

        // Clear previous status
        document.getElementById('status').textContent = '';

        // Get the phone number from the input field
        const phoneNumberInput = document.getElementById('phoneNumber');
        const phoneNumber = phoneNumberInput.value;

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

        const url = `http://localhost:8080/info/user?phoneNumber=${phoneNumber}`;

        fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('User is not registered');
                }
                return response.json();
            })
            .then(data => {
                
                const userExternalId = data.externalId;

                localStorage.setItem('userExternalId', userExternalId);
                if (data.status === 'active' || data.status === 'registered' || data.status === 'Active') {
                    window.location.href = 'records.html';
                } else {
                    document.getElementById('status').textContent = `User is ${data.status}`;
                }
            })
            .catch(error => {
                document.getElementById('status').textContent = error.message;
                console.error(error);
            });
    });
});
