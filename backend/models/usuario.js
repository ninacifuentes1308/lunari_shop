const mongoose = require(`mongoose`);
const userinfo = new mongoose.Schema({
    nombre: {type:String, required: true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true},
    telefono: {type: String},
    fecharegistro: {type: Date, default:Date.now}
});
module.exports = mongoose.model(`Usuario`, userinfo);