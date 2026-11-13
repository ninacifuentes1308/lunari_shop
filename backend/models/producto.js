const mongoose = require (`mongoose`);
const productoinfo = new mongoose.Schema({
    nombre:{type: String, required: true},
    precio: {type: Number, required: true},
    imagen: {type: String},
    categoria: {type: String},
    stock: {type: Number, default: 10},
    descripcion: {type: String}
});
module.exports = mongoose.model(`Producto`, productoinfo);