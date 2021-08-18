let express = require('express');
let router = express.Router();
let authApi = require('../api/authApi');
let authMiddle = require('../middleware/authMiddle');
let userApi = require('../api/userApi');
let menuApi = require('../api/menuApi');
let tableApi = require('../api/tableApi');
let billApi = require('../api/billApi');

//auth
router.post('/login', authApi.checkLogin);

//user

router.get('/user', authMiddle.verifyToken, userApi.getAllUser);
router.get('/user/:id', authMiddle.verifyToken, userApi.getUserInfo);
router.post('/user/create', authMiddle.verifyToken, userApi.postCreateUser);
router.delete('/user/delete/:id', authMiddle.verifyToken, userApi.deleteUser);
router.put('/user/update/:id', authMiddle.verifyToken, userApi.updateUser);
router.put('/user/update/info/:id', authMiddle.verifyToken, userApi.updateInfoUser);
router.put('/user/update/changePass/:id', authMiddle.verifyToken, userApi.changePassword);

//menu
router.get('/menus', authMiddle.verifyToken, menuApi.getListMenuAll);
router.post('/menu/create', authMiddle.verifyToken, menuApi.postCreate);
router.delete('/menu/delete/:id', authMiddle.verifyToken, menuApi.deleteMenu);
router.put('/menu/update/:id', authMiddle.verifyToken, menuApi.postUpdate);

//table
router.get('/table', authMiddle.verifyToken, tableApi.getListTable);
router.post('/table/create', authMiddle.verifyToken, tableApi.postCreate);
router.delete('/table/delete/:id', authMiddle.verifyToken, tableApi.deleteTable);
router.put('/table/update/:id', authMiddle.verifyToken, tableApi.postUpdate);

//bill
router.post('/bill/create', authMiddle.verifyToken, billApi.postOrder);
router.get('/bill/listUnpaid', authMiddle.verifyToken, billApi.getListBillUnpaid);
router.get('/bill/listPaid', authMiddle.verifyToken, billApi.getListBillPaid);
router.get('/bill/billOne/:billCode', authMiddle.verifyToken, billApi.getListBillOneFromBill);
router.post('/bill/paid/:billCode', authMiddle.verifyToken,billApi.postPaid);
router.get('/bill/billPreview/:tableCode', authMiddle.verifyToken,billApi.getListBillOneFromTableCode);
router.post('/bill/return', authMiddle.verifyToken,billApi.postReturnItems);

router.get('/calc/:id', authMiddle.verifyToken, billApi.calcBill);

module.exports = router;