document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cowDetailsForm');
    const oldRecordsTable = document.getElementById('cattleTable').getElementsByTagName('tbody')[0];
    const resetButton = document.getElementById('resetButton');
    const backBtn = document.getElementById('backButton');
    const forwardBtn = document.getElementById('forwardButton');
    const pageSize = 5;
    let currentPage = 0;

    backBtn.addEventListener('click', navigateBack);
    forwardBtn.addEventListener('click', navigateForward);
    resetButton.addEventListener('click', () => form.reset());

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            submitFormData();
        } else {
            alert('Please fill out all fields correctly.');
        }
    });

    displayOldCattle(0);
    updatePageInfo();

    function validateForm() {
        const tagId = document.getElementById('tagId').value;
        const species = document.getElementById('species').value;
        const deworming = document.querySelector('input[name="deworming"]:checked');
        const daysInMilk = document.getElementById('daysInMilk').value;

        if (!/^[A-Za-z0-9 ]+$/.test(tagId)) {
            return false;
        }

        if (species === '') {
            return false;
        }

        if (!deworming) {
            return false;
        }

        if (daysInMilk !== '' && (!Number.isInteger(Number(daysInMilk)) || Number(daysInMilk) < 0)) {
            return false;
        }

        return true;
    }

    function submitFormData() {
        const userExternalId = localStorage.getItem('userExternalId');
        if (!userExternalId) {
            alert("Error: User ID is missing. Please log in again.");
            window.location.href = 'login.html';
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("X-User-Id", userExternalId);
        myHeaders.append("Content-Type", "application/json");

        const dewormingValue = document.querySelector('input[name="deworming"]:checked').value;
        const dewormingBoolean = dewormingValue === "Yes";

        const raw = JSON.stringify({
            tagId: document.getElementById('tagId').value,
            species: document.getElementById('species').value,
            deworming: dewormingBoolean,
            daysInMilk: document.getElementById('daysInMilk').value,
        });

        fetch('http://51.20.67.103:8080/info/cattle', {
            method: 'POST',
            headers: myHeaders,
            body: raw
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // No need to parse response.json() here if you don't need to access the JSON body
                console.log('Submit Form Data Result:', response.statusText); // Log response status text
                alert("Cattle registered successfully!");
                // window.location.href = 'ka.html';
            })
            .catch((error) => {
                console.error('Submit Form Data Error:', error);
                alert("Cattle is already registered");
                // Log response details on error if needed
                if (error.response) {
                    console.log('Error Response Details:', error.response);
                }
            });
    }

    function displayOldCattle(startIndex) {
        const userExternalId = localStorage.getItem('userExternalId');
        const myHeaders = new Headers();
        myHeaders.append("X-User-Id", userExternalId);

        fetch(`http://51.20.67.103:8080/info/cattle?userId=${userExternalId}`, {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        })
            .then(response => response.json())
            .then(result => {
                oldRecordsTable.innerHTML = '';
                for (let i = startIndex; i < Math.min(startIndex + pageSize, result.length); i++) {
                    const item = result[i];
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${item.tagId}</td>
                    <td>${item.species}</td>
                    <td>${item.deworming ? 'Yes' : 'No'}</td>
                    <td>${item.daysInMilk}</td>
                    <td><button class="viewBtn" data-id="${item.id}">View</button></td>
                `;
                    oldRecordsTable.appendChild(newRow);
                }

                // Add event listeners for the View buttons
                const viewButtons = document.querySelectorAll('.viewBtn');
                viewButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const cattleId = this.getAttribute('data-id');
                        localStorage.setItem('selectedCattleId', cattleId); // Store cattle ID in local storage
                        window.location.href = `records.html?CATTLE_ID=${cattleId}`;
                    });
                });
            })
            .catch(error => console.error('Display Old Cattle Error:', error));
    }

    function updatePageInfo() {
        const pageNumber = Math.floor(currentPage / pageSize) + 1;
        const pageInfo = document.getElementById('pageInfo');
        if (pageInfo) {
            pageInfo.textContent = `Page ${pageNumber}`;
        }
    }

    function navigateBack() {
        if (currentPage > 0) {
            currentPage -= pageSize;
            displayOldCattle(currentPage);
            updatePageInfo();
        }
    }

    function navigateForward() {
        const userExternalId = localStorage.getItem('userExternalId');
        const myHeaders = new Headers();
        myHeaders.append("X-User-Id", userExternalId);

        fetch(`http://51.20.67.103:8080/info/cattle?userId=${userExternalId}`, {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        })
            .then(response => response.json())
            .then(result => {
                if (currentPage + pageSize < result.length) {
                    currentPage += pageSize;
                    displayOldCattle(currentPage);
                    updatePageInfo();
                }
            })
            .catch(error => console.error('Navigate Forward Error:', error));
    }
});
