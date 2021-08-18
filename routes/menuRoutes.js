var express = require('express');
var router = express.Router();
var authMiddle = require('../middleware/authMiddle')
var menuController = require('../controller/menuController');

router.get('/',authMiddle.reqAuth, authMiddle.checkAdmin, menuController.getListMenu);
router.get('/create',authMiddle.reqAuth, authMiddle.checkAdmin, menuController.getCreate);
router.get('/:id/update',authMiddle.reqAuth, authMiddle.checkAdmin, menuController.getUpdate);
router.get('/:id/delete',authMiddle.reqAuth, authMiddle.checkAdmin, menuController.deleteMenu);

router.post('/create',authMiddle.reqAuth, authMiddle.checkAdmin, menuController.postCreate);
router.post('/:id/update',authMiddle.reqAuth, authMiddle.checkAdmin, menuController.postUpdate);

module.exports = router;
