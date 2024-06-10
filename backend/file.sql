CREATE DATABASE logindatabase;

CREATE TABLE users (
    id int,
    Email nvarchar(255),
    NAME varchar(255),
    PLZ int,
    Ort varchar(255),
    Telefonnummer int,
    Passwort nvarchar(255),
    Rechte varchar(255)
)