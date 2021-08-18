let bill = require('../model/bill');
let billOne = require('../model/menubillone');
let menu = require('../model/menu');
let table = require('../model/table');

module.exports.getListBillUnpaid = async (req, res) => {
    let findListUnpaid = await bill.find({status: "Chưa thanh toán"});
    if (findListUnpaid) {
        res.json(findListUnpaid);
    } else {
        res.status(201).json({message: 'Fail'});
    }
}
module.exports.getListBillOneFromBill = async (req, res) => {
    let {billCode} = req.params;
    let findListBillOneFromBill = await billOne.find({billCode});
    if (findListBillOneFromBill) {
        res.json(findListBillOneFromBill);
    } else {
        res.status(201).json({message: 'Fail'});
    }
}
module.exports.getListBillOneFromTableCode = async (req, res) => {
    let {tableCode} = req.params;
    let findBillFromTableCode = await bill.findOne({tableCode, status: "Chưa thanh toán"});
    if (findBillFromTableCode) {
        let findBillOneFromBillCode = await billOne.find({billCode: findBillFromTableCode.billCode});
        if (findBillOneFromBillCode) {
            res.status(200).json(findBillOneFromBillCode);
            console.log(findBillFromTableCode);
        } else {
            res.status(201).json({message: 'Fail'});
        }
    } else {
        res.status(201).json({message: 'Fail'});
    }
}
module.exports.getListBillPaid = async (req, res) => {
    let findListPaid = await bill.find({status: "Đã thanh toán"});
    if (findListPaid) {
        res.json(findListPaid);
    } else {
        res.status(201).json({message: 'Fail'});
    }
}
module.exports.getListBillUnpaid = async (req, res) => {
    let findListUnpaid = await bill.find({status: "Chưa thanh toán"});
    if (findListUnpaid) {
        res.json(findListUnpaid);
    } else {
        res.status(500).json({message: 'Fail'});
    }
}
module.exports.postPaid = async (req, res) => {
    let {billCode} = req.params;
    let {nameCashier} = req.body;
    if (req.body.discount != 0) {
        await bill.findOneAndUpdate({billCode}, {
            $set: {
                discount: req.body.discount,
                totalPrice: req.body.totalMoney
            },
        }, {new: true});
    }

    let paid = await bill.findOneAndUpdate({billCode}, {
        $set: {
            nameCashier,
            status: "Đã thanh toán"
        },
    }, {new: true});
    if (paid) {
        let findTable = await bill.findOne({billCode});
        if (findTable) {
            let updateTable = await table.findOneAndUpdate({tableCode: findTable.tableCode}, {
                $set: {
                    status: false
                },
            }, {new: true})
            if (updateTable) {
                res.status(200).json({message: `Đã thanh toán hóa đơn ${paid.billCode}`});
            }
        }

    } else {
        res.status(201).json({message: 'Thanh toán thất bại'});
    }
}
module.exports.postOrder = async (req, res) => {
    let {tableCode} = req.body;
    let totalPrice = 0;
    let nameCashier = "null";
    let status = "Chưa thanh toán";
    let checkTable = await table.findOne({tableCode});
    if (checkTable) {
        if (!checkTable.status) {
            let currentdate = new Date();
            let datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
            let list = await bill.find({});
            let listCount = list.length + 1;
            let billCode = "HD" + tableCode.toString() + currentdate.getDate() + (currentdate.getMonth() + 1) + currentdate.getFullYear() + listCount.toString();
            let {nameOrder} = req.body;
            let {list_menu} = req.body;
            for (let i = 0; i < list_menu.length; i++) {
                let {image} = list_menu[i];
                let {sl} = list_menu[i];
                let {name} = list_menu[i];
                let {price} = list_menu[i];
                let {type} = list_menu[i];
                let totalMoney = price * sl;
                let add = new billOne({billCode, image, sl, name, price, type, totalMoney});
                add.save();
                totalPrice += totalMoney;
            }
            let addBill = new bill({billCode,dateBill:datetime, nameCashier, nameOrder, tableCode, totalPrice, status});
            await table.findOneAndUpdate({_id: checkTable._id}, {
                    $set: {
                        status: true
                    }
                }, {new: true}
            )
            addBill.save().then((resolve, reject) => {
                if (resolve) {
                    res.status(200).json({message: `Order thành công bàn ${tableCode}`});
                } else if (reject) {
                    res.status(500).json({message: 'Fail'})
                }
            });
        } else {
            let findBill = await bill.findOne({tableCode, status: "Chưa thanh toán"});
            if (findBill) {
                let billCode = findBill.billCode;
                let {list_menu} = req.body;
                for (let i = 0; i < list_menu.length; i++) {
                    let {name} = list_menu[i];
                    let findFoodOrder = await billOne.findOne({name, billCode});
                    if (findFoodOrder) {
                        let sl = findFoodOrder.sl + list_menu[i].sl;
                        let totalMoney = findFoodOrder.price * sl;
                        await billOne.findOneAndUpdate({_id: findFoodOrder._id}, {
                            $set: {
                                sl,
                                totalMoney,
                            },
                        }, {new: true});
                    } else {
                        let sl = list_menu[i].sl;
                        let image = list_menu[i].image;
                        let price = list_menu[i].price;
                        let type = list_menu[i].type;
                        let totalMoney = price * sl;
                        let add1 = new billOne({billCode, image, sl, name, price, type, totalMoney});
                        add1.save();
                    }
                }
                res.redirect(`/api/calc/${billCode}`)

            }
        }

    } else {
        res.status(201).json({message: `Không có bàn này`})
    }

}
module.exports.postReturnItems = async (req, res) => {
    let list = req.body.list_bill;
    let billcode = "";
    for (let i = 0; i < list.length; i++) {
        let id = list[i]._id;
        billcode = list[i].billCode;
        await billOne.findOneAndUpdate({_id: id}, {
                $set: {
                    sl: list[i].sl,
                    totalMoney: list[i].totalMoney
                },
            }, {new: true}
        )
    }
    res.redirect(`/api/calc/${billcode}`)


}
module.exports.calcBill = async (req, res) => {
    let id = req.params.id;
    let d = await billOne.find({billCode: id});
    let b = await bill.findOne({billCode: id});
    let totalPrice = 0;
    if (d) {
        for (let i = 0; i < d.length; i++) {
            totalPrice += d[i].totalMoney;
        }
        await bill.findOneAndUpdate({billCode: id}, {
            $set: {
                totalPrice,
            },
        }, {new: true}).then((resolve, reject) => {
            if (resolve) {
                res.status(200).json({message: `Order thêm bàn ${b.tableCode}`})
            } else if (reject) {
                res.status(201).json({message: 'Fail'})
            }
        });
    }
}

