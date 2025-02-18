const fs = require('fs');
const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const serverDB = require("./serverDB.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));

serverDB.executeQuery(`CREATE TABLE IF NOT EXISTS type (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name varchar(20)
);`);

serverDB.executeQuery(`CREATE TABLE IF NOT EXISTS booking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  idType INT NOT NULL,
  date DATE NOT NULL,
  hour INT NOT NULL,
  name VARCHAR(50),
  FOREIGN KEY (idType) REFERENCES type(id)
);`);

app.post("/prenotation/add", async (req, res) => {
  const prenotation = req.body;
  try {
    const result = await serverDB.insert(prenotation);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'inserimento" });
  }
});

app.get("/prenotation/get", async (req, res) => {
  try {
    const prenotations = await serverDB.select();
    res.json(prenotations);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei dati" });
  }
});

const server = http.createServer(app);
server.listen(5500, () => {
  console.log("- server running");
});

serverDB.test();
