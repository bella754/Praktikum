<script setup>
import { ref, onMounted } from 'vue';
import router from '../router.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const user = ref([]);
const searchResults = ref([]);
let filteredData = ref([]);
// console.log("searchResults: ", searchResults);
// const sortedData = ref([...searchResults.value]);
// console.log(sortedData);
// console.log("searchresult: ", searchResults[0]);

const rowsPerPage = 10;
let currentPage = ref(1);
// let totalPages = Math.ceil(searchResults.value.length / rowsPerPage);
let totalPages = ref(1);


function displayTable(page, dataInput) {
    // console.log("dataInput in displayTable: ", dataInput);
    const table = document.getElementById("table");
    const tbody = table.querySelector("tbody");

    if (!dataInput) {
        dataInput = searchResults.value;
    } 
    // console.log("dataInput after if: ", dataInput);

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const slicedData = dataInput.slice(startIndex, endIndex);

    // console.log("slicedData: ", slicedData);

    // Clear existing table rows
    tbody.innerHTML = '';

    let temp = 0;

    slicedData.forEach(item => {
        temp++
        //console.log(item);
        const row = document.createElement('tr');
        row.className = 'table__row';

        row.addEventListener("click", () => {
            openPersonalblatt(item);
        });

        if (temp % 2 == 0) {
            row.style = 'background-color: #9cdbaf';
        }

        const emailCell = document.createElement('td');
        emailCell.className = 'table__data';
        emailCell.style = 'border: 1px solid black';
        emailCell.textContent = item.Email;
        row.appendChild(emailCell);

        const nameCell = document.createElement('td');
        nameCell.className = 'table__data';
        nameCell.style = 'border: 1px solid black';
        nameCell.textContent = item.Name;
        row.appendChild(nameCell);

        const plzCell = document.createElement('td');
        plzCell.className = 'table__data';
        plzCell.style = 'border: 1px solid black';
        plzCell.textContent = item.PLZ;
        row.appendChild(plzCell);

        const ortCell = document.createElement('td');
        ortCell.className = 'table__data';
        ortCell.style = 'border: 1px solid black';
        ortCell.textContent = item.Ort;
        row.appendChild(ortCell);

        const telCell = document.createElement('td');
        telCell.className = 'table__data';
        telCell.style = 'border: 1px solid black';
        telCell.textContent = item.Telefonnummer;
        row.appendChild(telCell);

        tbody.appendChild(row);
    });
    // console.log("displayTabel end with dataInput.length: ", dataInput.length);
    // console.log("filteredData: ", filteredData);
    updatePagination(page, dataInput.length);
}

function updatePagination(page, number) {
    if(number == 0) {
        currentPage.value = 0;
    };
    // console.log("updatePagination start with number: ", number);
    const pageCount = Math.ceil(number / rowsPerPage);
    totalPages.value = Math.ceil(number / rowsPerPage);
    // console.log("new totalPages: ", totalPages);
    // console.log("new totalPages.value: ", totalPages.value);
    // const paginationContainer = document.getElementById("pagination");
    //paginationContainer.innerHTML = "";
    //totalPages = pageCount

    for (let i = 1; i <= pageCount; i++) {
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.innerText = i;
        pageLink.onclick = function () {
            displayTable(i);
        };
        if (i === page) {
            pageLink.style.fontWeight = "bold";
        }
        //paginationContainer.appendChild(pageLink);
        //paginationContainer.appendChild(document.createTextNode(" "));
    }
}

function openPersonalblatt(person) {
    router.push({ name: 'personalblatt', params: { id: person.id , user: JSON.stringify(user.value)} }); 
    //console.log("function done");
}

function nextPage() {
    currentPage.value++;
    if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
    }

    if (filteredData.value.length == 0) {
        displayTable(currentPage.value);
    } else {
        displayTable(currentPage.value, filteredData.value);
    }
}

function prevPage() {
    currentPage.value--;
    if (currentPage.value < 1) {
        currentPage.value = 1;
    }
    if (filteredData.value.length == 0) {
        displayTable(currentPage.value);
    } else {
        displayTable(currentPage.value, filteredData.value);
    }
}

onMounted(() => {
    if (route.params.result) {
        // console.log("route.params.result", route.params.result);
        searchResults.value = JSON.parse(route.params.result);
        // console.log(searchResults);
        // console.log("searchresult", searchResults.value.length);
        // console.log(searchResults.value[0]);
    }
    displayTable(currentPage.value);
    if (route.params.user) {
        // console.log("route.params.result", route.params.result);
        user.value = JSON.parse(route.params.user);
    }
});

