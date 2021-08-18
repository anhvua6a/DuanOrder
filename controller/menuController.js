let uniqid = require("uniqid");
let menu = require('../model/menu');

module.exports.getListMenu = async (req, res) => {
    let keyword = req.query.keyword == undefined ? "" : req.query.keyword;
    let listFood = await menu.find({type: "Food", name: new RegExp(keyword, 'i')});
    let listDrink = await menu.find({type: "Drink", name: new RegExp(keyword, 'i')});
    let listOther = await menu.find({type: "Other", name: new RegExp(keyword, 'i')});
    var page = parseInt(req.query.page) || 1;
    var perPage = 6;
    var start = (page - 1) * perPage;
    var end = page * perPage;
    console.log(listFood.slice(start, end));
    res.render('menu/listMenu', {
        listFood: listFood.slice(start, end),
        listDrink: listDrink.slice(start, end),
        listOther: listOther.slice(start, end),
        keyword,
        layout: 'temp/index',
        title: 'Menu',
        currentPage:1,
        totalPages:5
    });
}
module.exports.getCreate = (req, res) => {
    res.render('menu/createMenu', {err: false})
}
module.exports.postCreate = async (req, res) => {
    let name = req.body.name;
    let type = req.body.type;
    let price = req.body.price;
    let amount = null;
    if (type == "Drink") {
        amount = req.body.amount;
    }
    let image = null;
    if (req.files) {
        image = req.files.image;
        let filename = "/menus/" + uniqid() + "-" + image.name;
        image.mv(`./uploads/${filename}`)
        image = filename;
    }
    let addMenu = await menu.create({name, price, image, type, amount}).catch(err => {
        res.code(404).message(err.message);
    });
    if (addMenu) {
        res.redirect('/menus');
    }
}
module.exports.getUpdate = async (req, res) => {
    let foodId = req.params.id;
    let findFood = await menu.findById(foodId);
    if (findFood) {
        res.render('menu/updateMenu', {err: false, findFood})
    } else {
        res.status(404).message('ID not found');
    }

}
module.exports.postUpdate = async (req, res) => {
    let foodId = req.params.id;
    let findFood = await menu.findById(foodId);
    if (findFood) {
        let name = req.body.name;
        let type = req.body.type;
        let amount = null;
        if (type == "Drink") {
            amount = req.body.amount;
        }
        let price = req.body.price;
        let image = findFood.image;
        if (req.files) {
            image = req.files.image;
            let filename = "/menus/" + uniqid() + "-" + image.name;
            image.mv(`./uploads/${filename}`)
            image = filename;
        }
        let updateMenu = await menu.findOneAndUpdate({_id: foodId}, {
            name, type, amount, price, image
        });
        if (updateMenu) {
            res.redirect('/menus')
        } else {
            res.status(404).message('Update Fail')
        }
    } else {
        res.status(404).message('ID not found');
    }
}
module.exports.deleteMenu = async (req, res) => {
    let foodId = req.params.id;
    let findFood = await menu.findById(foodId);
    if (findFood) {
        let deleteMenu = await menu.findOneAndRemove({_id: foodId});
        if (!deleteMenu) {
            res.status(404).message('Delete Fail');
        }
        res.redirect('/menus');
    } else {
        res.status(404).message('ID not found');
    }
}
