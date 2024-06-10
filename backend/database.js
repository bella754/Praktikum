import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 6603
}).promise();

export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}

export async function getSingleUser(id) {  // statt ? geht auch ${id} und dann kein [id] , aber so ist es sicherer gegen angriffe
    const [rows] = await pool.query(`
    SELECT * 
    FROM users
    WHERE id = ?
    `, [id]);
    return rows[0];
}

export async function getSingleUserEmail(email) {  // statt ? geht auch ${id} und dann kein [id] , aber so ist es sicherer gegen angriffe
    const [rows] = await pool.query(`
    SELECT * 
    FROM users
    WHERE Email = ?
    `, [email]);
    return rows[0];
}

export async function createUser(email, name, plz, ort, tel, passwort) {
    let rechte = "Standard User";
    const [result] = await pool.query(`
    INSERT INTO users (Email, Name, PLZ, Ort, Telefonnummer, Passwort, Rechte)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [email, name, plz, ort, tel, passwort, rechte]);
    let id = result.insertId;
    return getSingleUser(id);
}

export async function updateUser(id, email, name, plz, ort, tel, passwort, rechte) {
    // console.log("input in database.js: ", id, email, name, plz, ort, tel, passwort, rechte);
    if (email) {
        await pool.query(`
        UPDATE users
        SET Email = "${email}"
        WHERE id = ?
        `, [id]);
    } 
    if (name) {
        // console.log("name/id in if case: ", name, id);
        await pool.query(`
        UPDATE users
        SET Name = "${name}"
        WHERE id = ?
        `, [id]);
    }
    if (plz) {
        await pool.query(`
        UPDATE users
        SET PLZ = ${plz}
        WHERE id = ?
        `, [id]);
    }
    if (ort) {
        await pool.query(`
        UPDATE users
        SET Ort = "${ort}"
        WHERE id = ?
        `, [id]);
    }
    if (tel) {
        await pool.query(`
        UPDATE users
        SET Telefonnummer = "${tel}"
        WHERE id = ?
        `, [id]);
    }
    if (passwort) {
        await pool.query(`
        UPDATE users
        SET Passwort = "${passwort}"
        WHERE id = ?
        `, [id]);
    }
    if (rechte) {
        await pool.query(`
        UPDATE users
        SET Rechte = "${rechte}"
        WHERE id = ?
        `, [id]);
    }
    // console.log("user: ", user);
    return getSingleUser(id);
}

export async function deleteUser(id) {
    const user = await pool.query(`
    DELETE FROM users
    WHERE id = ?
    `, [id]);
    return getUsers();
}
