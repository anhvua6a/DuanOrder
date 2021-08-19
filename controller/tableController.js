let table = require('../model/table');
let tableOrder = require('../model/tableOrder')
let user = require('../model/user')

module.exports.getListTable = async (req, res) => {
    let keyword = req.query.keyword === undefined ? "" : req.query.keyword;
    let listTable = await table.find();
    var page = parseInt(req.query.page) || 1;
    var perPage = 9;
    var start = (page - 1) * perPage;
    var end = page * perPage;
    res.render('table/listTable', {
        listTable: listTable.slice(start,end),
        keyword,
        layout:'temp/index',
        title:'table',
        img:'',
        currentPage:1,
        totalPages:5
    });
}
module.exports.getCreate = async (req, res) => {

    let findAllTables = await table.find();
    res.render('table/createTables', {err: false, findAllTables});
}

module.exports.postCreate = async (req, res) => {
    let tableCode = req.body.tableCode;
    let tableSeats = req.body.tableSeats;
    if (tableCode.length === 0) {

    } else if (tableSeats.length === 0) {

    } else {
        let addTable = await table.create({tableCode, tableSeats});
        if (addTable) {
            res.redirect('/tables');
        }
    }
}
module.exports.getUpdate = async (req, res) => {
    let findTable = await table.findById(req.params.id);
    if (findTable) {
        res.render('table/updateTable', {findTable, err: false});
    }

}

module.exports.postUpdate = async (req, res) => {
    let findTable = await table.findById(req.params.id);
    if (findTable) {
        let updateTable = await table.findOneAndUpdate({_id: req.params.id}, {
            tableCode: req.body.tableCode,
            tableSeats: req.body.tableSeats,
        })
        if (updateTable){
            res.redirect('/tables');
        } else {
            res.render('table/updateTable', {findTable, err: true, msg: `Lỗi`});
        }
    }


}
module.exports.deleteTable = async (req, res) => {
    let findTable = await table.findById(req.params.id);
    if (findTable) {
        let deleteMenu = await table.findOneAndRemove({_id: req.params.id});
        if (deleteMenu) {
            res.redirect('/tables');
        }
    } else {
        res.status(404).message('ID not found');
    }
}

// đặt bàn
module.exports.tableOrder = async (req,res)=>{
    let {date, personNumber, userID, tableName} = req.body
    let user = await user.findOne({_id: userID})
    let name = await table.findOne({tableCode:tableName})

    if (!user) {
        return res.json({status: false, message: "User does not exist"})
    }
    if(!name) {
        return res.json({status: false, message: "Table does not exist"})
    }
    let table = new tableOrder({userID, date, personNumber, tableName})
    await table.save()

    let socket = req.app.get('socket')
    socket.emit('order', {user, table})

    res.json({status: true, message: 'Đặt bàn thành công'})
}