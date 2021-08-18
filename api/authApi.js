let user = require('../model/user');
let jwt = require('jsonwebtoken');
var md5 = require('md5');

module.exports.checkLogin = async (req, res) => {
    let phone = req.body.phone;
    let findUser = await user.findOne({phone: phone});

    if (findUser) {
        let password = md5(req.body.password);
        if (findUser.passWord === password) {
            const token = jwt.sign({id: findUser._id}, 'duan', {algorithm: 'HS256', expiresIn: 60 * 60 * 24});
            res.json({
                status: 'OK',
                token,
                id: findUser._id,
                role: findUser.role,
                name: findUser.fullName,
                avatar: findUser.avatar,
                message: 'Đăng nhập thành công'
            });
        } else {
            res.json({status: 'Fail', message: 'Mật khẩu không chính xác'});
        }
    } else {
        res.json({status: 'Fail', message: 'Tài khoản không tồn tại'});
    }
}
