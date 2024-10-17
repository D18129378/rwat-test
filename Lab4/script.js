const referenceFile = 'data/reference.json';
const data3File = 'data/data3.json';

function clearTable() {
    document.querySelector('#student-table tbody').innerHTML = '';
}

function splitName(fullName) {
    const nameParts = fullName.split(' ');
    const surname = nameParts.pop(); 
    const name = nameParts.join(' ');  
    return { name, surname };
}

function displayData(students) {
    const tableBody = document.querySelector('#student-table tbody');
    students.forEach(student => {
        const { name, surname } = splitName(student.name);
        const row = `<tr>
            <td>${name}</td>
            <td>${surname}</td>
            <td>${student.id}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Implementation 1: Synchronous XMLHttpRequest
function fetchDataSync() {
    clearTable();
    
    function fetchSync(file) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file, false); // Synchronous request
        xhr.send(null);
        if (xhr.status === 200) {
            return JSON.parse(xhr.responseText);
        } else {
            console.error('Error fetching file:', file);
            return null;
        }
    }

    let allData = [];

    const referenceData = fetchSync(referenceFile);
    if (referenceData) {
        const data1 = fetchSync(`data/${referenceData.data_location}`);
        if (data1) {
            displayData(data1.data);
            allData = allData.concat(data1.data);

            const data2 = fetchSync(`data/${data1.data_location}`);
            if (data2) {
                displayData(data2.data);
                allData = allData.concat(data2.data);
            }
        }
    }

    const data3 = fetchSync(data3File);
    if (data3) {
        displayData(data3.data);
        allData = allData.concat(data3.data);
    }
}

// Implementation 2: Asynchronous XMLHttpRequest with Callbacks
function fetchDataAsync() {
    clearTable();

    function fetchAsync(file, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file, true); // Asynchronous request
        xhr.onload = function () {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                console.error('Error fetching file:', file);
                callback(null);
            }
        };
        xhr.send();
    }

    let allData = [];

    fetchAsync(referenceFile, function (referenceData) {
        if (referenceData) {
            fetchAsync(`data/${referenceData.data_location}`, function (data1) {
                if (data1) {
                    displayData(data1.data);
                    allData = allData.concat(data1.data);

                    fetchAsync(`data/${data1.data_location}`, function (data2) {
                        if (data2) {
                            displayData(data2.data);
                            allData = allData.concat(data2.data);
                        }

                        fetchAsync(data3File, function (data3) {
                            if (data3) {
                                displayData(data3.data);
                                allData = allData.concat(data3.data);
                            }
                        });
                    });
                }
            });
        }
    });
}

// Implementation 3: fetch() with Promises
function fetchDataWithFetch() {
    clearTable();

    function fetchJson(file) {
        return fetch(file).then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load file: ${file}`);
            }
            return response.json();
        });
    }

    let allData = [];

    fetchJson(referenceFile)
        .then(referenceData => {
            return fetchJson(`data/${referenceData.data_location}`);
        })
        .then(data1 => {
            displayData(data1.data);
            allData = allData.concat(data1.data);

            return fetchJson(`data/${data1.data_location}`);
        })
        .then(data2 => {
            displayData(data2.data);
            allData = allData.concat(data2.data);

            return fetchJson(data3File);
        })
        .then(data3 => {
            displayData(data3.data);
            allData = allData.concat(data3.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
