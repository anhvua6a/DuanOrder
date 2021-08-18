var express = require('express');
var routes = express.Router();
var authMiddle = require('../middleware/authMiddle')
var tableController = require('../controller/tableController');

routes.get('/',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    tableController.getListTable);

routes.get('/create',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    tableController.getCreate);

routes.get('/:id/update',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    tableController.getUpdate);

routes.get('/:id/delete',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    tableController.deleteTable);

routes.post('/create',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    tableController.postCreate);

routes.post('/:id/update',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    tableController.postUpdate);
routes.post('/tableOrder',
    tableController.tableOrder);
module.exports = routes;
