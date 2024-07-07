document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('farmerDetailsForm');
    const resetButton = document.getElementById('resetButton');

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
        const district = document.getElementById('district').value;
        const tehsil = document.getElementById('tehsil').value;
        const panchayat = document.getElementById('panchayat').value;
        const village = document.getElementById('village').value;
        const phone_number = document.getElementById('mobileNumber').value;

        if (!/^[A-Za-z ]+$/.test(name)) {
            return false;
        }

        if (!/^[A-Za-z0-9 ]+$/.test(district)) {
            return false;
        }

        if (!/^[A-Za-z0-9 ]+$/.test(tehsil)) {
            return false;
        }

        if (!/^[A-Za-z0-9 ]+$/.test(panchayat)) {
            return false;
        }

        if (!/^[A-Za-z0-9 ]+$/.test(village)) {
            return false;
        }

        if (!/^[6-9]\d{9}$/.test(phone_number)) {
            return false;
        }

        return true;
    }

    function submitFormData() {
        const myHeaders = new Headers({
            "Content-Type": "application/json"
        });

        const formData = {
            name: document.getElementById('farmerName').value,
            district: document.getElementById('district').value,
            tehsil: document.getElementById('tehsil').value,
            panchayat: document.getElementById('panchayat').value,
            village: document.getElementById('village').value,
            phone_number: document.getElementById('mobileNumber').value,
            status: "Registered"
        };

        fetch('http://51.20.67.103:8080/sign-in', {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 500) {
                        throw new Error('Farmer is already registered');
                    } else {
                        throw new Error('Network response was not ok');
                    }
                }
                return response.json(); // Assuming backend returns JSON response
            })
            .then(result => {
                console.log(result); // Log the response if needed
                alert("Farmer registered successfully!");
                window.location.href = 'ka.html';
            })
            .catch(error => {
                console.error(error);
                alert("Error: " + error.message);
            });
    }


    window.addEventListener('load', function () {
        form.reset();
        document.getElementById('status').textContent = '';
    });
});
