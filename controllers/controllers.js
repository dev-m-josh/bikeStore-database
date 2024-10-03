const sql = require("mssql");



//all products
function getAllProducts(req, res) {
    //page and pageSize
    let {page, pageSize} = req.query;
    //offset
    let offset = (Number(page)-1) * Number(pageSize);
    
    new sql.Request().query(`SELECT product_id, product_name, category_id, brand_id FROM production.products ORDER BY product_id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`, (err, result) =>{
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
    let {page, pageSize} = req.query;
    let currentPage = (Number(page) - 1) * Number(pageSize);

    new sql.Request().query(
        `SELECT order_id, 
           staff_id,
           (SELECT order_id, item_id, product_id FROM sales.order_items WHERE order_id = orders.order_id FOR JSON PATH ) AS order_items
        FROM sales.orders orders ORDER BY order_id OFFSET ${currentPage} ROWS FETCH NEXT ${pageSize} ROWS ONLY;`, (err, result) =>{
            if (err) {
                console.log("Error occured in query", err);
            } else {
                res.json(result.recordset);
            };
        });
};

//get orders of a customer by customer id
//--orders
// product name, price, quantity, order_item_id
function getCustomerOrdersById(req, res) {
    let requestedId = req.params.customerId;
    new sql.Request().query(
    `SELECT order_id, order_status, order_date, shipped_date, store_id,
    (SELECT OT.order_id, OT.item_id, OT.quantity, prod.product_name, OT.list_price FROM sales.order_items OT
INNER JOIN production.products prod ON OT.product_id = prod.product_id WHERE OT.order_id = SO.order_id FOR JSON PATH) orders
FROM sales.orders SO
WHERE customer_id = ${requestedId}`, (err, result) =>{
        if (err) {
            console.log("Error occured in query", err);
        } else {
            res.json(result.recordset);
        };
    });
};


//get orders of staff sale
//--orders
// product name, price, quantity
function getStaffOrders(req, res) {
let requestedId = req.params.staffId;

let {page, pageSize} = req.query;
let offset = (Number(page) - 1) * Number(pageSize);

    new sql.Request().query(
    `SELECT order_id, order_date, customer_id, order_status, shipped_date, store_id,
       (SELECT  items.order_id, items.item_id, items.quantity, prods.product_name, items.list_price FROM sales.order_items items
INNER JOIN production.products prods ON prods.product_id = items.product_id WHERE items.order_id = OS.order_id FOR JSON PATH) orders
FROM sales.orders OS
WHERE staff_id = ${requestedId} ORDER BY order_id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`, (err, result)=>{
        if (err) {
            console.log("Error occured in query", err);
        } else {
            res.json(result.recordset);
        };
    });
};

module.exports = { getAllProducts, getProductById, getAllOrdersAndItems, getCustomerOrdersById, getStaffOrders };


