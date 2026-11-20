import { useState,useEffect } from "react";
import "./App.css";
import Carrito from "./carrito.jsx";
import Login from "./login.jsx";
import Index from "./index.jsx";
import Registro from "./registro.jsx";
import Admin from "./admin.jsx";
import Contacto from "./contacto.jsx";
function App(){
  const [abierto, setAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [mensajes, setMensajes] = useState([
    {de: "bot",texto:"Hola! Soy Lunita 🌙 de Lunari Shop. Pregúntame por precio, envío o productos"},
  ]);
  const [input, setInput] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [vista, setVista]=useState("inicio");
  const [nombreUsuario, setNombreUsuario]=useState(localStorage.getItem("nombrelunari")||"");
  const [busqueda, setBusqueda]= useState("");
  const [categoria, setCategoria]=useState("todas");
  const [orden, setOrden]=useState("normal");
  //Para jalar todos los productos desde el backend
  useEffect(()=>{
    fetch("https://lunari-shop-backend.onrender.com/api/productos")
    .then((r)=>r.json())
    .then((data)=>setProductos(data))
    .catch(()=>setProductos([]));
  }, []);
  const enviar = ()=>{
    if (!input.trim()) return;
    const textoUser = input.toLowerCase();
    setMensajes((m)=>[...m,{de:"user", texto:input}]);
    setInput("");
    
    let respuesta = `Por el momentono tenemos ${input} en Lunari Shop 🌙. Puedes buscar por papeleria, belleza, peluches o preguntar precios.`;
    const normalizar = (t)=>(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    const textonormal= normalizar(textoUser);
    const textobusqueda = textonormal.replaceAll("maquillaje", "belleza").replaceAll("makeup", "belleza").replaceAll("cosmeticos", "belleza").replaceAll("cosméticos", "belleza");
    const stop=["tienen", "tiene","tienes","hay","quiero", "busco","buscas","dime","cuanto","cuesta","precio","para","con","una","unos","este", "esta","eso","ese","del","los","las","que"];
    const palabrasuser = textobusqueda.split(" ").filter(p=>p.length>2 && !stop.includes(p));
    const encontrado = productos.filter((p) => {
      const nombre=normalizar(p.nombre);
      const descrip= normalizar(p.descripcion);
      const cat = normalizar(p.categoria);
      const textoprod=nombre+" "+descrip+" "+cat;
      const palabrasprod=textoprod.split(" ");
      const coincidencias = palabrasuser.filter(pal=>textoprod.includes(pal)).length;
      if(palabrasuser.length<=1) return coincidencias>=1;
      return coincidencias===palabrasuser.length;
    }).sort((a,b)=>{
      const pa=palabrasuser.filter(pal=>(normalizar(a.nombre)+" "+normalizar(a.descripcion)+" "+normalizar(a.categoria)).includes(pal)).length;
      const pb=palabrasuser.filter(pal=>(normalizar(b.nombre)+" "+normalizar(b.descripcion)+" "+normalizar(b.categoria)).includes(pal)).length;
      return pb-pa;
    });
    
    if (textoUser.includes("hola")|| textoUser.includes("buenas")||textoUser.includes("hey")){
      respuesta="Hola! Binvenid@ a Lunari Shop 🌙 ¿Qué buscas hoy?";
    } else if (encontrado.length>0){
      respuesta=`Si tenemos ${encontrado.length} de esos: \n`+ encontrado.map(p=>`•${p.nombre} a $${p.precio} - ${p.descripcion || ""}`).join("\n");
    } else if (textoUser.includes("precio") || textoUser.includes("cuanto") || textoUser.includes("cuánto") || textoUser.includes("cuestan") || textoUser.includes("vale")){
      respuesta=productos.length>0
      ? "Estos son nuestros precios: "+productos.map((p)=>`${p.nombre} $${p.precio}`).join(", ")
      :"Todavia estoy cargando los productos, dame un segundito...";
    } else if (textoUser.includes("envio") || textoUser.includes("envío") || textoUser.includes("entrega") || textoUser.includes("demora") || textoUser.includes("llega")) {
      respuesta="Hacemos envíos a todo Guayaquil y Ecuador. Guayaquil 1-2 días laborables, resto del país 2-4 días laborables.";
    }else if (textoUser.includes("categoria") || textoUser.includes("categoría") || textoUser.includes("tipo")){
      const cats=[... new Set(productos.map((p)=>p.categoria).filter(Boolean))];
      respuesta=cats.length>0?`Tenemos estas categorias: ${cats.join(", ")}. Dime cuál te gusta y te gusta y te muestro`:"Tenemos de todo un poco, dime que buscas.";
    } else {
      respuesta =`Por el momentono tenemos ${input} en Lunari Shop 🌙. Puedes buscar por papeleria, belleza, peluches o preguntar precios.`;
    }
    setMensajes((m)=>[...m,{de: "IA", texto: respuesta}]);
  };

  const agregar=(p)=> {
    const nuevo=[...carrito,p];
    setCarrito(nuevo);
    if (nombreUsuario){
      localStorage.setItem(`carrito_${nombreUsuario}`,JSON.stringify(nuevo));
    }
  };
  const categorias=[...new Set(productos.map((p)=>p.categoria).filter(Boolean))];
  const productosfiltrados=productos
    .filter((p)=>{
      const coincidebusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincidecategoria= categoria==="todas"||p.categoria===categoria;
      return coincidebusqueda && coincidecategoria;
    })
    .sort((a,b)=>{
      if (orden==="menor-mayor") return a.precio-b.precio;
      if (orden==="mayor-menor") return b.precio-a.precio;
    });
  const total=carrito.reduce((s,p)=>s+p.precio,0);
  const mensajeWA=encodeURIComponent(`Hola Lunari! Quiero comprar: ${carrito.map((p)=>p.nombre).join(", ")} - Total $${total}`);

  return(
    <>
    <header className="encabezado">
    <div className="logo_tienda">
      <img src="/assets/img/lunarishoplogo.png" alt="Lunari Shop Logo" className="logo"/>
      <h1>Lunari Shop</h1>
    </div>
    <nav>
      <ul className="nav_paginas">
        <li><button onClick={()=> setVista("inicio")}>🏠 Inicio</button></li>
        <li><button onClick={()=> setVista("tienda")}> 🛍️ Tienda</button></li>
        <li><button onClick={()=> setVista("carrito")}>🛒 Ver Carrito</button></li>
        <li><button onClick={()=> setVista("admin")}>👤Administrador</button></li>
        <li><button onClick={()=>setVista("contacto")}> 📞 Contáctanos</button></li>
        <li>{nombreUsuario ? (
          <>
          <span>Hola, {nombreUsuario}</span>
          <button onClick={()=>{localStorage.removeItem("nombrelunari"); setNombreUsuario(""); setCarrito([]); setVista("tienda");}}>Salir</button>
          </>
        ) : (
          <button onClick={()=>setVista("login")}>Iniciar Sesión</button>
        )}</li>
      </ul>
      </nav>
       </header>
      {vista === "admin" && <Admin onSalir={()=>setVista("tienda")}/>}
      {vista === "contacto" && <Contacto/>}
      {vista==="inicio" &&(
        <Index
        nombreUsuario={nombreUsuario}
        irATienda={()=>setVista("tienda")}
        irALogin={()=>setVista("login")}
        onSalir={()=>{localStorage.removeItem("nombrelunari"); setNombreUsuario("");}}
        irAContacto={()=>{setTimeout(()=>document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"}),100)}}
        irAAdmin={()=>alert("El admin se abre desde su panel aparte")}
        />
      )}
      {vista === "login" && (
        <Login onLogin={(nombre)=>{
          setNombreUsuario(nombre);
          localStorage.setItem("nombrelunari",nombre);
          const micarrito=JSON.parse(localStorage.getItem(`carrito_${nombre}`)) || [];
          setCarrito(micarrito);
          setVista("tienda"); 
        }} onIrRegistro={()=> setVista("registro")}/>
      )}
      {vista==="registro" &&(
        <Registro onIrLogin={()=>setVista("login")} />
      )}
      {vista=== "tienda" && (
        <>
      <p className="subtitulo">Tu tienda - se actualiza sola cuando agregas productos desde el admin</p>
      {productos.length===0 && <p className="aviso">⏳ Cargando productos... ¿Tienes prendido el backend en el puerto 3000?</p>}
      <div className="filtros">
        <input value={busqueda} onChange={(e)=> setBusqueda(e.target.value)} placeholder=" 🔍 Buscar por nombre..." />
        <select value={categoria} onChange={(e)=>setCategoria(e.target.value)}>
          <option value="todas">Todas las categorias</option>
          {categorias.map((c)=>(
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={orden} onChange={(e)=>setOrden(e.target.value)}>
          <option value="normal">Sin ordenar</option>
          <option value="menor-mayor">Precio: menor a mayor</option>
          <option value="mayor-menor">Precio: mayor a menor</option>
        </select>
      </div>
      <h2>Productos ({productosfiltrados.length})</h2>
      {productosfiltrados.length===0 && productos.length > 0 && <p className="aviso">No hay productos con ese filtro</p>}
        <div className="productos">
          {productosfiltrados.map((p)=>(
            <div key={p._id} className="producto">
              {p.imagen && <img src={p.imagen} alt={p.nombre} className="producto_img"/>}
          <div className="producto_info">
            <b>{p.nombre}</b><br />
            <span>${p.precio} {p.categoria ? `- ${p.categoria}`: ""}</span><br />
            <small>{p.descripcion}</small><br />
            <button onClick={()=>agregar(p)} className="btn_agregar">Agregar</button>
          </div>
        </div>
      ))}
      </div>
      </>
          )}
      {vista === "carrito" && (
        <Carrito carrito={carrito} setCarrito={setCarrito} onVolver={()=> setVista("tienda")}/>
      )}
      {!abierto &&(
        <button onClick={()=>setAbierto(true)} className="btn_luna">🌙</button>
      )}
      {abierto &&(
        <div className="chat">
          <div className="chat_header">
            <b>🌙 Lunita - Lunari Shop</b>
            <button onClick={()=>setAbierto(false)} className="btn_cerrar">❌</button>
          </div>
          <div className="chat_mensajes">
            {mensajes.map((m,i)=>(
              <div key={i} className={m.de === "user" ? "msg msg-user" : "msg msg-bot"}>{m.texto}</div>
            ))}
          </div>
          <div className="chat_input">
            <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && enviar()} placeholder="Busca por nombre, precio, envío..." />
            <button onClick={enviar}>Enviar</button>
          </div>
        </div>
      )}
      </>
  );
}
export default App;