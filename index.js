const express = require("express");

const sql = require("mssql");

const app = express();

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

app.get('/', (req, res) =>{
    res.send("Welcome")
});

//all products
app.get('/products', (req, res) =>{
    new sql.Request().query("SELECT product_id, product_name, category_id, brand_id FROM production.products", (err, result) =>{
        if (err) {
            res.send(err)
            console.log("Error occured in query", err);
        }else{
            res.json(result.recordset);
        };

    });
});

//a product based on i'ts id
app.get('/products/:productId', (req, res) =>{
    let requestedId = req.params.productId;

    new sql.Request().query(`SELECT product_id, product_name, category_id, brand_id FROM production.products WHERE product_id = ${requestedId}`, (err, result) =>{
        if (err) {
            console.log("Error occured in query", err);
        } else {
            res.json(result.recordset[0]);
        };
    });
});


//get orders of a customer
app.get('/customer/orders/:orderId', (req, res) =>{
    let requestedId = req.params.orderId;
    new sql.Request().query(
    `SELECT sales.orders.customer_id,
            sales.orders.order_id,
            sales.order_items.product_id
    FROM sales.orders
    LEFT JOIN sales.order_items 
    ON sales.orders.order_id = sales.order_items.order_id
    WHERE customer_id = ${requestedId}`, (err, result) =>{
        if (err) {
            console.log("Error occured in query", err);
        } else {
            res.json(result.recordset);
        };
    });
});

//get orders of staff sale
app.get('/orders/staffs/:staffId', (req, res) =>{
    let requestedId = req.params.staffId;
    new sql.Request().query(`SELECT * FROM sales.orders WHERE staff_id = ${requestedId}`, (err, result) =>{
        if (err) {
            console.log("Error occured in query", err);
        } else {
            res.json(result.recordset);
        };
    });
});

//server listening
const port = 4000;
app.listen(port, ()=>{
    console.log(`Server listening to port: ${port}`);
});


users = [["ds", "sdf"], ["dss"]]
console.log(users[0])