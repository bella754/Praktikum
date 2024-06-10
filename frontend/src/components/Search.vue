<script setup>
    // import data from '../../../backend/data/mockData.json';
    import router from '../router.js';
    import { ref, onMounted } from "vue";
    import { useRoute } from 'vue-router';
    import axios from 'axios';

    const route = useRoute();
    const user = ref([]);
    let newData = [];
    const error = ref('');
    let persons;

    async function getData() {
        try {
            const response = await axios.post('/api/table');
            if (response.data.success) {
                // console.log("fetching data successfull");
                // console.log("newData in tryCatch: ", response.data.users);
                return response.data.users;
            } else {
                // console.log("response.data.success == false");
                error.value = response.data.message;
            }
        } catch (err) {
            // console.log("in catch(err)");
            error.value = 'An error occurred.';
        }
    }

    function search() {
        const obj = document.getElementsByClassName("form__input");
        let result = [];
        
        for(let i = 0; i < 5; i++) {
            if(obj[i].value != "") {
                // console.log("obj[i].value ist nicht leer");
                persons.forEach(item => {
                    // console.log("obj[i].value", obj[i].value);
                    // console.log("item.Email", item.Email);
                    // let identifier = obj[i].name;
                    // console.log("identifier", obj[i].name);
                    switch (obj[i].name) {
                        case "Email":
                            // console.log("in Email case");
                            if(obj[i].value === item.Email) {
                                if (result.findIndex(elem => elem.id === item.id) === -1) {
                                    result.push(item);
                                // console.log("item: ", item);
                                // console.log("item got pushed to result:", result);
                                // console.log("item in results?:", result[0]);
                                }
                            } else {
                                // console.log("search != email in item");
                                let index = result.findIndex(elem => elem.id === item.id);
                                if (index !== -1) {
                                    // console.log("item war vorher in result und wird jetzt gelöscht");
                                    result.splice(index, 1);
                                }
                            }
                            // console.log("result before break: ", result, result[0]);
                            break;
                        case "Name":
                            if(obj[i].value === item.Name) {
                                if (result.findIndex(elem => elem.id === item.id) === -1) {
                                    result.push(item);
                                }
                            } else {
                                let index = result.findIndex(elem => elem.id === item.id);
                                if (index !== -1) {
                                    result.splice(index, 1);
                                }
                            }
                            break;
                        case "PLZ":
                            if(obj[i].value === item.PLZ) {
                                // console.log("in case PLZ and obj{i}.value === item.PLZ");
                                if (result.findIndex(elem => elem.id === item.id) === -1) {
                                    result.push(item);
                                    // console.log("item pushed to result: ", item.id);
                                }
                            } else {
                                // console.log("obj{i}.value != item.PLZ");
                                let index = result.findIndex(elem => elem.id === item.id);
                                if (index !== -1) {
                                    // console.log("item gets removed from result", item.id);
                                    result.splice(index, 1);
                                }
                            }
                            break;
                        case "Ort":
                            if(obj[i].value === item.Ort) {
                                if (result.findIndex(elem => elem.id === item.id) === -1) {
                                    result.push(item);
                                }
                            } else {
                                let index = result.findIndex(elem => elem.id === item.id);
                                if (index !== -1) {
                                    result.splice(index, 1);
                                }
                            }
                            break;
                        case "Telefonnummer":
                            if(obj[i].value === item.Telefonnummer) {
                                if (result.findIndex(elem => elem.id === item.id) === -1) {
                                    result.push(item);
                                }
                            } else {
                                let index = result.findIndex(elem => elem.id === item.id);
                                if (index !== -1) {
                                    result.splice(index, 1);
                                }
                            }
                            break;
                        default:
                            console.log("no case found");
                    }
                });
            }
        }
        // console.log("result vor rechte", result.length);
        const rechte = document.getElementById("rechte");
        if(rechte.value != "") {
            persons.forEach(item => {
                if(rechte.value === item.Rechte) {
                    // console.log("rechte.value == item.Rechte");
                    if (result.findIndex(elem => elem.id === item.id) === -1) {
                    result.push(item);
                    // console.log("item in result gepushed", result);
                    }
                } else {
                    let index = result.findIndex(elem => elem.id === item.id);
                    if (index !== -1) {
                        // console.log("item war vorher in result und wird jetzt gelöscht");
                        result.splice(index, 1);
                    }
                }
            });
        }
        // console.log("result before routing", result, result[0]);
        router.push({ name: 'Suchergebnis', params: { result: JSON.stringify(result) } }); 
    }


    onMounted(async () => {
        newData = await getData();
        persons = newData;
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
</script>

<template>
        <!--default ist MyData-->
        <nav class="navigationBoard">
            <!-- <RouterLink class="routerlink" to= "/myData/:user" style="text-decoration: none; color: inherit;"> -->
            <button class="btn" @click="goToMyData()">Meine Daten</button>
            <!-- </RouterLink>
            <RouterLink class="routerlink" to="/listPersons" style="text-decoration: none; color: inherit;"> -->
            <button class="btn" @click="goToListPersons()">Alle Mitglieder</button>
            <!-- </RouterLink>
            <RouterLink class="routerlink" to="/search" style="text-decoration: none; color: inherit;"> -->
            <button class="btn" @click="goToSearch()">Erweiterte Suche</button>
            <!-- </RouterLink>-->
            <RouterLink class="routerlink" to="/" style="text-decoration: none; color: inherit;">
                <button class="btn">Logout</button>
            </RouterLink>
            <!--müssen noch @click events bekommen, um, auf entsprechender seite zu landen-->
        </nav>
        <div class="container">
            <div class="form">
                <h2 class="msg">Gib deine Suchkriterien an:</h2>
                <label class="form__label" for="email">
                    <span class="form__span">E-Mail</span>
                    <input class="form__input" type="email" name="Email" id="email">
                </label>
                <label class="form__label" for="name">
                    <span class="form__span">Name</span>
                    <input class="form__input" type="text" name="Name" id="name">
                </label>
                <label class="form__label" for="plz">
                    <span class="form__span">Postleitzahl</span>
                    <input class="form__input" type="text" name="PLZ" id="plz">
                </label>
                <label class="form__label" for="ort">
                    <span class="form__span">Ort</span>
                    <input class="form__input" type="text" name="Ort" id="ort">
                </label>
                <label class="form__label" for="tel">
                    <span class="form__span">Telefonnummer</span>
                    <input class="form__input" type="text" name="Telefonnummer" id="tel">
                </label>
                <label class="form__label" for="rechte">
                    <span class="form__span">Rechte</span>
                    <select class="form__selection" name="Rechte" id="rechte">
                        <option class="option" selected></option>
                        <option class="option">Standard User</option>
                        <option class="option">Power User</option>
                        <option class="option">Administrator</option>
                    </select>
                </label>
                <!-- <RouterLink class="routerlink" to="/search/result" style="text-decoration: none; color: inherit;"> -->
                    <button class="btn btn--search" @click="search()">Suchen</button>
                <!-- </RouterLink> -->
            </div>
        </div>
        
</template>

<style scoped>
.navigationBoard {
    position: relative;
    /* top: 40px; */
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
.btn--search {
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
.btn--search:hover {
    background-color: #438f5a;
}
.msg {
    position: relative;
}
</style>



