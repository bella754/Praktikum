import express from 'express'
import { getUsers, getSingleUser, getSingleUserEmail, createUser, updateUser, deleteUser } from './database.js'
import path from 'path'
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const app = express();
app.use(bodyParser.json());

/////////////////////////////////
// get all users
/////////////////////////////////
app.get("/api/persons", async (req, res) => {
    let users = await getUsers();
    res.status(200).json({ success: true, users: users });
});

/////////////////////////////////
// get single user
/////////////////////////////////
app.get("/api/persons/:id", async (req, res) => {
    let id = req.params.id;
    let user = await getSingleUser(id);
    res.status(200).json(user);
});

/////////////////////////////////
// for encryption
/////////////////////////////////
import bcrypt from "bcrypt";
const saltRounds = 10;

/////////////////////////////////
// update user
/////////////////////////////////
app.put('/api/persons/:id', async (req, res) => {
    let id = req.params.id;
    // console.log("id: ", id);
    let email = req.body.Email;
    let name = req.body.Name;
    let plz = req.body.PLZ;
    let ort = req.body.Ort;
    let tel = req.body.Telefonnummer;
    let password = req.body.Passwort;
    let rechte = req.body.Rechte; 

    let newEmail, newName, newPLZ, newOrt, newTel, newPasswort, newRechte;

    let userToRefresh = await getSingleUser(id);
    // console.log("user to refresh: ", userToRefresh);
    // let testUser = persons.persons.filter(obj => obj.id == id)[0];
    // console.log("testuser: ", testUser);

    if (userToRefresh.Email != email && email != "" && email != undefined) {
        newEmail = email;
    } 
    if (userToRefresh.Name != name && name != "" && name != undefined) {
        newName = name;
    } 
    if (userToRefresh.PLZ != plz && plz != "" && plz != undefined) {
        newPLZ = plz;
    } 
    if (userToRefresh.Ort != ort && ort != "" && ort != undefined) {
        newOrt = ort;
    } 
    if (userToRefresh.Telefonnummer != tel && tel != "" && tel != undefined) {
        newTel = tel;
    } 
    if (userToRefresh.Passwort != password && password != "" && password != undefined) {
        bcrypt
            .genSalt(saltRounds)
            .then(salt => {
                return bcrypt.hash(password, salt)
            })
            .then(async (hash) => {
                newPasswort = hash;
                // console.log("newPasssword in bcrypt: ", newPasswort);
                let test = await updateUser(id, undefined, undefined, undefined, undefined, undefined, newPasswort, undefined);
                // console.log("user in bcrypt after update: ", test);
            })
            .catch(err => console.error(err.message))
    }
    if (userToRefresh.Rechte != rechte && rechte != "" && rechte != undefined) {
        newRechte = rechte;
    }
    // console.log("new password: ", newPasswort);
    let userAfterUpdateSQL = await updateUser(id, newEmail, newName, newPLZ, newOrt, newTel, undefined, newRechte);
    // console.log("user after update in sql: ", userAfterUpdateSQL);
    res.status(201).json(userAfterUpdateSQL);
})

/////////////////////////////////
// delete user
/////////////////////////////////
app.delete('/api/persons/:id', async (req, res) => {
    let id = req.params.id;
    await deleteUser(id);
    res.status(200).json("User gelöscht");
})

/////////////////////////////////
// create user
/////////////////////////////////
app.post('/api/persons', async (req, res) => {
    let email = req.body.Email;
    let name = req.body.Name;
    let plz = req.body.PLZ;
    let ort = req.body.Ort;
    let tel = req.body.Telefonnummer;
    let password = req.body.Passwort;
    
    // generate hash
    bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            // console.log('Salt: ', salt)
            return bcrypt.hash(password, salt)
        })
        .then(async (hash) => {
            // console.log("hash in .then: ", hash);
            let newUser = await createUser(email, name, plz, ort, tel, hash);
            res.status(201).json(newUser);
        })
        .catch(err => console.error(err.message));
});

