var mongoose = require('mongoose')

var tableSchema = new mongoose.Schema({
    userID: String,
    tableName: String,
    date: Date,
    personNumber: Number,
})

module.exports=mongoose.model('tableorder',tableSchema)