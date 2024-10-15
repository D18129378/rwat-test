// Paths to GitHub-hosted JSON files
const baseURL = 'https://d18129378.github.io/rwat-test/';  // Base URL of your GitHub Pages

const referenceFilePath = baseURL + 'data/reference.json';  // Absolute path to the reference.json
const data3FilePath = baseURL + 'data/data3.json';  // Known file (absolute path)

// Function to append row to the table
function appendRowToTable(name, surname, id) {
    const tableBody = document.getElementById("dataBody");
    const row = tableBody.insertRow();
    row.insertCell(0).innerText = name;
    row.insertCell(1).innerText = surname;
    row.insertCell(2).innerText = id;
}

// Helper function to process and display data
function processData(data) {
    data.forEach(student => {
        const [name, surname] = student.name.split(" ");
        appendRowToTable(name, surname, student.id);
    });
}

// Synchronous XMLHttpRequest
function fetchSynchronously() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', referenceFilePath, false);  // Synchronous request
    xhr.send();
    const reference = JSON.parse(xhr.responseText);

    const xhrData1 = new XMLHttpRequest();
    xhrData1.open('GET', baseURL + `data/${reference.data_location}`, false);  // Absolute path for data1
    xhrData1.send();
    const data1 = JSON.parse(xhrData1.responseText);
    processData(data1.data);

    const xhrData2 = new XMLHttpRequest();
    xhrData2.open('GET', baseURL + `data/${data1.data_location}`, false);  // Absolute path for data2
    xhrData2.send();
    const data2 = JSON.parse(xhrData2.responseText);
    processData(data2.data);

    const xhrData3 = new XMLHttpRequest();
    xhrData3.open('GET', data3FilePath, false);  // Absolute path for data3
    xhrData3.send();
    const data3 = JSON.parse(xhrData3.responseText);
    processData(data3.data);
}

// Asynchronous XMLHttpRequest with callbacks
function fetchAsynchronously() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', referenceFilePath, true);
    xhr.onload = function () {
        const reference = JSON.parse(xhr.responseText);

        const xhrData1 = new XMLHttpRequest();
        xhrData1.open('GET', baseURL + `data/${reference.data_location}`, true);
        xhrData1.onload = function () {
            const data1 = JSON.parse(xhrData1.responseText);
            processData(data1.data);

            const xhrData2 = new XMLHttpRequest();
            xhrData2.open('GET', baseURL + `data/${data1.data_location}`, true);
            xhrData2.onload = function () {
                const data2 = JSON.parse(xhrData2.responseText);
                processData(data2.data);

                const xhrData3 = new XMLHttpRequest();
                xhrData3.open('GET', data3FilePath, true);
                xhrData3.onload = function () {
                    const data3 = JSON.parse(xhrData3.responseText);
                    processData(data3.data);
                };
                xhrData3.send();
            };
            xhrData2.send();
        };
        xhrData1.send();
    };
    xhr.send();
}

// Fetch using promises
function fetchUsingPromises() {
    fetch(referenceFilePath)
        .then(response => response.json())
        .then(reference => {
            return fetch(baseURL + `data/${reference.data_location}`);
        })
        .then(response => response.json())
        .then(data1 => {
            processData(data1.data);
            return fetch(baseURL + `data/${data1.data_location}`);
        })
        .then(response => response.json())
        .then(data2 => {
            processData(data2.data);
            return fetch(data3FilePath);
        })
        .then(response => response.json())
        .then(data3 => {
            processData(data3.data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Event listeners for buttons
document.getElementById('syncButton').addEventListener('click', fetchSynchronously);
document.getElementById('asyncButton').addEventListener('click', fetchAsynchronously);
document.getElementById('fetchButton').addEventListener('click', fetchUsingPromises);
