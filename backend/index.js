require(`dotenv`).config();
const express = require(`express`);
const conectDB = require(`./setup/database`);
const cors = require(`cors`);
const Usuario = require(`./models/usuario`);
const Producto = require(`./models/producto`)
const app = express();
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
const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
});