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

//get all orders including the items that are associated with the particular order
app.get('/orders', (req, res) =>{
    new sql.Request().query(
    `SELECT order_id, 
       customer_id, 
       staff_id, 
       store_id, 
       (SELECT order_id, item_id, product_id FROM sales.order_items WHERE order_id = orders.order_id FOR JSON PATH ) AS order_items
    FROM sales.orders orders;`, (err, result) =>{
        if (err) {
            console.log("Error occured in query", err);
        } else {
            res.json(result.recordset);
        };
    });
});

//get orders of a customer
app.get('/orders/customer/:orderId', (req, res) =>{
    let requestedId = req.params.orderId;
    new sql.Request().query(
    `SELECT customer_id,
        order_id,
        order_date,
        store_id,
        staff_id,
        (SELECT item_id  FROM sales.order_items WHERE order_id = ords.order_id FOR JSON PATH) AS order_items
 FROM sales.orders ords
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
    new sql.Request().query(
    `SELECT staff_id,
        first_name,
        last_name,
        email,
       (SELECT staff_id, order_id, customer_id, order_date, store_id  FROM sales.orders WHERE staff_id = staff.staff_id FOR JSON PATH) staff_orders
    FROM sales.staffs staff`, (err, result) =>{
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

