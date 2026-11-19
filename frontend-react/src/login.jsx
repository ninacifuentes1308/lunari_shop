import { useState } from "react";

export default function Login({ onIrRegistro, onLogin }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [verPass, setVerPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });
      const datos = await res.json();
      alert(datos.mensaje);
      if (res.ok) {
        localStorage.setItem("nombrelunari", datos.nombre);
        if (onLogin) onLogin(datos.nombre);
      }
    } catch {
      alert("No se pudo conectar con el servidor. ¿Tienes prendido el backend con node index.js?");
    }
  }

  return (
    <main className="form_registro_inicio">
      <h2>Iniciar sesión en Lunari ✨</h2>
      <form className="formulario" onSubmit={handleSubmit}>
        <div className="form_dato">
          <label htmlFor="correo">Correo Electrónico:</label>
          <input type="text" id="correo" placeholder="tu@correo.com" required
            value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </div>

        <div className="form_dato password_wrapper">
          <label htmlFor="password">Contraseña:</label>
          <input type={verPass ? "text" : "password"} id="password" placeholder="........." required minLength="6"
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="contraseña_privada" onClick={() => setVerPass(!verPass)}>
            {verPass ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <button type="submit" className="btn_principal">Ingresar</button>
        <p>¿No tienes una cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onIrRegistro(); }}>Regístrate</a></p>
      </form>
    </main>
  );
}