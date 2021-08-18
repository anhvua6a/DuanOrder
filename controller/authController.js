let user = require('../model/user');
var md5 = require('md5');

module.exports.getLogin = (req, res) => {
    res.render('login', {err: false, layout: 'temp/default', title: 'Login'});
}

module.exports.checkLogin = async (req, res) => {
    let phone = req.body.phone;
    let findUser = await user.findOne({phone: phone});
    if (findUser) {
        let password = md5(req.body.password);
        if (findUser.passWord === password) {
            if (findUser.role === 'Admin') {
                res.cookie('id', findUser._id, {
                    signed: true
                });
                res.redirect('/users');
            } else {
                res.cookie('id', findUser._id, {
                    signed: true
                });
                res.locals.user = findUser
                res.redirect('users/info/' + findUser._id);
            }

        } else {
            res.render('login', {error: true, msg: 'Wrong Password'});
        }
    } else {
        res.render('login', {error: true, msg: 'Account does not exist'});
    }

}

module.exports.logOut = (req, res) => {
    if (req.signedCookies.id) {
        res.clearCookie('id');
    }
    res.redirect('/');
}