////////////////////////////////////////
// Tabelle sortieren/filtern 
////////////////////////////////////////
let dir = "asc";

function sortTable(n) {
    // console.log(dir);
    // console.log("sortedData before sorting: ", sortedData);

    // if (!sortedData.value) {
    //     sortedData.value = [...data.persons];
    // }
    
    console.log("searchResult: ", searchResults.value);
    searchResults.value.sort((a, b) => {
        const valueA = a[Object.keys(a)[n]];
        // console.log("valueA: ", valueA);
        const valueB = b[Object.keys(b)[n]];
        // console.log("valueB: ", valueB);

        if (dir === "asc") {
            // console.log(valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' }));
            // dir = "desc";
            return valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
        } else {
            // dir = "asc";
            return valueB.localeCompare(valueA, undefined, { numeric: true, sensitivity: 'base' });
        }
    });

    if (dir === "asc") {
        dir = "desc";
    } else {
        dir = "asc";
    }
    // console.log("sortedData before displayTable: ", searchResults);


    let table = document.getElementById("table");
    let rows = table.rows;
    // Remove arrow from all headers
    let headers = document.getElementsByClassName("table__header");
    for (let header of headers) {
        header.classList.remove("table__header--selected");
        header.querySelector(".arrow")?.remove();
        // header.removeChild(header.querySelector(".arrow"));
    }
    // console.log("header after removing arrows and bold", headers);

    // Add arrow to clicked header
    let arrow = document.createElement("i");
    arrow.classList.add("arrow")
    if (dir === "asc") {
        arrow.innerHTML = "&#8595";
    } else {
        arrow.innerHTML = "&#8593";
    }
    headers[n-1].classList.add("table__header--selected");
    // console.log("headers after header--selected hinzugefügt", headers[n]);
    headers[n-1].appendChild(arrow);
    // console.log("headers after arrow is added", headers[n]);

    for(let i = 0; i < rows.length; i++) {
            rows[i].style.backgroundColor = "#ffffff";
            if(i % 2 == 0) {
                rows[i].style.backgroundColor ='#9cdbaf';
            }
    }
    displayTable(currentPage.value); // Pass sorted data to displayTable
}

function filterTable() {
    currentPage.value = 1;
    let input = document.getElementById("searchbar").value;
    // console.log("input: ", input);
    filteredData.value = [];

    searchResults.value.forEach(item => {
        //console.log(item.Email.includes(input));
        
        if (item.Email.toUpperCase().includes(input.toUpperCase())) {
            // console.log("input in mail");
            if (filteredData.value.findIndex(elem => elem.id === item.id) === -1) {
                filteredData.value.push(item);
            }
            // console.log("filteredData: ", filteredData);
        }
        if (item.Name.toUpperCase().includes(input.toUpperCase())) {
            // console.log("input in name");
            if (filteredData.value.findIndex(elem => elem.id === item.id) === -1) {
                filteredData.value.push(item);
            }
            // console.log("filteredData: ", filteredData);
        }
        if (item.PLZ.toUpperCase().includes(input.toUpperCase())) {
            // console.log("input in plz");
            if (filteredData.value.findIndex(elem => elem.id === item.id) === -1) {
                filteredData.value.push(item);
            }
            // console.log("filteredData: ", filteredData);
        }
        if (item.Ort.toUpperCase().includes(input.toUpperCase())) {
            // console.log("input in ort");
            if (filteredData.value.findIndex(elem => elem.id === item.id) === -1) {
                filteredData.value.push(item);
            }
            // console.log("filteredData: ", filteredData);
        }
        if (item.Telefonnummer.toUpperCase().includes(input.toUpperCase())) {
            // console.log("input in telefonnummer");
            if (filteredData.value.findIndex(elem => elem.id === item.id) === -1) {
                filteredData.value.push(item);
            }
            // console.log("filteredData: ", filteredData);
        }
    });
    // console.log("filtered data: ", filteredData);
    displayTable(currentPage.value, filteredData.value)
}


function goToMyData() {
    // console.log("in goToData with user.value: ", user.value);
    router.push({ name: 'Startseite', params: { user: JSON.stringify(user.value) } }); 
}

