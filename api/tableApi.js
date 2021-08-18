let table = require('../model/table');

module.exports.getListTable = async (req, res) => {
    let listTable = await table.find();
    res.json(listTable);
}

module.exports.postCreate = async (req, res) => {
    let getTable = await table.find({});
    let tableCode = getTable.length + 1;
    for (let i = 0; i <getTable.length; i++) {
        if (tableCode == getTable[i].tableCode) {
            tableCode++;
        }
    }
    let tableSeats = req.body.tableSeats;
    const addTable = new table({tableCode, tableSeats});
    addTable.save((err) => {
        if (err) {
            res.status(201).json({
                message: `Error is ${err}`
            });
        } else {
            res.status(200).json({
                message: `Add new table successfully`
            });
        }
    });
}

module.exports.postUpdate = async (req, res) => {
    let findTable = await table.findById(req.params.id);
    if (findTable) {
        let updated = await table.findOneAndUpdate({_id: req.params.id}, {
            $set: {
                tableCode: req.body.tableCode,
                tableSeats: req.body.tableSeats,
            },
        }, {new: true});
        if (updated) {
            res.status(200).json({message: `Cập nhật bàn ${findTable.tableCode} thành công!`})
        } else {
            res.status(500).json({message: `Cập nhật bàn ${findTable.tableCode} thất bại!`})
        }
    } else {
        res.status(500).json({message: 'Bàn không tồn tại'})
    }
}
module.exports.deleteTable = async (req, res) => {
    let findTable = await table.findById(req.params.id);
    if (findTable) {
        if (findTable.status) {
            res.status(201).json({message: 'Bàn đang có người ăn hoặc chưa thanh toán hóa đơn'})
        } else {
            const deleteTable = await table.findOneAndRemove({_id: req.params.id});
            if (deleteTable) {
                res.status(200).json({message: `Xóa bàn ${findTable.tableCode} thành công!`})
            } else {
                res.status(201).json({message: `Xóa bàn ${findTable.tableCode} thất bại!`})
            }
        }
    } else {
        res.status(500).json({message: 'Bàn không tồn tại'})
    }
}