const mongoose=require('mongoose');
const pedidoinfo=new mongoose.Schema({
    codigo:{type: String, required: true, unique: true},
    nombre: {type: String},
    telefono: {type: String},
    productos: {type: Array, default: []},
    total: {type: Number, required: true},
    estado: {type: String, default: 'En preparación'},
    fecha: {type: Date, default: Date.now}
});
module.exports=mongoose.model('Pedido', pedidoinfo);