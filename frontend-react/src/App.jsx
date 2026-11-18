import { useState,useEffect } from "react";
import "./App.css";
function App(){
  const [abierto, setAbierto] = useState(false);
  const [productos, setProductos] = useState([]);
  const [mensajes, setMensajes] = useState([
    {de: "bot",texto:"Hola! Soy Lunita 🌙 de Lunari Shop. Pregúntame por precio, envío o productos"},
  ]);
  const [input, setInput] = useState("");
  const [carrito, setCarrito] = useState([]);
  //Para jalar todos los productos desde el backend
  useEffect(()=>{
    fetch("http://localhost:3000/api/productos")
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
    const palabrasuser = textobusqueda.split(" ").filter(p=>p.length>2);
    const encontrado = productos.filter((p) => {
      const nombre=normalizar(p.nombre);
      const descrip= normalizar(p.descripcion);
      const cat = normalizar(p.categoria);
      const palabrasprod=(nombre + " " + descrip + " " + cat).split(" ");
      return palabrasuser.some(pal=>palabrasprod.includes(pal)) ||
          (p.descripcion && palabrasuser.some(pal=>palabrasprod.includes(pal)));
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

  const agregar=(p)=> setCarrito([...carrito,p]);
  const total=carrito.reduce((s,p)=>s+p.precio,0);
  const mensajeWA=encodeURIComponent(`Hola Lunari! Quiero comprar: ${carrito.map((p)=>p.nombre).join(", ")} - Total $${total}`);

  return(
    <div className="contenedor">
      <h1> 🌙Lunari Shop</h1>
      <p className="subtitulo">Tu tienda - se actualiza sola cuando agregas productos desde el admin</p>
      {productos.length===0 && <p className="aviso">⏳ Cargando productos... ¿Tienes prendido el backend en el puerto 3000?</p>}
      <h2>Productos ({productos.length})</h2>
      <div className="productos">
      {productos.map((p)=>(
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
      <div className="carrito">
        <h3>🛒 Carrito:{carrito.length} productos - Total: ${total}</h3>
        {carrito.length>0 && (
          <a href={`https://wa.me/593999810503?text=${mensajeWA}`} target="_blank" rel="noreferrer" className="btn_wa">Comprar por WhatsApp</a>
        )}
      </div>
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
    </div>
  );
}
export default App;