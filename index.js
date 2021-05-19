const tableCellsMetaData = ['customerID', 'requestID' , 'jsonMetadata.name', 'phoneNumber', 'jsonMetadata'];
const headers = ['Customer ID', 'Request ID', 'Customer Name', 'Phone Number', "Meta Information"];
let sortType = false; // true for asecending and false for descending

const sortData = (data, flag) => {
  const container = document.getElementById('container');
  document.getElementById('matrix-table').remove();
  const sortedData = data.sort((item1, item2) => {
    if(Number(item1.customerID) < Number(item2.customerID)) {
      return -1;
    }
    if(Number(item1.customerID) > Number(item2.customerID)) {
      return 1;
    }
    return 0;
  })
  const table = createTable(sortedData);
  container.appendChild(table);
}

const openMetaInformationModal = (data) => {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'block';
  const overlayContent = document.createElement('div');
  overlayContent.id = 'overlay-content';
  const overlayData = {
    name: data.name,
    email: data.email,
    address: Object.keys(data.address).reduce((acc, next) => {
      return `${acc} ${data.address[next]}`
    }, ''),
  };

  Object.keys(overlayData).forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `${item} - ${overlayData[item]}`;
    overlayContent.appendChild(div);
  })
  overlay.appendChild(overlayContent);

}

const createTable = (data) => {
  const table = document.createElement('table');
  table.id = 'matrix-table';
  const tableBody = document.createElement('tbody');
  const tableHeader = document.createElement('thead');
  const trHead = document.createElement('tr');
  
  headers.forEach((i, index) => {
    const thElement = document.createElement('th');
    const text = document.createTextNode(i);
    thElement.appendChild(text);
    if(index === 0) {
      thElement.addEventListener('click', function() {
        sortData(data, tableCellsMetaData[i]);
      })
    }
    trHead.appendChild(thElement);
  });

  tableHeader.appendChild(trHead);
  table.appendChild(tableHeader);

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    tableCellsMetaData.forEach(d => {
      if(typeof item[d] !== 'object' && (item[d]|| item[d.split('.')[0]])) {
        const splitItemChild = d.split('.');
        let value = item[d];
        if(splitItemChild.length > 1) {
          value = splitItemChild.reduce((acc, next) => {
            return acc[next];
          }, item);

        }
        const cell = document.createElement('td');
        const text = document.createTextNode(value);
        cell.appendChild(text);
        row.appendChild(cell);
      } 
      if(typeof item[d] === 'object' && item[d] && Object.keys(item[d]).length > 0) {
        const cell = document.createElement('td');
        const overlayButton = document.createElement('button');
        overlayButton.addEventListener('click', function() {
          openMetaInformationModal(item[d]);
        })
        overlayButton.innerHTML = 'Show';
        cell.appendChild(overlayButton);
        row.appendChild(cell);

      }
    });
    tableBody.appendChild(row);
  });
  table.appendChild(tableBody);
  return table;
};

const fetchData = () => {
  return fetch('https://jsonblob.com/api/1a54c6fb-b565-11eb-8dde-95cf20a72691')
    .then(res => res.json());
}

document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('container');
  fetchData().then(res => {
    console.log(res);
    const table = createTable(res);
    const loader = document.getElementById('loadingIndicator');
    loader.style.display = 'none';
    container.appendChild(table);
  });
})