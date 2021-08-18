var mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://dailtph08173:daicaptain@cluster0.zlpug.azure.mongodb.net/Duan2';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = mongoDB;