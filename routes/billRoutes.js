var express = require('express');
var routes = express.Router();
var authMiddle = require('../middleware/authMiddle')
var billController = require('../controller/billController');

/* GET home page. */
routes.get('/:billCode', authMiddle.reqAuth, authMiddle.checkAdmin, billController.getBills);
routes.get('/', authMiddle.reqAuth, authMiddle.checkAdmin, billController.getAllBills);
routes.post('/create', authMiddle.reqAuth, authMiddle.checkAdmin, billController.postCreateBill);
routes.get('/create', authMiddle.reqAuth, authMiddle.checkAdmin, billController.getCreateBill);;

module.exports = routes;
