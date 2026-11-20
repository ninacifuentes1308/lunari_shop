import { useState } from "react";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const enviar = (e) => {
    e.preventDefault();

    // Validar WhatsApp: 10 números y que empiece en 09
    if (whatsapp.length !== 10 || !whatsapp.startsWith("09")) {
      alert("El WhatsApp debe tener 10 números e iniciar en 09");
      return;
    }

    // Arma el mensaje para WhatsApp
    const texto = `Hola Lunari! Soy ${nombre}%0AEmail: ${email}%0AWhatsApp: ${whatsapp}%0AMensaje: ${mensaje}`;
    window.open(`https://wa.me/593999810503?text=${texto}`, "_blank");

    alert("¡Mensaje listo para enviar por WhatsApp!");
    setNombre("");
    setEmail("");
    setMensaje("");
    setWhatsapp("");
  };

  return (
    <main className="contacto_form">
      <h1>Contáctanos</h1>
      <p>Para pedidos grandes o personalizados</p>

      <form className="form_contacto" onSubmit={enviar}>
        <div className="form_dato">
          <label htmlFor="nombre">Nombre: </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Tu nombre"
          />
        </div>

        <div className="form_dato">
          <label htmlFor="email">Correo Electrónico: </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </div>

        <div className="form_dato">
          <label htmlFor="mensaje">Mensaje: </label>
          <textarea
            id="mensaje"
            rows="5"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            placeholder="Cuéntanos que necesitas..."
          />
        </div>

        <div className="form_dato">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            type="tel"
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="0981546278"
            maxLength="10"
            minLength="10"
            required
            title="Debe tener 10 numeros e iniciar en 09"
          />
        </div>

        <button type="submit" className="btn_principal">
          Enviar mensaje
        </button>
      </form>
    </main>
  );
}

export default Contacto;
