let mongoose = require('mongoose');

let billOneSchema = new mongoose.Schema({
    billCode: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    sl: {
        type: Number,
        required: true
    },
    totalMoney: {
        type: Number,
        required: true
    }

})
module.exports = mongoose.model('billOne', billOneSchema, 'billOne');