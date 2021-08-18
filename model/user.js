let mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    passWord: {
        type: String,
        required: true,
    },
    role: {
        type: String
    },
    fullName: {
        type: String
    },
    indentityCardNumber: {
        type: Number
    },
    phone: {
        type: String
    },
    address: {
        type:String
    },
    avatar: {
        type:String
    },
    age: {
        type:Number
    }
})
module.exports = mongoose.model('User', userSchema, 'user');