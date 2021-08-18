let mongoose = require('mongoose');
var currentdate = new Date();
var datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();

let billSchema = new mongoose.Schema({
    billCode: {
        type: String,
        required:true
    },
    nameCashier: {
        type: String,
        required: true,
    },
    nameOrder: {
        type: String,
        required: true,
    },
    tableCode: {
        type: Number,
        required: true,
    },

    totalPrice: {
        type: Number,
        required: true
    },
    dateBill: {
        type: String,
        required: true,
        default: datetime
    },
    discount:{
      type: Number,
      required:true,
      default: 0
    },
    status: {
        type: String,
        required: true
    },


})
module.exports = mongoose.model('bill', billSchema, 'bill');