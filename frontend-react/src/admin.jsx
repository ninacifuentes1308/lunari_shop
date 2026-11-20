import { useState, useEffect } from "react";

function Admin({ onSalir }) {
  const [logueado, setLogueado] = useState(localStorage.getItem("lunari_admin") === "si");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nombre: "", precio: "", imagen: "", categoria: "", stock: "", descripcion: ""
  });

  const API = "http://localhost:3000/api";

  const cargar = async () => {
    const res = await fetch(API + "/productos");
    setProductos(await res.json());
    const r2 = await fetch(API + "/pedidos");
    setPedidos(await r2.json());
  };

  useEffect(() => { if (logueado) cargar(); }, [logueado]);

  const entrar = () => {
    if (user === "admin" && pass === "lunari2026") {
      localStorage.setItem("lunari_admin", "si");
      setLogueado(true);
    } else {
      setError("Usuario o clave incorrecta");
    }
  };

  const salir = () => {
    localStorage.removeItem("lunari_admin");
    setLogueado(false);
    if (onSalir) onSalir();
  };

  const editar = (p) => {
    setForm({
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      categoria: p.categoria,
      stock: p.stock,
      descripcion: p.descripcion || ""
    });
    setEditandoId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm({ nombre: "", precio: "", imagen: "", categoria: "", stock: "", descripcion: "" });
  };

  const guardar = async () => {
    const body = { ...form, precio: Number(form.precio), stock: Number(form.stock) };
    if (editandoId) {
      await fetch(API + "/productos/" + editandoId, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      alert("Producto actualizado ✨");
    } else {
      await fetch(API + "/productos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      alert("Producto guardado");
    }
    cancelarEdicion();
    cargar();
  };

  const borrar = async (id) => {
    if (!confirm("¿Borrar?")) return;
    await fetch(API + "/productos/" + id, { method: "DELETE" });
    cargar();
  };

  if (!logueado) {
    return (
      <div className="body_admin">
        <div className="login_admin">
        <h1 className="h1_admin">Lunari - Acceso de administrador</h1>
        <input className="admin" value={user} onChange={(e) => setUser(e.target.value)} placeholder="usuario" />
        <input className="admin" value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Contraseña" />
        <button className="boton_admin" onClick={entrar}>Entrar</button>
        <p>{error}</p>
      </div>
      </div>
    );
  }

  return (
    <div className="form_admin">
      <button className="boton_admin" onClick={salir} style={{ float: "right" }}>Cerrar Sesión</button>
      <h1 className="h1_admin">Lunari - Panel de Administrador</h1>
      <h2>{editandoId ? "Editando: " + form.nombre : "Agregar Producto"}</h2>
      <input className="admin" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre ej: Anillo con dije de Luna" />
      <input className="admin" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} type="number" placeholder="Precio ej: 4.50" />
      <input className="admin" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} placeholder="Link de imagen ej: https://..." />
      <input className="admin" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} placeholder="Categoria ej: Kpop, belleza, papeleria" />
      <input className="admin" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} type="number" placeholder="Stock ej: 10" />
      <textarea className="admin" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" />
      <button className="boton_admin" onClick={guardar}>{editandoId ? "Guardar cambios" : "Guardar producto"}</button>
      {editandoId && <button className="boton_admin" onClick={cancelarEdicion} style={{ background: "#999" }}>Cancelar edición</button>}

      <h2>Productos en tienda</h2>
      <div id="lista">
        {productos.map((p) => (
          <div key={p._id} className="card_admin">
            <img src={p.imagen} alt={p.nombre} />
            <div style={{ flex: 1 }}>
              <b>{p.nombre}</b> - ${p.precio}<br />
              {p.categoria} | Stock: {p.stock}<br />
              <small>{p.descripcion || ""}</small>
            </div>
            <button onClick={() => editar(p)}>Editar</button>
            <button onClick={() => borrar(p._id)}>Eliminar</button>
          </div>
        ))}
      </div>

      <h2>Pedidos LUNARI-XXXX</h2>
      <div>
        {pedidos.map((o) => (
          <div key={o._id || o.codigo} className="card_admin"><div style={{ flex: 1 }}>
            <b>{o.codigo}</b> - {o.nombre} - {o.telefono}<br />
            Total: ${o.total} - {o.estado}
          </div></div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
