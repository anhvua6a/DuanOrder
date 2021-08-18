let mongoose = require('mongoose');
let tableSchema = new mongoose.Schema({
    tableCode: {
        type: Number,
        required: true,
    },
    tableSeats: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
})
module.exports = mongoose.model('table', tableSchema, 'table');