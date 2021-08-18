let user = require('../model/user');
let uniqid = require('uniqid');
let md5 = require('md5');

module.exports.getAllUser = async (req, res) => {
    let findUser = await user.find({});
    if (findUser) {
        res.json(findUser)
    } else {
        res.status(201).json({message: 'Get User Fail'});
    }
}
module.exports.getUserInfo = async (req, res) => {
    let userIf = await user.findById(req.params.id);
    if (!userIf) {
        res.status(201).json({message: 'User does not exist'})
    }
    res.status(200).json(userIf)

}
module.exports.deleteUser = async (req, res) => {
    let findUser = await user.findById(req.params.id);
    if (findUser) {
        const deleteUser = await user.findOneAndDelete({_id: req.params.id});
        if (deleteUser) {
            res.status(200).json({message: 'User Deleted'})
        } else {
            res.status(201).json({message: 'Delete User Fail'})
        }
    } else {
        res.status(201).json({message: 'User does not exist'})
    }
}
module.exports.updateUser = async (req, res) => {
    let findUser = await user.findById(req.params.id);
    if (findUser) {
        let avatar = findUser.avatar;
        if (req.files) {
            let avatarName = "/users/" + uniqid() + "-" + req.files.avatar.name;
            req.files.avatar.mv(`./uploads${avatarName}`)
            avatar = avatarName;
        }
        let updated = await user.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                fullName: req.body.fullName.substring(1, req.body.fullName.length - 1),
                phone: req.body.phone.substring(1, req.body.phone.length - 1),
                age: req.body.age,
                address: req.body.address.substring(1, req.body.address.length - 1),
                role: req.body.role.substring(1, req.body.role.length - 1),
                indentityCardNumber: req.body.indentityCardNumber,
                avatar: avatar,
            },
        }, {new: true});
        if (updated) {
            res.status(200).json({message: 'User Updated'})
        } else {
            res.status(201).json({message: 'Update User Fail'})
        }

    } else {
        res.status(201).json({message: 'User does not exist'})
    }

}

module.exports.updateInfoUser = async (req, res) => {
    let findUser = await user.findById(req.params.id);
    if (findUser) {
        let avatar = findUser.avatar;
        if (req.files) {
            let avatarName = "/users/" + uniqid() + "-" + req.files.avatar.name;
            req.files.avatar.mv(`./uploads${avatarName}`)
            avatar = avatarName;
        }
        let updated = await user.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                fullName: req.body.fullName.substring(1, req.body.fullName.length - 1),
                phone: req.body.phone.substring(1, req.body.phone.length - 1),
                age: req.body.age,
                address: req.body.address.substring(1, req.body.address.length - 1),
                avatar: avatar,
            },
        }, {new: true});
        if (updated) {
            res.status(200).json({message: 'Cập nhật thông tin thành công'})
        } else {
            res.status(201).json({message: 'Update User Fail'})
        }

    } else {
        res.status(201).json({message: 'User does not exist'})
    }

}
module.exports.changePassword = async (req, res) => {
    let findUser = await user.findById(req.params.id);
    if (findUser) {
        let password = md5(req.body.currentpass);
        if (password === findUser.passWord) {
            const updated = await user.findOneAndUpdate({_id: req.params.id}, {
                $set: {
                    passWord: md5(req.body.newpass),
                }
            }, {new: true});
            if (updated) {
                res.status(200).json({message: 'Password Updated'})
            } else {
                res.status(201).json({message: 'Update Password Fail'})
            }

        } else {
            res.status(201).json({message: 'Wrong password'})
        }
    } else {
        res.status(201).json({message: 'User does not exist'})
    }
}
module.exports.postCreateUser = async (req, res) => {
    let phone = req.body.phone.substring(1, req.body.phone.length - 1);
    let checkPhone = await user.findOne({phone: phone});
    if (checkPhone) {
        res.json({message: 'User already exists'});
    } else {
        let passWord = md5("123456");
        let role = req.body.role.substring(1, req.body.role.length - 1);
        let fullName = req.body.fullName.substring(1, req.body.fullName.length - 1);
        let indentityCardNumber = req.body.indentityCardNumber;
        let address = req.body.address.substring(1, req.body.address.length - 1);
        let age = req.body.age;
        let avatar = null;
        if (req.files) {
            let avatarName = "/users/" + uniqid() + "-" + req.files.avatar.name;
            req.files.avatar.mv(`./uploads${avatarName}`)
            avatar = avatarName;
        }
        const users = new user({passWord, role, fullName, indentityCardNumber, phone, address, age, avatar});
        users.save().then((resolve, reject) => {
            if (resolve) {
                res.status(200).json({message: `Register new user successfully`})
            } else if (reject) {
                res.status(201).json({message: `Error is ${reject.toString()}`});
            }
        });
    }
}