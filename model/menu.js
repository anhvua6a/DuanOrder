let mongoose = require('mongoose');

let menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String
    },
    type: {
        type:String,
        required:true
    },
    status: {
        type: Boolean,
        default:true
    }

})
module.exports = mongoose.model('Menu', menuSchema, 'menu');