function goToListPersons() {
    router.push({ name: 'ListPersons', params: { user: JSON.stringify(user.value) } }); 
}

function goToSearch() {
    router.push({ name: 'Search', params: { user: JSON.stringify(user.value) } }); 
}
</script>


<template>
    <nav class="navigationBoard">
        <button class="btn" @click="goToMyData()">Meine Daten</button>
        <button class="btn" @click="goToListPersons()">Alle Mitglieder</button>
        <button class="btn" @click="goToSearch()">Erweiterte Suche</button>
        <RouterLink class="routerlink" to="/" style="text-decoration: none; color: inherit;">
            <button class="btn">Logout</button>
        </RouterLink>
    </nav>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <div class="form">
        <h2 class="heading">Alle Mitstreiter, die bereits registriert sind:</h2>
        <span class="search">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
            </svg>
            <input class="searchbar" type="text" name="searchbar" id="searchbar" @keyup="filterTable()" placeholder="Suche nach einem Mitstreiter">
        </span>
        <table class="table" id="table">
            <thead>
                <tr>
                    <th class="table__header" @click="sortTable(1)">E-Mail</th>
                    <th class="table__header" @click="sortTable(2)">Name</th>
                    <th class="table__header" @click="sortTable(3)">PLZ</th>
                    <th class="table__header" @click="sortTable(4)">Ort</th>
                    <th class="table__header" @click="sortTable(5)">Telefon</th>
                </tr>
            </thead>
            <tbody class="tbody">
                
            </tbody>
            </table>
        <!-- <div class="pagination" id="pagination"></div>  -->
        <div class="pagination__buttons">
            <button class="pagination__btn" @click="prevPage">&lt;</button>
            {{ currentPage }} / {{ totalPages }}
            <button class="pagination__btn" @click="nextPage">&gt;</button>
        </div>
        <div class="dropdown">

        </div>
    </div>
</template>


<style scoped>
.navigationBoard {
    position: relative;
    width: 100%;
    /* border: 3px solid black; */
    display: flex;
    align-items: center;
    justify-content: center; 
    flex-wrap: wrap;
}
.routerlink {
    /* border: 3px solid red; */
    margin: 3px 5px;
}
.table__routerlink {
    display: contents; 
}
.btn {
    min-width: 200px;
    color: white;
    background-color: #438f5a;
    border: 1px solid transparent;
    border-radius: 7px;
    font-size: 16px;
    font-weight: 600;
    padding: 10px 15px 10px 15px;
    font-family: Arial, Helvetica, sans-serif;
    margin: 5px 2px;
}
.btn:hover {
    background-color: #438f5a;
    transform: translateY(-1px);
}
.btn:active {
    background-color: #9cdbaf;
    transform: translateY(0);
}

/* form stuff */
.form {
    position: relative;
    top: 50px;
    /* border: 1px solid red;   */
}
.heading {
    display: block;
    position: relative;
    display: inline-flex;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 20px 0 0 0;
}
.search {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center; 
    margin-bottom: 20px;
}
.searchbar {
    width: 40%;
    padding: 5px 15px;
    border: 1px solid black;
    border-radius: 7px;
}
.arrow {
    left: 50px;
}
.down {
    transform: rotate(45deg);
}
.table {
    position: relative;
    left: 50%;
    width: 70%;
    transform: translate(-50%);
    border-collapse: collapse;
    margin-bottom: 10px;
}
.table__header {
    position: relative;
    background-color: #438f5a;
    color: white;   
    font-family:Arial, Helvetica, sans-serif;
    font-weight: 400;
    border: 1px solid black;
    border-collapse: collapse;
}
.table__header--selected {
    font-weight: bold;
}
.header__arrow {
    position: absolute;
    top: 40%;
    left: 70%;
    transform: translateY(-50%);    
}
.table__row:nth-child(even) {
    background-color: #9cdbaf;
}
.table__data {
    padding: 5px;
    text-wrap: nowrap;
    text-align: left;
    overflow: auto;
}
.table__row:hover {
    background-color: #9cdbaf;
}
.pagination__buttons {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center; 
    gap: 10px;
}

.pagination__buttons button {
    background-color: #438f5a;
    color: black;
    font-weight: bold;
    border: 1px solid transparent;
    border-radius: 50%;
}
.pagination__btn:active {
    background-color: #9cdbaf
} 
</style>