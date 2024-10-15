// Helper function to display data in the table
function displayData(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Clear previous data
  
    data.forEach(student => {
      const row = document.createElement('tr');
      const firstName = student.name.split(' ')[0];
      const lastName = student.name.split(' ')[1];
      const id = student.id;
  
      row.innerHTML = `
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${id}</td>
      `;
  
      tableBody.appendChild(row);
    });
  }
  
  // Synchronous XMLHttpRequest
  function synchronousXHR() {
    const data = [];
  
    // Fetch reference.json synchronously
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/reference.json', false);  // Synchronous call
    xhr.send();
  
    if (xhr.status === 200) {
      const reference = JSON.parse(xhr.responseText);
  
      // Fetch data1.json (unknown filename) synchronously
      const xhrData1 = new XMLHttpRequest();
      xhrData1.open('GET', `data/${reference.data_location}`, false); // Synchronous
      xhrData1.send();
  
      if (xhrData1.status === 200) {
        const data1 = JSON.parse(xhrData1.responseText);
        data.push(...data1.data);
  
        // Fetch data2.json synchronously
        const xhrData2 = new XMLHttpRequest();
        xhrData2.open('GET', `data/${data1.data_location}`, false); // Synchronous
        xhrData2.send();
  
        if (xhrData2.status === 200) {
          const data2 = JSON.parse(xhrData2.responseText);
          data.push(...data2.data);
        }
      }
    }
  
    // Fetch data3.json (known filename)
    const xhrData3 = new XMLHttpRequest();
    xhrData3.open('GET', 'data/data3.json', false); // Synchronous
    xhrData3.send();
  
    if (xhrData3.status === 200) {
      const data3 = JSON.parse(xhrData3.responseText);
      data.push(...data3.data);
    }
  
    displayData(data);
  }
  
  // Asynchronous XMLHttpRequest with Callbacks
  function asynchronousXHR() {
    let data = [];
  
    // Fetch reference.json
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/reference.json', true);  // Asynchronous
    xhr.onload = function() {
      if (xhr.status === 200) {
        const reference = JSON.parse(xhr.responseText);
  
        // Fetch data1.json asynchronously
        const xhrData1 = new XMLHttpRequest();
        xhrData1.open('GET', `data/${reference.data_location}`, true);
        xhrData1.onload = function() {
          if (xhrData1.status === 200) {
            const data1 = JSON.parse(xhrData1.responseText);
            data.push(...data1.data);
  
            // Fetch data2.json asynchronously
            const xhrData2 = new XMLHttpRequest();
            xhrData2.open('GET', `data/${data1.data_location}`, true);
            xhrData2.onload = function() {
              if (xhrData2.status === 200) {
                const data2 = JSON.parse(xhrData2.responseText);
                data.push(...data2.data);
  
                // Fetch data3.json asynchronously
                const xhrData3 = new XMLHttpRequest();
                xhrData3.open('GET', 'data/data3.json', true);
                xhrData3.onload = function() {
                  if (xhrData3.status === 200) {
                    const data3 = JSON.parse(xhrData3.responseText);
                    data.push(...data3.data);
                    displayData(data);
                  }
                };
                xhrData3.send();
              }
            };
            xhrData2.send();
          }
        };
        xhrData1.send();
      }
    };
    xhr.send();
  }
  
  // Fetch API with Promises
  function fetchWithPromises() {
    let data = [];
  
    // Fetch reference.json
    fetch('data/reference.json')
      .then(response => response.json())
      .then(reference => {
        // Fetch data1.json using the reference
        return fetch(`data/${reference.data_location}`);
      })
      .then(response => response.json())
      .then(data1 => {
        data.push(...data1.data);
  
        // Fetch data2.json
        return fetch(`data/${data1.data_location}`);
      })
      .then(response => response.json())
      .then(data2 => {
        data.push(...data2.data);
  
        // Fetch data3.json (known file)
        return fetch('data/data3.json');
      })
      .then(response => response.json())
      .then(data3 => {
        data.push(...data3.data);
        displayData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  
  // Attach event listeners to buttons
  document.getElementById('syncButton').addEventListener('click', synchronousXHR);
  document.getElementById('asyncButton').addEventListener('click', asynchronousXHR);
  document.getElementById('fetchButton').addEventListener('click', fetchWithPromises);
  