/////////////////////////////////
// get Data for Components
/////////////////////////////////
app.post("/api/login", async (req, res) => {  
    const { email, password } = req.body;

    let user = await getSingleUserEmail(email); 
    // console.log("user in server.js: ", user);

    if (!user) {
        return res.status(404).json({ success: false, message: 'No user found with given email' });
    }

    let passwordMatch = await bcrypt.compare(password, user.Passwort);  // Vergleichen Sie das Passwort

    if (passwordMatch) {
        res.status(200).json({ success: true, user: user });
    } else {
        res.status(403).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post("/api/registrierung", async (req, res) => {  
    const { email } = req.body;

    let user = await getSingleUserEmail(email); 
    // console.log("user in server.js: ", user);

    if (!user) {
        return res.json({ success: false, message: 'No user found with given email' });
    } else {
        return res.status(200).json({ success: true});
    }
});

app.post("/api/table", async (req, res) => {
    let users = await getUsers();
    // console.log("users: ", users);
    res.status(200).json({ success: true, users: users });
});

app.post("/api/personDetails", async (req, res) => {
    // console.log("id: ", req.body.id);
    let user = await getSingleUser(req.body.id);
    // console.log("user in sever.js: ", user);
    res.status(200).json({ success: true, user: user });
});

/////////////////////////////////
// send email for registartion
/////////////////////////////////
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    // auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    // },
    tls: {
        rejectUnauthorized: false
    }
});

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}
const tokenStore = new Map();
app.post('/api/text-mail', async (req, res) => {
    const { email, name, plz, ort, tel, password } = req.body;
    let hashedPassword;
    // encryp password
    bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            return bcrypt.hash(password, salt)
        })
        .then(async (hash) => {
            hashedPassword = hash;
            // console.log("hashedPasword: ", hashedPassword);
            const token = generateToken(); 
            // const tokenStore = new Map();
            tokenStore.set(token, { email, name, plz, ort, tel, hashedPassword, expires: Date.now() + 3600000 }); // Token 1 Stunde gültig
            // console.log("tokenStore in server.js: ", tokenStore);
            const mailData = {
                from: '"Your Datamanagement Tool" <' + process.env.EMAIL_USER + '>',
                to: email,
                subject: 'Your registration link',
                text: `Hey ${name},\n\nPlease click the link below to finish your registration:\n\nhttp://localhost:5173/api/verify-email?token=${token}`,
                html: `<b>Hey ${name},</b><br><br>Please click the link below to finish your registration:<br><a href="http://localhost:5173/api/verify-email?token=${token}">Verify Email</a>`,
            };

            try {
                const info = await transporter.sendMail(mailData);
                // console.log("Message sent: %s", info.messageId);
                res.status(200).send({ success: true, message: "Mail sent", message_id: info.messageId });
            } catch (error) {
                // console.error("Error sending email:", error);
                res.status(500).send({ success: false, error: error.message });
            }
        })
        .catch(err => console.error(err.message));
});

app.get('/api/verify-email', async (req, res) => {
    const token = req.query.token;
    // console.log("token: ", token);
    
    // check if token is there
    if (tokenStore.has(token)) {
        const userData = tokenStore.get(token);
        
        // check expiration time
        if (Date.now() > userData.expires) {
            return res.status(400).send({ success: false, message: 'Token expired' });
        }

        // Erstellen Sie den Benutzer
        const { email, name, plz, ort, tel, hashedPassword } = userData;
            
        try {
            let newUser = await createUser(email, name, plz, ort, tel, hashedPassword);
            tokenStore.delete(token); 
            res.status(201).json({ success: true, user: newUser });
        } catch (error) {
            // console.error("Error while creating user:", error);
            res.status(500).send({ success: false, error: error.message });
        }
    } else {
        res.status(400).send({ success: false, message: 'Invalid token' });
    }
});

/////////////////////////////////
// dist files für hosting
/////////////////////////////////
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.listen(5173, () => {
    console.log("Listen on http://localhost:5173");
});