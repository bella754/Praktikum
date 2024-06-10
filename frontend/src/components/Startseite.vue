<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import router from '../router.js';
// import data from "../../../backend/data/mockData.json"

const route = useRoute();
const user = ref([]);

const userPassword = ref('');
// console.log("auf startseite");
// console.log("user in startseite: ", user);

function changeVisibility() {
  var pw = document.getElementById("password");
  if (pw.type === "password") {
    pw.type = "text";
  } else {
    pw.type = "password";
  }
}

onMounted(() => {
    // console.log("route.params: ", route.params);
    if (route.params.user) {
        // console.log("route.params.user", route.params.user);
        user.value = JSON.parse(route.params.user);
    }
});

function goToMyData() {
    router.push({ name: 'Startseite', params: { user: JSON.stringify(user.value) } }); 
}

function goToListPersons() {
    // console.log("go to lisPersons with user.value: ", user.value);
    router.push({ name: 'ListPersons', params: { user: JSON.stringify(user.value) } }); 
}

function goToSearch() {
    router.push({ name: 'Search', params: { user: JSON.stringify(user.value) } }); 
}

async function refresh() {
    let temp = document.getElementsByClassName("form__input");
    // console.log("temp: ", temp[0].value);
    // console.log("PUT request body in fetch: ", temp[0].value, temp[1].value, temp[2].value, temp[3].value, temp[4].value, temp[5].value, temp[6].value);
    // console.log("user id: ", user.id);
    // let id = data.persons.filter(e => e.id == user.id)
    // console.log("id: ", id);
    try {
        const response = await fetch(`api/persons/${temp[0].value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Email: temp[1].value,
                Name: temp[2].value,
                PLZ: temp[3].value,
                Ort: temp[4].value,
                Telefonnummer: temp[5].value,
                Passwort: temp[6].value
            })
        });
        const data = await response.json()
        // console.log("response: ", response);
    } catch(error) {
        console.log("Error while editing user: ", error);
    }
}

function refreshData() {
    document.getElementById("refreshMsg").style.display = "none";
    refresh();
    document.getElementById("refreshMsg").style.display = "block";
}
</script>

<template>
        <!--default ist MyData-->
        <nav class="navigationBoard">
            <button class="btn" @click="goToMyData()">Meine Daten</button>
            <button class="btn" @click="goToListPersons()">Alle Mitglieder</button>
            <button class="btn" @click="goToSearch()">Erweiterte Suche</button>
            <RouterLink class="routerlink" to="/" style="text-decoration: none; color: inherit;">
                <button class="btn">Logout</button>
            </RouterLink>
        </nav>
        <div class="container">
            <div class="form">
                <h2 class="msg">Hier kannst du deine persönlichen Daten sehen und ändern.</h2>
                <h3 class="refreshMsg" id="refreshMsg">Deine Daten wurden erfolgreich aktualisiert.</h3>
                <input type="text" class="form__input form__input--hidden" v-model="user.id">
                <label class="form__label" for="email">
                    <span class="form__span">E-Mail</span>
                    <input class="form__input" type="email" name="email" id="email" v-model="user.Email">
                </label>
                <label class="form__label" for="name">
                    <span class="form__span">Name</span>
                    <input class="form__input" type="text" name="name" id="name" v-model="user.Name">
                </label>
                <label class="form__label" for="plz">
                    <span class="form__span">Postleitzahl</span>
                    <input class="form__input" type="text" name="plz" id="plz" v-model="user.PLZ">
                </label>
                <label class="form__label" for="ort">
                    <span class="form__span">Ort</span>
                    <input class="form__input" type="text" name="ort" id="ort" v-model="user.Ort">
                </label>
                <label class="form__label" for="tel">
                    <span class="form__span">Telefonnummer</span>
                    <input class="form__input" type="text" name="tel" id="tel" v-model="user.Telefonnummer">
                </label>
                <label class="form__label" for="password">
                    <span class="form__span">Passwort ändern</span>
                    <input class="form__input" type="password" name="password" id="password">
                </label>
                <label class="form__label" for="showPassword">
                    <input class="form__input--checkbox" type="checkbox" id="showPassword" @click="changeVisibility()">
                    <span class="form__span-checkbox">Passwort anzeigen</span>
                </label>
                <!-- <RouterLink class="routerlink" to="/myData/refresh" style="text-decoration: none; color: inherit;"> -->
                <button class="btn btn--refresh" @click="refreshData()">Aktualisieren</button>
                <!-- </RouterLink> -->
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
    flex-wrap: wrap;
    justify-content: center; 
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

.container {
    position: relative;
    text-align: center;
    top: 50px;
}
.form {
    display: inline-block;
    text-align: center;
}
.form__span {
    display: inline-block;
    min-width: 150px;
    margin-bottom: 15px;
}
.form__label {
    display: block;
}
.form__input {
    padding: 7px;
    border: 1px solid #ccc;
    border-radius: 7px;
    box-sizing: border-box;
}
.btn--refresh {
    position: relative;
    top: 10px;
    min-width: 120px;
    color: black;
    background-color: #9cdbaf;
    border: 1px solid transparent;
    border-radius: 7px;
    font-size: 15px;
    font-weight: 500;
    padding: 5px;
}
.btn--refresh:hover {
    background-color: #438f5a;
}
.msg {
    position: relative;
}
.refreshMsg {
    display: none;
    color: #438f5a;
}
.form__input--checkbox {
    margin-left: 100px;   
}
.form__input--hidden {
    display: none;
}
</style>



