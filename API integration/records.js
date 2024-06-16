document.addEventListener('DOMContentLoaded', function () {
    // Function to get query parameter from URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Example usage to get CATTLE_ID
    const cattleId = getQueryParam('CATTLE_ID');
    if (!cattleId) {
        alert("Error: CATTLE_ID is missing. Please go back and select a cattle.");
        window.location.href = 'cow.html';
        return;
    }

    // Now you can use 'cattleId' in your code
    console.log('Selected Cattle ID:', cattleId);

    const form = document.getElementById('newRecordsForm');
    const submitButton = document.getElementById('submitButton');
    const oldRecordsTable = document.getElementById('oldRecordsTable').getElementsByTagName('tbody')[0];
    const resetButton = document.getElementById('resetButton');
    const backBtn = document.getElementById('backButton');
    const forwardBtn = document.getElementById('forwardButton');
    const pageSize = 5;
    let currentPage = 0;

    // Event listeners
    resetButton.addEventListener('click', () => form.reset());
    submitButton.addEventListener('click', submitForm);
    backBtn.addEventListener('click', navigateBack);
    forwardBtn.addEventListener('click', navigateForward);

    // Set today's date as max value for the Date input field
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('Date').setAttribute('max', formattedDate);

    // Initial display of old records
    displayOldRecords(0);
    updatePageInfo();

    // Functions

    function submitForm(event) {
        event.preventDefault();
        if (validateForm()) {
            const data = {
                date: document.getElementById('Date').value,
                dry_bait: document.getElementById('sukha').value,
                green_bait: document.getElementById('haraChara').value,
                khal: document.getElementById('khal').value,
                churi: document.getElementById('choori').value,
                rest: document.getElementById('others').value,
                krishak_feed: document.getElementById('krishakFeed').value,
                milk: document.getElementById('doodh').value,
                fat: document.getElementById('fat').value,
                snf: document.getElementById('snf').value,
                gobar: document.getElementById('gobar').value,
                comment: document.getElementById('comment').value
            };

            const url = new URL('http://51.20.67.103:8080/stat/daily');
            url.searchParams.append('cattleId', cattleId); // Append cattleId as query parameter    

            const myHeaders = new Headers();
            myHeaders.append("USER_EXTERNAL_ID", localStorage.getItem('userExternalId'));
            myHeaders.append("Content-Type", "application/json");

            console.log('Data to be sent:', data);

            fetch(url, {  // Use the url variable that has the cattleId appended as query parameter
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.ok) {
                        displayOldRecords(currentPage); // Refresh the records table
                        displaySuccessMessage();
                        form.reset();
                    } else {
                        throw new Error('Failed to save data');
                    }
                })
                .catch(error => displayErrorMessage(error));
        } else {
            displayErrorMessage('Please fill out all required fields with valid values.');
        }
    }

    function validateForm() {
        const inputs = document.querySelectorAll('#newRecordsForm input, #newRecordsForm textarea');
        for (let input of inputs) {
            if (input.value.trim() === '' || (input.type === 'number' && isNaN(input.value))) {
                input.classList.add('error-input');
                return false;
            } else {
                input.classList.remove('error-input');
            }
        }
        return true;
    }

    function displayOldRecords(startIndex) {
        const myHeaders = new Headers();
        myHeaders.append("USER_EXTERNAL_ID", localStorage.getItem('userExternalId'));

        fetch(`http://51.20.67.103:8080/stat/daily/fetch?cattleId=${cattleId}`, {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        })
            .then(response => response.json())
            .then(result => {
                oldRecordsTable.innerHTML = '';
                for (let i = startIndex; i < Math.min(startIndex + pageSize, result.data.length); i++) {
                    const item = result.data[i];
                    const datePart = item.date ? item.date.split('T')[0] : '';
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${datePart}</td>
                        <td>${item.dryBait}</td>
                        <td>${item.greenBait}</td>
                        <td>${item.khal}</td>
                        <td>${item.churi}</td>
                        <td>${item.rest}</td>
                        <td>${item.krishakFeed}</td>
                        <td>${item.milk}</td>
                        <td>${item.fat}</td>
                        <td>${item.snf}</td>
                        <td>${item.gobar}</td>
                        <td>${item.comment}</td>
                    `;
                    oldRecordsTable.appendChild(newRow);
                }
            })
            .catch(error => console.error(error));
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
            displayOldRecords(currentPage);
            updatePageInfo();
        }
    }

    function navigateForward() {
        const myHeaders = new Headers();
        myHeaders.append("USER_EXTERNAL_ID", localStorage.getItem('userExternalId'));

        fetch(`http://51.20.67.103:8080/stat/daily/fetch?cattleId=${cattleId}`, {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        })
            .then(response => response.json())
            .then(result => {
                if (currentPage + pageSize < result.data.length) {
                    currentPage += pageSize;
                    displayOldRecords(currentPage);
                    updatePageInfo();
                }
            })
            .catch(error => console.error(error));
    }

    function displaySuccessMessage() {
        const popupSuccess = document.getElementById('popupSuccess');
        popupSuccess.style.display = 'block';
        setTimeout(() => {
            popupSuccess.classList.add('auto-fade');
        }, 3000);
    }

    function displayErrorMessage(message) {
        console.error('Error:', message);
        const popupError = document.getElementById('popupError');
        popupError.style.display = 'block';
        setTimeout(() => {
            popupError.classList.add('auto-fade');
        }, 3000);
    }
});
