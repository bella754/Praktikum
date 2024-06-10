<script setup>
    import { ref, onMounted } from 'vue';
    // import data from '../../../backend/data/mockData.json'; 
    import { useRoute } from 'vue-router';
    import router from '../router.js';
    import axios from 'axios';

    const route = useRoute();
    const user = ref([]);
    let id = route.params.id;
    let newData = [];
    const error = ref('');

    async function getData() {
        try {
            const response = await axios.post('/api/personDetails', {id: id});
            if (response.data.success) {
                // console.log("fetching data successfull");
                // console.log("newData in tryCatch: ", response.data.user);
                return response.data.user;
            } else {
                // console.log("response.data.success == false");
                error.value = response.data.message;
            }
        } catch (err) {
            // console.log("in catch(err)");
            error.value = 'An error occurred.';
        }
    }

    function changeVisibility() {
        var pw = document.getElementById("password");
        if (pw.type === "password") {
            pw.type = "text";
        } else {
            pw.type = "password";
        }
    }

    onMounted(async () => {
        newData = await getData();
        if (route.params.user) {
            // console.log("route.params.result", route.params.result);
            user.value = JSON.parse(route.params.user);
        }
    });

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

    const isAdminOrPowerUser = () => {
        // console.log("Admin or Power User?: ", user.value.Rechte === 'Administrator' || user.value.Rechte === 'Power User');
        return user.value.Rechte === 'Administrator' || user.value.Rechte === 'Power User';
    }
    const isStandardUser = () => {
        return user.value.Rechte === 'Standard User';
    }
    const isAdmin = () => {
        return user.value.Rechte === 'Administrator';
    }


    async function refresh() {
    let temp = document.getElementsByClassName("form__input");
    let rechte = document.getElementById("rechte").value;
    // console.log("Rechte: ", rechte);
    try {
        console.log("");
        const response = await fetch(`api/persons/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Email: temp[0].value,
                Name: temp[1].value,
                PLZ: temp[2].value,
                Ort: temp[3].value,
                Telefonnummer: temp[4].value,
                Passwort: temp[5].value,
                Rechte: rechte
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

    async function deleteUser() {
        try {
        const response = await fetch(`api/persons/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json()
        // console.log("response: ", response);
        } catch(error) {
            console.log("Error while deleting user: ", error);
        }
    }

    function deleteData() {
        // document.getElementById("deleteMsg").style.display = "none";
        deleteUser();
        router.push({ name: 'ListPersons', params: { user: JSON.stringify(user.value) } }); 
        // document.getElementById("deleteMsg").style.display = "block";
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
        <div class="container">
            <div class="form">
                <!-- <div>{{ $route.params }}</div> -->
                <h2 class="msg">Ausgewählten Nutzer bearbeiten:</h2>
                <h3 class="refreshMsg" id="refreshMsg">Nutzerdaten wurden erfolgreich aktualisiert.</h3>
                <h3 class="deleteMsg" id="deleteMsg">Nutzerdaten wurden erfolgreich gelöscht.</h3>
                <!-- <input type="text" class="form__input form__input--hidden" v-model="user.id"> -->
                <label class="form__label" for="email">
                    <span class="form__span">E-Mail</span>
                    <input class="form__input" type="email" name="email" id="email" v-model="newData.Email" :disabled="isStandardUser()">
                </label>
                <label class="form__label" for="name">
                    <span class="form__span">Name</span>
                    <input class="form__input" type="text" name="name" id="name" v-model="newData.Name" :disabled="isStandardUser()">
                </label>
                <label class="form__label" for="plz">
                    <span class="form__span">Postleitzahl</span>
                    <input class="form__input" type="text" name="plz" id="plz" v-model="newData.PLZ" :disabled="isStandardUser()">
                </label>
                <label class="form__label" for="ort">
                    <span class="form__span">Ort</span>
                    <input class="form__input" type="text" name="ort" id="ort" v-model="newData.Ort" :disabled="isStandardUser()">
                </label>
                <label class="form__label" for="tel">
                    <span class="form__span">Telefonnummer</span>
                    <input class="form__input" type="text" name="tel" id="tel" v-model="newData.Telefonnummer" :disabled="isStandardUser()">
                </label>
                <label class="form__label" for="password" v-if="isAdminOrPowerUser()">
                    <span class="form__span">Passwort ändern</span>
                    <input class="form__input" type="password" name="password" id="password">
                </label>
                <label class="form__label" for="showPassword" v-if="isAdminOrPowerUser()">
                    <input class="form__input--checkbox" type="checkbox" id="showPassword" @click="changeVisibility()">
                    <span class="form__span-checkbox">Passwort anzeigen</span>
                </label>
                <label class="form__label" for="rechte" v-if="isAdmin()">
                    <span class="form__span">Rechte</span>
                    <select class="form__selection" name="rechte" id="rechte">
                        <option class="option" selected>{{ newData.Rechte }}</option>
                        <option class="option">Standard User</option>
                        <option class="option">Power User</option>
                        <option class="option">Administrator</option>
                    </select>
                </label>
                <button class="btn btn--change" v-if="isAdminOrPowerUser()" @click="refreshData()">
                    <!-- <RouterLink to="/refresh" style="text-decoration: none; color: inherit;"> -->
                        Aktualisieren
                    <!-- </RouterLink> -->
                </button>
                <button class="btn btn--change" v-if="isAdmin()" @click="deleteData()">
                    <!-- <RouterLink to="/delete" style="text-decoration: none; color: inherit;"> -->
                    Löschen
                    <!-- </RouterLink> -->
                </button>
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

.container {
    position: relative;
    top: 50px;
    text-align: center;
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
.form__selection {
    padding: 7px;
    border: 1px solid #ccc;
    border-radius: 7px;
    box-sizing: border-box;
    min-width: 185px;
}
.btn--change {
    position: relative;
    color: black;
    background-color: #9cdbaf;
    border: 1px solid transparent;
    border-radius: 7px;
    font-size: 15px;
    font-weight: 500;
    padding: 5px 10px;
    margin: 10px;
}
.btn--change:hover {
    background-color: #438f5a;
}
.msg {
    position: relative;
}
.form__input--checkbox {
    margin-left: 100px; 
    margin-bottom: 10px;  
}
.refreshMsg {
    display: none;
    color: #438f5a;
}
.deleteMsg {
    display: none;
    color: #438f5a;
}
/* .form__input--hidden {
    display: none;
} */
</style>



