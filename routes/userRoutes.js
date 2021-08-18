var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');
var authMiddle = require('../middleware/authMiddle');

router.get('/',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    userController.getUser
);

router.get('/info/:id',
    authMiddle.reqAuth,
    userController.getUserInfo
);

router.get('/create',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    userController.getCreateUser
);

router.get('/delete/:id',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    userController.deleteUser
);

router.post('/create',
    authMiddle.reqAuth,
    authMiddle.checkAdmin,
    userController.postCreateUser
);

router.post('/info/:id/update',
    authMiddle.reqAuth,
    userController.updateUser
);

router.post('/info/:id/changepass',
    authMiddle.reqAuth,
    userController.changePassword
);

module.exports = router;
