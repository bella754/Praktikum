<script setup>
    // import data from "../../../backend/data/mockData.json";
    import { ref } from 'vue';
    import router from '../router.js';

    import axios from 'axios';

    const error = ref('');

    async function login(mailInput, passwordInput) {
        try {
            const response = await axios.post('/api/login', { 
                email: mailInput,
                password: passwordInput
            });

            if (response.data.success) {
                // Login erfolgreich
                // console.log('User:', response.data.user);
                router.push({ name: 'Startseite', params: { user: JSON.stringify(response.data.user) } });
            } else {
                // irgendwie ist der case bis jetzt total egal
                // console.log("response.data.success == false");
                error.value = response.data.message;
            }
        } catch (err) {
            // console.log("in catch(err)");
            document.getElementById("container").style.top = "165px";
            let errorMsg = document.getElementById("wrongData");
            errorMsg.style.display = "block";
            // console.error(err);
            error.value = 'An error occurred.';
        }
    }

    async function authentication() {
        document.getElementById("emptyInput").style.display = "none";
        document.getElementById("wrongData").style.display = "none";

        let userMail = document.getElementById("email").value;
        let userPassword = document.getElementById("password").value;

        if(!userPassword || !userMail) {
            document.getElementById("container").style.top = "165px";
            let error = document.getElementById("emptyInput");
            // console.log("error: ", error);
            error.style.display = "block";
            // console.log("error style: ", error.style);
        } else {
            await login(userMail, userPassword);
        }
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    }
    
    // document.addEventListener('keypress', function(e) {
    //     if(e.key === 'Enter') {
    //         // console.log("enter worked");
    //         authentication();
    //     }
    // })
</script>

<template>
    <!--<div class="header">test</div>-->
    <div class="container" id="container">
        <h3 class="emptyInput" id="emptyInput">Die Login Felder dürfen nicht leer sein, wenn du dich einloggen möchtest.</h3>
        <h3 class="wrongData" id="wrongData">Deine Anmeldedaten sind nicht korrekt.</h3>
        <h2>Einfach und schnell einloggen.</h2>
        <div class="form">
            <div class="form__group">
                <label for="email">E-Mail</label>
                <input class="form__input" type="email" id="email" placeholder="E-Mail"> 
            </div>
            <div class="form__group">
                <label for="password">Passwort</label>
                <input class="form__input" type="password" id="password" placeholder="Passwort"> 
            </div>
            <!-- <RouterLink to="/myData" style="text-decoration: none; color: inherit;"> -->
            <button class="form__btn" @click="authentication()" @keydown.Enter="authentication">Login</button>
            <!-- </RouterLink> -->
            <!-- <p class="form__msg">Noch nicht angemeldet?<br><u><a href="http://localhost:5173/register">Dann hier klicken</a></u>, um dich zu registrieren.</p> -->
            <p class="form__msg">Noch nicht angemeldet?<br><RouterLink to="/register">Dann hier klicken</RouterLink>, um dich zu registrieren.</p>
        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    top: 200px;
    text-align: center;
}
.form {
    display: inline-block;
    text-align: center;
}
.form__group {
    display: grid;
    grid-template-rows: auto 1fr;
}
.form__input {
    position: relative;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 20px;
}
.form__btn {
    position: relative;
    background-color: #9cdbaf;
    padding: 0.6em 1.2em;
    border-radius: 8px;
    border: 1px solid transparent;
}
.form__btn:hover {
    background-color: #438f5a;
}
.form__msg {
    margin-top: 20px;
}
.emptyInput {
    display: none;
    color: red;
}
.wrongData {
    display: none;
    color: red;
}
</style>