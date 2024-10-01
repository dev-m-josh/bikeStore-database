const router = require("express").Router();







const { getAllProducts, getProductById, getAllOrdersAndItems, getCustomerOrdersById, getStaffOrders } = require("../controllers/controllers");


//all products
router.get('/products', getAllProducts);

//a product based on i'ts id
router.get('/products/:productId', getProductById);

//get all orders including the items that are associated with the particular order
router.get('/orders', getAllOrdersAndItems);

//get orders of a customer
router.get('/orders/customer/:customerId', getCustomerOrdersById); 

//get orders of staff sale
router.get('/orders/staffs/:staffId', getStaffOrders);

module.exports = { router };