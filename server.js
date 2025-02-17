const fs = require('fs');
const http=require("http");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const serverDB = require("./serverDB.js");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

const path = require('path');
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));
//creazione delle due tabelle del database
serverDB.executeQuery(`CREATE TABLE IF NOT EXISTS type (
id INT PRIMARY KEY AUTO_INCREMENT,
name varchar(20)
);
`);
serverDB.executeQuery(`CREATE TABLE IF NOT EXISTS booking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idType INT NOT NULL,
    date DATE NOT NULL,
    hour INT NOT NULL,
    name VARCHAR(50),
    FOREIGN KEY (idType) REFERENCES type(id)
  );
  `);

const server = http.createServer(app);

  server.listen(5500, () => {
  
    console.log("- server running");
  
});
serverDB.test();