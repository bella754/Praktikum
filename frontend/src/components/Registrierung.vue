<script setup>
import { ref } from 'vue';
import router from '../router.js';
import axios from 'axios';

const userEmail = ref('');
const userName = ref('');
const userPLZ = ref('');
const userOrt = ref('');
const userTelefonnummer = ref('');
const userPassword = ref('');
const userPassword2 = ref('');

async function createUser() {
    // console.log("request body in fetch: ", userEmail.value, userName.value, userPLZ.value, userOrt.value, userPassword.value, userTelefonnummer.value);
    // wenn passwörter gleich sind --> request für neuen Nutzer

    try {
        const response = await axios.post('/api/text-mail', { 
            email: userEmail.value,
            name: userName.value,
            plz: userPLZ.value,
            ort: userOrt.value,
            tel: userTelefonnummer.value,
            password: userPassword.value
        });

        if (response.data.success) {
            // Mail gesendet
            console.log('Message:', response.data.message);
        } else {
            // irgendwie ist der case bis jetzt total egal
            console.log("response.data.success == false");
        }
    } catch (err) {
        //console.log("in catch(err)");
        console.error(err);
    }
}


async function testInputFields() {
    let emptyInput = document.getElementById("emptyInput");
    let wrongPassword =  document.getElementById("wrongPassword");
    let emailInUse = document.getElementById("messageAlreadyInUse");
    // console.log("temp: ", temp);
    emptyInput.style.display = "none";
    wrongPassword.style.display = "none";
    emailInUse.style.display = "none";

    let datenschutz = document.getElementById("datenschutz");
    // console.log("datenschutz", datenschutz.checked);

    if(!userEmail.value || !userName.value || !userPLZ.value || !userOrt.value || !userTelefonnummer.value || !userPassword.value || !userPassword2.value || datenschutz.checked == false ||
        userEmail.value == null || userName.value == null || userPLZ.value == null || userOrt.value == null || userTelefonnummer.value == null || userPassword.value == null || userPassword2.value == null) {
        
        document.getElementById("container").style.top = "35px";
        // let error = document.getElementById("emptyInput");
        emptyInput.style.display = "block";
    } else if(userPassword.value != userPassword2.value) {
        console.log("Passwörter stimmen nicht überein");
        // let msg = document.getElementById("wrongPassword");
        wrongPassword.style.display = "block";
    } else {
        try {
            const response = await axios.post('/api/registrierung', {userEmail});
            console.log("response: ", response, response.data);
            if (response.data.success) {
                console.log("Email schon vergeben");
                // let msg = document.getElementById("wrongPassword");
                emailInUse.style.display = "block";
            } else {
                // irgendwie ist der case bis jetzt total egal
                console.log("response.data.success == false");
                createUser();
                router.push({ name: 'Registrierungsbestätigung' }); 
            }
        } catch (err) {
            //console.log("in catch(err)");
            console.error(err);
        }
        // createUser();
        // router.push({ name: 'Registrierungsbestätigung' }); 
    }
}
</script>

<template>
    <div class="container" id="container">
        <div class="form">
            <h2 class="msg">Bitte gib folgende Informationen ein, um dich zu registrieren.</h2>
            <h3 class="emptyInput" id="emptyInput">Alle Pflichtfelder müssen ausgefüllt werden.</h3>
            <h3 class="emptyInput" id="wrongPassword">Die Passwörter stimmen nicht überein.</h3>
            <h3 class="emptyInput" id="messageAlreadyInUse">Es existiert bereits ein Account mit der eingegebenen Email Adresse</h3>
            <label class="form__label" for="email">
                <span class="form__span">E-Mail*</span>
                <input class="form__input" type="email" name="email" v-model="userEmail" id="email" placeholder="E-Mail" required/>
            </label>
            <label class="form__label" for="name">
                <span class="form__span">Name*</span>
                <input class="form__input" type="text" name="name" v-model="userName" id="name" placeholder="Name" required/>
            </label>
            <label class="form__label" for="plz">
                <span class="form__span">Postleitzahl*</span>
                <input class="form__input" type="text" name="plz" v-model="userPLZ" id="plz" placeholder="Postleitzahl" required/>
            </label>
            <label class="form__label" for="ort">
                <span class="form__span">Ort*</span>
                <input class="form__input" type="text" name="ort" v-model="userOrt" id="ort" placeholder="Ort" required/>
            </label>
            <label class="form__label" for="tel">
                <span class="form__span">Telefonnummer*</span>
                <input class="form__input" type="text" name="tel" v-model="userTelefonnummer" id="tel" placeholder="Telefonnummer" required/>
            </label>
            <label class="form__label" for="password">
                <span class="form__span">Passwort*</span>
                <input class="form__input" type="password" name="password" v-model="userPassword" id="password" placeholder="Passwort" required/>
            </label>
            <label class="form__label" for="password2">
                <span class="form__span">Passwort wiederholen*</span>
                <input class="form__input" type="password" name="password2" v-model="userPassword2" id="password2" placeholder="Passwort wiederholen" required/>
            </label>
            <p class="form__text">* Pflichtfeld</p>
            <label class="form__label" for="datenschutz">
                <input class="form__checkbox" type="checkbox" id="datenschutz" required>
                <span class="form_span">Ich stimme den <b>Nutzungsbedingungen</b> zu und <br> habe die <b>Datenschutzerklärung</b> gelesen.*</span>
            </label>    

            <br><button class="btn" @click="testInputFields()"> Registrieren
                <!-- <RouterLink to="/registerMsg" style="text-decoration: none; color: inherit;">Registrieren</RouterLink> -->
            </button>   
            <p class="form__msg">Bereits registriert?<br><RouterLink to="/">Dann hier klicken</RouterLink>, um dich anzumelden.</p>
        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    top: 60px;
    text-align: center;
}
.form {
    position: relative;
    top: 50px;
    right: 10px;
}
.form__span {
    display: inline-block;
    min-width: 150px;
    margin-bottom: 15px;
}
.form__label {
    display: block;
}
.form__datenschutz {
    display: inline-block;
}
.form__input {
    padding: 7px;
    border: 1px solid #ccc;
    border-radius: 7px;
    box-sizing: border-box;
}
.form__text { 
    position: relative;
    left: 10px;
    top: -10px;
    font-size: x-small;
}
.form__input--error {
    border: 1px solid red;
    border-radius: 7px;
    box-sizing: border-box;
}
.form__input--error::placeholder {
    color: red;
}
.btn {
    position: relative;
    background-color: #9cdbaf;
    padding: 0.6em 1.2em;
    border-radius: 8px;
    border: 1px solid transparent;
}
.btn:hover {
    background-color: #438f5a;
}
.form__msg {
    margin-top: 30px;
}
.emptyInput {
    display: none;
    color: red;
}
</style>