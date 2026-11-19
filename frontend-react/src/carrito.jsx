export default function Carrito({ carrito, setCarrito, onVolver }) {
  const total = carrito.reduce((acc, p) => acc + p.precio * (p.cantidad || 1), 0);

  const subir = (id) => {
    setCarrito(prev => prev.map(p => {
      if (p._id !== id) return p;
      const stock = p.stock ?? 10;
      if ((p.cantidad || 1) >= stock) {
        alert(`Solo hay ${stock} en stock de ${p.nombre}`);
        return p;
      }
      return { ...p, cantidad: (p.cantidad || 1) + 1 };
    }));
  };

  const bajar = (id) => {
    setCarrito(prev => {
      const prod = prev.find(p => p._id === id);
      if (!prod) return prev;
      if ((prod.cantidad || 1) > 1) {
        return prev.map(p => p._id === id ? { ...p, cantidad: p.cantidad - 1 } : p);
      } else {
        return prev.filter(p => p._id !== id);
      }
    });
  };

  const eliminar = (id) => {
    setCarrito(prev => prev.filter(p => p._id !== id));
  };

  const mensajeWA = encodeURIComponent(
    "Hola Lunari, quiero pedir:\n" + carrito.map(p => `- ${p.nombre} x${p.cantidad || 1} = $${(p.precio * (p.cantidad || 1)).toFixed(2)}`).join("\n") + `\nTotal: $${total.toFixed(2)}`
  );

  return (
    <div className="carrito">
      <button className="btn_volver" onClick={onVolver}>← Volver a la tienda</button>
      <h3>🛒 Carrito: {carrito.length} productos - Total: ${total.toFixed(2)}</h3>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div id="lista_carrito">
            {carrito.map((p) => (
              <div key={p._id} className="prod_carrito">
                {p.imagen && <img src={p.imagen} alt={p.nombre} />}
                <div className="prod_info">
                  <h4>{p.nombre}</h4>
                  <div className="btn_control">
                    <button className="btn_menos" onClick={() => bajar(p._id)}>-</button>
                    <span>Cant: {p.cantidad || 1}</span>
                    <button className="btn_mas" onClick={() => subir(p._id)}>+</button>
                    <button className="btn_eliminar" onClick={() => eliminar(p._id)}>🗑️</button>
                  </div>
                </div>
                <strong className="precio_carrito">${(p.precio * (p.cantidad || 1)).toFixed(2)}</strong>
              </div>
            ))}
          </div>
          <a href={`https://wa.me/593999810503?text=${mensajeWA}`} target="_blank" rel="noreferrer" className="btn_wa">
            Pedir por WhatsApp
          </a>
        </>
      )}
    </div>
  );
}