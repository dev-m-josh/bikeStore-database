const express = require("express");

const sql = require("mssql");

const app = express();

const { router } = require("./routes/routes");

app.use(router);



const config = {
    user: "sa",
    password: "Josh@4889",
    server: "localhost",
    database: "BikeStores",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

//CONNECT TO A SERVER
sql.connect(config, err =>{
    if (err) {
        throw err;
    }
    console.log("Connection Successful!")
});

//server listening
const port = 4000;
app.listen(port, ()=>{
    console.log(`Server listening to port: ${port}`);
});




