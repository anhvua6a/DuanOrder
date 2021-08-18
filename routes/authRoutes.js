let express = require('express');
let routes = express.Router();
let authController = require('../controller/authController');


routes.get('/',
 authController.getLogin
);

routes.post('/auth',
 authController.checkLogin
);

routes.get('/logout',
 authController.logOut
);


module.exports = routes;
