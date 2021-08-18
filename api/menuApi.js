let menu = require('../model/menu');
let uniqid = require('uniqid');

module.exports.getListMenuAll = async (req, res) => {
    let findMenu = await menu.find({});
    if (findMenu) {
        res.json(findMenu);
    } else {
        res.status(201).json({message: 'Lấy danh sách món ăn thất bại'});
    }
}
module.exports.postCreate = async (req, res) => {
    let name = req.body.name.substring(1, req.body.name.length - 1);
    let checkName = await menu.findOne({name: name});
    if (checkName) {
        res.status(201).json({message: `Tên món ăn bị trùng`});
    } else {
        let type = req.body.type.substring(1, req.body.type.length - 1);
        let price = req.body.price;
        let image = null;
        if (req.files) {
            let avatarName = "/menus/" + uniqid() + "-" + req.files.avatar.name;
            req.files.avatar.mv(`./uploads${avatarName}`);
            image = avatarName;
        }
        const menus = new menu({name, type, price, image});
        menus.save().then((resolve, reject) => {
            if (resolve) {
                res.status(200).json({message: `Thêm món ăn thành công`})
            } else if (reject) {
                res.status(201).json({message: `Thêm món ăn thất bại`});
            }
        });
    }


}
module.exports.postUpdate = async (req, res) => {
    let findFood = await menu.findById(req.params.id);
    if (findFood) {
        let image = findFood.image;
        let status = req.body.status;
        if (findFood.type == "Food"){
            status = true;
        }
        if (req.files) {
            let avatarName = "/menus/" + uniqid() + "-" + req.files.avatar.name;
            req.files.avatar.mv(`./uploads${avatarName}`);
            image = avatarName;
        }
        let name = req.body.name.substring(1, req.body.name.length - 1);

        let updated = await menu.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                name: name,
                price: req.body.price,
                image: image,
                status: status,

            },
        }, {new: true});
        if (updated) {
            res.status(200).json({message: 'Cập nhật thành công'})
        } else {
            res.status(201).json({message: 'Cập nhật thất bại'})
        }

    } else {
        res.status(201).json({message: 'Món ăn không tồn tại'})
    }
}
module.exports.deleteMenu = async (req, res) => {
    let findFood = await menu.findById(req.params.id);
    if (findFood) {
        const deleteMenu = await menu.findOneAndRemove({_id: req.params.id});
        if (deleteMenu) {
            res.status(200).json({message: `Đã xóa ${findFood.name}`})
        } else {
            res.status(201).json({message: 'Xóa món ăn thất bại'})
        }
    } else {
        res.status(201).json({message: 'Món ăn không tồn tại'})
    }
}
