require(`dotenv`).config();
const express = require(`express`);
const conectDB = require(`./setup/database`);
const cors = require(`cors`);
const Usuario = require(`./models/usuario`);
const Producto = require(`./models/producto`);
const Pedido = require('./models/pedido');
const app = express();
app.use(express.static(__dirname));
app.use(express.static(__dirname+'/../frontend'));
conectDB();
app.use(cors());
app.use(express.json());

app.get(`/`, (req, res) =>{
    res.send(`API Lunari Shop funcionando`);
});
//Para el registro
app.post(`/api/registro`, async(req,res)=>{
    try{
        const {nombre,correo,password,telefono}=req.body;
        const existe=await Usuario.findOne({email: correo});
        if (existe){
            return res.status(400).json({mensaje:`Este correo ya se encuentra registrado`});
        }
        const nuevousuario=new Usuario({nombre,email: correo,password,telefono});
        await nuevousuario.save();
        res.status(201).json({mensaje: `¡Usuario creado exitosamente!`});
    } catch (error) {
        res.status(500).json({mensaje: `Error en el servidor`, error:error.message});
    }
});
app.post('/api/login',async(req,res)=>{
    try{
        const{correo,password}=req.body;
        const usuario=await Usuario.findOne({email:correo});
        if (!usuario) {
            return res.status(400).json({mensaje:'Correo no registrado'});
        }
        if (usuario.password!==password) {
            return res.status(400).json({mensaje: 'La contraseña ingresada es incorrecta'});
        }
        res.json({mensaje: 'Bienvenido a Lunari', nombre: usuario.nombre});
    } catch (error) {
        res.status(500).json({mensaje: 'Error en el servidor', error: error.message});
    }
});
//productos para el catalogo y panel para administrador
app.get('/api/productos', async (req, res)=>{
    const productos=await Producto.find();
    res.json(productos);
});
app.post('/api/productos', async (req,res)=>{
    try {
        const nuevo = new Producto(req.body);
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch (e) {res.status(500).json({mensaje: e.message}); }
});
app.delete('/api/productos/:id', async(req,res)=>{
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ok:true});
});
//pedidos con el codigo LUNARI
app.post('/api/pedidos', async (req,res)=>{
    try{
        const codigo ='LUNARI-'+Math.floor(1000+Math.random()*9000);
        const nuevo = new Pedido({codigo, ...req.body});
        await nuevo.save();
        res.status(201).json(nuevo);
    } catch(e){res.status(500).json({mensaje: e.message}); }
});
//para la IA integrada
app.get('/api/pedidos/:codigo', async(req,res)=>{
    const pedido = await Pedido.findOne({codigo:req.params.codigo});
    if (!pedido) return res.status(404).json({mensaje:'No encontrado'});
    res.json(pedido);
});
app.get('/api/pedidos',async(req,res)=>{
    const pedidos = await Pedido.find().sort({fecha:-1});
    res.json(pedidos);
});
const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
});