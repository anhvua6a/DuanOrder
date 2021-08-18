let user = require('../model/user');
let uniqid = require('uniqid');

var md5 = require('md5');

module.exports.getUser = async (req, res) => {
    let keyword = req.query.keyword == undefined ? "" : req.query.keyword;
    let findAllUser = await user.find({fullName: new RegExp(keyword, 'i')});
    res.render('user/listUser', {users: findAllUser, keyword, layout: 'temp/index', title: 'Người dùng',});
}
module.exports.getUserInfo = async (req, res) => {
    let id = req.params.id;
    let idCookie = req.signedCookies.id;
    let idAdmin = await user.findOne({_id: idCookie});
    let userIf = await user.findOne({_id: id});
    if (id == idCookie) {
        if (userIf) {
            res.render('user/infoUser', {userIf, err: false, layout: 'temp/index', title: 'login', img: ''})
        }
    } else if (id != idCookie && idAdmin.role == 'Admin') {
        res.render('user/infoUser', {userIf, err: false, layout: 'temp/index', title: 'login', img: ''});
    } else {
        res.redirect('/users/info/' + idCookie)
    }
}
module.exports.deleteUser = async (req, res) => {
    let idUser = req.params.id;
    let checkAdmin = await user.findOne({_id: idUser});
    if (checkAdmin.role === 'Admin') {
        res.redirect('/users');
        res.alert('Không được xóa admin');
        return;
    }
    user.findOneAndRemove({_id: idUser}).catch(err => {
        res.send('Lỗi')
    });

    res.redirect('/users');
}
module.exports.updateUser = async (req, res) => {
    let userId = req.params.id;
    let findUser = await user.findById(userId);
    if (findUser) {
        let fullName = req.body.fullname;
        let phone = req.body.phone;
        let avatar = findUser.avatar;
        let age = req.body.age;
        let address = req.body.address;
        let indentityCardNumber = req.body.cmnd;
        let role = req.body.role;
        if (req.files) {
            // fs.unlinkSync(`./uploads/${findUser.avatar}`);
            avatar = req.files.avatar;
            let filename = "/users/" + uniqid() + "-" + avatar.name;
            avatar.mv(`./uploads/${filename}`)
            avatar = filename;
        }
        let password = md5(req.body.password);
        let password2 = md5(req.body.password2);
        if (password === password2 && findUser.passWord === password) {
            let updated = await user.findOneAndUpdate({_id: userId}, {
                fullName,
                phone,
                avatar,
                age,
                address,
                role,
                indentityCardNumber
            })
            if (updated) {
                res.redirect('/users');
            } else {
                res.redirect('/users/info/' + findUser._id);
            }
        }
    }
    res.redirect('/users/info/' + findUser._id);
}
module.exports.changePassword = async (req, res) => {
    let userId = req.params.id;
    let findUser = await user.findById(userId);
    if (findUser) {
        let password = md5(req.body.currentpass);
        if (password === findUser.passWord) {
            let newPassword = md5(req.body.newpass);
            let confirmPassword = md5(req.body.confirmpass);
            if (newPassword === confirmPassword) {
                let updated = await user.findOneAndUpdate({_id: userId}, {
                    passWord: newPassword,
                })
                if (updated) {
                    res.redirect('/users/info/' + findUser._id);
                } else {
                    res.error(404);
                }
            }
        } else {
            res.render('user/infoUser', {
                userIf: findUser,
                err: true,
                msg: 'Mật khẩu cũ không chính xác'
            });
        }
    }
}
module.exports.getCreateUser = (req, res) => {
    res.render('user/createUser', {err: false})
}


module.exports.postCreateUser = async (req, res) => {
    let phone = req.body.phone;
    let checkPhone = await user.findOne({phone: phone});
    if (checkPhone) {
        res.render('user/createUser', {err: true, msg: "Số điện thoại này đã tồn tại"});
    } else {
        let passWord = md5("123456");
        let role = req.body.role;
        let fullName = req.body.fullName;
        let indentityCardNumber = req.body.soCMND;
        let address = req.body.address;
        let age = req.body.age;
        let avatar = null;
        if (req.files) {
            avatar = req.files.avatar;
            let filename = "/users/" + uniqid() + "-" + avatar.name;
            avatar.mv(`./uploads/${filename}`)
            avatar = filename;
        }
        let addUser = await user.create({passWord, role, fullName, indentityCardNumber, phone, address, age, avatar});
        if (addUser) {
            res.redirect('/users');
        } else {
            res.code(404).message('Thêm user thất bại');
        }

    }
}
