// Function to display data in the table
function displayData(data) {
  const tableBody = document.querySelector("#data-table tbody");
  tableBody.innerHTML = ''; // Clear existing table data

  data.forEach(item => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const surnameCell = document.createElement('td');
      const idCell = document.createElement('td');

      const [firstName, lastName] = item.name.split(' ');

      nameCell.textContent = firstName;
      surnameCell.textContent = lastName;
      idCell.textContent = item.id;

      row.appendChild(nameCell);
      row.appendChild(surnameCell);
      row.appendChild(idCell);

      tableBody.appendChild(row);
  });
}

// Fetch and merge data in sequence
function fetchAndStitchData() {
  // Fetch data1.json
  fetch('data1.json')
      .then(response => response.json())
      .then(data1 => {
          const data = data1.data;

          // Fetch data2.json after data1
          return fetch('data2.json')
              .then(response => response.json())
              .then(data2 => {
                  data.push(...data2.data);  // Merge data1 and data2

                  // Fetch data3.json after data2
                  return fetch('data3.json')
                      .then(response => response.json())
                      .then(data3 => {
                          data.push(...data3.data);  // Merge all three
                          return data;
                      });
              });
      })
      .then(mergedData => {
          displayData(mergedData);  // Display all merged data
      })
      .catch(error => console.error('Error:', error));
}

// Function to handle synchronous XMLHttpRequest
function fetchDataSync() {
  let data = [];

  // Synchronous fetch for data1.json
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'data1.json', false);  // Sync call
  xhr.send();

  if (xhr.status === 200) {
      const jsonData = JSON.parse(xhr.responseText);
      data = data.concat(jsonData.data);
  }

  // Synchronous fetch for data2.json
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'data2.json', false);  // Sync call
  xhr.send();

  if (xhr.status === 200) {
      const jsonData = JSON.parse(xhr.responseText);
      data = data.concat(jsonData.data);
  }

  // Synchronous fetch for data3.json
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'data3.json', false);  // Sync call
  xhr.send();

  if (xhr.status === 200) {
      const jsonData = JSON.parse(xhr.responseText);
      data = data.concat(jsonData.data);
  }

  displayData(data);
}

// Function to handle asynchronous XMLHttpRequest
function fetchDataAsync() {
  let data = [];

  const xhr1 = new XMLHttpRequest();
  xhr1.open('GET', 'data1.json', true);
  xhr1.onload = function () {
      if (xhr1.status === 200) {
          const jsonData = JSON.parse(xhr1.responseText);
          data = data.concat(jsonData.data);

          const xhr2 = new XMLHttpRequest();
          xhr2.open('GET', 'data2.json', true);
          xhr2.onload = function () {
              if (xhr2.status === 200) {
                  const jsonData2 = JSON.parse(xhr2.responseText);
                  data = data.concat(jsonData2.data);

                  const xhr3 = new XMLHttpRequest();
                  xhr3.open('GET', 'data3.json', true);
                  xhr3.onload = function () {
                      if (xhr3.status === 200) {
                          const jsonData3 = JSON.parse(xhr3.responseText);
                          data = data.concat(jsonData3.data);

                          displayData(data);  // Display all data after all async calls complete
                      }
                  };
                  xhr3.send();
              }
          };
          xhr2.send();
      }
  };
  xhr1.send();
}

// Function to handle Fetch API with Promises
function fetchDataWithFetch() {
  fetchAndStitchData();  // Using the fetchAndStitchData function
}
