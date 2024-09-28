const sql = require("mssql");

//all products
function getAllProducts(req, res) {
        new sql.Request().query("SELECT product_id, product_name, category_id, brand_id FROM production.products", (err, result) =>{
            if (err) {
                console.log("Error occured in query", err);
            }else{
                res.json(result.recordset);
            };
    
        });
};

//a product based on i'ts id
function getProductById(req, res) {
        let requestedId = req.params.productId;
    
        new sql.Request().query(`SELECT product_id, product_name, category_id, brand_id FROM production.products WHERE product_id = ${requestedId}`, (err, result) =>{
            if (err) {
                console.log("Error occured in query", err);
            } else {
                res.json(result.recordset[0]);
            };
        });
};

//get all orders including the items that are associated with the particular order
function getAllOrdersAndItems(req, res) {
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
};

//get orders of a customer by customer id
function getCustomerOrdersById(req, res) {
    let requestedId = req.params.customerId;
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
            res.json(result.recordset[0]);
        };
    })
};

//get orders of staff sale
function getStaffOrders(req, res) {
    let requestedId = req.params.staffId;
    new sql.Request().query(
    `SELECT staff_id,
        first_name,
        last_name,
        email,
       (SELECT staff_id, order_id, customer_id, order_date, store_id  FROM sales.orders WHERE staff_id = staff.staff_id FOR JSON PATH) staff_orders
    FROM sales.staffs staff
    WHERE staff_id = ${requestedId}`, (err, result) =>{
        if (err) {
            console.log("Error occured in query", err);
        } else {
            res.json(result.recordset[0]);
        };
    });
};

module.exports = { getAllProducts, getProductById, getAllOrdersAndItems, getCustomerOrdersById, getStaffOrders };

