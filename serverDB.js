const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('./public/conf.json')).dbInfo;
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log('done');
            resolve(result);
        });
    });
};
const serverDB = {
    executeQuery : function (sql)  {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                console.log('done');
                resolve(result);
            });
        });
    },
    createTable: function () {
        return executeQuery(`
        CREATE TABLE IF NOT EXISTS images
        ( id INT PRIMARY KEY AUTO_INCREMENT, 
            url VARCHAR(255) NOT NULL ) 
        `);
    },
    insert: function (prenotation) {
        const template = `
        INSERT INTO booking (idType,date,hour,name) VALUES ('$IDTYPE','$DATE','$HOUR','$NAME')
        `;
        let sql = template.replace("$IDTYPE",prenotation.idtype).replace("$DATE",prenotation.date).replace("$HOUR",prenotation.hour).replace("$NAME",prenotation.name);
        return executeQuery(sql);
    },
    select: function () {
        const sql = `
        SELECT b.id, t.name type, b.date, b.hour, b.name
        FROM booking AS b
        JOIN type as t ON b.idType = t.id
        `;
        return executeQuery(sql);
    },
    test: async function () {
        await this.createTable();
        // await this.insert({url: "test " + new Date().getTime()});
        const images = await this.select();
        console.log("Risultato della query SELECT:", images);
    },
    clear : function(){
        const sql = `
        TRUNCATE TABLE booking
        `;
        return executeQuery(sql);
    }
};

module.exports = serverDB;